import { createMetadata } from '@/lib/seo';
import { LoginClient } from './login-client';

export const metadata = createMetadata({
  title: 'Admin login',
  description: 'Sign in to review submissions.',
});

export default function LoginPage() {
  return <LoginClient />;
}
