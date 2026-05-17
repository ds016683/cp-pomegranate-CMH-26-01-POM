import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PomegranateProvider } from './contexts/PomegranateContext';
import { AuthPage } from './components/auth/AuthPage';
import { ProjectPlanView } from './components/project-plan/ProjectPlanView';
import { PomegranateCardView } from './components/baseball-card/PomegranateCardView';
import { PomGanttView } from './components/gantt/PomGanttView';
import { OdinChat } from './components/odin/OdinChat';
import { AppDrawer } from './components/navigation/AppDrawer';
import type { AppView } from './components/navigation/AppDrawer';
import { useState } from 'react';

function AppContent() {
  const { user } = useAuth();
  const [view, setView] = useState<AppView>('plan');

  if (!user) return <AuthPage />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f9fc] text-gray-900">
      <AppDrawer activeView={view} onViewChange={setView} />
      <main className="flex-1 flex flex-col min-h-0">
        <PomegranateProvider>
          {view === 'plan'  && <div className="flex-1 overflow-y-auto"><ProjectPlanView /></div>}
          {view === 'cards' && <div className="flex-1 overflow-y-auto"><PomegranateCardView /></div>}
          {view === 'gantt' && <div className="flex-1 overflow-y-auto"><PomGanttView /></div>}
          {view === 'odin'  && <div className="flex flex-col flex-1 min-h-0"><OdinChat /></div>}
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
