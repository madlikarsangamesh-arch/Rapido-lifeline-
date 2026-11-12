import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { LocationPoint, TripState } from "@rapidlifeline/shared";
import { PrismaService } from "../prisma/prisma.service.js";

const OPEN_TRIP_STATES: TripState[] = ["requested", "searching"];
const ACTIVE_TRIP_STATES: TripState[] = [
  "assigned",
  "arriving",
  "picked_up",
  "en_route",
  "arrived",
];
const MAX_LOCATION_AGE_MS = 5 * 60 * 1000;
const MAX_CLOCK_SKEW_MS = 30 * 1000;

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async setAvailability(userId: string, isOnline: boolean) {
    return this.prisma.$transaction(async (tx) => {
      const driverId = await this.lockDriver(tx, userId);

      if (!isOnline) {
        const driver = await tx.driver.update({
          where: { id: driverId },
          data: { isOnline: false },
          select: { isOnline: true },
        });
        return driver;
      }

      const driver = await this.getDriver(tx, userId);
      this.requireEligibleDriver(driver);
      if (!driver.shifts[0]) {
        throw new ConflictException(
          "An active approved vehicle shift is required to go online",
        );
      }
      await this.ensureNoActiveTrip(tx, driver.id);

      return tx.driver.update({
        where: { id: driver.id },
        data: { isOnline: true },
        select: { isOnline: true },
      });
    });
  }

  async getEligibleBookings(userId: string) {
    const driver = await this.getDriver(this.prisma, userId);
    this.requireEligibleDriver(driver);
    const activeShift = driver.shifts[0];
    if (!driver.isOnline || !activeShift) {
      return [];
    }

    const hasActiveTrip = await this.prisma.trip.findFirst({
      where: {
        driverId: driver.id,
        state: { in: ACTIVE_TRIP_STATES },
      },
      select: { id: true },
    });
    if (hasActiveTrip) {
      return [];
    }

    const trips = await this.prisma.trip.findMany({
      where: {
        driverId: null,
        state: { in: OPEN_TRIP_STATES },
        booking: {
          categoryId: activeShift.vehicle.categoryId,
          hospital: { isVerified: true, erOpen: true },
        },
        offers: {
          none: { driverId: driver.id, result: "declined" },
        },
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        bookingId: true,
        state: true,
        createdAt: true,
        booking: {
          select: {
            pickupLat: true,
            pickupLng: true,
            pickupAddress: true,
            category: { select: { code: true, nameEn: true } },
            hospital: { select: { name: true, address: true } },
          },
        },
      },
    });

    return trips.map((trip) => ({
      bookingId: trip.bookingId,
      status: trip.state,
      createdAt: trip.createdAt,
      category: trip.booking.category,
      pickup: {
        lat: trip.booking.pickupLat,
        lng: trip.booking.pickupLng,
        address: trip.booking.pickupAddress,
      },
      destination: trip.booking.hospital,
    }));
  }

  async acceptBooking(userId: string, bookingId: string) {
    return this.prisma.$transaction(async (tx) => {
      const driverId = await this.lockDriver(tx, userId);
      const driver = await this.getDriver(tx, userId);
      this.requireEligibleDriver(driver);
      if (!driver.isOnline || !driver.shifts[0]) {
        throw new ConflictException(
          "An online driver with an active approved vehicle shift is required",
        );
      }
      await this.ensureNoActiveTrip(tx, driver.id);

      await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM trips WHERE booking_id = ${bookingId} FOR UPDATE
      `;
      const trip = await tx.trip.findUnique({
        where: { bookingId },
        include: { booking: { select: { categoryId: true } } },
      });
      if (!trip) {
        throw new NotFoundException("Booking was not found");
      }
      if (
        trip.driverId === driverId &&
        ACTIVE_TRIP_STATES.includes(trip.state)
      ) {
        return { bookingId, status: trip.state, tripId: trip.id };
      }
      if (trip.driverId !== null || !OPEN_TRIP_STATES.includes(trip.state)) {
        throw new ConflictException("Booking has already been assigned");
      }
      if (trip.booking.categoryId !== driver.shifts[0].vehicle.categoryId) {
        throw new ForbiddenException(
          "The active vehicle is not eligible for this booking category",
        );
      }

      const previousOffer = await tx.dispatchOffer.findFirst({
        where: { tripId: trip.id, driverId },
        orderBy: { createdAt: "desc" },
      });
      if (previousOffer?.result === "declined") {
        throw new ConflictException("This driver already rejected the booking");
      }

      const now = new Date();
      const updated = await tx.trip.updateMany({
        where: {
          id: trip.id,
          driverId: null,
          state: { in: OPEN_TRIP_STATES },
        },
        data: {
          driverId,
          vehicleId: driver.shifts[0].vehicleId,
          state: "arriving",
          assignedAt: now,
        },
      });
      if (updated.count !== 1) {
        throw new ConflictException("Booking has already been assigned");
      }

      if (previousOffer) {
        await tx.dispatchOffer.update({
          where: { id: previousOffer.id },
          data: { result: "accepted", respondedAt: now },
        });
      } else {
        await tx.dispatchOffer.create({
          data: {
            tripId: trip.id,
            driverId,
            result: "accepted",
            respondedAt: now,
          },
        });
      }

      await tx.tripEvent.create({
        data: {
          tripId: trip.id,
          state: "arriving",
          actorId: userId,
          payload: { action: "driver_accepted" },
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "trip.driver_assigned",
          entity: "trip",
          entityId: trip.id,
          diff: { driverId, vehicleId: driver.shifts[0].vehicleId },
        },
      });

      return {
        bookingId,
        tripId: trip.id,
        status: "arriving" as const,
      };
    });
  }

  async rejectBooking(userId: string, bookingId: string) {
    return this.prisma.$transaction(async (tx) => {
      const driverId = await this.lockDriver(tx, userId);
      const driver = await this.getDriver(tx, userId);
      this.requireEligibleDriver(driver);
      if (!driver.isOnline || !driver.shifts[0]) {
        throw new ConflictException(
          "An online driver with an active approved vehicle shift is required",
        );
      }
      await this.ensureNoActiveTrip(tx, driver.id);

      await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM trips WHERE booking_id = ${bookingId} FOR UPDATE
      `;
      const trip = await tx.trip.findUnique({
        where: { bookingId },
        include: { booking: { select: { categoryId: true } } },
      });
      if (!trip) {
        throw new NotFoundException("Booking was not found");
      }
      if (trip.driverId !== null || !OPEN_TRIP_STATES.includes(trip.state)) {
        throw new ConflictException("Booking is no longer available");
      }
      if (trip.booking.categoryId !== driver.shifts[0].vehicle.categoryId) {
        throw new ForbiddenException(
          "The active vehicle is not eligible for this booking category",
        );
      }

      const now = new Date();
      const previousOffer = await tx.dispatchOffer.findFirst({
        where: { tripId: trip.id, driverId },
        orderBy: { createdAt: "desc" },
      });
      if (previousOffer?.result !== "declined") {
        if (previousOffer) {
          await tx.dispatchOffer.update({
            where: { id: previousOffer.id },
            data: { result: "declined", respondedAt: now },
          });
        } else {
          await tx.dispatchOffer.create({
            data: {
              tripId: trip.id,
              driverId,
              result: "declined",
              respondedAt: now,
            },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "dispatch.booking_rejected",
          entity: "trip",
          entityId: trip.id,
          diff: { driverId },
        },
      });

      return {
        bookingId,
        tripId: trip.id,
        response: "rejected" as const,
        status: trip.state,
      };
    });
  }

  async addLocation(userId: string, tripId: string, point: LocationPoint) {
    const recordedAt = new Date(point.recordedAt);
    const now = Date.now();
    if (recordedAt.getTime() > now + MAX_CLOCK_SKEW_MS) {
      throw new BadRequestException("Location timestamp is in the future");
    }
    if (recordedAt.getTime() < now - MAX_LOCATION_AGE_MS) {
      throw new BadRequestException("Location timestamp is too old");
    }

    return this.prisma.$transaction(async (tx) => {
      const driver = await tx.driver.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (!driver) {
        throw new NotFoundException("Driver account was not found");
      }

      await tx.$queryRaw<Array<{ id: string }>>`
        SELECT id FROM trips WHERE id = ${tripId} FOR UPDATE
      `;
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        select: { id: true, driverId: true, state: true },
      });
      if (!trip) {
        throw new NotFoundException("Trip was not found");
      }
      if (trip.driverId !== driver.id) {
        throw new ForbiddenException(
          "Location can only be shared for the driver's assigned trip",
        );
      }
      if (!ACTIVE_TRIP_STATES.includes(trip.state)) {
        throw new ConflictException("Trip is not active for location sharing");
      }

      const latest = await tx.tripLocation.findFirst({
        where: { tripId },
        orderBy: { recordedAt: "desc" },
        select: { recordedAt: true },
      });
      if (latest && recordedAt <= latest.recordedAt) {
        throw new ConflictException(
          "Location timestamp must be newer than the last update",
        );
      }

      const location = await tx.tripLocation.create({
        data: {
          tripId,
          driverId: driver.id,
          lat: point.lat,
          lng: point.lng,
          speedKmh: point.speedKmh,
          heading: point.heading,
          recordedAt,
        },
        select: {
          lat: true,
          lng: true,
          speedKmh: true,
          heading: true,
          recordedAt: true,
        },
      });
      return { tripId, location };
    });
  }

  private async lockDriver(tx: Prisma.TransactionClient, userId: string) {
    const rows = await tx.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM drivers WHERE user_id = ${userId} FOR UPDATE
    `;
    if (rows.length === 0) {
      throw new NotFoundException("Driver account was not found");
    }
    return rows[0].id;
  }

  private async getDriver(
    tx: Prisma.TransactionClient | PrismaService,
    userId: string,
  ) {
    const driver = await tx.driver.findUnique({
      where: { userId },
      include: {
        shifts: {
          where: {
            endedAt: null,
            vehicle: {
              status: "approved",
              insuranceExpiry: { gt: new Date() },
            },
          },
          include: { vehicle: true },
          orderBy: { startedAt: "desc" },
          take: 1,
        },
        user: { select: { role: true } },
      },
    });
    if (!driver) {
      throw new NotFoundException("Driver account was not found");
    }
    return driver;
  }

  private requireEligibleDriver(
    driver: Awaited<ReturnType<DriversService["getDriver"]>>,
  ) {
    if (driver.status !== "approved" || driver.user.role !== "driver") {
      throw new ForbiddenException("Driver account is not eligible");
    }
  }

  private async ensureNoActiveTrip(
    tx: Prisma.TransactionClient,
    driverId: string,
  ) {
    const activeTrip = await tx.trip.findFirst({
      where: {
        driverId,
        state: { in: ACTIVE_TRIP_STATES },
      },
      select: { id: true },
    });
    if (activeTrip) {
      throw new ConflictException("Driver already has an active trip");
    }
  }
}
