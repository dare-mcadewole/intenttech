import Link from 'next/link';
import { createMetadata } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = createMetadata({
  title: 'Home',
  description: 'Submit your profile publicly, or sign in to review submissions.',
});

/** Public landing: route applicants to /apply, staff to /login. */
export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-6 pt-24">
      <Card>
        <CardHeader>
          <CardTitle>IntentTech Profiles</CardTitle>
          <CardDescription>
            Submit your profile publicly, or sign in to review submissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild>
            <Link href="/apply">Submit your profile</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Admin login</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
