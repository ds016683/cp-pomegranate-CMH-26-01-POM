import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePomegranate } from '../../contexts/PomegranateContext';
import { GROUPS, GROUP_COLORS } from '../../lib/monday/columnMap';

const STATUS_BAR: Record<string, string> = {
  DONE:         '#00c875',
  IN_PROGRESS:  '#fdab3d',
  BLOCKED:      '#df2f4a',
  ONGOING:      '#8B1E2D',
  NOT_STARTED:  '#374151',
  REVIEW:       '#7c3aed',
};

function daysDiff(a: Date, b: Date) { return Math.round((b.getTime() - a.getTime()) / 86400000); }
function fmtMon(d: Date) { return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }); }

export function PomGanttView() {
  const { items, loading, error, refetch } = usePomegranate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const contractStart = new Date('2026-05-01');
  const contractEnd   = new Date('2026-08-31');
  const totalDays = daysDiff(contractStart, contractEnd);

  // Month markers
  const months: { label: string; leftPct: number }[] = [];
  const cur = new Date(contractStart.getFullYear(), contractStart.getMonth(), 1);
  while (cur <= contractEnd) {
    months.push({ label: fmtMon(new Date(cur)), leftPct: Math.max(0, (daysDiff(contractStart, cur) / totalDays) * 100) });
    cur.setMonth(cur.getMonth() + 1);
  }

  if (loading) return (
    <div className="flex h-64 items-center justify-center text-white/40">
      <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Loading board…
    </div>
  );
  if (error) return (
    <div className="m-6 rounded-xl border border-red-800/40 bg-red-900/20 p-4 text-sm text-red-300">
      <strong>Error:</strong> {error}
    </div>
  );

  const grouped = GROUPS.map(g => ({
    ...g,
    color: GROUP_COLORS[g.id] ?? '#8B1E2D',
    items: items.filter(i => i.groupId === g.id && (i.startDate || i.endDate)),
  }));

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Gantt Chart</h2>
          <p className="text-xs text-white/30">May 2026 – Aug 2026 · Contract window</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 hover:text-white/80 transition"
        >
          <RefreshCw className="h-3 w-3" /> Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#120810]">
        {/* Header */}
        <div className="flex border-b border-white/10 bg-white/5" style={{ minWidth: '700px' }}>
          <div className="w-64 flex-shrink-0 py-2 pl-4 text-[10px] font-semibold uppercase tracking-wider text-white/30">Task</div>
          <div className="flex-1 relative h-8">
            {months.map(m => (
              <div key={m.label} className="absolute top-2 text-[10px] text-white/30" style={{ left: `${m.leftPct}%` }}>
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {grouped.map(group => group.items.length > 0 && (
          <div key={group.id}>
            <div
              className="flex items-center border-b border-white/5 py-1.5 pl-4"
              style={{ backgroundColor: group.color + '22', borderLeft: `3px solid ${group.color}` }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: group.color }}>
                {group.label}
              </span>
            </div>
            {group.items.map(item => {
              const start = item.startDate ? new Date(item.startDate) : contractStart;
              const end   = item.endDate   ? new Date(item.endDate)   : new Date(start.getTime() + 7 * 86400000);
              const leftPct  = Math.max(0, Math.min(100, (daysDiff(contractStart, start) / totalDays) * 100));
              const widthPct = Math.max(0.5, Math.min(100 - leftPct, (daysDiff(start, end) / totalDays) * 100));
              const barColor = STATUS_BAR[item.status] ?? '#374151';
              const isHovered = hoveredId === item.id;
              const isMilestone = item.deliverable === 'Milestone';

              return (
                <div
                  key={item.id}
                  className="flex items-center border-b border-white/5 hover:bg-white/[0.03] transition"
                  style={{ minWidth: '700px' }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="w-64 flex-shrink-0 py-2 pl-4 pr-2">
                    <span className={`text-xs truncate block ${isMilestone ? 'font-semibold text-[#C13B4A]' : 'text-white/70'}`}>
                      {isMilestone && '◆ '}{item.name}
                    </span>
                  </div>
                  <div className="flex-1 relative h-8 flex items-center px-1">
                    <div
                      className="absolute h-4 rounded"
                      style={{ left: `${leftPct}%`, width: `${widthPct}%`, backgroundColor: barColor, opacity: 0.85 }}
                    />
                    {isHovered && (
                      <div
                        className="absolute z-10 rounded-lg border border-white/20 bg-[#1a0d10] px-3 py-2 text-xs text-white shadow-xl pointer-events-none"
                        style={{ left: `${Math.min(leftPct + widthPct / 2, 70)}%`, top: '-2.5rem' }}
                      >
                        <div className="font-semibold mb-0.5 max-w-[200px] truncate">{item.name}</div>
                        <div className="text-white/50">{item.startDate || '?'} → {item.endDate || '?'}</div>
                        {item.owner && <div className="text-white/50">{item.owner}</div>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {grouped.every(g => g.items.length === 0) && (
          <div className="py-12 text-center text-sm text-white/30">No timeline data on board yet.</div>
        )}
      </div>
    </div>
  );
}
