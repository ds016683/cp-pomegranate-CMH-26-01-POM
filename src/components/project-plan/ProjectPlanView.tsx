import { useState } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, ExternalLink } from 'lucide-react';
import { usePomegranate } from '../../contexts/PomegranateContext';
import { GROUPS, GROUP_COLORS, STATUS_COLORS } from '../../lib/monday/columnMap';

const BOARD_URL = 'https://thirdhorizonstrategies.monday.com/boards/18411269588';

function fmtDate(d: string | null | undefined) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  } catch { return d; }
}

function StatusPill({ status, raw }: { status: string; raw: string }) {
  const cls = STATUS_COLORS[status] ?? 'bg-gray-200 text-gray-500';
  const label = raw || 'Not Started';
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{label}</span>;
}

export function ProjectPlanView() {
  const { items, loading, error, refetch } = usePomegranate();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [syncing, setSyncing] = useState(false);

  async function handleRefresh() {
    setSyncing(true);
    await refetch();
    setSyncing(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8 text-sm text-gray-400">
        Loading project plan…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <strong>Error loading board:</strong> {error}
        </div>
      </div>
    );
  }

  // Build group → items map
  const byGroup: Record<string, typeof items> = {};
  for (const item of items) {
    if (!byGroup[item.groupId]) byGroup[item.groupId] = [];
    byGroup[item.groupId].push(item);
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#224057]">Project Plan</h2>
          <p className="text-xs text-gray-400">CMH-26-01-POM · May–Aug 2026 · {items.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={BOARD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
          >
            <ExternalLink size={12} /> Monday.com
          </a>
          <button
            onClick={handleRefresh}
            disabled={syncing}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Groups */}
      {GROUPS.map(group => {
        const groupItems = byGroup[group.id] ?? [];
        const isCollapsed = collapsed[group.id];
        const headerColor = GROUP_COLORS[group.id] ?? '#224057';

        return (
          <div key={group.id} className="mb-4 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
            {/* Group header */}
            <button
              onClick={() => setCollapsed(c => ({ ...c, [group.id]: !c[group.id] }))}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-white"
              style={{ backgroundColor: headerColor }}
            >
              <span className="flex items-center gap-2">
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                {group.label}
                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-normal">
                  {groupItems.length}
                </span>
              </span>
            </button>

            {/* Items table */}
            {!isCollapsed && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Owner</th>
                    <th className="px-3 py-2 text-left">Timeline</th>
                    <th className="px-3 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {groupItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-4 text-center text-xs text-gray-300">
                        No items in this phase yet.
                      </td>
                    </tr>
                  )}
                  {groupItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-pom-cream/30 transition-colors`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {item.name}
                        {item.notes && (
                          <p className="mt-0.5 text-[10px] text-gray-400 line-clamp-1">{item.notes}</p>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusPill status={item.status} raw={item.statusRaw} />
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {item.owner || '—'}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {item.startDate ? `${fmtDate(item.startDate)} – ${fmtDate(item.endDate)}` : '—'}
                      </td>
                      <td className="px-3 py-3 text-xs">
                        {item.deliverable === 'Milestone' ? (
                          <span className="rounded-full bg-pom-red/10 px-2 py-0.5 text-[10px] font-semibold text-pom-red">
                            Milestone
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      })}
    </div>
  );
}
