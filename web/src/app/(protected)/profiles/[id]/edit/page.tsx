import { createMetadata } from '@/lib/seo';
import ProfileEditPageClient from './edit-client';

export const metadata = createMetadata({
  title: 'Edit profile',
  description: 'Edit a submitted user profile.',
});

export default function ProfileEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <ProfileEditPageClient params={params} />;
}
