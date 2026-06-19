/**
 * Single-source-of-truth site identity for OrizPDF. Consumed by the family-
 * shared scaffolding (account, contact, legal pages) so every site exposes
 * the same shape without dragging the full @chirag127/oriz-ui types in.
 */
export interface OrizSiteConfig {
  slug: string
  name: string
  origin: string
  tagline: string
  description: string
}

export const SITE_CONFIG: OrizSiteConfig = {
  slug: 'pdf',
  name: 'PDF Tools',
  origin: 'https://pdf.oriz.in',
  tagline: 'Merge, split, compress, sign — never uploaded',
  description: 'Merge, split, compress, sign — never uploaded',
}
