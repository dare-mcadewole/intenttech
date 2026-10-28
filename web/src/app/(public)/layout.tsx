import Link from 'next/link';
import { Sparkles, UserRound } from 'lucide-react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-20 border-b border-white/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform group-hover:rotate-[-6deg]">
              <Sparkles className="size-5" />
            </span>
            <span className="text-[15px] font-bold tracking-tight text-slate-900">
              Intent<span className="text-primary">Tech</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium">
            <Link
              href="/apply"
              className="rounded-full px-4 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              Apply Now
            </Link>
            <Link href="/login" className="
              group inline-flex items-center justify-center gap-2 rounded-full
              bg-slate-950 size-8 md:size-auto md:px-4 md:py-2.5 text-white shadow-md
              shadow-slate-900/10 transition-all hover:bg-primary
            ">
              <span className='hidden md:inline'>
                Sign in as admin
              </span>
              <UserRound className="
                size-4 transition-transform group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              " />
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="mx-auto flex max-w-6xl items-center justify-between px-5 py-8 text-xs text-slate-500 sm:px-8">
        <span>© {new Date().getFullYear()} IntentTech</span>
        <span>Thoughtful profiles. Better connections.</span>
      </footer>
    </div>
  );
}
