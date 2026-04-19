'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    window.location.href = '/admin/dashboard';
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <input required type="email" placeholder="Email" className="w-full rounded-lg border p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input required type="password" placeholder="Password" className="w-full rounded-lg border p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="w-full rounded-lg bg-brand-700 px-4 py-2 text-white">Sign in</button>
    </form>
  );
}
