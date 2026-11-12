import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import type { CreateBookingInput } from "@rapidlifeline/shared";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(riderId: string, input: CreateBookingInput) {
    const booking = await this.prisma.$transaction(async (tx) => {
      const rider = await tx.user.findUnique({
        where: { id: riderId },
        select: { id: true, role: true },
      });
      if (!rider || rider.role !== "rider") {
        throw new NotFoundException("Customer account was not found");
      }

      const [category, hospital] = await Promise.all([
        tx.category.findUnique({
          where: { id: input.categoryId },
          select: { id: true, code: true, nameEn: true },
        }),
        tx.hospital.findUnique({
          where: { id: input.hospitalId },
          select: {
            id: true,
            name: true,
            address: true,
            isVerified: true,
            erOpen: true,
          },
        }),
      ]);

      if (!category) {
        throw new BadRequestException("Ambulance category is unavailable");
      }
      if (!hospital || !hospital.isVerified || !hospital.erOpen) {
        throw new BadRequestException(
          "The selected destination is unavailable or not verified",
        );
      }

      const created = await tx.booking.create({
        data: {
          riderId,
          forOther: input.forOther,
          patientName: input.patientName,
          patientPhone: input.patientPhone,
          categoryId: input.categoryId,
          pickupLat: input.pickup.lat,
          pickupLng: input.pickup.lng,
          pickupAddress: input.pickupAddress,
          hospitalId: input.hospitalId,
          quoteMinPaise: null,
          quoteMaxPaise: null,
          paymentMethod: input.paymentMethod,
          consentSummary: input.consentSummary,
          patientSummary: input.patientSummary,
          trip: {
            create: {
              state: "searching",
              events: {
                create: {
                  state: "searching",
                  actorId: riderId,
                  payload: { action: "booking_created" },
                },
              },
            },
          },
        },
        select: {
          id: true,
          createdAt: true,
          category: { select: { id: true, code: true, nameEn: true } },
          hospital: { select: { id: true, name: true, address: true } },
          trip: { select: { id: true, state: true } },
        },
      });

      if (!created.trip) {
        throw new InternalServerErrorException(
          "Booking was created without its trip state",
        );
      }
      const createdTrip = created.trip;

      await tx.auditLog.create({
        data: {
          actorId: riderId,
          action: "booking.created",
          entity: "booking",
          entityId: created.id,
          diff: { tripId: createdTrip.id, status: createdTrip.state },
        },
      });

      return { ...created, trip: createdTrip };
    });

    return {
      id: booking.id,
      status: booking.trip.state,
      createdAt: booking.createdAt,
      category: booking.category,
      pickup: {
        lat: input.pickup.lat,
        lng: input.pickup.lng,
        address: input.pickupAddress,
      },
      destination: booking.hospital,
      fareEstimate: null,
      tripId: booking.trip.id,
    };
  }

  async getById(riderId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, riderId },
      select: {
        id: true,
        createdAt: true,
        forOther: true,
        patientName: true,
        patientPhone: true,
        category: { select: { id: true, code: true, nameEn: true } },
        pickupLat: true,
        pickupLng: true,
        pickupAddress: true,
        quoteMinPaise: true,
        quoteMaxPaise: true,
        hospital: { select: { id: true, name: true, address: true } },
        trip: {
          select: {
            id: true,
            state: true,
            driverId: true,
            assignedAt: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException("Booking was not found");
    }
    if (!booking.trip) {
      throw new InternalServerErrorException(
        "Booking trip state is unavailable",
      );
    }

    return {
      id: booking.id,
      status: booking.trip.state,
      createdAt: booking.createdAt,
      forOther: booking.forOther,
      patientName: booking.patientName,
      patientPhone: booking.patientPhone,
      category: booking.category,
      pickup: {
        lat: booking.pickupLat,
        lng: booking.pickupLng,
        address: booking.pickupAddress,
      },
      destination: booking.hospital,
      fareEstimate:
        booking.quoteMinPaise === null || booking.quoteMaxPaise === null
          ? null
          : {
              minPaise: booking.quoteMinPaise,
              maxPaise: booking.quoteMaxPaise,
            },
      trip: {
        id: booking.trip.id,
        status: booking.trip.state,
        driverAssigned: booking.trip.driverId !== null,
        assignedAt: booking.trip.assignedAt,
      },
    };
  }

  async getLatestLocation(riderId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, riderId },
      select: {
        id: true,
        trip: {
          select: {
            id: true,
            state: true,
            locations: {
              orderBy: { recordedAt: "desc" },
              take: 1,
              select: {
                lat: true,
                lng: true,
                speedKmh: true,
                heading: true,
                recordedAt: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException("Booking was not found");
    }
    if (!booking.trip) {
      throw new InternalServerErrorException(
        "Booking trip state is unavailable",
      );
    }

    const latest = booking.trip.locations[0];
    return {
      bookingId: booking.id,
      tripStatus: booking.trip.state,
      location: latest ?? null,
    };
  }
}
