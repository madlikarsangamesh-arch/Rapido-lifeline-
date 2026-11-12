import { z } from 'zod';

export const HospitalStatusUpdateSchema = z.object({
  erOpen: z.boolean(),
  capacityNote: z.string().max(250).optional(),
});
export type HospitalStatusUpdateInput = z.infer<typeof HospitalStatusUpdateSchema>;

export const HospitalAlertResponseSchema = z.object({
  status: z.enum(['accepted', 'declined']),
  reason: z.string().max(250).optional(),
});
export type HospitalAlertResponseInput = z.infer<typeof HospitalAlertResponseSchema>;

export const HospitalQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  specialty: z.string().optional(),
  q: z.string().optional(),
});
export type HospitalQueryInput = z.infer<typeof HospitalQuerySchema>;

