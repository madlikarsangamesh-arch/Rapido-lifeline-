import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthGuard } from "../src/common/guards/auth.guard.js";
import { RolesGuard } from "../src/common/guards/roles.guard.js";

function createContext(request: unknown): ExecutionContext {
  return {
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe("API authorization guards", () => {
  const originalSecret = process.env.JWT_ACCESS_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_ACCESS_SECRET;
    } else {
      process.env.JWT_ACCESS_SECRET = originalSecret;
    }
  });

  it("rejects requests without a bearer token", async () => {
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue(false),
    };
    const guard = new AuthGuard(
      { verifyAsync: vi.fn() } as unknown as JwtService,
      reflector as unknown as Reflector,
    );

    await expect(
      guard.canActivate(createContext({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("fails safely when the JWT secret is missing or shorter than 32 bytes", async () => {
    const verifyAsync = vi.fn();
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue(false),
    };
    const guard = new AuthGuard(
      { verifyAsync } as unknown as JwtService,
      reflector as unknown as Reflector,
    );
    process.env.JWT_ACCESS_SECRET = "short";

    await expect(
      guard.canActivate(
        createContext({ headers: { authorization: "Bearer token" } }),
      ),
    ).rejects.toMatchObject({ status: 503 });
    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it("requires a token family claim for session-scoped authentication", async () => {
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue(false),
    };
    const guard = new AuthGuard(
      {
        verifyAsync: vi.fn().mockResolvedValue({
          sub: "rider-id",
          role: "rider",
        }),
      } as unknown as JwtService,
      reflector as unknown as Reflector,
    );
    process.env.JWT_ACCESS_SECRET =
      "test-access-secret-must-be-at-least-32-bytes-long";

    await expect(
      guard.canActivate(
        createContext({ headers: { authorization: "Bearer token" } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rejects rider credentials on driver-only routes", () => {
    const reflector = {
      getAllAndOverride: vi.fn().mockReturnValue(["driver"]),
    };
    const guard = new RolesGuard(reflector as unknown as Reflector);

    expect(() =>
      guard.canActivate(
        createContext({ user: { sub: "rider-id", role: "rider" } }),
      ),
    ).toThrow(ForbiddenException);
  });
});
