'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { AccountRole, type ProfileResponse, type UpdateProfileRequest } from '@repo/contracts';
import { apiFetch } from '@/app/apiClient';
import { RequireRole } from '@/features/auth/require-role';
import { useAppSelector } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AcademicInformationModal, type AcademicDraft } from '@/components/academic-information-modal';
import { UsersRound } from 'lucide-react';

export function ProfileEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [academics, setAcademics] = useState<ProfileResponse['academics']>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<AcademicDraft | null>(null);
  const [editingAcademicIndex, setEditingAcademicIndex] = useState<number | null>(null);

  async function handleSaveAcademic(d: AcademicDraft) {
    const formatted = {
      schoolName: d.schoolName,
      degree: d.degree ?? null,
      fieldOfStudy: d.fieldOfStudy ?? null,
      startDate: d.startDate ? `${d.startDate}-01` : null,
      endDate: d.endDate ? `${d.endDate}-01` : null,
      description: d.description ?? null,
    };
    const next: any[] = [...academics];
    if (editingAcademicIndex === null) next.push(formatted);
    else next[editingAcademicIndex] = formatted;
    setAcademics(next);
    setModalOpen(false);
    setDraft(null);
    setEditingAcademicIndex(null);
    try {
      const updated = await apiFetch<ProfileResponse>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify({ academics: next }) });
      setProfile(updated);
      setAcademics(updated.academics ?? []);
    } catch (err) { setError((err as Error).message); }
  }

  useEffect(() => {
    apiFetch<ProfileResponse>(`/users/${id}`)
      .then((pr) => { setProfile(pr); setAcademics(pr.academics ?? []); })
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;
    const fd = new FormData(e.currentTarget);
    const body: UpdateProfileRequest = {
      info: {
        firstName: String(fd.get('firstName') ?? ''),
        lastName: String(fd.get('lastName') ?? ''),
        dateOfBirth: String(fd.get('dateOfBirth') ?? ''),
        occupation: String(fd.get('occupation') ?? ''),
        gender: String(fd.get('gender') ?? '') as never,
        profilePhotoUrl: (fd.get('profilePhotoUrl') as string) || null,
      },
      contact: {
        email: String(fd.get('email') ?? ''),
        phoneNumber: String(fd.get('phoneNumber') ?? ''),
        fax: (fd.get('fax') as string) || null,
        linkedinUrl: (fd.get('linkedinUrl') as string) || null,
      },
      address: {
        addressLine: String(fd.get('addressLine') ?? ''),
        city: String(fd.get('city') ?? ''),
        state: String(fd.get('state') ?? ''),
        country: String(fd.get('country') ?? ''),
        zipCode: String(fd.get('zipCode') ?? ''),
      },
    };
    setSaving(true);
    try {
      const updated = await apiFetch<ProfileResponse>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      setProfile(updated);
      router.push(`/profiles/${id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (error) return <p className="p-6 text-sm text-destructive">{error}</p>;
  if (!profile) return <p className="p-6">Loading…</p>;

  const p = profile;
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <UsersRound className="size-4" /> Edit profile
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          {p.info.firstName} {p.info.lastName}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update info, contact, address and academic information
        </p>
      </div>
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle>Profile details</CardTitle>
          <CardDescription>Update all profile fields below.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h3 className="font-semibold">Personal info</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name"><Input name="firstName" defaultValue={p.info.firstName} /></Field>
              <Field label="Last name"><Input name="lastName" defaultValue={p.info.lastName} /></Field>
            </div>
            <Field label="Date of birth"><Input type="date" name="dateOfBirth" defaultValue={p.info.dateOfBirth} /></Field>
            <Field label="Occupation"><Input name="occupation" defaultValue={p.info.occupation} /></Field>
            <Field label="Gender">
              <Select name="gender" defaultValue={p.info.gender}>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="PREFER_NOT_TO_SAY">PREFER_NOT_TO_SAY</option>
              </Select>
            </Field>
            <Field label="Profile photo URL"><Input name="profilePhotoUrl" defaultValue={p.info.profilePhotoUrl ?? ''} /></Field>

            <h3 className="font-semibold">Contact</h3>
            <Field label="Email"><Input name="email" defaultValue={p.contact.email} /></Field>
            <Field label="Phone number"><Input name="phoneNumber" defaultValue={p.contact.phoneNumber} /></Field>
            <Field label="Fax"><Input name="fax" defaultValue={p.contact.fax ?? ''} /></Field>
            <Field label="LinkedIn URL"><Input name="linkedinUrl" defaultValue={p.contact.linkedinUrl ?? ''} /></Field>

            <h3 className="font-semibold">Address</h3>
            <Field label="Street address"><Input name="addressLine" defaultValue={p.address.addressLine} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City"><Input name="city" defaultValue={p.address.city} /></Field>
              <Field label="State"><Input name="state" defaultValue={p.address.state} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Country"><Input name="country" defaultValue={p.address.country} /></Field>
              <Field label="Zip code"><Input name="zipCode" defaultValue={p.address.zipCode} /></Field>
            </div>

            <h3 className="font-semibold">Academics</h3>
            <div className="space-y-2">
              {academics.map((a, i) => (
                <div key={i} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <div className="font-medium">{a.schoolName}</div>
                    <div className="text-sm text-muted-foreground">{a.degree} · {a.fieldOfStudy}</div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => { setEditingAcademicIndex(i); setDraft({ ...a } as AcademicDraft); setModalOpen(true); }}>
                    Edit
                  </Button>
                </div>
              ))}
              {academics.length === 0 && <p className="text-sm text-muted-foreground">No academic entries.</p>}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => { setEditingAcademicIndex(null); setDraft(null); setModalOpen(true); }}>
              + Add academic entry
            </Button>

            <AcademicInformationModal
              open={modalOpen}
              onOpenChange={setModalOpen}
              initial={draft}
              onSave={handleSaveAcademic}
            />

            <Field label="Notes"><Textarea name="notes" defaultValue="" /></Field>

            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfileEditPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const role = useAppSelector((s) => s.auth.session?.role);
  void role;
  return (
    <RequireRole allowed={[AccountRole.ADMIN, AccountRole.EDITOR]}>
      <ProfileEditClient id={id} />
    </RequireRole>
  );
}
