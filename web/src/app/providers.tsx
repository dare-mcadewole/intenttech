'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { ProgressProvider } from '@bprogress/next/app';

/** Client boundary: Redux store for the whole App Router tree. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider options={{
      showSpinner: false,
    }}>
      <Provider store={store}>
        {children}
      </Provider>
    </ProgressProvider>
  );
}
