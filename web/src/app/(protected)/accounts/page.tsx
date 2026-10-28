import { createMetadata } from '@/lib/seo';
import { AccountsClient } from './accounts-client';

export const metadata = createMetadata({
  title: 'Accounts',
  description: 'Create and manage admin accounts (ADMIN only).',
});

export default function AccountsPage() {
  return <AccountsClient />;
}
