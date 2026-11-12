import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ServiceUnavailableException,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { USER_ROLES } from "@rapidlifeline/shared";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException({
        error: {
          code: "UNAUTHORIZED",
          message: "Missing or invalid Authorization header",
        },
      });
    }

    const [scheme, token, ...extra] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token || extra.length > 0) {
      throw new UnauthorizedException({
        error: {
          code: "UNAUTHORIZED",
          message: "Missing or invalid Authorization header",
        },
      });
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
      throw new ServiceUnavailableException(
        "Authentication is unavailable because JWT_ACCESS_SECRET must contain at least 32 bytes.",
      );
    }

    let payload: Record<string, unknown>;
    try {
      payload = await this.jwtService.verifyAsync<Record<string, unknown>>(
        token,
        {
          secret,
        },
      );
    } catch {
      throw new UnauthorizedException({
        error: {
          code: "TOKEN_INVALID",
          message: "Access token is invalid or expired",
        },
      });
    }

    if (
      typeof payload.sub !== "string" ||
      typeof payload.sid !== "string" ||
      !USER_ROLES.some((role) => role === payload.role)
    ) {
      throw new UnauthorizedException({
        error: {
          code: "TOKEN_INVALID",
          message: "Access token is missing a valid user identity or role",
        },
      });
    }

    request.user = payload;
    return true;
  }
}
