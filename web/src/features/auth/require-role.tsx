'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { AccountRole } from '@repo/contracts';
import { useAppSelector } from './hooks';

/**
 * UX-only role gate for protected pages.
 * Real enforcement lives in the backend RolesGuard.
 */
export function RequireRole({
  allowed,
  children,
}: {
  allowed: AccountRole[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const session = useAppSelector((s) => s.auth.session);

  useEffect(() => {
    if (session && !allowed.includes(session.role)) router.replace('/403');
  }, [session, allowed, router]);

  if (!session) return <p className="p-6">Loading…</p>;
  if (!allowed.includes(session.role)) return null;
  return <>{children}</>;
}
