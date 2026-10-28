'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Gender } from '@repo/contracts';
import { useAppDispatch, useAppSelector } from '../../auth/hooks';
import { saveInfo, setStep } from '../applySlice';
import { infoSchema, type InfoForm } from '../schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

export function StepInfo() {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.apply.info);
  const { register, handleSubmit, formState: { errors } } = useForm<InfoForm>({
    resolver: zodResolver(infoSchema),
    defaultValues: saved ?? {
      gender: '' as Gender
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1 — Personal info</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => {
            dispatch(saveInfo(v));
            dispatch(setStep(1));
          })}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
              <Input id="firstName" {...register('firstName')} />
            </Field>
            <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
              <Input id="lastName" {...register('lastName')} />
            </Field>
          </div>
          <Field label="Date of birth" htmlFor="dateOfBirth" error={errors.dateOfBirth?.message}>
            <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
          </Field>
          <Field label="Occupation" htmlFor="occupation" error={errors.occupation?.message}>
            <Input id="occupation" {...register('occupation')} />
          </Field>
          <Field label="Gender" htmlFor="gender">
            <Select id="gender" {...register('gender')}>
              {Object.values(Gender).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </Select>
          </Field>
          <Field label="Profile photo URL (optional)" htmlFor="profilePhotoUrl" error={errors.profilePhotoUrl?.message}>
            <Input id="profilePhotoUrl" {...register('profilePhotoUrl')} />
          </Field>
          <div className='mt-7 text-right'>
            <Button>Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
