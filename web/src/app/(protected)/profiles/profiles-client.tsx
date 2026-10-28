'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AccountRole, type Paged, type ProfileSummary } from '@repo/contracts';
import { ChevronLeft, ChevronRight, Eye, Pencil, Search, Trash2, UsersRound } from 'lucide-react';
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
    <main className="mx-auto max-w-6xl space-y-6 px-5 py-8 sm:px-8 sm:py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            <UsersRound className="size-4" /> Directory
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Profiles</h1>
          <p className="mt-2 text-sm text-slate-500">Explore and manage the people in your workspace.</p>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            aria-label="Search profiles"
            className="bg-white pl-10"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>
      </div>
      {error && <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-destructive">{error}</p>}
      <section className="overflow-hidden rounded-2xl border border-white/80 bg-white/90 shadow-[0_12px_36px_-18px_rgba(27,39,74,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">All submissions</h2>
            <p className="mt-1 text-xs text-slate-500">Profile details and education at a glance</p>
          </div>
          {data && <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-primary">{data.meta.total} total</span>}
        </div>
        {!data ? (
          <div className="space-y-4 p-6" aria-label="Loading profiles">
            <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-14 animate-pulse rounded-xl bg-slate-50" />
            <div className="h-14 animate-pulse rounded-xl bg-slate-50" />
          </div>
        ) : data.data.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-primary"><UsersRound className="size-6" /></span>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">{search ? 'No matching profiles' : 'No profiles yet'}</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {search ? 'Try another name or email address.' : 'Submitted profiles will appear here when they are ready to review.'}
            </p>
          </div>
        ) : (
          <>
            <Table className="min-w-190">
              <TableHeader className="[&_tr]:border-slate-100 [&_th]:h-12 [&_th]:px-5 [&_th]:text-[10px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.13em] [&_th]:text-slate-400">
                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-slate-100">
                {data.data.map((p) => (
                  <TableRow key={p.id} className="group hover:bg-indigo-50/30">
                    <TableCell className="px-5 py-4">
                      <Link className="flex items-center gap-3 font-semibold text-slate-800 hover:text-primary" href={`/profiles/${p.id}`}>
                        <span className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-indigo-50 to-violet-100 text-xs font-bold text-indigo-700">
                          {p.info.firstName.charAt(0)}{p.info.lastName.charAt(0)}
                        </span>
                        {p.info.firstName} {p.info.lastName}
                      </Link>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-slate-500">{p.contact.email}</TableCell>
                    <TableCell className="px-5 py-4 text-slate-500">
                      {p.address.city}, {p.address.country}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">{p.academicsCount}</span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <Link className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-primary" href={`/profiles/${p.id}`} aria-label={`View ${p.info.firstName} ${p.info.lastName}`}>
                          <Eye className="size-4" />
                        </Link>
                        {(role === AccountRole.ADMIN || role === AccountRole.EDITOR) && (
                          <Link className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-indigo-50 hover:text-primary" href={`/profiles/${p.id}/edit`} aria-label={`Edit ${p.info.firstName} ${p.info.lastName}`}>
                            <Pencil className="size-4" />
                          </Link>
                        )}
                        {role === AccountRole.ADMIN && (
                          <button className="inline-flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-destructive" onClick={() => remove(p.id)} aria-label={`Delete ${p.info.firstName} ${p.info.lastName}`}>
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <span className="text-xs font-medium text-slate-500">
                Page <span className="font-semibold text-slate-800">{data.meta.page}</span> of <span className="font-semibold text-slate-800">{data.meta.totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <ChevronLeft className="size-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
