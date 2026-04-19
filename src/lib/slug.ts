export function slugify(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s/_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getPreferredSlugSource(input: { model?: string | null; englishName?: string | null; georgianName?: string | null }) {
  return (input.model || '').trim() || (input.englishName || '').trim() || (input.georgianName || '').trim() || '';
}

export function buildProductSlug(input: { model?: string | null; englishName?: string | null; georgianName?: string | null }) {
  const source = getPreferredSlugSource(input);
  return slugify(source);
}
