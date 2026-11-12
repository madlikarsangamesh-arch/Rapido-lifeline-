import { z } from 'zod';
import { PhoneSchema } from './common.schema.js';
import { USER_ROLES } from '../constants/index.js';

export const RequestOtpSchema = z.object({
  phone: PhoneSchema,
});
export type RequestOtpInput = z.infer<typeof RequestOtpSchema>;

export const VerifyOtpSchema = z.object({
  phone: PhoneSchema,
  otp: z.string().length(6, 'OTP must be 6 digits'),
});
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export const GuestAuthSchema = z.object({
  name: z.string().min(1).max(100).optional(),
}).strict();
export type GuestAuthInput = z.infer<typeof GuestAuthSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1).max(512),
});
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const UserProfileUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(100).nullable().optional(),
    language: z.enum(['en', 'kn']).optional(),
    largeText: z.boolean().optional(),
    lowData: z.boolean().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one profile field must be provided',
  });
export type UserProfileUpdateInput = z.infer<typeof UserProfileUpdateSchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  phone: z.string().nullable(),
  name: z.string().nullable(),
  role: z.enum(USER_ROLES),
  language: z.enum(['en', 'kn']).default('en'),
  largeText: z.boolean().default(false),
  lowData: z.boolean().default(false),
  isGuest: z.boolean().default(false),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: UserProfileSchema,
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
