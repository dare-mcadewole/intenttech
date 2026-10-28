'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { AccountRole, type ProfileResponse } from '@repo/contracts';
import { apiFetch } from '@/app/apiClient';
import { ResumeView } from '@/components/resume-view';
import { useAppSelector } from '@/features/auth/hooks';
import { exportDocx, exportPdf } from '@/features/admin/exporters';
import { Button } from '@/components/ui/button';

/** Protected single-profile resume view. Data comes from GET /users/:id (auth required). */
export function ProfileDetailClient({ id }: { id: string }) {
  const role = useAppSelector((s) => s.auth.session?.role);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ProfileResponse>(`/users/${id}`)
      .then(setProfile)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="p-6 text-sm text-destructive">{error}</p>;
  if (!profile) return <p className="p-6">Loading…</p>;

  const canEdit = role === AccountRole.ADMIN || role === AccountRole.EDITOR;

  return (
    <div className="space-y-4 p-6">
      <div className="no-print mx-auto flex max-w-2xl items-center justify-between">
        <Link className="text-sm underline" href="/profiles">← Back to list</Link>
        <div className="flex gap-2">
          {canEdit && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/profiles/${id}/edit`}>Edit</Link>
            </Button>
          )}
          {canEdit && (
            <>
              <Button variant="outline" size="sm" onClick={() => exportPdf(profile)}>
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={() => exportDocx(profile)}>
                DOCX
              </Button>
            </>
          )}
        </div>
      </div>
      <ResumeView profile={profile} />
    </div>
  );
}

/** Thin wrapper so the server page can pass async params. */
export default function ProfileDetailPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProfileDetailClient id={id} />;
}
