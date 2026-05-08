import { Level, Grid, Cell } from '../types/game';

function emptyCell(): Cell { return { piece: null }; }

function makeGrid(rows: number, cols: number): Grid {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => emptyCell())
  );
}

function g(rows: number, cols: number, pieces: Array<{ r: number; c: number; piece: Cell['piece'] }>): Grid {
  const grid = makeGrid(rows, cols);
  for (const { r, c, piece } of pieces) {
    grid[r][c] = { piece };
  }
  return grid;
}

export const LEVELS: Level[] = [
  {
    id: 'tutorial-1',
    name: 'First Light',
    description: 'Place a mirror to redirect the red beam to the target.',
    rows: 5,
    cols: 5,
    grid: g(5, 5, [
      { r: 2, c: 0, piece: { type: 'SOURCE', color: 'RED', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 4, piece: { type: 'TARGET', color: 'RED', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'tutorial-2',
    name: 'Bounce',
    description: 'Use two mirrors to reach the target in the corner.',
    rows: 6,
    cols: 6,
    grid: g(6, 6, [
      { r: 5, c: 0, piece: { type: 'SOURCE', color: 'BLUE', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 5, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'tutorial-3',
    name: 'Split Decision',
    description: 'Hit both targets — you have a splitter and mirrors.',
    rows: 6,
    cols: 7,
    grid: g(6, 7, [
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 3, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 5, c: 6, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'colors-1',
    name: 'Mixing It Up',
    description: 'A white beam hits a prism — route each color to its matching target.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'WHITE', direction: 'RIGHT', fixed: true } },
      { r: 3, c: 3, piece: { type: 'PRISM', fixed: true } },
      { r: 0, c: 6, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 3, c: 6, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 6, c: 6, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'colors-2',
    name: 'Color Fusion',
    description: 'Combine red and green beams to make yellow and hit the target.',
    rows: 7,
    cols: 8,
    grid: g(7, 8, [
      { r: 0, c: 2, piece: { type: 'SOURCE', color: 'RED', direction: 'DOWN', fixed: true } },
      { r: 6, c: 5, piece: { type: 'SOURCE', color: 'GREEN', direction: 'UP', fixed: true } },
      { r: 3, c: 7, piece: { type: 'TARGET', color: 'YELLOW', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'strategy-1',
    name: 'Traffic Control',
    description: 'Route three beams to three targets without crossing wires.',
    rows: 8,
    cols: 8,
    grid: g(8, 8, [
      { r: 0, c: 1, piece: { type: 'SOURCE', color: 'RED', direction: 'DOWN', fixed: true } },
      { r: 0, c: 4, piece: { type: 'SOURCE', color: 'BLUE', direction: 'DOWN', fixed: true } },
      { r: 4, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 7, c: 7, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 7, c: 4, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
      { r: 0, c: 7, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'strategy-2',
    name: 'The Filter',
    description: 'Use color filters to create cyan and magenta beams.',
    rows: 8,
    cols: 9,
    grid: g(8, 9, [
      { r: 4, c: 0, piece: { type: 'SOURCE', color: 'WHITE', direction: 'RIGHT', fixed: true } },
      { r: 1, c: 8, piece: { type: 'TARGET', color: 'CYAN', fixed: true } },
      { r: 4, c: 8, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 7, c: 8, piece: { type: 'TARGET', color: 'MAGENTA', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'PRISM' },
      { type: 'COLORFILTER', color: 'CYAN' },
      { type: 'COLORFILTER', color: 'MAGENTA' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'strategy-3',
    name: 'Prism Palace',
    description: 'Split and filter the white beam to light all five targets.',
    rows: 9,
    cols: 9,
    grid: g(9, 9, [
      { r: 4, c: 0, piece: { type: 'SOURCE', color: 'WHITE', direction: 'RIGHT', fixed: true } },
      { r: 4, c: 4, piece: { type: 'PRISM', fixed: true } },
      { r: 0, c: 8, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 1, c: 8, piece: { type: 'TARGET', color: 'YELLOW', fixed: true } },
      { r: 4, c: 8, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 7, c: 8, piece: { type: 'TARGET', color: 'CYAN', fixed: true } },
      { r: 8, c: 8, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'COLORFILTER', color: 'YELLOW' },
      { type: 'COLORFILTER', color: 'CYAN' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'master-1',
    name: 'Laser Labyrinth',
    description: 'Blockers are in your way. Find the path through the maze.',
    rows: 9,
    cols: 9,
    grid: g(9, 9, [
      { r: 0, c: 0, piece: { type: 'SOURCE', color: 'RED', direction: 'RIGHT', fixed: true } },
      { r: 8, c: 8, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 0, c: 3, piece: { type: 'BLOCKER', fixed: true } },
      { r: 1, c: 3, piece: { type: 'BLOCKER', fixed: true } },
      { r: 2, c: 3, piece: { type: 'BLOCKER', fixed: true } },
      { r: 4, c: 5, piece: { type: 'BLOCKER', fixed: true } },
      { r: 5, c: 5, piece: { type: 'BLOCKER', fixed: true } },
      { r: 6, c: 5, piece: { type: 'BLOCKER', fixed: true } },
      { r: 7, c: 5, piece: { type: 'BLOCKER', fixed: true } },
      { r: 3, c: 7, piece: { type: 'BLOCKER', fixed: true } },
      { r: 4, c: 7, piece: { type: 'BLOCKER', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'master-2',
    name: 'Full Spectrum',
    description: 'The ultimate challenge. Route the white beam to light all five targets.',
    rows: 10,
    cols: 10,
    grid: g(10, 10, [
      { r: 5, c: 0, piece: { type: 'SOURCE', color: 'WHITE', direction: 'RIGHT', fixed: true } },
      { r: 5, c: 5, piece: { type: 'PRISM', fixed: true } },
      { r: 0, c: 9, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 2, c: 9, piece: { type: 'TARGET', color: 'YELLOW', fixed: true } },
      { r: 5, c: 9, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 7, c: 9, piece: { type: 'TARGET', color: 'CYAN', fixed: true } },
      { r: 9, c: 9, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'COLORFILTER', color: 'YELLOW' },
      { type: 'COLORFILTER', color: 'CYAN' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
];

export function getLevelById(id: string): Level | undefined {
  return LEVELS.find(l => l.id === id);
}

// Generate a daily puzzle deterministically from a date string
export function getDailyPuzzle(dateStr: string): Level {
  const hash = dateStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const idx = hash % LEVELS.length;
  const base = LEVELS[idx];
  return {
    ...base,
    id: `daily-${dateStr}`,
    name: `Daily — ${dateStr}`,
    description: base.description,
  };
}
