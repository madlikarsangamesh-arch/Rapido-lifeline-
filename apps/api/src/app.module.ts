import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { APP_GUARD, APP_FILTER } from "@nestjs/core";
import { PrismaModule } from "./modules/prisma/prisma.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { BookingsModule } from "./modules/bookings/bookings.module.js";
import { DriversModule } from "./modules/drivers/drivers.module.js";
import { AuthGuard } from "./common/guards/auth.guard.js";
import { RolesGuard } from "./common/guards/roles.guard.js";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter.js";
import { RequestIdMiddleware } from "./common/middleware/request-id.middleware.js";

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    BookingsModule,
    DriversModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
