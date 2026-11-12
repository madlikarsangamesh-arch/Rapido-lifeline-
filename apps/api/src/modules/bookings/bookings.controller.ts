import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
} from "@nestjs/common";
import {
  CreateBookingSchema,
  type CreateBookingInput,
} from "@rapidlifeline/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe.js";
import { BookingsService } from "./bookings.service.js";

interface AuthenticatedUser {
  sub: string;
  role: string;
}

@Controller("bookings")
@Roles("rider")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateBookingSchema)) body: CreateBookingInput,
  ) {
    return this.bookingsService.create(user.sub, body);
  }

  @Get(":id")
  getById(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.bookingsService.getById(user.sub, id);
  }

  @Get(":id/location")
  getLatestLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return this.bookingsService.getLatestLocation(user.sub, id);
  }
}
