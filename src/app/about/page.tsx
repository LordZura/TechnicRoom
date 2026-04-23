import { getLocaleFromCookie } from '@/lib/i18n/locale';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default function AboutPage() {
  const locale = getLocaleFromCookie();
  const t = getDictionary(locale);

  return (
    <article className="space-y-4 sm:space-y-6">
      <section className="tr-surface p-5 sm:p-8">
        <h1 className="tr-section-title">{t.about.title}</h1>
        <p className="mt-3 text-sm text-brand-800/85 sm:mt-4 sm:text-base">{t.about.body}</p>
      </section>
      <section className="grid gap-3.5 md:grid-cols-3 md:gap-4">
        {[
          ['Trusted Guidance', 'Clear recommendations based on room size, budget, and long-term usage.'],
          ['Verified Specs', 'Transparent technical data to help clients compare products confidently.'],
          ['After-Sales Support', 'From installation planning to maintenance follow-up.']
        ].map(([title, body]) => (
          <div key={title} className="tr-surface p-4 sm:p-5">
            <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
            <p className="mt-1.5 text-sm text-brand-700/85 sm:mt-2">{body}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
