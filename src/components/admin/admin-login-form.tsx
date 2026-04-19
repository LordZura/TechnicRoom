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
    <form onSubmit={onSubmit} className="tr-surface mx-auto max-w-md space-y-4 p-6 sm:p-7">
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <input required type="email" placeholder="Email" className="tr-input" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input required type="password" placeholder="Password" className="tr-input" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="tr-btn-primary w-full">Sign in</button>
    </form>
  );
}
