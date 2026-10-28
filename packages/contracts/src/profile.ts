import type { Gender } from './enums.js';

/** Step 1 of the wizard: who the person is. */
export interface ProfileInfoInput {
  firstName: string;
  lastName: string;
  /** ISO date string, e.g. "1990-05-12". Must be a past date. */
  dateOfBirth: string;
  occupation: string;
  gender: Gender;
  /** Optional public URL of the profile photo. v1 accepts a URL string only. */
  profilePhotoUrl?: string | null;
}

/** Step 2 of the wizard: how to reach the person. */
export interface ContactInput {
  email: string;
  phoneNumber: string;
  fax?: string | null;
  linkedinUrl?: string | null;
}

/** Step 3 of the wizard: where the person lives. Exactly one address per profile in v1. */
export interface AddressInput {
  addressLine: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

/** Step 4 of the wizard: one entry in the "past schools" list. */
export interface AcademicInput {
  schoolName: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  /** ISO date strings. endDate must be >= startDate when both present. */
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

/**
 * POST /users body. Public endpoint — the sole data-collection contract.
 * info, contact, address are required; academics may be an empty array.
 */
export interface CreateProfileRequest {
  info: ProfileInfoInput;
  contact: ContactInput;
  address: AddressInput;
  academics: AcademicInput[];
}

/**
 * PATCH /users/:id body. Deep-partial of create:
 * any top-level key may be omitted (left untouched).
 * If `academics` is present it is a FULL REPLACE of the list.
 */
export type UpdateProfileRequest = Partial<CreateProfileRequest>;
