import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import type { ProfileResponse } from '@repo/contracts';

function formatAcademicDate(value: string | null | undefined) {
  if (!value) return '';
  const match = /^(\d{4})(?:-(\d{2}))?/.exec(value);
  if (!match) return value;
  const [, year, month] = match;
  if (!month) return year;
  const monthName = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' }).format(
    new Date(Date.UTC(Number(year), Number(month) - 1, 1)),
  );
  return `${monthName} ${year}`;
}

/**
 * Option A — client-side exports from the GET /users/:id payload.
 * Zero backend work; ADMIN + EDITOR only (gated by the calling page + backend roles).
 */

export function exportPdf(p: ProfileResponse) {
  const doc = new jsPDF();
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const fullName = `${p.info.firstName} ${p.info.lastName}`;
  const location = [p.address.city, p.address.state, p.address.country].filter(Boolean).join(', ');
  let y = margin;

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };
  const addParagraph = (
    text: string,
    options: { size: number; color: [number, number, number]; bold?: boolean; gap?: number },
  ) => {
    doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
    doc.setFontSize(options.size);
    doc.setTextColor(...options.color);
    const lines = doc.splitTextToSize(text, contentWidth) as string[];
    const lineHeight = options.size * 0.48;
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, margin, y);
      y += lineHeight;
    }
    y += options.gap ?? 0;
  };
  const addSectionTitle = (title: string) => {
    ensureSpace(14);
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(35, 59, 98);
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(220, 227, 237);
    doc.setLineWidth(0.35);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;
  };

  addParagraph(fullName, { size: 25, color: [21, 36, 59], bold: true, gap: 2 });
  addParagraph(p.info.occupation, { size: 13, color: [80, 98, 123], gap: 5 });
  const contactDetails = [
    p.contact.email,
    p.contact.phoneNumber,
    location,
  ].filter(Boolean);
  addParagraph(contactDetails.join('  |  '), { size: 9, color: [70, 86, 109], gap: 1 });
  if (p.contact.linkedinUrl) {
    doc.setTextColor(49, 93, 145);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.textWithLink('LinkedIn profile', margin, y, { url: p.contact.linkedinUrl });
    y += 5;
  }
  doc.setDrawColor(35, 59, 98);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;

  if (p.academics.length > 0) {
    addSectionTitle('Education');
  }
  for (const a of p.academics) {
    const qualification = [a.degree, a.fieldOfStudy].filter(Boolean).join(' · ');
    const dateRange = [a.startDate, a.endDate].map(formatAcademicDate).filter(Boolean).join(' — ');
    ensureSpace(15);
    addParagraph(a.schoolName, { size: 11, color: [28, 42, 62], bold: true, gap: 1 });
    if (qualification) {
      addParagraph(qualification, { size: 10, color: [70, 86, 109], gap: 1 });
    }
    if (dateRange) {
      addParagraph(dateRange, { size: 9, color: [94, 111, 132], gap: 1 });
    }
    if (a.description) {
      addParagraph(a.description, { size: 9, color: [57, 72, 92], gap: 5 });
    } else {
      y += 5;
    }
  }
  doc.save(`${p.info.firstName}-${p.info.lastName}-resume.pdf`);
}

export async function exportDocx(p: ProfileResponse) {
  const location = [p.address.city, p.address.state, p.address.country].filter(Boolean).join(', ');
  const contactDetails = [
    p.contact.email,
    p.contact.phoneNumber,
    location,
    p.contact.linkedinUrl ? 'LinkedIn profile' : '',
  ].filter(Boolean);
  const children: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: `${p.info.firstName} ${p.info.lastName}`, bold: true, size: 44, color: '15243B' })],
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: p.info.occupation, size: 26, color: '50627B' })],
      spacing: { after: 160 },
    }),
    new Paragraph({
      children: [new TextRun({ text: contactDetails.join('  |  '), size: 18, color: '46566D' })],
      spacing: { after: 100 },
    }),
    ...(p.academics.length > 0
      ? [new Paragraph({ text: 'EDUCATION', heading: HeadingLevel.HEADING_1 })]
      : []),
    ...p.academics.flatMap((a) => [
      new Paragraph({
        children: [new TextRun({ text: a.schoolName, bold: true, size: 22, color: '1C2A3E' })],
        spacing: { before: 160, after: 40 },
        keepNext: true,
      }),
      ...(a.degree || a.fieldOfStudy
        ? [new Paragraph({
            children: [new TextRun({ text: [a.degree, a.fieldOfStudy].filter(Boolean).join(' · '), size: 20, color: '46566D' })],
            spacing: { after: 40 },
            keepNext: Boolean(a.startDate || a.endDate || a.description),
          })]
        : []),
      ...(a.startDate || a.endDate
        ? [new Paragraph({
            children: [new TextRun({ text: [a.startDate, a.endDate].map(formatAcademicDate).filter(Boolean).join(' — '), size: 18, color: '5E6F84' })],
            spacing: { after: 40 },
            keepNext: Boolean(a.description),
          })]
        : []),
      ...(a.description
        ? [new Paragraph({
            children: [new TextRun({ text: a.description, size: 18, color: '39485C' })],
            spacing: { after: 120 },
          })]
        : []),
    ]),
  ];
  const blob = await Packer.toBlob(new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
        },
      },
      children,
    }],
  }));
  saveAs(blob, `${p.info.firstName}-${p.info.lastName}-resume.docx`);
}
