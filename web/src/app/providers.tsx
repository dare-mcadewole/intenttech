'use client';

import { Provider } from 'react-redux';
import { store } from './store';

/** Client boundary: Redux store for the whole App Router tree. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
