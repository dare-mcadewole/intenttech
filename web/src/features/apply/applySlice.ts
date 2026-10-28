import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CreateProfileRequest, ProfileResponse } from '@repo/contracts';
import { apiFetch } from '../../app/apiClient';
import type { AddressForm, ContactForm, InfoForm } from './schemas';
import type { AcademicInput } from '@repo/contracts';

export interface ApplyState {
  step: number;
  info: InfoForm | null;
  contact: ContactForm | null;
  address: AddressForm | null;
  academics: AcademicInput[];
  status: 'idle' | 'submitting' | 'succeeded' | 'failed';
  error: string | null;
  result: ProfileResponse | null;
}

const initialState: ApplyState = {
  step: 0,
  info: null,
  contact: null,
  address: null,
  academics: [],
  status: 'idle',
  error: null,
  result: null,
};

/** Public submit — no auth token. Fires once from the resume-preview step. */
export const submitApplication = createAsyncThunk('apply/submit', async (_, { getState }) => {
  const s = (getState() as { apply: ApplyState }).apply;
  const body: CreateProfileRequest = {
    info: {
      firstName: s.info!.firstName,
      lastName: s.info!.lastName,
      dateOfBirth: s.info!.dateOfBirth,
      occupation: s.info!.occupation,
      gender: s.info!.gender,
      profilePhotoUrl: s.info!.profilePhotoUrl || null,
    },
    contact: {
      email: s.contact!.email,
      phoneNumber: s.contact!.phoneNumber,
      fax: s.contact!.fax || null,
      linkedinUrl: s.contact!.linkedinUrl || null,
    },
    address: { ...s.address! },
    academics: s.academics,
  };
  return apiFetch<ProfileResponse>('/users', { method: 'POST', body: JSON.stringify(body) });
});

const applySlice = createSlice({
  name: 'apply',
  initialState,
  reducers: {
    setStep(state, a: PayloadAction<number>) {
      state.step = a.payload;
    },
    saveInfo(state, a: PayloadAction<InfoForm>) {
      state.info = a.payload;
    },
    saveContact(state, a: PayloadAction<ContactForm>) {
      state.contact = a.payload;
    },
    saveAddress(state, a: PayloadAction<AddressForm>) {
      state.address = a.payload;
    },
    saveAcademics(state, a: PayloadAction<AcademicInput[]>) {
      state.academics = a.payload;
    },
    resetApply() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitApplication.pending, (s) => {
        s.status = 'submitting';
        s.error = null;
      })
      .addCase(submitApplication.fulfilled, (s, a) => {
        s.status = 'succeeded';
        s.result = a.payload;
      })
      .addCase(submitApplication.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.error.message ?? 'Submission failed.';
      });
  },
});

export const { setStep, saveInfo, saveContact, saveAddress, saveAcademics, resetApply } =
  applySlice.actions;
export default applySlice.reducer;
