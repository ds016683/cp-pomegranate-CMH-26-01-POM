import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PomegranateProvider } from './contexts/PomegranateContext';
import { AuthPage } from './components/auth/AuthPage';
import { ProjectPlanView } from './components/project-plan/ProjectPlanView';
import { PomegranateCardView } from './components/baseball-card/PomegranateCardView';
import { PomGanttView } from './components/gantt/PomGanttView';

type AppView = 'plan' | 'cards' | 'gantt';

function PomegranateIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="22" r="14" fill="url(#pomAppGrad)" />
      <ellipse cx="14" cy="17" rx="3" ry="4" fill="#C13B4A" opacity="0.7"/>
      <ellipse cx="20" cy="14" rx="3" ry="4" fill="#C13B4A" opacity="0.7"/>
      <ellipse cx="26" cy="17" rx="3" ry="4" fill="#C13B4A" opacity="0.7"/>
      <path d="M17 8 Q20 4 23 8" stroke="#5C3A1E" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M20 4 L20 8" stroke="#2D7A2D" strokeWidth="2" strokeLinecap="round"/>
      <defs>
        <radialGradient id="pomAppGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#C13B4A"/>
          <stop offset="100%" stopColor="#5C0F1A"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: 'plan',  label: 'Project Plan' },
  { id: 'cards', label: 'Baseball Cards' },
  { id: 'gantt', label: 'Gantt' },
];

function AppContent() {
  const { user, signOut } = useAuth();
  const [view, setView] = useState<AppView>('plan');

  if (!user) return <AuthPage />;

  return (
    <div className="min-h-screen bg-[#0d0a0b] text-white">
      <header className="border-b border-white/10 bg-[#120810]">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <PomegranateIcon size={28} />
            <div>
              <h1 className="text-sm font-bold text-white">Pomegranate Market × Third Horizon</h1>
              <p className="text-[10px] text-white/30">CMH-26-01-POM · Food is Medicine Strategy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">{user}</span>
            <button
              onClick={signOut}
              className="rounded-lg border border-white/10 px-3 py-1 text-xs text-white/40 hover:text-white/70 transition"
            >Sign out</button>
          </div>
        </div>
        <nav className="flex gap-0 border-t border-white/5 px-6">
          {NAV_ITEMS.map(n => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className={`px-4 py-2.5 text-xs font-semibold transition border-b-2 ${
                view === n.id
                  ? 'border-[#8B1E2D] text-white'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}
            >{n.label}</button>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto">
        <PomegranateProvider>
          {view === 'plan'  && <ProjectPlanView />}
          {view === 'cards' && <PomegranateCardView />}
          {view === 'gantt' && <PomGanttView />}
        </PomegranateProvider>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
