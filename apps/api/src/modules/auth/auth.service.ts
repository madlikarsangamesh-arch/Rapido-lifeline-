import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import type {
  AuthResponse,
  GuestAuthInput,
  RefreshTokenInput,
  RequestOtpInput,
  UserProfile,
  UserProfileUpdateInput,
  VerifyOtpInput,
} from "@rapidlifeline/shared";
import { UserProfileSchema } from "@rapidlifeline/shared";
import { PrismaService } from "../prisma/prisma.service.js";

const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const USER_PROFILE_SELECT = {
  id: true,
  phone: true,
  name: true,
  role: true,
  language: true,
  largeText: true,
  lowData: true,
  isGuest: true,
} as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  requestOtp(
    _input: RequestOtpInput,
  ): Promise<{ success: boolean; message: string }> {
    throw new ServiceUnavailableException(
      "OTP authentication is unavailable because no delivery provider is configured.",
    );
  }

  verifyOtp(_input: VerifyOtpInput): Promise<AuthResponse> {
    throw new ServiceUnavailableException(
      "OTP authentication is unavailable because no delivery provider is configured.",
    );
  }

  async createGuestSession(input: GuestAuthInput): Promise<AuthResponse> {
    this.getAccessTokenSecret();
    const rawRefreshToken = this.createRefreshToken();
    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          phone: null,
          name: input.name ?? null,
          role: "rider",
          isGuest: true,
        },
        select: USER_PROFILE_SELECT,
      });
      const tokenFamilyId = randomUUID();
      await tx.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: this.hashRefreshToken(rawRefreshToken),
          tokenFamilyId,
          expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
        },
      });

      return this.createAuthResponse(
        this.toUserProfile(user),
        rawRefreshToken,
        tokenFamilyId,
      );
    });
  }

  async refreshToken(input: RefreshTokenInput): Promise<AuthResponse> {
    this.getAccessTokenSecret();
    const tokenHash = this.hashRefreshToken(input.refreshToken);
    const now = new Date();
    const nextRawToken = this.createRefreshToken();

    const result = await this.prisma.$transaction(async (tx) => {
      const current = await tx.refreshToken.findUnique({
        where: { tokenHash },
        select: {
          id: true,
          userId: true,
          tokenFamilyId: true,
          expiresAt: true,
          revokedAt: true,
          user: { select: USER_PROFILE_SELECT },
        },
      });
      if (!current) {
        return { status: "invalid" as const };
      }

      if (current.revokedAt) {
        await tx.refreshToken.updateMany({
          where: { tokenFamilyId: current.tokenFamilyId, revokedAt: null },
          data: { revokedAt: now },
        });
        return { status: "invalid" as const };
      }
      if (current.expiresAt <= now) {
        await tx.refreshToken.updateMany({
          where: { id: current.id, revokedAt: null },
          data: { revokedAt: now },
        });
        return { status: "invalid" as const };
      }

      const claimed = await tx.refreshToken.updateMany({
        where: {
          id: current.id,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: { revokedAt: now },
      });
      if (claimed.count !== 1) {
        await tx.refreshToken.updateMany({
          where: { tokenFamilyId: current.tokenFamilyId, revokedAt: null },
          data: { revokedAt: now },
        });
        return { status: "invalid" as const };
      }

      const replacement = await tx.refreshToken.create({
        data: {
          userId: current.userId,
          tokenHash: this.hashRefreshToken(nextRawToken),
          tokenFamilyId: current.tokenFamilyId,
          expiresAt: new Date(now.getTime() + REFRESH_TOKEN_TTL_MS),
        },
        select: { id: true },
      });
      await tx.refreshToken.update({
        where: { id: current.id },
        data: { replacedByTokenId: replacement.id },
      });

      return {
        status: "rotated" as const,
        response: await this.createAuthResponse(
          this.toUserProfile(current.user),
          nextRawToken,
          current.tokenFamilyId,
        ),
      };
    });

    if (result.status === "invalid") {
      throw new UnauthorizedException("Refresh token is invalid or expired");
    }
    return result.response;
  }

  async logout(tokenFamilyId: string): Promise<{ success: true }> {
    await this.prisma.refreshToken.updateMany({
      where: { tokenFamilyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: USER_PROFILE_SELECT,
    });
    if (!user) {
      throw new UnauthorizedException("User account is no longer available");
    }
    return this.toUserProfile(user);
  }

  async updateProfile(
    userId: string,
    data: UserProfileUpdateInput,
  ): Promise<UserProfile> {
    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data,
        select: USER_PROFILE_SELECT,
      });
      return this.toUserProfile(updated);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new UnauthorizedException("User account is no longer available");
      }
      throw error;
    }
  }

  private async createAuthResponse(
    user: UserProfile,
    refreshToken: string,
    tokenFamilyId: string,
  ): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, role: user.role, sid: tokenFamilyId },
      {
        secret: this.getAccessTokenSecret(),
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );
    return { accessToken, refreshToken, user };
  }

  private toUserProfile(user: unknown): UserProfile {
    return UserProfileSchema.parse(user);
  }

  private getAccessTokenSecret(): string {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
      throw new ServiceUnavailableException(
        "Authentication is unavailable because JWT_ACCESS_SECRET must contain at least 32 bytes.",
      );
    }
    return secret;
  }

  private createRefreshToken(): string {
    return randomBytes(32).toString("base64url");
  }

  private hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
