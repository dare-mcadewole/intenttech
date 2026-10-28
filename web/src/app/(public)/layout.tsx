import Link from 'next/link';

/** Minimal public chrome — no auth nav, just a way home. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="no-print border-b">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
          <Link href="/" className="font-semibold">IntentTech</Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/apply" className="underline">Apply</Link>
            <Link href="/login" className="underline">Admin login</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
