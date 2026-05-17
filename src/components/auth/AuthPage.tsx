import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import thsLogo from '../../assets/ths-logo.png';
import pomLogoFull from '../../assets/pom-logo-full.png';

export function AuthPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: err } = signIn(email, passcode);
    if (err) setError(err);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f9fc] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        {/* Logos */}
        <div className="mb-8 flex items-center justify-center gap-5">
          <img src={pomLogoFull} alt="Pomegranate Market" className="h-14 w-auto" />
          <div className="h-10 w-px bg-gray-200" />
          <img src={thsLogo} alt="Third Horizon Strategies" className="h-8 w-auto" />
        </div>

        <p className="mb-6 text-center text-xs text-gray-400">Client Portal — Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:border-[#1a2e45] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Passcode</label>
            <input
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:border-[#1a2e45] focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-pom-red py-2.5 text-sm font-semibold text-white transition-colors hover:bg-pom-red-dark disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-gray-300">
          Contract CMH-26-01-POM · May–Aug 2026
        </p>
      </div>
    </div>
  );
}
