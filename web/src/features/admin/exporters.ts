import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import type { ProfileResponse } from '@repo/contracts';

/**
 * Option A — client-side exports from the GET /users/:id payload.
 * Zero backend work; ADMIN + EDITOR only (gated by the calling page + backend roles).
 */

export function exportPdf(p: ProfileResponse) {
  const doc = new jsPDF();
  let y = 15;
  const line = (t: string) => {
    doc.text(t, 15, y);
    y += 7;
  };
  doc.setFontSize(18);
  line(`${p.info.firstName} ${p.info.lastName}`);
  doc.setFontSize(11);
  line(p.info.occupation);
  line(`${p.contact.email} · ${p.contact.phoneNumber}`);
  line(`${p.address.addressLine}, ${p.address.city}, ${p.address.state}, ${p.address.country} ${p.address.zipCode}`);
  y += 3;
  doc.setFontSize(13);
  line('Academic background');
  doc.setFontSize(11);
  for (const a of p.academics) {
    line(`• ${a.schoolName}${a.degree ? ` — ${a.degree}` : ''}`);
    if (a.startDate || a.endDate) line(`  ${[a.startDate, a.endDate].filter(Boolean).join(' → ')}`);
    if (a.description) line(`  ${a.description}`);
  }
  doc.save(`${p.info.firstName}-${p.info.lastName}-resume.pdf`);
}

export async function exportDocx(p: ProfileResponse) {
  const children: Paragraph[] = [
    new Paragraph({ text: `${p.info.firstName} ${p.info.lastName}`, heading: HeadingLevel.TITLE }),
    new Paragraph({ children: [new TextRun(p.info.occupation)] }),
    new Paragraph({ children: [new TextRun(`${p.contact.email} · ${p.contact.phoneNumber}`)] }),
    new Paragraph({
      children: [
        new TextRun(
          `${p.address.addressLine}, ${p.address.city}, ${p.address.state}, ${p.address.country} ${p.address.zipCode}`,
        ),
      ],
    }),
    new Paragraph({ text: 'Academic background', heading: HeadingLevel.HEADING_1 }),
    ...p.academics.flatMap((a) => [
      new Paragraph({ children: [new TextRun({ text: a.schoolName, bold: true })] }),
      ...(a.degree || a.fieldOfStudy
        ? [new Paragraph({ children: [new TextRun([a.degree, a.fieldOfStudy].filter(Boolean).join(' — '))] })]
        : []),
      ...(a.description ? [new Paragraph({ children: [new TextRun(a.description)] })] : []),
    ]),
  ];
  const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
  saveAs(blob, `${p.info.firstName}-${p.info.lastName}-resume.docx`);
}
