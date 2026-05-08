import { Grid, Piece } from '../types/game';
import { traceBeams } from './beamTracer';

export interface HintResult {
  handIndex: number;
  row: number;
  col: number;
}

function pieceKey(p: Piece): string {
  return `${p.type}|${p.color ?? ''}|${p.mirror ?? ''}`;
}

function cloneGrid(grid: Grid): Grid {
  return grid.map(row => row.map(cell => ({
    piece: cell.piece ? { ...cell.piece } : null,
  })));
}

function uniqueHandIndices(hand: Piece[]): number[] {
  const seen = new Set<string>();
  const out: number[] = [];
  for (let i = 0; i < hand.length; i++) {
    const k = pieceKey(hand[i]);
    if (!seen.has(k)) { seen.add(k); out.push(i); }
  }
  return out;
}

type Candidate = { hi: number; r: number; c: number };

function getCandidates(grid: Grid, hand: Piece[]): Candidate[] {
  const rows = grid.length;
  const cols = grid[0].length;
  const { beams } = traceBeams(grid);
  const beamSet = new Set(beams.keys());

  const onBeam: [number, number][] = [];
  const offBeam: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].piece) continue;
      (beamSet.has(`${r},${c}`) ? onBeam : offBeam).push([r, c]);
    }
  }
  const cells = [...onBeam, ...offBeam];

  const result: Candidate[] = [];
  for (const hi of uniqueHandIndices(hand)) {
    for (const [r, c] of cells) {
      result.push({ hi, r, c });
    }
  }
  return result;
}

function applyPlacement(grid: Grid, hand: Piece[], hi: number, r: number, c: number): { grid: Grid; hand: Piece[] } {
  const ng = cloneGrid(grid);
  ng[r][c] = { piece: hand[hi] };
  const nh = hand.filter((_, i) => i !== hi);
  return { grid: ng, hand: nh };
}

export function findHint(grid: Grid, hand: Piece[], targetCount: number): HintResult | null {
  if (!hand.length || !targetCount) return null;

  const { hitTargets: initialHit } = traceBeams(grid);
  const initialHits = initialHit.size;
  if (initialHits >= targetCount) return null;

  const candidates = getCandidates(grid, hand);

  // Phase 1: find any 1-step solution or best 1-step improvement
  let best1: Candidate | null = null;
  let best1hits = initialHits;

  for (const { hi, r, c } of candidates) {
    const { grid: ng } = applyPlacement(grid, hand, hi, r, c);
    const { hitTargets } = traceBeams(ng);
    const hits = hitTargets.size;

    if (hits >= targetCount) return { handIndex: hi, row: r, col: c };
    if (hits > best1hits) { best1hits = hits; best1 = { hi, r, c }; }
  }

  // Phase 2: 2-step lookahead — find a pair of placements that reaches targetCount
  for (const { hi: hi1, r: r1, c: c1 } of candidates) {
    const { grid: ng1, hand: nh1 } = applyPlacement(grid, hand, hi1, r1, c1);
    const { hitTargets: hits1 } = traceBeams(ng1);
    if (hits1.size < initialHits) continue; // prune regressions

    const cands2 = getCandidates(ng1, nh1);
    for (const { hi: hi2, r: r2, c: c2 } of cands2) {
      const { grid: ng2 } = applyPlacement(ng1, nh1, hi2, r2, c2);
      const { hitTargets: hits2 } = traceBeams(ng2);
      if (hits2.size >= targetCount) {
        return { handIndex: hi1, row: r1, col: c1 };
      }
    }
  }

  // Phase 3: 3-step lookahead for harder puzzles
  const MAX_3STEP = 2000;
  let checked = 0;
  for (const { hi: hi1, r: r1, c: c1 } of candidates) {
    const { grid: ng1, hand: nh1 } = applyPlacement(grid, hand, hi1, r1, c1);
    const { hitTargets: hits1 } = traceBeams(ng1);
    if (hits1.size < initialHits) continue;

    const cands2 = getCandidates(ng1, nh1);
    for (const { hi: hi2, r: r2, c: c2 } of cands2) {
      if (++checked > MAX_3STEP) break;
      const { grid: ng2, hand: nh2 } = applyPlacement(ng1, nh1, hi2, r2, c2);
      const { hitTargets: hits2 } = traceBeams(ng2);
      if (hits2.size < hits1.size) continue;

      const cands3 = getCandidates(ng2, nh2);
      for (const { hi: hi3, r: r3, c: c3 } of cands3) {
        const { grid: ng3 } = applyPlacement(ng2, nh2, hi3, r3, c3);
        const { hitTargets: hits3 } = traceBeams(ng3);
        if (hits3.size >= targetCount) {
          return { handIndex: hi1, row: r1, col: c1 };
        }
      }
    }
  }

  // Fall back to best single improvement found
  if (best1 && best1hits > initialHits) {
    return { handIndex: best1.hi, row: best1.r, col: best1.c };
  }
  return null;
}
