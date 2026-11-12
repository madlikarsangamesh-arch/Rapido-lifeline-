import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import {
  DriverDutySchema,
  LocationPointSchema,
  type DriverDutyInput,
  type LocationPoint,
} from "@rapidlifeline/shared";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Roles } from "../../common/decorators/roles.decorator.js";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe.js";
import { DriversService } from "./drivers.service.js";

interface AuthenticatedUser {
  sub: string;
  role: string;
}

@Controller("drivers/me")
@Roles("driver")
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Patch("availability")
  setAvailability(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(DriverDutySchema)) body: DriverDutyInput,
  ) {
    return this.driversService.setAvailability(user.sub, body.isOnline);
  }

  @Get("bookings")
  getEligibleBookings(@CurrentUser() user: AuthenticatedUser) {
    return this.driversService.getEligibleBookings(user.sub);
  }

  @Post("bookings/:bookingId/accept")
  acceptBooking(
    @CurrentUser() user: AuthenticatedUser,
    @Param("bookingId", ParseUUIDPipe) bookingId: string,
  ) {
    return this.driversService.acceptBooking(user.sub, bookingId);
  }

  @Post("bookings/:bookingId/reject")
  rejectBooking(
    @CurrentUser() user: AuthenticatedUser,
    @Param("bookingId", ParseUUIDPipe) bookingId: string,
  ) {
    return this.driversService.rejectBooking(user.sub, bookingId);
  }

  @Post("trips/:tripId/location")
  addLocation(
    @CurrentUser() user: AuthenticatedUser,
    @Param("tripId", ParseUUIDPipe) tripId: string,
    @Body(new ZodValidationPipe(LocationPointSchema)) body: LocationPoint,
  ) {
    return this.driversService.addLocation(user.sub, tripId, body);
  }
}
