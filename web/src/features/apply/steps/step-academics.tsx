'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../auth/hooks';
import { saveAcademics, setStep } from '../applySlice';
import { academicsSchema, type AcademicsForm } from '../schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function StepAcademics() {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.apply.academics);
  const { register, control, handleSubmit } = useForm<AcademicsForm>({
    resolver: zodResolver(academicsSchema),
    defaultValues: { items: saved.length ? saved : [{ schoolName: '' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4 — Academic background</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => {
            dispatch(saveAcademics(v.items));
            dispatch(setStep(4));
          })}
          className="space-y-4"
        >
          {fields.map((f, i) => (
            <div key={f.id} className="space-y-2 rounded-md border p-3">
              <div className="space-y-1">
                <Label>School name *</Label>
                <Input {...register(`items.${i}.schoolName`)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Degree</Label>
                  <Input {...register(`items.${i}.degree`)} />
                </div>
                <div className="space-y-1">
                  <Label>Field of study</Label>
                  <Input {...register(`items.${i}.fieldOfStudy`)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Start date</Label>
                  <Input type="date" {...register(`items.${i}.startDate`)} />
                </div>
                <div className="space-y-1">
                  <Label>End date</Label>
                  <Input type="date" {...register(`items.${i}.endDate`)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea {...register(`items.${i}.description`)} />
              </div>
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
