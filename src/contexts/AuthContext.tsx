// Simple passcode + email allowlist auth — no Supabase dependency
// Credentials stored in VITE_CLIENT_ALLOWLIST and VITE_CLIENT_PASSCODE env vars

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  user: string | null;      // email address
  loading: boolean;
  signIn: (email: string, passcode: string) => { error: string | null };
  signOut: () => void;
}

const STORAGE_KEY = 'pom-auth-v1';
const AUTH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { email, expiresAt } = JSON.parse(raw);
        if (Date.now() < expiresAt) {
          setUser(email);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  function signIn(email: string, passcode: string): { error: string | null } {
    const allowlist = (import.meta.env.VITE_CLIENT_ALLOWLIST ?? '')
      .split(',')
      .map((e: string) => e.trim().toLowerCase());
    const expected = (import.meta.env.VITE_CLIENT_PASSCODE ?? '').trim();

    const emailLower = email.trim().toLowerCase();
    if (!allowlist.includes(emailLower)) {
      return { error: 'Email not authorized.' };
    }
    if (passcode.trim() !== expected) {
      return { error: 'Incorrect passcode.' };
    }

    const payload = { email: emailLower, expiresAt: Date.now() + AUTH_TTL_MS };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setUser(emailLower);
    return { error: null };
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
