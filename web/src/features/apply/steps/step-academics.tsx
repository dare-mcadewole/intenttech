'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../auth/hooks';
import { saveAcademics, setStep } from '../applySlice';
import { academicsSchema, type AcademicsForm } from '../schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const DEGREES = [
  'National Diploma',
  'Higher National Diploma',
  'B.Sc.',
  'B.A.',
  'B.Eng.',
  'M.Sc.',
  'M.A.',
  'M.Eng.',
  'Ph.D.',
  'Associate Degree',
  'Certificate',
  'Other',
];

export function StepAcademics() {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.apply.academics);
  const { register, control, handleSubmit } = useForm<AcademicsForm>({
    resolver: zodResolver(academicsSchema),
    defaultValues: { items: saved.length ? saved : [{ schoolName: '' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const submitAcademics = handleSubmit((v) => {
    const items = v.items.map((it) => ({
      ...it,
      startDate: it.startDate ? `${it.startDate}-01` : it.startDate,
      endDate: it.endDate ? `${it.endDate}-01` : it.endDate,
    }));
    dispatch(saveAcademics(items));
    dispatch(setStep(4));
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4 — Academic background</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={submitAcademics}
          className="space-y-4"
        >
          {fields.map((f, i) => (
            <div key={f.id} className="space-y-2 rounded-md border p-3">
              <Field label="School name *">
                <Input {...register(`items.${i}.schoolName`)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Degree">
                  <Select {...register(`items.${i}.degree`)}>
                    <option value="">Select degree</option>
                    {DEGREES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Field of study">
                  <Input {...register(`items.${i}.fieldOfStudy`)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date (month/year)">
                  <Input type="month" {...register(`items.${i}.startDate`)} />
                </Field>
                <Field label="End date (month/year)">
                  <Input type="month" {...register(`items.${i}.endDate`)} />
                </Field>
              </div>
              <Field label="Description">
                <Textarea {...register(`items.${i}.description`)} />
              </Field>
              {fields.length > 1 && (
                <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => remove(i)}>
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => append({ schoolName: '' })}>
            + Add school
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => dispatch(setStep(2))}>Back</Button>
            <Button>Review</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
