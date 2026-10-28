import { createMetadata } from '@/lib/seo';
import { ProfilesClient } from './profiles-client';

export const metadata = createMetadata({
  title: 'Profiles',
  description: 'Browse, search, edit and delete submitted user profiles.',
});

export default function ProfilesPage() {
  return <ProfilesClient />;
}
