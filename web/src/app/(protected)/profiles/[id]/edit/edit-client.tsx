'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { AccountRole, type ProfileResponse, type UpdateProfileRequest } from '@repo/contracts';
import { apiFetch } from '@/app/apiClient';
import { RequireRole } from '@/features/auth/require-role';
import { useAppSelector } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/**
 * Protected edit (ADMIN + EDITOR via RequireRole; backend RolesGuard is authoritative).
 * v1: quick-edit form proving the PATCH contract; full wizard-prefill edit
 * reusing the apply steps is the flagged next iteration.
 */
export function ProfileEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ProfileResponse>(`/users/${id}`)
      .then(setProfile)
      .catch((e) => setError(e.message));
  }, [id]);

  async function saveOccupation(next: string) {
    const body: UpdateProfileRequest = { info: { ...profile!.info, occupation: next } as never };
    const updated = await apiFetch<ProfileResponse>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    setProfile(updated);
    router.push(`/profiles/${id}`);
  }

  if (error) return <p className="p-6 text-sm text-destructive">{error}</p>;
  if (!profile) return <p className="p-6">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Edit {profile.info.firstName} {profile.info.lastName}
          </CardTitle>
          <CardDescription>
            Quick edit (occupation). Full wizard-prefill edit reuses the apply steps — next iteration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const v = new FormData(e.currentTarget).get('occupation') as string;
              saveOccupation(v).catch((err) => setError(err.message));
            }}
          >
            <div className="space-y-1">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" name="occupation" defaultValue={profile.info.occupation} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button>Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfileEditPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const role = useAppSelector((s) => s.auth.session?.role);
  void role;
  return (
    <RequireRole allowed={[AccountRole.ADMIN, AccountRole.EDITOR]}>
      <ProfileEditClient id={id} />
    </RequireRole>
  );
}
