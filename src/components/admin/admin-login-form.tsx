'use client';

import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setPending(false);
      return;
    }

    window.location.href = '/admin/dashboard';
  }

  return (
    <div className="tr-shell flex min-h-[70vh] items-center justify-center py-14">
      <form
        onSubmit={onSubmit}
        className="tr-card relative w-full max-w-md p-7 sm:p-9"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-wine-100/70 blur-3xl"
        />

        <div className="relative">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-wine-700 to-wine-900 text-white shadow-glow">
            <ShieldCheck className="h-5 w-5" />
          </span>

          <h1 className="tr-display mt-5 text-2xl text-ink-900">Admin Login</h1>
          <p className="mt-2 text-sm text-ink-500">
            Sign in to manage the catalog.
          </p>

          <div className="mt-7 space-y-3">
            <label className="tr-field">
              <Mail className="h-4 w-4 shrink-0 text-ink-400" />
              <input
                required
                type="email"
                placeholder="Email"
                autoComplete="email"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className="tr-field">
              <Lock className="h-4 w-4 shrink-0 text-ink-400" />
              <input
                required
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          {error && (
            <p className="mt-3 rounded-xl bg-wine-50 px-3.5 py-2.5 text-sm font-medium text-wine-800">
              {error}
            </p>
          )}

          <button className="tr-btn-primary mt-5 w-full" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}
