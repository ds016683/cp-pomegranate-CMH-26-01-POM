import { useState } from 'react';
import { LayoutGrid, LogOut, Menu, X, GanttChart, FileText, Sparkles } from 'lucide-react';
import thsLogo from '../../assets/ths-logo.png';
import pomLogoFull from '../../assets/pom-logo-full.png';
import { useAuth } from '../../contexts/AuthContext';

export type AppView = 'plan' | 'cards' | 'gantt' | 'odin';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  dividerBefore?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'plan',  label: 'Project Plan',   icon: FileText },
  { id: 'gantt', label: 'Gantt Chart',    icon: GanttChart },
  { id: 'cards', label: 'Baseball Cards', icon: LayoutGrid },
  { id: 'odin',  label: 'Ask Odin',       icon: Sparkles, dividerBefore: true },
];


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
        className="fixed left-3 top-3 z-50 rounded-lg bg-[#1a2e45] p-1.5 text-white shadow md:hidden"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <aside
        className={`${open ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-[#1a2e45] transition-transform duration-200 md:relative md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-3 border-b border-white/[0.08] px-4 py-4">
          <img src={pomLogoFull} alt="Pomegranate Market" className="h-8 w-auto brightness-0 invert" />
          <div className="h-6 w-px bg-white/20" />
          <img src={thsLogo} alt="Third Horizon Strategies" className="h-5 w-auto brightness-0 invert opacity-80" />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Engagement
          </p>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <div key={item.id}>
                {item.dividerBefore && <div className="my-2 border-t border-white/10" />}
                <button
                  onClick={() => { onViewChange(item.id); setOpen(false); }}
                  className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    active
                      ? 'bg-white/10 font-semibold text-white'
                      : item.id === 'odin'
                        ? 'text-white/50 hover:bg-white/5 hover:text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/[0.08] p-4">
          <img src={thsLogo} alt="Third Horizon Strategies" className="mb-3 h-5 w-auto brightness-0 invert opacity-60" />
          <p className="mb-2 truncate text-[10px] text-white/40">{user}</p>
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
