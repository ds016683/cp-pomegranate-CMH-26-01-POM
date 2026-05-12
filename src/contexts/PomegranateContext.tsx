import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { fetchPomegranateBoard, clearCache } from '../lib/monday/client';
import type { PomegranateItem } from '../lib/monday/client';

interface PomegranateContextType {
  items: PomegranateItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PomegranateContext = createContext<PomegranateContextType | null>(null);

export function PomegranateProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<PomegranateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPomegranateBoard(force);
      setItems(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const refetch = useCallback(async () => {
    clearCache();
    await load(true);
  }, [load]);

  return (
    <PomegranateContext.Provider value={{ items, loading, error, refetch }}>
      {children}
    </PomegranateContext.Provider>
  );
}

export function usePomegranate() {
  const ctx = useContext(PomegranateContext);
  if (!ctx) throw new Error('usePomegranate must be used within PomegranateProvider');
  return ctx;
}
