import type { AccountRole, Gender } from './enums.js';

export interface ProfileInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  occupation: string;
  gender: Gender;
  profilePhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileContact {
  email: string;
  phoneNumber: string;
  fax: string | null;
  linkedinUrl: string | null;
}

export interface ProfileAddress {
  addressLine: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface ProfileAcademic {
  id: string;
  schoolName: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  sortOrder: number;
}

/** GET /users/:id and create/update responses. */
export interface ProfileResponse {
  id: string;
  info: ProfileInfo;
  contact: ProfileContact;
  address: ProfileAddress;
  academics: ProfileAcademic[];
}

/** Row shape for GET /users (full academics omitted for list speed). */
export interface ProfileSummary extends Omit<ProfileResponse, 'academics'> {
  academicsCount: number;
}

export type SortDirection = 'asc' | 'desc';

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paged<T> {
  data: T[];
  meta: PageMeta;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

/** Query params for GET /users. */
export interface ListProfilesQuery {
  page?: number;
  limit?: number;
  search?: string;
  sort?: `createdAt:${SortDirection}`;
}
