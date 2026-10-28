'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/auth/hooks';
import { fetchSession, logout } from '@/features/auth/authSlice';
import { AccountRole } from '@repo/contracts';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, Hexagon, LayoutDashboard, LogOut, Shield, Sparkles, Users, UsersRound } from 'lucide-react';

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
  const navClass = (active: boolean) =>
    `group flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${active
      ? 'bg-indigo-50 text-primary'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`;

  return (
    <div className="min-h-screen lg:flex">
      <aside className="no-print border-b border-white/80 bg-white/80 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:px-6 lg:py-7">
          <Link href="/profiles" className="group flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/15 transition-transform group-hover:rotate-[-6deg]">
              <Hexagon className="size-5" />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-tight text-slate-950">IntentTech</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-400">Team workspace</span>
            </span>
          </Link>
          {session && (
            <div className="flex items-center gap-2 lg:hidden">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                {session.role}
              </span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                onClick={() => {
                  dispatch(logout());
                  router.replace('/login');
                }}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          )}
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-1.5 lg:px-4 lg:pb-0" aria-label="Workspace navigation">
          <p className="hidden px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 lg:block">Workspace</p>
          {canWrite && (
            <Link href="/admin" className={navClass(pathname === '/admin')}>
              <LayoutDashboard className="size-[18px] text-current" /> Overview
            </Link>
          )}
          <Link href="/profiles" className={navClass(pathname === '/profiles')}>
            <UsersRound className="size-[18px] text-current" /> Profiles
          </Link>
          {session?.role === AccountRole.ADMIN && (
            <Link href="/accounts" className={navClass(pathname === '/accounts')}>
              <Users className="size-[18px] text-current" /> Team accounts
            </Link>
          )}
        </nav>
        <div className="hidden border-t border-slate-100 p-4 lg:block">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm"><Shield className="size-4" /></span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-800">{session?.email}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">{session?.role} access</p>
            </div>
          </div>
          {session && (
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => {
                dispatch(logout());
                router.replace('/login');
              }}
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          )}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="no-print sticky top-0 z-10 hidden border-b border-white/70 bg-background/70 backdrop-blur-xl lg:block">
          <div className="flex h-[72px] items-center justify-between px-8">
            <div className="text-sm text-slate-400">
              Workspace <span className="mx-2 text-slate-300">/</span>
              <span className="font-semibold text-slate-700">
                {pathname === '/admin' ? 'Overview' : pathname === '/accounts' ? 'Team accounts' : 'Profiles'}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-500 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-500" /> Secure workspace
              <ArrowUpRight className="size-3.5 text-slate-400" />
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
