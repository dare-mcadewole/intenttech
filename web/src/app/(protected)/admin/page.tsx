import { createMetadata } from '@/lib/seo';
import { AdminClient } from './admin-client';

export const metadata = createMetadata({
  title: 'Admin dashboard',
  description: 'Review submissions, export PDF/DOCX, edit or delete entries.',
});

export default function AdminPage() {
  return <AdminClient />;
}
