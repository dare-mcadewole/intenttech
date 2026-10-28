'use client';

import { useAppSelector } from '@/features/auth/hooks';
import { Check, ClipboardList, UserRound } from 'lucide-react';
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
    <main className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
      <div className="mb-8 flex items-start gap-4">
        <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-primary sm:flex"><ClipboardList className="size-6" /></span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Your profile</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Let’s get to know you.</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Share a few details about yourself. You can review everything before submitting.</p>
        </div>
      </div>
      <div className="mb-7 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-sm shadow-slate-900/[0.03] sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <UserRound className="size-4 text-primary" />
            Step {Math.min(step + 1, 5)} <span className="font-normal text-slate-400">of 5</span>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-primary">{TITLES[Math.min(step, 4)]}</span>
        </div>
        <div className="flex gap-2" aria-label={`Step ${Math.min(step + 1, 5)} of 5`}>
          {TITLES.map((title, index) => (
            <div
              key={title}
              className={`h-1.5 flex-1 rounded-full transition-colors ${index <= step ? 'bg-gradient-to-r from-primary to-indigo-400' : 'bg-slate-100'}`}
              title={title}
            />
          ))}
        </div>
        <div className="mt-3 hidden grid-cols-5 gap-2 sm:grid">
          {TITLES.map((title, index) => (
            <div key={title} className={`flex items-center gap-2 text-[11px] font-medium ${index === step ? 'text-primary' : index < step ? 'text-slate-600' : 'text-slate-400'}`}>
              <span className={`flex size-5 items-center justify-center rounded-full ${index < step ? 'bg-emerald-100 text-emerald-700' : index === step ? 'bg-indigo-100 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                {index < step ? <Check className="size-3" /> : index + 1}
              </span>
              <span className="truncate">{title}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="apply-step-card">
        {step === 0 && <StepInfo />}
        {step === 1 && <StepContact />}
        {step === 2 && <StepAddress />}
        {step === 3 && <StepAcademics />}
        {step >= 4 && <ReviewSubmit />}
      </div>
    </main>
  );
}
