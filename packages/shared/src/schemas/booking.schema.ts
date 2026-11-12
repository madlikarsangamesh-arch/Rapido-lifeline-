import { z } from 'zod';
import { CoordinatesSchema, PhoneSchema } from './common.schema.js';
import { PAYMENT_METHODS } from '../constants/index.js';

export const QuoteRequestSchema = z.object({
  pickup: CoordinatesSchema,
  categoryId: z.string().uuid().optional(),
});
export type QuoteRequestInput = z.infer<typeof QuoteRequestSchema>;

export const TriageSuggestSchema = z.object({
  isConscious: z.boolean(),
  hasChestPainOrHeavyBleeding: z.boolean(),
});
export type TriageSuggestInput = z.infer<typeof TriageSuggestSchema>;

export const CreateBookingSchema = z.object({
  forOther: z.boolean().default(false),
  patientName: z.string().max(100).optional(),
  patientPhone: PhoneSchema.optional(),
  categoryId: z.string().uuid(),
  pickup: CoordinatesSchema,
  pickupAddress: z.string().min(3).max(500),
  hospitalId: z.string().uuid(),
  paymentMethod: z.enum(PAYMENT_METHODS).default('cash'),
  consentSummary: z.boolean().default(false),
  patientSummary: z.string().max(1000).optional(),
});
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;

export const CancelBookingSchema = z.object({
  reason: z.string().max(250).optional(),
});
export type CancelBookingInput = z.infer<typeof CancelBookingSchema>;

