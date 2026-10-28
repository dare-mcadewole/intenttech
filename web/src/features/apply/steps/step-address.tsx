'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../auth/hooks';
import { saveAddress, setStep } from '../applySlice';
import { addressSchema, type AddressForm } from '../schemas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function StepAddress() {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.apply.address);
  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: saved ?? {},
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3 — Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((v) => {
            dispatch(saveAddress(v));
            dispatch(setStep(3));
          })}
          className="space-y-3"
        >
          <Field label="Street address" htmlFor="addressLine" error={errors.addressLine?.message}>
            <Input id="addressLine" {...register('addressLine')} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" htmlFor="city">
              <Input id="city" {...register('city')} />
            </Field>
            <Field label="State" htmlFor="state">
              <Input id="state" {...register('state')} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Country" htmlFor="country">
              <Input id="country" {...register('country')} />
            </Field>
            <Field label="Zip code" htmlFor="zipCode">
              <Input id="zipCode" {...register('zipCode')} />
            </Field>
          </div>

          <div className="flex justify-end gap-2 mt-7">
            <Button type="button" variant="outline" onClick={() => dispatch(setStep(1))}>Back</Button>
            <Button>Continue</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
