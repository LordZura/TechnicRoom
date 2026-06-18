const transformEnabled = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_TRANSFORM === 'true';

// Supabase storage public URL segment → image transform segment
const OBJECT_SEGMENT = '/storage/v1/object/public/';
const RENDER_SEGMENT = '/storage/v1/render/image/public/';

export default function supabaseImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Free-tier fallback: return src unchanged so images still load without resizing.
  if (!transformEnabled || !src.includes(OBJECT_SEGMENT)) {
    return src;
  }

  const url = new URL(src.replace(OBJECT_SEGMENT, RENDER_SEGMENT));
  url.searchParams.set('width', String(width));
  url.searchParams.set('quality', String(quality ?? 75));
  return url.toString();
}
