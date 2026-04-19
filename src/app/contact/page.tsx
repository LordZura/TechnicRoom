export default function ContactPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="tr-surface p-6 sm:p-7">
        <h1 className="tr-section-title">Contact</h1>
        <p className="tr-muted mt-2">We help you choose and install the right climate system for your space.</p>
        <ul className="mt-6 space-y-3 text-[#705946]">
          <li><span className="font-semibold text-brand-espresso">Phone:</span> +995 555 00 00 00</li>
          <li><span className="font-semibold text-brand-espresso">Email:</span> info@technicroom.ge</li>
          <li><span className="font-semibold text-brand-espresso">Address:</span> Tbilisi, Georgia</li>
        </ul>
      </section>
      <form action="/api/contact" method="post" className="tr-surface space-y-4 p-6 sm:p-7">
        <h2 className="text-xl font-semibold">Send Message</h2>
        <input name="name" required placeholder="Name" className="tr-input" />
        <input name="email" required type="email" placeholder="Email" className="tr-input" />
        <textarea name="message" required placeholder="Message" className="tr-input h-32" />
        <button className="tr-btn-primary">Submit</button>
      </form>
    </div>
  );
}
