import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-8 border-t border-brand-line bg-brand-ivory sm:mt-10">
      <div className="tr-shell grid gap-7 py-8 text-sm md:grid-cols-3 md:gap-8 md:py-10">
        <div>
          <p className="text-base font-semibold text-brand-espresso">Technic Room</p>
          <p className="mt-2 text-[#725c49]">Reliable climate solutions with clear technical guidance.</p>
        </div>
        <div>
          <p className="font-semibold text-brand-espresso">Quick links</p>
          <div className="mt-2 space-y-1 text-[#725c49]">
            <Link className="block transition hover:text-brand-brown" href="/products">Products</Link>
            <Link className="block transition hover:text-brand-brown" href="/about">About</Link>
            <Link className="block transition hover:text-brand-brown" href="/contact">Contact</Link>
          </div>
        </div>
        <div className="text-[#725c49] md:text-right">
          <p className="font-semibold text-brand-espresso">Contact</p>
          <p className="mt-2"><a href="mailto:unispacegeo@gmail.com" className="transition hover:text-brand-brown">unispacegeo@gmail.com</a></p>
          <p><a href="tel:+995574504400" className="transition hover:text-brand-brown">+995 574 50 44 00</a></p>
        </div>
      </div>
      <div className="border-t border-brand-line bg-brand-cream">
        <div className="tr-shell py-3 text-xs text-[#7e6856]">© {new Date().getFullYear()} Technic Room. All rights reserved.</div>
      </div>
    </footer>
  );
}
