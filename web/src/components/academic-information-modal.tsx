'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type AcademicDraft = {
  schoolName: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
};

export function AcademicInformationModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: AcademicDraft | null;
  onSave: (draft: AcademicDraft) => void;
}) {
  const [draft, setDraft] = useState<AcademicDraft>(initial ?? { schoolName: '' });

  useEffect(() => {
    if (open) setDraft(initial ?? { schoolName: '' });
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit academic entry' : 'Add academic entry'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Field label="School name"><Input value={draft.schoolName} onChange={(e) => setDraft({ ...draft, schoolName: e.target.value })} /></Field>
          <Field label="Degree"><Input value={draft.degree ?? ''} onChange={(e) => setDraft({ ...draft, degree: e.target.value })} /></Field>
          <Field label="Field of study"><Input value={draft.fieldOfStudy ?? ''} onChange={(e) => setDraft({ ...draft, fieldOfStudy: e.target.value })} /></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date (month/year)"><Input type="month" value={(draft.startDate ?? '').slice(0, 7)} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} /></Field>
            <Field label="End date (month/year)"><Input type="month" value={(draft.endDate ?? '').slice(0, 7)} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} /></Field>
          </div>

          <Field label="Description">
            <Textarea
              value={draft.description ?? ''}
              rows={5}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={() => onSave(draft)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
