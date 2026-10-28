import type { ProfileResponse } from '@repo/contracts';
import { Card, CardContent } from '@/components/ui/card';

/**
 * Shared presentational resume template (server-safe).
 * Used by: public wizard preview, apply success receipt,
 * protected profile detail, and as the DOM source for PDF/DOCX export.
 * Role-agnostic — the route decides who may see it.
 */
export function ResumeView({ profile }: { profile: ProfileResponse }) {
  const { info, contact, address, academics } = profile;
  return (
    <Card className="mx-auto max-w-3xl">
      <CardContent className="p-8">
        <header className="flex items-start gap-4 border-b pb-4">
          {info.profilePhotoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={info.profilePhotoUrl}
              alt={`${info.firstName} ${info.lastName}`}
              className="h-20 w-20 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {info.firstName} {info.lastName}
            </h1>
            <p className="text-muted-foreground">{info.occupation}</p>
            <p className="text-sm text-muted-foreground">
              {contact.email} · {contact.phoneNumber}
              {contact.linkedinUrl && (
                <>
                  {' '}· <a className="underline" href={contact.linkedinUrl}>LinkedIn</a>
                </>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {address.addressLine}, {address.city}, {address.state}, {address.country}{' '}
              {address.zipCode}
            </p>
          </div>
        </header>

        <section className="mt-4">
          <h2 className="text-lg font-semibold">Personal details</h2>
          <dl className="mt-1 grid grid-cols-2 gap-1 text-sm">
            <dt className="text-muted-foreground">Date of birth</dt>
            <dd>{info.dateOfBirth}</dd>
            <dt className="text-muted-foreground">Gender</dt>
            <dd>{info.gender}</dd>
            {contact.fax && (
              <>
                <dt className="text-muted-foreground">Fax</dt>
                <dd>{contact.fax}</dd>
              </>
            )}
          </dl>
        </section>

        <section className="mt-4">
          <h2 className="text-lg font-semibold">Academic background</h2>
          {academics.length === 0 ? (
            <p className="text-sm text-muted-foreground">No schools listed.</p>
          ) : (
            <ul className="mt-1 space-y-3">
              {academics.map((a) => (
                <li key={a.id ?? a.schoolName} className="text-sm">
                  <p className="font-medium">{a.schoolName}</p>
                  {(a.degree || a.fieldOfStudy) && (
                    <p className="text-muted-foreground">
                      {[a.degree, a.fieldOfStudy].filter(Boolean).join(' — ')}
                    </p>
                  )}
                  {(a.startDate || a.endDate) && (
                    <p className="text-muted-foreground">
                      {[a.startDate, a.endDate].filter(Boolean).join(' → ')}
                    </p>
                  )}
                  {a.description && <p className="mt-1">{a.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
