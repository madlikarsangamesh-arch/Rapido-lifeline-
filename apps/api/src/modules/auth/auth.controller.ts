import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import {
  GuestAuthSchema,
  RefreshTokenSchema,
  RequestOtpSchema,
  UserProfileUpdateSchema,
  VerifyOtpSchema,
  type GuestAuthInput,
  type RefreshTokenInput,
  type RequestOtpInput,
  type UserProfileUpdateInput,
  type VerifyOtpInput,
} from "@rapidlifeline/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Public } from "../../common/guards/auth.guard.js";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe.js";
import { AuthService } from "./auth.service.js";

interface AuthenticatedUser {
  sub: string;
  role: string;
  sid: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("otp/request")
  requestOtp(
    @Body(new ZodValidationPipe(RequestOtpSchema)) body: RequestOtpInput,
  ) {
    return this.authService.requestOtp(body);
  }

  @Public()
  @Post("otp/verify")
  verifyOtp(
    @Body(new ZodValidationPipe(VerifyOtpSchema)) body: VerifyOtpInput,
  ) {
    return this.authService.verifyOtp(body);
  }

  @Public()
  @Post("guest")
  createGuest(
    @Body(new ZodValidationPipe(GuestAuthSchema)) body: GuestAuthInput,
  ) {
    return this.authService.createGuestSession(body);
  }

  @Public()
  @Post("refresh")
  refresh(
    @Body(new ZodValidationPipe(RefreshTokenSchema)) body: RefreshTokenInput,
  ) {
    return this.authService.refreshToken(body);
  }

  @Post("logout")
  logout(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.logout(user.sid);
  }
}

@Controller("me")
export class MeController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.sub);
  }

  @Patch()
  updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UserProfileUpdateSchema))
    body: UserProfileUpdateInput,
  ) {
    return this.authService.updateProfile(user.sub, body);
  }
}
