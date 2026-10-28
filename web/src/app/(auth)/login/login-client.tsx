'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
    <main className="mx-auto mt-24 max-w-sm p-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin login</CardTitle>
          <CardDescription>Sign in to review submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-4 text-sm text-muted-foreground">
            Public applicants use <Link className="underline" href="/apply">/apply</Link> — no login needed.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
