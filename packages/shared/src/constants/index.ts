export const CATEGORY_CODES = ['BLS', 'ALS', 'ICU', 'PT', 'NEO'] as const;
export type CategoryCode = (typeof CATEGORY_CODES)[number];

export const USER_ROLES = [
  'rider',
  'driver',
  'hospital_staff',
  'operator',
  'admin',
  'super_admin',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const TRIP_STATES = [
  'requested',
  'searching',
  'assigned',
  'arriving',
  'picked_up',
  'en_route',
  'arrived',
  'completed',
  'cancelled',
  'no_driver',
] as const;
export type TripState = (typeof TRIP_STATES)[number];

export const PAYMENT_METHODS = ['upi', 'card', 'wallet', 'cash'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const DEFAULT_FARE_CARD = {
  BLS: {
    basePaise: 120000,
    baseKm: 5,
    perKmPaise: 2500,
    waitPerMinPaise: 500,
    nightPct: 20,
  },
  ALS: {
    basePaise: 250000,
    baseKm: 5,
    perKmPaise: 4000,
    waitPerMinPaise: 500,
    nightPct: 20,
  },
  ICU: {
    basePaise: 450000,
    baseKm: 5,
    perKmPaise: 6000,
    waitPerMinPaise: 500,
    nightPct: 20,
  },
  PT: {
    basePaise: 80000,
    baseKm: 5,
    perKmPaise: 1800,
    waitPerMinPaise: 500,
    nightPct: 20,
  },
  NEO: {
    basePaise: 350000,
    baseKm: 5,
    perKmPaise: 5000,
    waitPerMinPaise: 500,
    nightPct: 20,
  },
} as const;

export const DISPATCH_CONFIG = {
  radiusStepsKm: [3, 5, 8],
  stepTimeoutSeconds: 10,
  offerTimeoutSeconds: 20,
  maxSequentialOffers: 5,
  upgradeOfferSeconds: 30,
  hospitalResponseTimeoutSeconds: 60,
  speedMotionLockKmh: 10,
  staleLocationWarningSeconds: 10,
  staleLocationCriticalSeconds: 60,
  trackingLinkExpiryMinutes: 30,
} as const;

