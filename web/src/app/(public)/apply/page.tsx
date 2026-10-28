import { createMetadata } from '@/lib/seo';
import { ApplyClient } from './apply-client';

export const metadata = createMetadata({
  title: 'Apply',
  description: 'Submit your profile publicly — multi-step wizard, no login required.',
});

/** Server component: exports metadata, renders the client wizard island. */
export default function ApplyPage() {
  return <ApplyClient />;
}
