import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import type { PrismaService } from "../src/modules/prisma/prisma.service.js";
import { BookingsService } from "../src/modules/bookings/bookings.service.js";
import { DriversService } from "../src/modules/drivers/drivers.service.js";
import { CreateBookingSchema } from "@rapidlifeline/shared";
import { ZodValidationPipe } from "../src/common/pipes/zod-validation.pipe.js";
import { describe, expect, it, vi } from "vitest";

type MockDatabase = {
  user: { findUnique: ReturnType<typeof vi.fn> };
  category: { findUnique: ReturnType<typeof vi.fn> };
  hospital: { findUnique: ReturnType<typeof vi.fn> };
  booking: {
    create: ReturnType<typeof vi.fn>;
    findFirst: ReturnType<typeof vi.fn>;
  };
  driver: {
    findUnique: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  trip: {
    findFirst: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
    findUnique: ReturnType<typeof vi.fn>;
    updateMany: ReturnType<typeof vi.fn>;
  };
  dispatchOffer: {
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
  };
  tripEvent: { create: ReturnType<typeof vi.fn> };
  tripLocation: {
    findFirst: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
  };
  auditLog: { create: ReturnType<typeof vi.fn> };
  $queryRaw: ReturnType<typeof vi.fn>;
  $transaction: ReturnType<typeof vi.fn>;
};

const bookingId = "30a2fb9f-74c3-4f67-a992-226a092f7c4c";
const tripId = "a4320bc2-c8c1-43c0-93cc-c1c72ec2be8b";
const riderId = "3b28ded5-3d9d-44b3-b151-6fa3ac4fb5e3";
const hospitalId = "120a8edf-d70c-4bd6-aa7f-bcc2c3d6aa45";
const categoryId = "a1bba47a-1869-4156-a59f-947790d204a8";

function createMockDatabase(): MockDatabase {
  const db = {} as MockDatabase;
  const driverRows = [
    {
      id: "96c1d9e6-9fe5-4e42-9a9b-258a5d122f8d",
      userId: "2b18c7b5-31a8-4efb-9887-6c8c0a68298a",
      user: { role: "driver" },
      status: "approved",
      isOnline: true,
      shifts: [
        {
          vehicleId: "1175854c-6066-4b24-8a7b-3cc66c6e8df0",
          vehicle: { categoryId, status: "approved" },
        },
      ],
    },
    {
      id: "c693b44d-424a-4178-9d4c-78bbf9fbde5a",
      userId: "65f9405c-c891-4a1f-99b7-b1724b3bba3d",
      user: { role: "driver" },
      status: "approved",
      isOnline: true,
      shifts: [
        {
          vehicleId: "a1d217f5-83ec-4c52-955a-3ca647c65a73",
          vehicle: { categoryId, status: "approved" },
        },
      ],
    },
  ];
  const trip = {
    id: tripId,
    bookingId,
    driverId: null as string | null,
    vehicleId: null as string | null,
    state: "searching",
    assignedAt: null as Date | null,
    booking: { categoryId },
  };
  const offers: Array<{
    id: string;
    tripId: string;
    driverId: string;
    result: string;
  }> = [];
  let transactionTail = Promise.resolve();

  db.user = {
    findUnique: vi.fn().mockResolvedValue({ id: riderId, role: "rider" }),
  };
  db.category = {
    findUnique: vi.fn().mockResolvedValue({
      id: categoryId,
      code: "BLS",
      nameEn: "Basic Life Support",
    }),
  };
  db.hospital = {
    findUnique: vi.fn().mockResolvedValue({
      id: hospitalId,
      name: "Verified Hospital",
      address: "Stored address",
      isVerified: true,
      erOpen: true,
    }),
  };
  db.booking = {
    create: vi.fn().mockImplementation(({ data }) =>
      Promise.resolve({
        id: bookingId,
        createdAt: new Date("2026-11-10T12:00:00.000Z"),
        category: { id: categoryId, code: "BLS", nameEn: "Basic Life Support" },
        hospital: {
          id: hospitalId,
          name: "Verified Hospital",
          address: "Stored address",
        },
        trip: { id: tripId, state: "searching" },
        inputData: data,
      }),
    ),
    findFirst: vi.fn().mockResolvedValue(null),
  };
  db.driver = {
    findUnique: vi
      .fn()
      .mockImplementation(({ where }) =>
        Promise.resolve(
          driverRows.find((driver) => driver.userId === where.userId) ?? null,
        ),
      ),
    update: vi.fn().mockImplementation(({ where, data }) => {
      const driver = driverRows.find((row) => row.id === where.id);
      if (!driver) return Promise.resolve(null);
      Object.assign(driver, data);
      return Promise.resolve({ isOnline: driver.isOnline });
    }),
  };
  db.trip = {
    findFirst: vi
      .fn()
      .mockImplementation(({ where }) =>
        Promise.resolve(
          trip.driverId === where.driverId &&
            [
              "assigned",
              "arriving",
              "picked_up",
              "en_route",
              "arrived",
            ].includes(trip.state)
            ? { id: trip.id }
            : null,
        ),
      ),
    findMany: vi.fn().mockResolvedValue([
      {
        id: tripId,
        bookingId,
        state: "searching",
        createdAt: new Date("2026-11-10T12:00:00.000Z"),
        booking: {
          pickupLat: 12.9,
          pickupLng: 77.6,
          pickupAddress: "Stored pickup",
          category: { code: "BLS", nameEn: "Basic Life Support" },
          hospital: { name: "Verified Hospital", address: "Stored address" },
        },
      },
    ]),
    findUnique: vi
      .fn()
      .mockImplementation(({ where }) =>
        Promise.resolve(
          where.bookingId === trip.bookingId || where.id === trip.id
            ? { ...trip }
            : null,
        ),
      ),
    updateMany: vi.fn().mockImplementation(({ data }) => {
      if (
        trip.driverId !== null ||
        !["requested", "searching"].includes(trip.state)
      ) {
        return Promise.resolve({ count: 0 });
      }
      Object.assign(trip, data);
      return Promise.resolve({ count: 1 });
    }),
  };
  db.dispatchOffer = {
    findFirst: vi
      .fn()
      .mockImplementation(({ where }) =>
        Promise.resolve(
          offers.find(
            (offer) =>
              offer.tripId === where.tripId &&
              offer.driverId === where.driverId,
          ) ?? null,
        ),
      ),
    create: vi.fn().mockImplementation(({ data }) => {
      const offer = { id: `offer-${offers.length + 1}`, ...data };
      offers.push(offer);
      return Promise.resolve(offer);
    }),
    update: vi.fn().mockImplementation(({ where, data }) => {
      const offer = offers.find((row) => row.id === where.id);
      if (!offer) return Promise.resolve(null);
      Object.assign(offer, data);
      return Promise.resolve(offer);
    }),
  };
  db.tripEvent = { create: vi.fn().mockResolvedValue({}) };
  db.tripLocation = {
    findFirst: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockImplementation(({ data }) => Promise.resolve(data)),
  };
  db.auditLog = { create: vi.fn().mockResolvedValue({}) };
  db.$queryRaw = vi
    .fn()
    .mockImplementation((strings: TemplateStringsArray, userId: string) => {
      if (strings.join("").includes("drivers")) {
        const driver = driverRows.find((row) => row.userId === userId);
        return Promise.resolve(driver ? [{ id: driver.id }] : []);
      }
      return Promise.resolve([{ id: trip.id }]);
    });
  db.$transaction = vi.fn(
    async (callback: (tx: MockDatabase) => Promise<unknown>) => {
      const previous = transactionTail;
      let release = () => {};
      transactionTail = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;
      try {
        return await callback(db);
      } finally {
        release();
      }
    },
  );

  return db;
}

function createBookingInput() {
  return {
    forOther: false,
    categoryId,
    pickup: { lat: 12.9, lng: 77.6 },
    pickupAddress: "Stored pickup address",
    hospitalId,
    paymentMethod: "cash" as const,
    consentSummary: false,
  };
}

describe("booking and driver workflow", () => {
  it("creates a persisted booking with the actual searching status and no unsupported fare", async () => {
    const db = createMockDatabase();
    const service = new BookingsService(db as unknown as PrismaService);

    const result = await service.create(riderId, createBookingInput());

    expect(result.id).toBe(bookingId);
    expect(result.status).toBe("searching");
    expect(result.fareEstimate).toBeNull();
    expect(db.booking.create).toHaveBeenCalledOnce();
    expect(db.auditLog.create).toHaveBeenCalledOnce();
  });

  it("rejects invalid coordinates and request fields", () => {
    const pipe = new ZodValidationPipe(CreateBookingSchema);
    expect(() =>
      pipe.transform(
        { ...createBookingInput(), pickup: { lat: 91, lng: 181 } },
        { type: "body", metatype: Object, data: "" },
      ),
    ).toThrow(BadRequestException);
  });

  it("returns only eligible bookings for an approved online driver and active vehicle", async () => {
    const db = createMockDatabase();
    const service = new DriversService(db as unknown as PrismaService);

    const result = await service.getEligibleBookings(
      "2b18c7b5-31a8-4efb-9887-6c8c0a68298a",
    );

    expect(result).toHaveLength(1);
    expect(result[0].bookingId).toBe(bookingId);
    expect(db.trip.findMany).toHaveBeenCalledOnce();
  });

  it("accepts a booking and updates its persisted trip state and assignment", async () => {
    const db = createMockDatabase();
    const service = new DriversService(db as unknown as PrismaService);

    const result = await service.acceptBooking(
      "2b18c7b5-31a8-4efb-9887-6c8c0a68298a",
      bookingId,
    );

    expect(result.status).toBe("arriving");
    expect(db.trip.updateMany).toHaveBeenCalledOnce();
    expect(db.tripEvent.create).toHaveBeenCalledOnce();
    expect(db.auditLog.create).toHaveBeenCalledOnce();
  });

  it("prevents a second driver from accepting an already assigned booking", async () => {
    const db = createMockDatabase();
    const service = new DriversService(db as unknown as PrismaService);
    await service.acceptBooking(
      "2b18c7b5-31a8-4efb-9887-6c8c0a68298a",
      bookingId,
    );

    await expect(
      service.acceptBooking("65f9405c-c891-4a1f-99b7-b1724b3bba3d", bookingId),
    ).rejects.toThrow(ConflictException);
  });

  it("records a driver's rejection without changing the booking's searching state", async () => {
    const db = createMockDatabase();
    const service = new DriversService(db as unknown as PrismaService);

    const result = await service.rejectBooking(
      "2b18c7b5-31a8-4efb-9887-6c8c0a68298a",
      bookingId,
    );

    expect(result.response).toBe("rejected");
    expect(result.status).toBe("searching");
    expect(db.dispatchOffer.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ result: "declined" }),
      }),
    );
  });

  it("returns the persisted trip state to the owning customer", async () => {
    const db = createMockDatabase();
    db.booking.findFirst.mockResolvedValue({
      id: bookingId,
      createdAt: new Date(),
      forOther: false,
      patientName: null,
      patientPhone: null,
      category: { id: categoryId, code: "BLS", nameEn: "Basic Life Support" },
      pickupLat: 12.9,
      pickupLng: 77.6,
      pickupAddress: "Stored pickup",
      quoteMinPaise: null,
      quoteMaxPaise: null,
      hospital: {
        id: hospitalId,
        name: "Verified Hospital",
        address: "Stored address",
      },
      trip: {
        id: tripId,
        state: "arriving",
        driverId: "driver-id",
        assignedAt: new Date(),
      },
    });
    const service = new BookingsService(db as unknown as PrismaService);

    const result = await service.getById(riderId, bookingId);

    expect(result.status).toBe("arriving");
    expect(result.trip.driverAssigned).toBe(true);
    expect(result.fareEstimate).toBeNull();
  });

  it("stores GPS only for the assigned driver and returns the actual latest point", async () => {
    const db = createMockDatabase();
    const service = new DriversService(db as unknown as PrismaService);
    await service.acceptBooking(
      "2b18c7b5-31a8-4efb-9887-6c8c0a68298a",
      bookingId,
    );

    const recordedAt = new Date().toISOString();
    const point = {
      lat: 12.9,
      lng: 77.6,
      speedKmh: 0,
      heading: 0,
      recordedAt,
    };
    const result = await service.addLocation(
      "2b18c7b5-31a8-4efb-9887-6c8c0a68298a",
      tripId,
      point,
    );
    expect(result.location.lat).toBe(point.lat);
    await expect(
      service.addLocation(
        "65f9405c-c891-4a1f-99b7-b1724b3bba3d",
        tripId,
        point,
      ),
    ).rejects.toThrow("Location can only be shared");

    db.booking.findFirst.mockResolvedValue({
      id: bookingId,
      trip: {
        id: tripId,
        state: "arriving",
        locations: [{ ...result.location }],
      },
    });
    const customerService = new BookingsService(db as unknown as PrismaService);
    const customerResult = await customerService.getLatestLocation(
      riderId,
      bookingId,
    );
    expect(customerResult.location?.lat).toBe(point.lat);
  });

  it("does not disclose booking details or location to a different customer", async () => {
    const db = createMockDatabase();
    const service = new BookingsService(db as unknown as PrismaService);

    await expect(
      service.getById("another-rider-id", bookingId),
    ).rejects.toThrow(NotFoundException);
    await expect(
      service.getLatestLocation("another-rider-id", bookingId),
    ).rejects.toThrow(NotFoundException);
  });
});
