import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-10 border-t border-brand-line bg-brand-ivory">
      <div className="tr-shell grid gap-8 py-10 text-sm md:grid-cols-3">
        <div>
          <p className="text-base font-semibold text-brand-espresso">Technic Room</p>
          <p className="mt-2 text-[#725c49]">Reliable climate solutions with clear technical guidance.</p>
        </div>
        <div>
          <p className="font-semibold text-brand-espresso">Quick links</p>
          <div className="mt-2 space-y-1 text-[#725c49]">
            <Link className="block hover:text-brand-brown" href="/products">Products</Link>
            <Link className="block hover:text-brand-brown" href="/about">About</Link>
            <Link className="block hover:text-brand-brown" href="/contact">Contact</Link>
          </div>
        </div>
        <div className="text-[#725c49] md:text-right">
          <p className="font-semibold text-brand-espresso">Contact</p>
          <p className="mt-2">info@technicroom.ge</p>
          <p>+995 555 00 00 00</p>
        </div>
      </div>
      <div className="border-t border-brand-line bg-brand-cream">
        <div className="tr-shell py-3 text-xs text-[#7e6856]">© {new Date().getFullYear()} Technic Room. All rights reserved.</div>
      </div>
    </footer>
  );
}
