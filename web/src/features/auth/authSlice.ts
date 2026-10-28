import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { SessionResponse } from '@repo/contracts';
import { apiFetch } from '../../app/apiClient';

export interface AuthState {
  session: SessionResponse | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: AuthState = { session: null, status: 'idle', error: null };

export const login = createAsyncThunk(
  'auth/login',
  async (input: { email: string; password: string }) => {
    const res = await apiFetch<{
      user: SessionResponse;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', { method: 'POST', body: JSON.stringify(input) });
    localStorage.setItem('accessToken', res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    return res.user;
  },
);

export const fetchSession = createAsyncThunk('auth/me', async () => {
  return apiFetch<SessionResponse>('/auth/me');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.session = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.status = 'idle';
        s.session = a.payload;
      })
      .addCase(login.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.error.message ?? 'Login failed.';
      })
      .addCase(fetchSession.fulfilled, (s, a) => {
        s.session = a.payload;
      })
      .addCase(fetchSession.rejected, (s) => {
        s.session = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
