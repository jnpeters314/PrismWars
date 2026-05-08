import { Direction, BeamColor, BeamMap, BeamSegment, Grid, MirrorType } from '../types/game';

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
};

function move(row: number, col: number, dir: Direction): [number, number] {
  if (dir === 'UP') return [row - 1, col];
  if (dir === 'DOWN') return [row + 1, col];
  if (dir === 'LEFT') return [row, col - 1];
  return [row, col + 1];
}

function reflectMirror(dir: Direction, mirror: MirrorType): Direction {
  // FORWARD = /   BACK = \
  if (mirror === 'FORWARD') {
    const map: Record<Direction, Direction> = { RIGHT: 'UP', LEFT: 'DOWN', UP: 'RIGHT', DOWN: 'LEFT' };
    return map[dir];
  } else {
    const map: Record<Direction, Direction> = { RIGHT: 'DOWN', LEFT: 'UP', UP: 'LEFT', DOWN: 'RIGHT' };
    return map[dir];
  }
}

function perpendicular(dir: Direction): [Direction, Direction] {
  if (dir === 'UP' || dir === 'DOWN') return ['LEFT', 'RIGHT'];
  return ['UP', 'DOWN'];
}

function mixColors(a: BeamColor, b: BeamColor): BeamColor | null {
  const set = new Set([a, b]);
  if (set.has('RED') && set.has('GREEN') && !set.has('BLUE')) return 'YELLOW';
  if (set.has('GREEN') && set.has('BLUE') && !set.has('RED')) return 'CYAN';
  if (set.has('RED') && set.has('BLUE') && !set.has('GREEN')) return 'MAGENTA';
  if (set.has('RED') && set.has('GREEN') && set.has('BLUE')) return 'WHITE';
  return null;
}

function rotateCCW(dir: Direction): Direction {
  const map: Record<Direction, Direction> = { RIGHT: 'UP', UP: 'LEFT', LEFT: 'DOWN', DOWN: 'RIGHT' };
  return map[dir];
}

function rotateCW(dir: Direction): Direction {
  const map: Record<Direction, Direction> = { RIGHT: 'DOWN', DOWN: 'LEFT', LEFT: 'UP', UP: 'RIGHT' };
  return map[dir];
}

function colorFilterResult(beamColor: BeamColor, filterColor: BeamColor): BeamColor | null {
  // Filter only passes its own color component
  if (beamColor === filterColor) return filterColor;
  if (beamColor === 'WHITE') return filterColor;
  if (beamColor === 'YELLOW' && (filterColor === 'RED' || filterColor === 'GREEN')) return filterColor;
  if (beamColor === 'CYAN' && (filterColor === 'GREEN' || filterColor === 'BLUE')) return filterColor;
  if (beamColor === 'MAGENTA' && (filterColor === 'RED' || filterColor === 'BLUE')) return filterColor;
  return null;
}

