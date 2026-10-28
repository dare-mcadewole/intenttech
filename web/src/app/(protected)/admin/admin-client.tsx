'use client';

import Link from 'next/link';
import { AccountRole } from '@repo/contracts';
import { RequireRole } from '@/features/auth/require-role';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/** Protected dashboard shell. ADMIN + EDITOR. */
export function AdminClient() {
  return (
    <RequireRole allowed={[AccountRole.ADMIN, AccountRole.EDITOR]}>
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Admin dashboard</CardTitle>
            <CardDescription>
              Review submissions, open a resume view to export PDF/DOCX, edit or delete entries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/profiles">Open submissions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </RequireRole>
  );
}
