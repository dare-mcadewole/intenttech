'use client';
import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DEGREES } from '@/features/apply/constants';

const schema = z.object({
  schoolName: z.string().min(1),
  degree: z.string().optional().nullable(),
  fieldOfStudy: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type AcademicDraft = z.infer<typeof schema>;

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
  const initialValues = useMemo(() => {
    return initial ? ({
      ...initial,
      startDate: initial.startDate?.replace(/\-\d+$/g, ''),
      endDate: initial.endDate?.replace(/\-\d+$/g, ''),
    }) : null
  }, [initial])

  const { register, handleSubmit, reset } = useForm<AcademicDraft>({
    resolver: zodResolver(schema),
    defaultValues: initialValues ?? { schoolName: '' },
  });

  useEffect(() => {
    if (open) reset(initialValues ?? { schoolName: '' });
  }, [open, initialValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit academic entry' : 'Add academic entry'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-3">
          <Field label="School name"><Input {...register('schoolName')} /></Field>
          <Field label="Degree">
            <Select {...register('degree')}>
              <option value="">Select degree</option>
              {DEGREES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Field of study"><Input {...register('fieldOfStudy')} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date (month/year)"><Input type="month" {...register('startDate')} /></Field>
            <Field label="End date (month/year)"><Input type="month" {...register('endDate')} /></Field>
          </div>
          <Field label="Description"><Textarea {...register('description')} /></Field>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
