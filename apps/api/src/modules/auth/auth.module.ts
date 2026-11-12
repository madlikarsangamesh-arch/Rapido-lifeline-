import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController, MeController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

@Module({
  imports: [
    JwtModule.register({}),
  ],
  controllers: [AuthController, MeController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
