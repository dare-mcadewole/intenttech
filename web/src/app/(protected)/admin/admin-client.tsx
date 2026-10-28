'use client';

import Link from 'next/link';
import { AccountRole } from '@repo/contracts';
import { ArrowRight, BadgeCheck, FileSearch, FolderKanban, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { RequireRole } from '@/features/auth/require-role';
import { useAppSelector } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/** Protected dashboard shell. ADMIN + EDITOR. */
export function AdminClient() {
  const role = useAppSelector((s) => s.auth.session?.role);

  return (
    <RequireRole allowed={[AccountRole.ADMIN, AccountRole.EDITOR]}>
      <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-8 sm:py-10">
        <section className="!hidden relative overflow-hidden rounded-[2rem] bg-slate-950 p-7 text-white shadow-[0_24px_65px_-30px_rgba(30,41,95,0.55)] sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(99,102,241,0.58),transparent_44%),radial-gradient(ellipse_at_10%_100%,rgba(20,184,166,0.22),transparent_42%)]" />
          <div className="absolute -right-10 -top-20 size-72 rounded-full border border-white/10" />
          <div className="absolute -right-3 -top-12 size-56 rounded-full border border-white/10" />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100">
                <Sparkles className="size-4 text-teal-200" /> Your workspace
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Make every introduction count.</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Explore submitted profiles, review each person’s story, and keep your team’s work organized.
              </p>
            </div>
            <Button asChild size="lg" className="shrink-0 bg-white text-slate-950 shadow-none hover:bg-indigo-50">
              <Link href="/profiles">Browse profiles <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Quick access</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">Everything in its place</h2>
            </div>
            <span className="hidden items-center gap-2 text-xs font-medium text-slate-400 sm:inline-flex">
              <span className="size-2 rounded-full bg-emerald-500" /> Secure team workspace
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="group border-white/80 bg-white/85 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/[0.08]">
              <CardHeader className="flex-row items-start justify-between space-y-0 p-6 sm:p-7">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-primary"><FileSearch className="size-5" /></span>
                <BadgeCheck className="size-5 text-emerald-500" />
              </CardHeader>
              <CardContent className="px-6 pb-6 sm:px-7 sm:pb-7">
                <CardTitle className="text-base">Profile directory</CardTitle>
                <CardDescription className="mt-2 max-w-sm leading-6">Search submissions, open detailed profiles, and manage each person’s information.</CardDescription>
                <Link href="/profiles" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  View submissions <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>

            <Card className="group border-white/80 bg-white/85 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/[0.08]">
              <CardHeader className="flex-row items-start justify-between space-y-0 p-6 sm:p-7">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700"><FolderKanban className="size-5" /></span>
                <ShieldCheck className="size-5 text-teal-600" />
              </CardHeader>
              <CardContent className="px-6 pb-6 sm:px-7 sm:pb-7">
                <CardTitle className="text-base">Review & export</CardTitle>
                <CardDescription className="mt-2 max-w-sm leading-6">Open a resume view to get a closer look, then export a polished PDF or DOCX.</CardDescription>
                <Link href="/profiles" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Explore profiles <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-white/80 bg-white/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><UsersRound className="size-5" /></span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Team access</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {role === AccountRole.ADMIN ? 'Invite teammates and choose the right level of access.' : 'Your workspace access is managed by an administrator.'}
              </p>
            </div>
          </div>
          {role === AccountRole.ADMIN && (
            <Button asChild variant="outline" className="shrink-0">
              <Link href="/accounts">Manage accounts <ArrowRight className="size-4" /></Link>
            </Button>
          )}
        </section>
      </main>
    </RequireRole>
  );
}