export function traceBeams(grid: Grid): { beams: BeamMap; hitTargets: Set<string> } {
  const rows = grid.length;
  const cols = grid[0].length;
  const beams: BeamMap = new Map();
  const hitTargets = new Set<string>();

  function addSegment(row: number, col: number, seg: BeamSegment) {
    const key = `${row},${col}`;
    const existing = beams.get(key) ?? [];
    existing.push(seg);
    beams.set(key, existing);
  }

  // visited: "row,col,dir,color" to prevent infinite loops
  const visited = new Set<string>();

  function trace(row: number, col: number, fromDir: Direction, color: BeamColor) {
    const key = `${row},${col},${fromDir},${color}`;
    if (visited.has(key)) return;
    visited.add(key);

    if (row < 0 || row >= rows || col < 0 || col >= cols) return;

    const cell = grid[row][col];
    const piece = cell.piece;

    if (!piece) {
      // Empty cell: beam passes straight through
      const exitDir = OPPOSITE[fromDir]; // beam continues in its original direction
      // Wait — fromDir is where the beam came FROM, so it continues in the direction it was going
      // Let me clarify: fromDir = the direction the beam is traveling
      addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color });
      const [nr, nc] = move(row, col, fromDir);
      trace(nr, nc, fromDir, color);
      return;
    }

    switch (piece.type) {
      case 'SOURCE':
        // Sources don't block beams passing through (treat as passthrough)
        addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color });
        {
          const [nr, nc] = move(row, col, fromDir);
          trace(nr, nc, fromDir, color);
        }
        break;

      case 'BLOCKER':
        addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color });
        // absorbed — no further propagation
        break;

      case 'TARGET': {
        const targetKey = `${row},${col}`;
        if (piece.color === color || piece.color === undefined) {
          if (!hitTargets.has(targetKey)) {
            hitTargets.add(targetKey);
          }
          addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color });
        } else {
          // Wrong color — absorbed
          addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color });
        }
        break;
      }

      case 'MIRROR': {
        const mirror = piece.mirror ?? 'FORWARD';
        const newDir = reflectMirror(fromDir, mirror);
        addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: newDir, color });
        const [nr, nc] = move(row, col, newDir);
        trace(nr, nc, newDir, color);
        break;
      }

      case 'SPLITTER': {
        // Continues straight AND spawns two perpendicular beams
        addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color });
        const [nr, nc] = move(row, col, fromDir);
        trace(nr, nc, fromDir, color);

        const [p1, p2] = perpendicular(fromDir);
        addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: p1, color });
        const [r1, c1] = move(row, col, p1);
        trace(r1, c1, p1, color);

        addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: p2, color });
        const [r2, c2] = move(row, col, p2);
        trace(r2, c2, p2, color);
        break;
      }

      case 'PRISM': {
        if (color === 'WHITE') {
          // RED turns CCW (left), GREEN continues straight, BLUE turns CW (right)
          const redDir = rotateCCW(fromDir);
          const blueDir = rotateCW(fromDir);
          addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: redDir, color: 'RED' });
          const [rr, rc] = move(row, col, redDir);
          trace(rr, rc, redDir, 'RED');

          addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color: 'GREEN' });
          const [gr, gc] = move(row, col, fromDir);
          trace(gr, gc, fromDir, 'GREEN');

          addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: blueDir, color: 'BLUE' });
          const [br, bc] = move(row, col, blueDir);
          trace(br, bc, blueDir, 'BLUE');
        } else {
          // Non-white passes straight through
          addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color });
          const [nr, nc] = move(row, col, fromDir);
          trace(nr, nc, fromDir, color);
        }
        break;
      }

      case 'COLORFILTER': {
        const result = colorFilterResult(color, piece.color ?? 'RED');
        if (result) {
          addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color: result });
          const [nr, nc] = move(row, col, fromDir);
          trace(nr, nc, fromDir, result);
        } else {
          addSegment(row, col, { enterDir: OPPOSITE[fromDir], exitDir: fromDir, color });
          // absorbed
        }
        break;
      }
    }
  }

  // Start beams from all SOURCEs
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const piece = grid[r][c].piece;
      if (piece?.type === 'SOURCE' && piece.direction && piece.color) {
        addSegment(r, c, { enterDir: OPPOSITE[piece.direction], exitDir: piece.direction, color: piece.color });
        const [nr, nc] = move(r, c, piece.direction);
        trace(nr, nc, piece.direction, piece.color);
      }
    }
  }

  // Post-process: check if mixed colors at target cells satisfy the target requirement
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const piece = grid[r][c].piece;
      if (piece?.type !== 'TARGET' || !piece.color) continue;
      const key = `${r},${c}`;
      if (hitTargets.has(key)) continue;
      const segs = beams.get(key);
      if (!segs) continue;
      const colors = [...new Set(segs.map(s => s.color))];
      if (canProduceColor(colors, piece.color as BeamColor)) {
        hitTargets.add(key);
      }
    }
  }

  return { beams, hitTargets };
}

function canProduceColor(colors: BeamColor[], target: BeamColor): boolean {
  if (colors.includes(target)) return true;
  if (target === 'YELLOW') return colors.includes('RED') && colors.includes('GREEN');
  if (target === 'CYAN') return colors.includes('GREEN') && colors.includes('BLUE');
  if (target === 'MAGENTA') return colors.includes('RED') && colors.includes('BLUE');
  if (target === 'WHITE') return colors.includes('RED') && colors.includes('GREEN') && colors.includes('BLUE');
  return false;
}

export function countTargets(grid: Grid): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.piece?.type === 'TARGET') count++;
    }
  }
  return count;
}
