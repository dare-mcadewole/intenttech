'use client';

import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../auth/hooks';
import { setStep, submitApplication } from './applySlice';
import { ResumeView } from '@/components/resume-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Final wizard steps: resume preview (read from local form state — no public GET),
 * then submit once. Success receipt renders the POST response.
 */
export function ReviewSubmit() {
  const dispatch = useAppDispatch();
  const { info, contact, address, academics, status, error, result } = useAppSelector(
    (s) => s.apply,
  );

  if (result) {
    return (
      <div className="space-y-4">
        <Card className="border-green-300 bg-green-50">
          <CardContent className="p-4">
            <h2 className="font-semibold">Application submitted ✓</h2>
            <p className="text-sm text-muted-foreground">Reference ID: {result.id}</p>
          </CardContent>
        </Card>
        <ResumeView profile={result} />
        <Link className="text-sm underline" href="/apply">Submit another</Link>
      </div>
    );
  }

  if (!info || !contact || !address) {
    return <p className="text-sm text-destructive">Please complete steps 1–3 first.</p>;
  }

  const preview = {
    id: 'preview',
    info: { ...info, profilePhotoUrl: info.profilePhotoUrl || null, createdAt: '', updatedAt: '' },
    contact: { ...contact, fax: contact.fax ?? null, linkedinUrl: contact.linkedinUrl ?? null },
    address: { ...address },
    academics: academics.map((a, i) => ({ ...a, id: `preview-${i}`, sortOrder: i })),
  } as never;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Step 5 — Review & submit</h2>
      <ResumeView profile={preview} />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="no-print flex justify-end gap-2 mt-7">
        <Button variant="outline" onClick={() => dispatch(setStep(3))}>Back</Button>
        <Button disabled={status === 'submitting'} onClick={() => dispatch(submitApplication())}>
          {status === 'submitting' ? 'Submitting…' : 'Submit application'}
        </Button>
      </div>
    </div>
  );
}
