'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/features/auth/hooks';
import { login } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function LoginClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error } = useAppSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await dispatch(login({ email, password }));
    if (login.fulfilled.match(res)) router.replace('/profiles');
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
      <section className="relative hidden min-h-[540px] overflow-hidden rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl shadow-indigo-950/20 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(99,102,241,0.65),transparent_48%),radial-gradient(ellipse_at_90%_85%,rgba(20,184,166,0.3),transparent_42%)]" />
        <div className="absolute -right-20 top-24 size-72 rounded-full border border-white/10" />
        <div className="absolute -right-8 top-36 size-48 rounded-full border border-white/10" />
        <Link href="/" className="relative inline-flex items-center gap-3 text-sm font-semibold">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"><Sparkles className="size-5 text-cyan-200" /></span>
          IntentTech
        </Link>
        <div className="relative max-w-md">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-indigo-100">
            <ShieldCheck className="size-4 text-teal-300" /> Private workspace
          </div>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight">A clear view of every story.</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">Sign in to review profiles, explore experience, and keep your team moving with confidence.</p>
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur">
            <span className="flex size-10 items-center justify-center rounded-xl bg-teal-300/15 text-teal-200"><BadgeCheck className="size-5" /></span>
            <div><p className="text-sm font-medium">Thoughtful by design</p><p className="mt-1 text-xs text-slate-400">Everything you need, right where you need it.</p></div>
          </div>
        </div>
        <p className="relative text-xs text-slate-400">Secure access for your team</p>
      </section>

      <section className="mx-auto w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-primary lg:hidden">
          <ArrowLeft className="size-4" /> Back to IntentTech
        </Link>
        <Card className="border-white/80 bg-white/90">
          <CardHeader className="space-y-3 px-7 pt-8 sm:px-9 sm:pt-10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-primary"><LockKeyhole className="size-5" /></div>
            <div className="space-y-2">
              <CardTitle className="text-2xl tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-sm">Sign in to your team workspace.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-7 pb-8 sm:px-9 sm:pb-10">
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <span className="text-xs text-slate-400">Contact your admin for help</span>
                </div>
                <Input id="password" type="password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-destructive">{error}</p>}
              <Button className="group w-full" size="lg" disabled={status === 'loading'}>
                {status === 'loading' ? 'Signing in…' : <>Sign in securely <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></>}
              </Button>
            </form>
            <div className="mt-6 border-t border-slate-100 pt-5 text-center">
              <p className="text-sm text-muted-foreground">
                Applying for a profile? <Link className="font-semibold text-primary hover:underline" href="/apply">Start here</Link>
              </p>
            </div>
          </CardContent>
        </Card>
        <p className="mt-5 text-center text-xs text-slate-400">Your workspace is protected and only available to your team.</p>
      </section>
    </main>
  );
}
