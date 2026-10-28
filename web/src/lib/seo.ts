import type { Metadata } from 'next';

/**
 * Abstraction over Next.js `Metadata` for page titles.
 *
 * Usage:
 *   export const metadata = createMetadata({
 *     title: 'Profiles',
 *     description: 'Optional page-specific description.',
 *   });
 *
 * Only `title` is required; `description` falls back to the site default.
 * The helper fills in OpenGraph + Twitter tags so every page is SEO-complete
 * without copy-pasting boilerplate. Server components only — `metadata` cannot
 * be exported from a `'use client'` module.
 */

export interface SeoInput {
  title: string;
  description?: string;
}

const SITE_NAME = 'IntentTech Profiles';
const DEFAULT_DESCRIPTION =
  'Public profile submission and protected admin review of user records.';

export function createMetadata({ title, description }: SeoInput): Metadata {
  const desc = description ?? DEFAULT_DESCRIPTION;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: desc,
    openGraph: {
      title: fullTitle,
      description: desc,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
    },
  };
}
