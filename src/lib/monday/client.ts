// Monday.com API client — Pomegranate Market
// Board ID: 18411269588  (READ-ONLY — never write to this board)
import { POMEGRANATE_BOARD_ID, COLS, STATUS_NORM } from './columnMap';

const MONDAY_API_URL = 'https://api.monday.com/v2';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface PomegranateItem {
  id: string;
  name: string;
  groupId: string;
  groupTitle: string;
  owner: string;
  statusRaw: string;
  status: string;      // normalized: DONE | IN_PROGRESS | ONGOING | BLOCKED | NOT_STARTED
  startDate: string;   // ISO date or ''
  endDate: string;     // ISO date or ''
  notes: string;
  deliverable: string; // '' | 'Milestone'
}

interface CacheEntry {
  data: PomegranateItem[];
  fetchedAt: number;
}

let cache: CacheEntry | null = null;

function parseTimeline(val: string): { start: string; end: string } {
  try {
    const parsed = JSON.parse(val);
    return { start: parsed.from ?? '', end: parsed.to ?? '' };
  } catch {
    return { start: '', end: '' };
  }
}

function getColText(columnValues: { id: string; text: string; value: string }[], colId: string): string {
  return columnValues.find(cv => cv.id === colId)?.text ?? '';
}
function getColValue(columnValues: { id: string; text: string; value: string }[], colId: string): string {
  return columnValues.find(cv => cv.id === colId)?.value ?? '';
}

export async function fetchPomegranateBoard(forceRefresh = false): Promise<PomegranateItem[]> {
  if (!forceRefresh && cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  const apiKey = import.meta.env.VITE_MONDAY_API_KEY;
  if (!apiKey) {
    console.warn('VITE_MONDAY_API_KEY not set — Monday data unavailable');
    return [];
  }

  const query = `{
    boards(ids: [${POMEGRANATE_BOARD_ID}]) {
      items_page(limit: 100) {
        items {
          id name
          group { id title }
          column_values { id text value }
        }
      }
    }
  }`;

  const res = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
      'API-Version': '2024-01',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`Monday API error: ${res.status}`);
  const data = await res.json();

  if (data.errors) {
    console.error('Monday GraphQL errors:', data.errors);
    return [];
  }

  const board = data.data.boards[0];
  const items: PomegranateItem[] = board.items_page.items.map((item: {
    id: string;
    name: string;
    group: { id: string; title: string };
    column_values: { id: string; text: string; value: string }[];
  }) => {
    const cv = item.column_values;
    const timelineVal = getColValue(cv, COLS.date);
    const { start, end } = parseTimeline(timelineVal);
    const statusRaw = getColText(cv, COLS.status);

    return {
      id:           item.id,
      name:         item.name,
      groupId:      item.group.id,
      groupTitle:   item.group.title,
      owner:        getColText(cv, COLS.person),
      statusRaw,
      status:       STATUS_NORM[statusRaw] ?? 'NOT_STARTED',
      startDate:    start,
      endDate:      end,
      notes:        getColText(cv, COLS.notes),
      deliverable:  getColText(cv, COLS.deliverable),
    };
  });

  cache = { data: items, fetchedAt: Date.now() };
  return items;
}

export function clearCache() {
  cache = null;
}
