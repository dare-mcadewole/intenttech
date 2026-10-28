'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AccountRole, type Paged, type ProfileSummary } from '@repo/contracts';
import { apiFetch } from '@/app/apiClient';
import { useAppSelector } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

/** Protected user management list. Pagination + search; no full academics. */
export function ProfilesClient() {
  const role = useAppSelector((s) => s.auth.session?.role);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<Paged<ProfileSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Paged<ProfileSummary>>(
      `/users?page=${page}&limit=20${search ? `&search=${encodeURIComponent(search)}` : ''}`,
    )
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [page, search]);

  async function remove(id: string) {
    if (!confirm('Delete this profile? This cannot be undone.')) return;
    await apiFetch(`/users/${id}`, { method: 'DELETE' });
    setData((d) => (d ? { ...d, data: d.data.filter((p) => p.id !== id) } : d));
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profiles</h1>
        <Input
          className="max-w-xs"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!data ? (
        <p>Loading…</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Schools</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <Link className="underline" href={`/profiles/${p.id}`}>
                      {p.info.firstName} {p.info.lastName}
                    </Link>
                  </TableCell>
                  <TableCell>{p.contact.email}</TableCell>
                  <TableCell>
                    {p.address.city}, {p.address.country}
                  </TableCell>
                  <TableCell>{p.academicsCount}</TableCell>
                  <TableCell className="text-right">
                    {(role === AccountRole.ADMIN || role === AccountRole.EDITOR) && (
                      <Link className="mr-3 underline" href={`/profiles/${p.id}/edit`}>
                        Edit
                      </Link>
                    )}
                    {role === AccountRole.ADMIN && (
                      <button className="text-destructive underline" onClick={() => remove(p.id)}>
                        Delete
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>
            <span className="text-sm">
              Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
