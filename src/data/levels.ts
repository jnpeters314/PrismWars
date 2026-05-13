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
  // ── TUTORIAL ──────────────────────────────────────────────────────────────
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
    name: 'Sharp Corner',
    description: 'A different mirror makes a very different turn. Get the beam to the target.',
    rows: 5,
    cols: 5,
    grid: g(5, 5, [
      { r: 0, c: 0, piece: { type: 'SOURCE', color: 'BLUE', direction: 'DOWN', fixed: true } },
      { r: 4, c: 4, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'tutorial-3',
    name: 'Double Bounce',
    description: 'Chain two mirrors together to send the beam all the way around.',
    rows: 6,
    cols: 6,
    grid: g(6, 6, [
      { r: 0, c: 0, piece: { type: 'SOURCE', color: 'RED', direction: 'DOWN', fixed: true } },
      { r: 0, c: 5, piece: { type: 'TARGET', color: 'RED', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'tutorial-4',
    name: 'Crossroads',
    description: 'One beam, two targets. A splitter sends light in three directions at once.',
    rows: 6,
    cols: 6,
    grid: g(6, 6, [
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 3, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 5, c: 3, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
    ],
  },
  {
    id: 'tutorial-5',
    name: 'New Angle',
    description: 'The beam starts going down. Find where to place each mirror to reach the target.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 0, c: 6, piece: { type: 'SOURCE', color: 'BLUE', direction: 'DOWN', fixed: true } },
      { r: 0, c: 0, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'tutorial-6',
    name: 'Split and Route',
    description: 'One branch of the splitter goes straight to its target — the other needs help.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 3, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 6, c: 6, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'tutorial-7',
    name: 'Reverse',
    description: 'This time the beam fires to the left. Think about how each mirror deflects it.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 0, c: 3, piece: { type: 'SOURCE', color: 'RED', direction: 'LEFT', fixed: true } },
      { r: 3, c: 6, piece: { type: 'TARGET', color: 'RED', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'tutorial-8',
    name: 'Three-Way Split',
    description: 'The splitter fires three ways. Route each branch to its own target.',
    rows: 8,
    cols: 8,
    grid: g(8, 8, [
      { r: 4, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 7, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 4, c: 7, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 7, c: 7, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'tutorial-9',
    name: 'Upward',
    description: 'The beam rises. Route it left, then back down to the target in the corner.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 6, c: 3, piece: { type: 'SOURCE', color: 'BLUE', direction: 'UP', fixed: true } },
      { r: 6, c: 0, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'tutorial-10',
    name: 'Grand Tour',
    description: 'A leftward beam, a splitter, three targets in three directions. Use everything you know.',
    rows: 8,
    cols: 9,
    grid: g(8, 9, [
      { r: 4, c: 8, piece: { type: 'SOURCE', color: 'RED', direction: 'LEFT', fixed: true } },
      { r: 0, c: 8, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 7, c: 8, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 4, c: 0, piece: { type: 'TARGET', color: 'RED', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  // ── COLORS ────────────────────────────────────────────────────────────────
  {
    id: 'colors-1',
    name: 'Color Match',
    description: 'Two beams, two targets — but only the right color lights a target.',
    rows: 6,
    cols: 6,
    grid: g(6, 6, [
      { r: 0, c: 3, piece: { type: 'SOURCE', color: 'RED', direction: 'DOWN', fixed: true } },
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 3, c: 5, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 5, c: 3, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'colors-2',
    name: 'The Prism',
    description: 'A prism splits white light into red, green, and blue. Route each color to its target.',
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
    ],
  },
  {
    id: 'colors-3',
    name: 'Color Fusion',
    description: 'Two beams meeting at the same target mix into a new color.',
    rows: 7,
    cols: 8,
    grid: g(7, 8, [
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'RED', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 4, piece: { type: 'SOURCE', color: 'GREEN', direction: 'DOWN', fixed: true } },
      { r: 6, c: 7, piece: { type: 'TARGET', color: 'YELLOW', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'colors-4',
    name: 'Filter Out',
    description: 'White light contains all colors. A color filter extracts just one.',
    rows: 4,
    cols: 7,
    grid: g(4, 7, [
      { r: 2, c: 0, piece: { type: 'SOURCE', color: 'WHITE', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 6, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 2, c: 6, piece: { type: 'MIRROR', mirror: 'FORWARD', fixed: true } },
    ]),
    hand: [
      { type: 'COLORFILTER', color: 'RED' },
    ],
  },
  {
    id: 'colors-5',
    name: 'Cyan Crossing',
    description: 'Two beams — green and blue — must meet at the same target to mix into cyan.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 6, piece: { type: 'SOURCE', color: 'BLUE', direction: 'DOWN', fixed: true } },
      { r: 6, c: 3, piece: { type: 'TARGET', color: 'CYAN', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'colors-6',
    name: 'Magenta Mix',
    description: 'Red and blue must converge at one spot. Together they make magenta.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 2, c: 0, piece: { type: 'SOURCE', color: 'RED', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 6, piece: { type: 'SOURCE', color: 'BLUE', direction: 'DOWN', fixed: true } },
      { r: 6, c: 3, piece: { type: 'TARGET', color: 'MAGENTA', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'colors-7',
    name: 'True Cyan',
    description: 'White light contains all colors — use a filter to extract just the cyan.',
    rows: 5,
    cols: 7,
    grid: g(5, 7, [
      { r: 0, c: 0, piece: { type: 'SOURCE', color: 'WHITE', direction: 'RIGHT', fixed: true } },
      { r: 4, c: 6, piece: { type: 'TARGET', color: 'CYAN', fixed: true } },
      { r: 0, c: 6, piece: { type: 'MIRROR', mirror: 'BACK', fixed: true } },
    ]),
    hand: [
      { type: 'COLORFILTER', color: 'CYAN' },
    ],
  },
  {
    id: 'colors-8',
    name: 'Prism Control',
    description: 'The prism is yours to place. Put it on the right cell to split white into three routes.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'WHITE', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 6, piece: { type: 'TARGET', color: 'RED', fixed: true } },
      { r: 3, c: 6, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 6, c: 6, piece: { type: 'TARGET', color: 'BLUE', fixed: true } },
    ]),
    hand: [
      { type: 'PRISM' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'colors-9',
    name: 'Yellow from White',
    description: 'Split white with a prism and route two of the colors together to mix yellow.',
    rows: 7,
    cols: 7,
    grid: g(7, 7, [
      { r: 0, c: 3, piece: { type: 'SOURCE', color: 'WHITE', direction: 'DOWN', fixed: true } },
      { r: 6, c: 3, piece: { type: 'TARGET', color: 'YELLOW', fixed: true } },
    ]),
    hand: [
      { type: 'PRISM' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'colors-10',
    name: 'True White',
    description: 'Three separate beams — red, green, blue — must all converge to produce white light.',
    rows: 8,
    cols: 8,
    grid: g(8, 8, [
      { r: 0, c: 0, piece: { type: 'SOURCE', color: 'RED', direction: 'RIGHT', fixed: true } },
      { r: 7, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 4, c: 7, piece: { type: 'SOURCE', color: 'BLUE', direction: 'LEFT', fixed: true } },
      { r: 4, c: 3, piece: { type: 'TARGET', color: 'WHITE', fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
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
    id: 'strategy-4',
    name: 'Three Routes',
    description: 'Three beams, three targets — each needs two bounces, and every mirror you place must not redirect the others.',
    rows: 9,
    cols: 9,
    grid: g(9, 9, [
      { r: 0, c: 0, piece: { type: 'SOURCE', color: 'RED',   direction: 'RIGHT', fixed: true } },
      { r: 0, c: 8, piece: { type: 'SOURCE', color: 'GREEN', direction: 'DOWN',  fixed: true } },
      { r: 8, c: 2, piece: { type: 'SOURCE', color: 'BLUE',  direction: 'UP',    fixed: true } },
      { r: 8, c: 8, piece: { type: 'TARGET', color: 'RED',   fixed: true } },
      { r: 8, c: 0, piece: { type: 'TARGET', color: 'GREEN', fixed: true } },
      { r: 0, c: 6, piece: { type: 'TARGET', color: 'BLUE',  fixed: true } },
    ]),
    hand: [
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'BACK' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'FORWARD' },
    ],
  },
  {
    id: 'strategy-5',
    name: 'Double Mix',
    description: 'Green must split to feed two different mixing targets. One partner comes from above, one from below — find where to branch.',
    rows: 9,
    cols: 9,
    grid: g(9, 9, [
      { r: 4, c: 0, piece: { type: 'SOURCE', color: 'GREEN', direction: 'RIGHT', fixed: true } },
      { r: 0, c: 0, piece: { type: 'SOURCE', color: 'RED',   direction: 'RIGHT', fixed: true } },
      { r: 8, c: 0, piece: { type: 'SOURCE', color: 'BLUE',  direction: 'RIGHT', fixed: true } },
      { r: 2, c: 6, piece: { type: 'TARGET', color: 'YELLOW', fixed: true } },
      { r: 8, c: 4, piece: { type: 'TARGET', color: 'CYAN',   fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'MIRROR', mirror: 'FORWARD' },
      { type: 'MIRROR', mirror: 'BACK' },
    ],
  },
  {
    id: 'strategy-6',
    name: 'White Tap',
    description: 'One WHITE beam feeds everything. A fixed filter taps CYAN from above — you supply the splitter and route the rest.',
    rows: 8,
    cols: 8,
    grid: g(8, 8, [
      { r: 3, c: 0, piece: { type: 'SOURCE', color: 'WHITE', direction: 'RIGHT', fixed: true } },
      { r: 1, c: 4, piece: { type: 'COLORFILTER', color: 'CYAN',    fixed: true } },
      { r: 0, c: 4, piece: { type: 'TARGET',      color: 'CYAN',    fixed: true } },
      { r: 3, c: 7, piece: { type: 'TARGET',      color: 'YELLOW',  fixed: true } },
      { r: 7, c: 6, piece: { type: 'TARGET',      color: 'MAGENTA', fixed: true } },
    ]),
    hand: [
      { type: 'SPLITTER' },
      { type: 'COLORFILTER', color: 'YELLOW' },
      { type: 'COLORFILTER', color: 'MAGENTA' },
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
