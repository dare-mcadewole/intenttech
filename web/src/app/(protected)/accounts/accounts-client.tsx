'use client';

import { useState } from 'react';
import { AccountRole } from '@repo/contracts';
import { ArrowRight, KeyRound, MailPlus, ShieldCheck, UserRoundPlus, Users } from 'lucide-react';
import { apiFetch } from '@/app/apiClient';
import { RequireRole } from '@/features/auth/require-role';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

/** ADMIN-only minimal account creation (invite-only; register endpoint is ADMIN-gated). */
export function AccountsClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newRole, setNewRole] = useState<AccountRole>(AccountRole.VIEWER);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, role: newRole }),
      });
      setMsg(`Created ${email} (${newRole}).`);
      setEmail('');
      setPassword('');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Failed.');
    }
  }

  return (
    <RequireRole allowed={[AccountRole.ADMIN]}>
      <main className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <section>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <Users className="size-4" /> Workspace access
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Team accounts</h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            Bring the right people into your workspace. Create an account and choose the level of access they need.
          </p>
          <div className="mt-7 space-y-3">
            {[
              { icon: ShieldCheck, title: 'Admin', description: 'Manage team accounts and profiles.' },
              { icon: UserRoundPlus, title: 'Editor', description: 'Review and update profile submissions.' },
              { icon: Users, title: 'Viewer', description: 'Browse profiles and export resumes.' },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/70 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-primary"><Icon className="size-4" /></span>
                <div><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-1 text-xs text-slate-500">{description}</p></div>
              </div>
            ))}
          </div>
        </section>

        <Card className="border-white/80 bg-white/90">
          <CardHeader className="px-6 pt-6 sm:px-8 sm:pt-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-700"><MailPlus className="size-5" /></div>
            <CardTitle className="mt-4 text-xl tracking-tight">Create a team account</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">Set up sign-in details and permissions for a new teammate.</p>
          </CardHeader>
          <CardContent className="px-6 pb-7 sm:px-8 sm:pb-8">
            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Work email</Label>
                <Input id="email" type="email" autoComplete="email" placeholder="teammate@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary password</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="password" type="password" autoComplete="new-password" className="pl-10" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Access level</Label>
                <Select id="role" value={newRole} onChange={(e) => setNewRole(e.target.value as AccountRole)}>
                  {Object.values(AccountRole).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
              </div>
              <Button className="w-full" size="lg">
                Create account <ArrowRight className="size-4" />
              </Button>
            </form>
            {msg && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{msg}</p>}
          </CardContent>
        </Card>
      </main>
    </RequireRole>
  );
}
