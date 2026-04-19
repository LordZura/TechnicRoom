import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-brand-700 px-4 py-2 text-white">Back to home</Link>
    </div>
  );
}
