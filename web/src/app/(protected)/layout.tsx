'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/auth/hooks';
import { fetchSession, logout } from '@/features/auth/authSlice';
import { AccountRole } from '@repo/contracts';
import { Button } from '@/components/ui/button';

/**
 * Protected shell: requires a session (backend guards stay authoritative).
 * Role-hidden nav is UX-only — pages re-check roles via <RequireRole/>.
 */
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const session = useAppSelector((s) => s.auth.session);

  useEffect(() => {
    if (!session && localStorage.getItem('accessToken')) dispatch(fetchSession());
    const on401 = () => {
      dispatch(logout());
      router.replace('/login');
    };
    window.addEventListener('auth:unauthorized', on401);
    return () => window.removeEventListener('auth:unauthorized', on401);
  }, [dispatch, router, session]);

  useEffect(() => {
    if (!session && !localStorage.getItem('accessToken')) router.replace('/login');
  }, [session, router]);

  const canWrite = session?.role === AccountRole.ADMIN || session?.role === AccountRole.EDITOR;

  return (
    <div>
      <header className="no-print border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <Link href="/profiles" className="font-semibold">IntentTech Admin</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/profiles" className={pathname === '/profiles' ? 'font-semibold' : 'text-muted-foreground'}>
              Profiles
            </Link>
            {canWrite && (
              <Link href="/admin" className={pathname === '/admin' ? 'font-semibold' : 'text-muted-foreground'}>
                Dashboard
              </Link>
            )}
            {session?.role === AccountRole.ADMIN && (
              <Link href="/accounts" className={pathname === '/accounts' ? 'font-semibold' : 'text-muted-foreground'}>
                Accounts
              </Link>
            )}
            {session && <span className="text-muted-foreground">{session.email}</span>}
            {session && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  dispatch(logout());
                  router.replace('/login');
                }}
              >
                Sign out
              </Button>
            )}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
