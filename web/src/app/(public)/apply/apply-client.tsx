'use client';

import { useAppSelector } from '@/features/auth/hooks';
import { StepAcademics } from '@/features/apply/steps/step-academics';
import { StepAddress } from '@/features/apply/steps/step-address';
import { StepContact } from '@/features/apply/steps/step-contact';
import { StepInfo } from '@/features/apply/steps/step-info';
import { ReviewSubmit } from '@/features/apply/review-submit';

const TITLES = ['Personal info', 'Contact', 'Address', 'Academics', 'Review'];

/** Public data-collection wizard. No login, no token, single POST at the end. */
export function ApplyClient() {
  const step = useAppSelector((s) => s.apply.step);
  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-1 text-2xl font-bold">Submit your profile</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        Step {Math.min(step + 1, 5)} of 5 — {TITLES[Math.min(step, 4)]}
      </p>
      <div className="mb-6 flex gap-1">
        {TITLES.map((t, i) => (
          <div
            key={t}
            className={`h-1.5 flex-1 rounded ${i <= step ? 'bg-primary' : 'bg-muted'}`}
            title={t}
          />
        ))}
      </div>
      {step === 0 && <StepInfo />}
      {step === 1 && <StepContact />}
      {step === 2 && <StepAddress />}
      {step === 3 && <StepAcademics />}
      {step >= 4 && <ReviewSubmit />}
    </div>
  );
}
