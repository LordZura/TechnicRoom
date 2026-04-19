import { Mail, Phone } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

const contact = {
  email: 'unispacegeo@gmail.com',
  phoneLabel: '+995 574 50 44 00',
  phoneHref: '+995574504400'
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 sm:space-y-6">
      <Reveal>
        <section className="tr-surface p-5 sm:p-8">
          <h1 className="tr-section-title">Contact</h1>
          <p className="tr-muted mt-2">Reach our team directly. We&apos;ll help you choose the right climate solution for your space.</p>
          <div className="mt-5 grid gap-3.5 sm:mt-6 sm:grid-cols-2 sm:gap-4">
            <a
              href={`tel:${contact.phoneHref}`}
              className="group rounded-2xl border border-brand-line bg-brand-cream p-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
            >
              <div className="mb-3 inline-flex rounded-full bg-brand-ivory p-2.5 text-brand-brown"><Phone className="h-4 w-4" /></div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#876f5a]">Phone</p>
              <p className="mt-2 text-lg font-semibold text-brand-espresso transition group-hover:text-brand-brown">{contact.phoneLabel}</p>
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="group rounded-2xl border border-brand-line bg-brand-cream p-4 transition-all duration-300 active:scale-[0.99] hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-soft"
            >
              <div className="mb-3 inline-flex rounded-full bg-brand-ivory p-2.5 text-brand-brown"><Mail className="h-4 w-4" /></div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#876f5a]">Email</p>
              <p className="mt-2 break-all text-lg font-semibold text-brand-espresso transition group-hover:text-brand-brown">{contact.email}</p>
            </a>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
