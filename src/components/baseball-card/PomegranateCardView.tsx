import { useState } from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { usePomegranate } from '../../contexts/PomegranateContext';
import { GROUPS, STATUS_COLORS } from '../../lib/monday/columnMap';
import type { PomegranateItem } from '../../lib/monday/client';

function fmtDate(d: string) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }); }
  catch { return d; }
}

function StatusPill({ status, raw }: { status: string; raw: string }) {
  const cls = STATUS_COLORS[status] ?? 'bg-gray-200 text-gray-500';
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{raw || 'Not Started'}</span>;
}

function Card({ item }: { item: PomegranateItem }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative h-48 cursor-pointer"
      style={{ perspective: '800px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="absolute inset-0 transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-snug text-gray-800 line-clamp-2">{item.name}</p>
            {item.deliverable === 'Milestone' && (
              <span className="shrink-0 rounded-full bg-pom-red/10 px-1.5 py-0.5 text-[9px] font-bold text-pom-red">M</span>
            )}
          </div>
          <StatusPill status={item.status} raw={item.statusRaw} />
          <div className="mt-3 space-y-1 text-[11px] text-gray-500">
            <p><span className="font-medium text-gray-600">Owner:</span> {item.owner || '—'}</p>
            <p>
              <span className="font-medium text-gray-600">Timeline:</span>{' '}
              {item.startDate ? `${fmtDate(item.startDate)} – ${fmtDate(item.endDate)}` : '—'}
            </p>
          </div>
          <p className="absolute bottom-3 right-3 text-[9px] text-gray-300">click to flip</p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl border border-pom-red/20 bg-[#f9f3f4] p-4 shadow-sm"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-pom-red">Notes</p>
          <p className="text-xs text-gray-600 line-clamp-5">
            {item.notes || 'No notes on record.'}
          </p>
          <div className="absolute bottom-3 right-3">
            <RotateCcw size={12} className="text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PomegranateCardView() {
  const { items, loading, error, refetch } = usePomegranate();
  const [syncing, setSyncing] = useState(false);
  const [filterGroup, setFilterGroup] = useState<string>('all');

  async function handleRefresh() {
    setSyncing(true);
    await refetch();
    setSyncing(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-8 text-sm text-gray-400">
        Loading cards…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  const filtered = filterGroup === 'all'
    ? items
    : items.filter(i => i.groupId === filterGroup);

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#224057]">Baseball Cards</h2>
          <p className="text-xs text-gray-400">{filtered.length} items · click a card to flip</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterGroup}
            onChange={e => setFilterGroup(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-600 focus:outline-none"
          >
            <option value="all">All phases</option>
            {GROUPS.map(g => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
          <button
            onClick={handleRefresh}
            disabled={syncing}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center text-sm text-gray-300">
          No items to display.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(item => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
