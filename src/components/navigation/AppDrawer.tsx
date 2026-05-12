import { useState } from 'react';
import { LayoutGrid, LogOut, Menu, X, GanttChart, FileText } from 'lucide-react';
import thsLogo from '../../assets/ths-logo.png';
import { useAuth } from '../../contexts/AuthContext';

export type AppView = 'project-plan' | 'tracker' | 'timeline';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'project-plan', label: 'Project Plan',   icon: FileText },
  { id: 'timeline',     label: 'Gantt Chart',    icon: GanttChart },
  { id: 'tracker',      label: 'Baseball Cards', icon: LayoutGrid },
];

// Pomegranate SVG icon
function PomegranateIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 40 40" style={{ width: size, height: size }} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="22" r="14" fill="#8B1E2D" />
      <circle cx="20" cy="22" r="10" fill="#c0392b" />
      <circle cx="17" cy="20" r="2" fill="#fde8e8" />
      <circle cx="23" cy="20" r="2" fill="#fde8e8" />
      <circle cx="20" cy="25" r="2" fill="#fde8e8" />
      <circle cx="15" cy="25" r="1.5" fill="#fde8e8" />
      <circle cx="25" cy="25" r="1.5" fill="#fde8e8" />
      <path d="M14 11 Q16 6 20 8 Q24 6 26 11 Q23 9 20 10 Q17 9 14 11Z" fill="#5a1020" />
    </svg>
  );
}

export function AppDrawer({
  activeView,
  onViewChange,
}: {
  activeView: AppView;
  onViewChange: (v: AppView) => void;
}) {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed left-3 top-3 z-50 rounded-lg bg-[#8B1E2D] p-1.5 text-white shadow md:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-[#16232f] transition-transform duration-200 md:relative md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-2 border-b border-white/10 px-4 py-5">
          <PomegranateIcon size={36} />
          <div className="text-center">
            <p className="text-xs font-bold leading-tight text-white">Pomegranate Market</p>
            <p className="text-[10px] text-white/40">× Third Horizon</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Engagement
          </p>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); setOpen(false); }}
                className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? 'bg-[#8B1E2D] font-semibold text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <img src={thsLogo} alt="Third Horizon Strategies" className="mb-3 h-5 w-auto brightness-0 invert opacity-50" />
          <p className="mb-2 truncate text-[10px] text-white/30">{user}</p>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
