import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import thsLogo from '../../assets/ths-logo.png';

// Pomegranate SVG icon (inline — swap for real asset when David supplies)
function PomegranateIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="22" r="14" fill="#8B1E2D" />
      <circle cx="20" cy="22" r="10" fill="#c0392b" />
      {/* seeds */}
      <circle cx="17" cy="20" r="2" fill="#fde8e8" />
      <circle cx="23" cy="20" r="2" fill="#fde8e8" />
      <circle cx="20" cy="25" r="2" fill="#fde8e8" />
      <circle cx="15" cy="25" r="1.5" fill="#fde8e8" />
      <circle cx="25" cy="25" r="1.5" fill="#fde8e8" />
      {/* crown */}
      <path d="M14 11 Q16 6 20 8 Q24 6 26 11 Q23 9 20 10 Q17 9 14 11Z" fill="#5a1020" />
    </svg>
  );
}

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0d1a26] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#16232f] p-8 shadow-2xl">
        {/* Logos */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <PomegranateIcon />
          <div className="h-8 w-px bg-white/20" />
          <img src={thsLogo} alt="Third Horizon Strategies" className="h-8 w-auto brightness-0 invert" />
        </div>

        <h1 className="mb-1 text-center text-lg font-bold text-white">Pomegranate Market × Third Horizon</h1>
        <p className="mb-6 text-center text-xs text-white/40">Client Portal — Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/10 bg-[#0d1a26] px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-pom-red focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-white/50">Passcode</label>
            <input
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-[#0d1a26] px-3 py-2.5 text-sm text-white placeholder-white/20 focus:border-pom-red focus:outline-none"
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

        <p className="mt-6 text-center text-[10px] text-white/20">
          Contract CMH-26-01-POM · May–Aug 2026
        </p>
      </div>
    </div>
  );
}
