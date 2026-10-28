import { z } from 'zod';
import { Gender } from '@repo/contracts';

/** Step-level schemas. Mirror the backend DTOs; typed against shared contracts. */

export const infoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((v) => {
      const d = new Date(v);
      return !Number.isNaN(d.getTime()) && d <= new Date();
    }, 'Must be a valid past date'),
  occupation: z.string().min(1, 'Occupation is required').max(150),
  gender: z.nativeEnum(Gender),
  profilePhotoUrl: z.string().url().optional().or(z.literal('')).nullable(),
});

export const contactSchema = z.object({
  email: z.string().email('Enter a valid email'),
  phoneNumber: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Enter a valid phone number'),
  fax: z.string().max(30).optional().nullable(),
  linkedinUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')).nullable(),
});

export const addressSchema = z.object({
  addressLine: z.string().min(1, 'Address is required').max(255),
  city: z.string().min(1, 'City is required').max(120),
  state: z.string().min(1, 'State is required').max(120),
  country: z.string().min(1, 'Country is required').max(120),
  zipCode: z.string().min(1, 'Zip code is required').max(20),
});

export const academicSchema = z
  .object({
    schoolName: z.string().min(1, 'School name is required').max(200),
    degree: z.string().max(200).optional().nullable(),
    fieldOfStudy: z.string().max(200).optional().nullable(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    description: z.string().max(2000).optional().nullable(),
  })
  .refine(
    (v) => !v.startDate || !v.endDate || new Date(v.endDate) >= new Date(v.startDate),
    { message: 'End date must be after start date', path: ['endDate'] },
  );

export const academicsSchema = z.object({ items: z.array(academicSchema).max(20) });

export type InfoForm = z.infer<typeof infoSchema>;
export type ContactForm = z.infer<typeof contactSchema>;
export type AddressForm = z.infer<typeof addressSchema>;
export type AcademicsForm = z.infer<typeof academicsSchema>;
