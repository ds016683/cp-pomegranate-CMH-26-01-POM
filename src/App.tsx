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
    <div className="flex h-screen overflow-hidden bg-[#0d1a26] text-white">
      <AppDrawer activeView={view} onViewChange={setView} />
      <main className="flex-1 overflow-y-auto">
        <PomegranateProvider>
          {view === 'plan'  && <ProjectPlanView />}
          {view === 'cards' && <PomegranateCardView />}
          {view === 'gantt' && <PomGanttView />}
          {view === 'odin'  && <OdinChat />}
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
