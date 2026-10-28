import Link from 'next/link';
import { ArrowDownRight, ArrowRight, BadgeCheck, BriefcaseBusiness, GraduationCap, Sparkles, UserRound } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export const metadata = createMetadata({
  title: 'Home',
  description: 'Submit your profile publicly, or sign in to review submissions.',
});

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
      <section className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/80 px-3.5 py-2 text-xs font-semibold tracking-wide text-primary shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            A better way to introduce yourself
          </div>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.35rem]">
            Your next chapter starts with a <span className="bg-gradient-to-r from-primary via-indigo-500 to-teal-500 bg-clip-text text-transparent">good introduction.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Build a thoughtful profile that brings your experience, education, and story together — all in one place.
          </p>

          <div className="mt-9">
            <Button asChild size="lg" className='uppercase tracking-widest'>
              <Link href="/apply">
                Create my profile now <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-slate-200/80 pt-6 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2"><BadgeCheck className="size-4 text-emerald-600" /> Simple guided application</span>
            <span className="inline-flex items-center gap-2"><UserRound className="size-4 text-primary" /> No account needed</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
          <div className="absolute -left-7 top-16 size-24 rounded-full bg-violet-300/50 blur-3xl" />
          <div className="absolute -right-4 bottom-8 size-32 rounded-full bg-teal-300/50 blur-3xl" />
          <div className="relative rotate-1 rounded-[2rem] border border-white/80 bg-gradient-to-br from-indigo-600 via-violet-600 to-blue-700 p-3 shadow-[0_32px_90px_-28px_rgba(63,66,170,0.55)]">
            <div className="overflow-hidden rounded-[1.45rem] bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-slate-400">
                  <Sparkles className="size-4 text-violet-500" /> Profile preview
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">Ready to share</span>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 text-primary">
                    <UserRound className="size-8" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold tracking-tight text-slate-900">Your name here</p>
                    <p className="mt-1 text-sm text-slate-500">A story worth sharing</p>
                  </div>
                  <BadgeCheck className="ml-auto size-5 text-blue-500" />
                </div>
                <div className="mt-8 space-y-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <BriefcaseBusiness className="size-4 text-violet-500" /> About
                    </div>
                    <div className="mt-3 h-2 w-11/12 rounded-full bg-slate-200" />
                    <div className="mt-2 h-2 w-8/12 rounded-full bg-slate-200" />
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700"><GraduationCap className="size-5" /></span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">Education & experience</p>
                      <p className="mt-1 text-xs text-slate-500">Add the details that make you, you.</p>
                    </div>
                    <ArrowRight className="size-4 text-slate-400" />
                  </div>
                </div>
                <div className="mt-6 rounded-xl bg-indigo-50/80 px-4 py-3 text-center text-xs font-medium text-indigo-700">
                  Your information, beautifully brought together
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-7 hidden items-center gap-3 rounded-2xl border border-white bg-white px-4 py-3 shadow-xl shadow-slate-900/10 sm:flex">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><BadgeCheck className="size-5" /></span>
            <div><p className="text-xs font-semibold text-slate-900">A simple guided process</p><p className="mt-0.5 text-[11px] text-slate-500">Your story, one step at a time</p></div>
          </div>
        </div>
      </section>

      <section className="mt-24 grid gap-5 rounded-[2rem] border border-white/80 bg-white/70 p-6 shadow-[0_16px_50px_-36px_rgba(27,39,74,0.35)] backdrop-blur sm:grid-cols-3 sm:p-8">
        {[
          { icon: UserRound, number: '01', title: 'Tell your story', text: 'Start with the details that make your profile yours.' },
          { icon: GraduationCap, number: '02', title: 'Add your journey', text: 'Bring your education and experience into focus.' },
          { icon: BadgeCheck, number: '03', title: 'Review with care', text: 'Check everything before you submit your profile.' },
        ].map(({ icon: Icon, number, title, text }) => (
          <div key={number} className="rounded-2xl p-4 transition-colors hover:bg-slate-50">
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-indigo-50 text-primary"><Icon className="size-5" /></span>
              <span className="text-xs font-semibold tracking-[0.18em] text-slate-300">{number}</span>
            </div>
            <h2 className="mt-5 text-base font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
