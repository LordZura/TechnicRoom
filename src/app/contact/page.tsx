export default function ContactPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Contact</h1>
        <ul className="mt-4 space-y-2 text-slate-700">
          <li>Phone: +995 555 00 00 00</li>
          <li>Email: info@technicroom.ge</li>
          <li>Address: Tbilisi, Georgia</li>
        </ul>
      </section>
      <form action="/api/contact" method="post" className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Send Message</h2>
        <input name="name" required placeholder="Name" className="w-full rounded-lg border p-2" />
        <input name="email" required type="email" placeholder="Email" className="w-full rounded-lg border p-2" />
        <textarea name="message" required placeholder="Message" className="h-28 w-full rounded-lg border p-2" />
        <button className="rounded-lg bg-brand-700 px-4 py-2 text-white">Submit</button>
      </form>
    </div>
  );
}
