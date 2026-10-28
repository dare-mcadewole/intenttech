'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AccountRole, ProfileAcademic, type ProfileResponse, type UpdateProfileRequest } from '@repo/contracts';
import { apiFetch } from '@/app/apiClient';
import { RequireRole } from '@/features/auth/require-role';
import { useAppSelector } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { AcademicInformationModal, type AcademicDraft } from '@/components/academic-information-modal';
import { UsersRound } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  occupation: z.string(),
  gender: z.string(),
  profilePhotoUrl: z.string().nullable().optional(),
  email: z.string().email(),
  phoneNumber: z.string(),
  fax: z.string().nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  addressLine: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipCode: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function ProfileEditClient({ id }: { id: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [academics, setAcademics] = useState<ProfileResponse['academics']>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<AcademicDraft | null>(null);
  const [editingAcademicIndex, setEditingAcademicIndex] = useState<number | null>(null);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '', lastName: '', dateOfBirth: '', occupation: '', gender: '', profilePhotoUrl: null,
      email: '', phoneNumber: '', fax: null, linkedinUrl: null,
      addressLine: '', city: '', state: '', country: '', zipCode: '',
    },
  });

  useEffect(() => {
    apiFetch<ProfileResponse>(`/users/${id}`)
      .then((pr) => {
        setProfile(pr);
        setAcademics(pr.academics ?? []);
        reset({
          firstName: pr.info.firstName,
          lastName: pr.info.lastName,
          dateOfBirth: pr.info.dateOfBirth,
          occupation: pr.info.occupation,
          gender: pr.info.gender,
          profilePhotoUrl: pr.info.profilePhotoUrl ?? null,
          email: pr.contact.email,
          phoneNumber: pr.contact.phoneNumber,
          fax: pr.contact.fax ?? null,
          linkedinUrl: pr.contact.linkedinUrl ?? null,
          addressLine: pr.address.addressLine,
          city: pr.address.city,
          state: pr.address.state,
          country: pr.address.country,
          zipCode: pr.address.zipCode,
        });
      })
      .catch((e) => setError(e.message));
  }, [id, reset]);

  async function onSubmit(values: FormValues) {
    if (!profile) return;
    const body: UpdateProfileRequest = {
      info: {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        occupation: values.occupation,
        gender: values.gender as never,
        profilePhotoUrl: values.profilePhotoUrl ?? null,
      },
      contact: {
        email: values.email,
        phoneNumber: values.phoneNumber,
        fax: values.fax ?? null,
        linkedinUrl: values.linkedinUrl ?? null,
      },
      address: {
        addressLine: values.addressLine,
        city: values.city,
        state: values.state,
        country: values.country,
        zipCode: values.zipCode,
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

  async function handleSaveAcademic(d: AcademicDraft) {
    const formatted = {
      schoolName: d.schoolName,
      degree: d.degree ?? null,
      fieldOfStudy: d.fieldOfStudy ?? null,
      startDate: d.startDate ? `${d.startDate}-01` : null,
      endDate: d.endDate ? `${d.endDate}-01` : null,
      description: d.description ?? null,
    };
    const strippedAcademics = academics.map((a) => {
      const academic = a as Partial<ProfileAcademic>
      delete academic.id;
      delete academic.sortOrder
      return academic;
    })
    const next: any[] = [...strippedAcademics];
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
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <h3 className="font-semibold">Personal info</h3>
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name"><Input {...register('firstName')} /></Field>
              <Field label="Last name"><Input {...register('lastName')} /></Field>
            </div>
            <Field label="Date of birth"><Input type="date" {...register('dateOfBirth')} /></Field>
            <Field label="Occupation"><Input {...register('occupation')} /></Field>
            <Field label="Gender">
              <Select {...register('gender')}>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="PREFER_NOT_TO_SAY">PREFER_NOT_TO_SAY</option>
              </Select>
            </Field>
            <Field label="Profile photo URL"><Input {...register('profilePhotoUrl')} /></Field>

            <h3 className="font-semibold">Contact</h3>
            <Field label="Email"><Input {...register('email')} /></Field>
            <Field label="Phone number"><Input {...register('phoneNumber')} /></Field>
            <Field label="Fax"><Input {...register('fax')} /></Field>
            <Field label="LinkedIn URL"><Input {...register('linkedinUrl')} /></Field>

            <h3 className="font-semibold">Address</h3>
            <Field label="Street address"><Input {...register('addressLine')} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City"><Input {...register('city')} /></Field>
              <Field label="State"><Input {...register('state')} /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Country"><Input {...register('country')} /></Field>
              <Field label="Zip code"><Input {...register('zipCode')} /></Field>
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

            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </form>
        </CardContent>
      </Card>
      <AcademicInformationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={draft}
        onSave={handleSaveAcademic}
      />
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
