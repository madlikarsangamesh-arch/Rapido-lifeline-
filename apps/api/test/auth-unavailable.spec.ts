import {
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { createHash } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GuestAuthSchema } from "@rapidlifeline/shared";
import { AuthService } from "../src/modules/auth/auth.service.js";

const userId = "3b28ded5-3d9d-44b3-b151-6fa3ac4fb5e3";
const accessSecret = "test-access-secret-must-be-at-least-32-bytes-long";
const tokenHash = (value: string) =>
  createHash("sha256").update(value).digest("hex");

function createAuthHarness() {
  const users: Array<Record<string, unknown>> = [];
  const refreshTokens: Array<Record<string, unknown>> = [];
  let tokenId = 0;
  const user = {
    findUnique: vi.fn(async ({ where }: { where: { id?: string } }) =>
      users.find((row) => row.id === where.id) ?? null,
    ),
    create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
      const created = {
        id: userId,
        phone: null,
        name: null,
        role: "rider",
        language: "en",
        largeText: false,
        lowData: false,
        isGuest: true,
        ...data,
      };
      users.push(created);
      return created;
    }),
    update: vi.fn(async ({ where, data }: {
      where: { id: string };
      data: Record<string, unknown>;
    }) => {
      const found = users.find((row) => row.id === where.id);
      if (!found) throw Object.assign(new Error("not found"), { code: "P2025" });
      Object.assign(found, data);
      return found;
    }),
  };
  const refreshToken = {
    create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
      const created = { id: `refresh-${++tokenId}`, ...data, revokedAt: null };
      refreshTokens.push(created);
      return created;
    }),
    findUnique: vi.fn(async ({ where }: { where: { tokenHash: string } }) => {
      const found = refreshTokens.find(
        (row) => row.tokenHash === where.tokenHash,
      );
      if (!found) return null;
      return {
        ...found,
        user: users.find((row) => row.id === found.userId),
      };
    }),
    updateMany: vi.fn(async ({ where, data }: {
      where: { id?: string; tokenFamilyId?: string; revokedAt?: null };
      data: Record<string, unknown>;
    }) => {
      let count = 0;
      for (const row of refreshTokens) {
        if (where.id && row.id !== where.id) continue;
        if (where.tokenFamilyId && row.tokenFamilyId !== where.tokenFamilyId)
          continue;
        if (where.revokedAt === null && row.revokedAt !== null) continue;
        Object.assign(row, data);
        count += 1;
      }
      return { count };
    }),
    update: vi.fn(async ({ where, data }: {
      where: { id: string };
      data: Record<string, unknown>;
    }) => {
      const found = refreshTokens.find((row) => row.id === where.id);
      if (!found) throw new Error("refresh token not found");
      Object.assign(found, data);
      return found;
    }),
  };

  const tx = { user, refreshToken };
  const prisma = {
    user,
    refreshToken,
    $transaction: vi.fn(
      async <T>(callback: (transaction: typeof tx) => Promise<T>) =>
        callback(tx),
    ),
  };
  const jwtService = {
    signAsync: vi.fn(async (payload: Record<string, unknown>) =>
      `access-${payload.sub}-${payload.sid}`,
    ),
  };
  const service = new AuthService(prisma as never, jwtService as never);
  return { service, prisma, jwtService, users, refreshTokens };
}

describe("AuthService", () => {
  const previousSecret = process.env.JWT_ACCESS_SECRET;

  beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = accessSecret;
  });

  afterEach(() => {
    if (previousSecret === undefined) delete process.env.JWT_ACCESS_SECRET;
    else process.env.JWT_ACCESS_SECRET = previousSecret;
  });

  it("creates a persistent guest without reserving a phone number", async () => {
    const { service, prisma, users, refreshTokens, jwtService } =
      createAuthHarness();

    const result = await service.createGuestSession({ name: "Guest" });

    expect(users[0]).toMatchObject({
      phone: null,
      name: "Guest",
      role: "rider",
      isGuest: true,
    });
    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ phone: null }) }),
    );
    expect(refreshTokens).toHaveLength(1);
    expect(refreshTokens[0].tokenHash).not.toBe(result.refreshToken);
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      expect.objectContaining({ sub: userId, role: "rider" }),
      expect.objectContaining({ secret: accessSecret, expiresIn: "15m" }),
    );
    expect(result.user.phone).toBeNull();
  });

  it("rejects phone numbers on guest-session requests", () => {
    expect(GuestAuthSchema.safeParse({ phone: "+919876543210" }).success).toBe(
      false,
    );
  });

  it("rotates refresh tokens and revokes a reused token family", async () => {
    const { service, refreshTokens } = createAuthHarness();
    const initial = await service.createGuestSession({});

    const rotated = await service.refreshToken({
      refreshToken: initial.refreshToken,
    });
    expect(rotated.refreshToken).not.toBe(initial.refreshToken);
    expect(refreshTokens[0].revokedAt).toBeInstanceOf(Date);
    expect(refreshTokens[0].replacedByTokenId).toBe(refreshTokens[1].id);

    await expect(
      service.refreshToken({ refreshToken: initial.refreshToken }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(
      service.refreshToken({ refreshToken: rotated.refreshToken }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(refreshTokens[1].revokedAt).toBeInstanceOf(Date);
  });

  it("revokes all active family tokens on logout", async () => {
    const { service, refreshTokens } = createAuthHarness();
    const session = await service.createGuestSession({});
    const familyId = refreshTokens[0].tokenFamilyId as string;
    const result = await service.logout(familyId);

    expect(result).toEqual({ success: true });
    await expect(
      service.refreshToken({ refreshToken: session.refreshToken }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("returns and updates only the authenticated user's profile fields", async () => {
    const { service, users } = createAuthHarness();
    await service.createGuestSession({});

    await expect(service.getProfile(userId)).resolves.toMatchObject({
      id: userId,
      phone: null,
      role: "rider",
    });
    await expect(
      service.updateProfile(userId, { language: "kn", largeText: true }),
    ).resolves.toMatchObject({ language: "kn", largeText: true });
    expect(users[0]).not.toHaveProperty("password");
  });

  it("keeps OTP unavailable and never accepts OTP as proof", () => {
    const { service } = createAuthHarness();
    expect(() => service.requestOtp({ phone: "+919876543210" })).toThrow(
      ServiceUnavailableException,
    );
    expect(() =>
      service.verifyOtp({ phone: "+919876543210", otp: "123456" }),
    ).toThrow(ServiceUnavailableException);
  });

  it("rejects unknown, expired and invalid refresh tokens", async () => {
    const { service, refreshTokens } = createAuthHarness();
    await expect(
      service.refreshToken({ refreshToken: "unknown-token" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    const created = await service.createGuestSession({});
    const storedHash = tokenHash(created.refreshToken);
    Object.assign(
      refreshTokens.find((row) => row.tokenHash === storedHash)!,
      { expiresAt: new Date(Date.now() - 1) },
    );
    await expect(
      service.refreshToken({ refreshToken: created.refreshToken }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("fails safely when the signing secret is missing or too short", async () => {
    const { service, prisma } = createAuthHarness();
    process.env.JWT_ACCESS_SECRET = "short";
    await expect(service.createGuestSession({})).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
