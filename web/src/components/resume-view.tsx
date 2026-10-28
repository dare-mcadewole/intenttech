import { AtSign, Linkedin, MapPin, Phone, GraduationCap } from 'lucide-react';
import type { ProfileResponse } from '@repo/contracts';

function formatAcademicDate(value: string | null | undefined) {
  if (!value) return '';
  const match = /^(\d{4})(?:-(\d{2}))?/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  if (!month) return year;
  return new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(
    new Date(Date.UTC(Number(year), Number(month) - 1, 1)),
  ) + ` ${year}`;
}

/**
 * Shared CV template for application preview, profile review, and printing.
 * The layout uses only submitted information and avoids personal details that
 * are not normally included on a professional resume.
 */
export function ResumeView({ profile }: { profile: ProfileResponse }) {
  const { info, contact, address, academics } = profile;
  const fullName = `${info.firstName} ${info.lastName}`;
  const location = [address.city, address.state, address.country].filter(Boolean).join(', ');

  return (
    <article
      id="resume-view"
      aria-label={`${fullName} resume`}
      className="resume-sheet mx-auto"
    >
      <header className="resume-header">
        <div className="resume-identity">
          {info.profilePhotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="resume-photo" src={info.profilePhotoUrl} alt={fullName} />
          ) : (
            <div className="resume-monogram" aria-hidden="true">
              {info.firstName.charAt(0)}{info.lastName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="resume-name">{fullName}</h1>
            <p className="resume-occupation">{info.occupation}</p>
          </div>
        </div>

        <address className="resume-contact">
          <a href={`mailto:${contact.email}`}>
            <AtSign aria-hidden="true" />
            <span>{contact.email}</span>
          </a>
          <a href={`tel:${contact.phoneNumber}`}>
            <Phone aria-hidden="true" />
            <span>{contact.phoneNumber}</span>
          </a>
          {location && (
            <span>
              <MapPin aria-hidden="true" />
              <span>{location}</span>
            </span>
          )}
          {contact.linkedinUrl && (
            <a href={contact.linkedinUrl} target="_blank" rel="noreferrer">
              <Linkedin aria-hidden="true" />
              <span>LinkedIn profile</span>
            </a>
          )}
        </address>
      </header>

      {academics.length > 0 && (
        <section className="resume-section" aria-labelledby="resume-education">
          <h2 id="resume-education" className="resume-section-title">
            <GraduationCap aria-hidden="true" />
            Education
          </h2>
          <div className="resume-education-list">
            {academics.map((academic) => {
              const dateRange = [academic.startDate, academic.endDate]
                .map(formatAcademicDate)
                .filter(Boolean)
                .join(' — ');
              const qualification = [academic.degree, academic.fieldOfStudy]
                .filter(Boolean)
                .join(' · ');

              return (
                <article
                  key={academic.id ?? academic.schoolName}
                  className="resume-education-entry"
                >
                  <div className="resume-education-heading">
                    <div>
                      <h3>{academic.schoolName}</h3>
                      {qualification && <p className="resume-qualification">{qualification}</p>}
                    </div>
                    {dateRange && <p className="resume-date">{dateRange}</p>}
                  </div>
                  {academic.description && (
                    <p className="resume-description">{academic.description}</p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
