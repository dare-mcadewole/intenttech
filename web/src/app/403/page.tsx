import { createMetadata } from '@/lib/seo';

export const metadata = createMetadata({
  title: 'Forbidden',
  description: 'You do not have permission to view this page.',
});

export default function Forbidden() {
  return <div className="p-8">403 — insufficient role.</div>;
}
