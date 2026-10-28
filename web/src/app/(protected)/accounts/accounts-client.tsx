'use client';

import { useState } from 'react';
import { AccountRole } from '@repo/contracts';
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
      <div className="mx-auto max-w-sm p-6">
        <Card>
          <CardHeader>
            <CardTitle>Accounts (ADMIN)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password (min 8)</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <Select id="role" value={newRole} onChange={(e) => setNewRole(e.target.value as AccountRole)}>
                  {Object.values(AccountRole).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
              </div>
              <Button className="w-full">Create account</Button>
            </form>
            {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
}
