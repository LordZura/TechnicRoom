import { cookies } from 'next/headers';
import { Locale } from '@/types';

export const DEFAULT_LOCALE: Locale = 'ka';

export function getLocaleFromCookie(): Locale {
  const locale = cookies().get('locale')?.value;
  return locale === 'en' || locale === 'ka' ? locale : DEFAULT_LOCALE;
}
