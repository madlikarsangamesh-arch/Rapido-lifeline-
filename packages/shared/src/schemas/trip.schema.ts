import { z } from 'zod';
import { CoordinatesSchema } from './common.schema.js';

export const LocationPointSchema = CoordinatesSchema.extend({
  speedKmh: z.number().min(0).max(200),
  heading: z.number().min(0).max(360),
  recordedAt: z.string().datetime(),
});
export type LocationPoint = z.infer<typeof LocationPointSchema>;

export const LocationBatchSchema = z.object({
  points: z.array(LocationPointSchema).min(1).max(500),
});
export type LocationBatchInput = z.infer<typeof LocationBatchSchema>;

export const DriverDutySchema = z.object({
  isOnline: z.boolean(),
});
export type DriverDutyInput = z.infer<typeof DriverDutySchema>;

export const DriverTripStateUpdateSchema = z.object({
  state: z.enum(['arriving', 'picked_up', 'arrived']),
});
export type DriverTripStateUpdateInput = z.infer<typeof DriverTripStateUpdateSchema>;

export const TripRatingSchema = z.object({
  stars: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});
export type TripRatingInput = z.infer<typeof TripRatingSchema>;

