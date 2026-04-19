import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default function AboutPage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  return (
    <article className="space-y-6">
      <section className="tr-surface p-6 sm:p-8">
        <h1 className="tr-section-title">{t.about.title}</h1>
        <p className="mt-4 text-[#624c3a]">{t.about.body}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Trusted Guidance', 'Clear recommendations based on room size, budget, and long-term usage.'],
          ['Verified Specs', 'Transparent technical data to help clients compare products confidently.'],
          ['After-Sales Support', 'From installation planning to maintenance follow-up.']
        ].map(([title, body]) => (
          <div key={title} className="tr-surface p-5">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm text-[#705946]">{body}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
