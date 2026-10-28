import { createMetadata } from '@/lib/seo';
import ProfileDetailPageClient from './detail-client';

export const metadata = createMetadata({
  title: 'Profile detail',
  description: 'Resume-style view of a single submitted profile.',
});

export default function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProfileDetailPageClient params={params} />;
}
