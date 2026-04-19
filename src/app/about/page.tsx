import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default function AboutPage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  return (
    <article className="prose max-w-3xl rounded-xl border border-slate-200 bg-white p-8">
      <h1>{t.about.title}</h1>
      <p>{t.about.body}</p>
      <p>Technic Room helps clients choose efficient and durable climate control equipment with transparent specifications and real support.</p>
    </article>
  );
}
