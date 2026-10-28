'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../auth/hooks';
import { saveContact, setStep } from '../applySlice';
import { contactSchema, type ContactForm } from '../schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function StepContact() {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.apply.contact);
  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: saved ?? {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2 — Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => {
            dispatch(saveContact(v));
            dispatch(setStep(2));
          })}
          className="space-y-3"
        >
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" {...register('email')} />
          </Field>
          <Field label="Phone number" htmlFor="phoneNumber" error={errors.phoneNumber?.message}>
            <Input id="phoneNumber" {...register('phoneNumber')} />
          </Field>
          <Field label="Fax (optional)" htmlFor="fax">
            <Input id="fax" {...register('fax')} />
          </Field>
          <Field label="LinkedIn URL (optional)" htmlFor="linkedinUrl" error={errors.linkedinUrl?.message}>
            <Input id="linkedinUrl" {...register('linkedinUrl')} />
          </Field>

          <div className="flex gap-2 justify-end mt-7">
            <Button type="button" variant="outline" onClick={() => dispatch(setStep(0))}>Back</Button>
            <Button>Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
