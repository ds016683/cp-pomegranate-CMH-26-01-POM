// columnMap.ts — Pomegranate Market board schema
// Board ID: 18411269588 (account: thirdhorizonstrategies)
// Auto-generated from live introspection 2026-05-11

export const POMEGRANATE_BOARD_ID = '18411269588';

// Column IDs
export const COLS = {
  name:        'name',          // type: name
  person:      'person',        // type: people — Client Lead
  status:      'status',        // type: status
  date:        'date',          // type: timeline
  notes:       'text',          // type: text — Notes
  deliverable: 'dropdown_mm2frms1', // type: dropdown — Deliverable (Milestone)
  files:       'files',         // type: file
} as const;

// Group IDs and labels
export const GROUPS = [
  { id: 'new_group',          label: 'Ongoing Project Management' },
  { id: 'topics',             label: 'Phase 1: Intelligence and Discovery' },
  { id: 'group_mkwzrdj4',     label: 'Phase 2: Model Design and Pitch Development' },
  { id: 'group_mkwzm9t2',     label: 'Phase 3: Outreach and Strategic Positioning' },
] as const;

// Status normalization
export const STATUS_NORM: Record<string, string> = {
  'Done':             'DONE',
  'Working on it':    'IN_PROGRESS',
  'Ongoing':          'ONGOING',
  'Stuck':            'BLOCKED',
  'Not Started':      'NOT_STARTED',
  '':                 'NOT_STARTED',
};

// Group header colors
export const GROUP_COLORS: Record<string, string> = {
  'new_group':       '#224057',
  'topics':          '#5C3D6B',
  'group_mkwzrdj4':  '#8B1E2D',
  'group_mkwzm9t2':  '#1a5f3a',
};

// Status pill colors
export const STATUS_COLORS: Record<string, string> = {
  'DONE':        'bg-[#00c875] text-white',
  'IN_PROGRESS': 'bg-[#fdab3d] text-white',
  'ONGOING':     'bg-[#009DE0] text-white',
  'BLOCKED':     'bg-[#df2f4a] text-white',
  'NOT_STARTED': 'bg-gray-200 text-gray-500',
};
