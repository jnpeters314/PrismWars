export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type BeamColor = 'RED' | 'GREEN' | 'BLUE' | 'WHITE' | 'YELLOW' | 'CYAN' | 'MAGENTA';

export type MirrorType = 'FORWARD' | 'BACK'; // / and \

export type PieceType =
  | 'SOURCE'
  | 'TARGET'
  | 'MIRROR'
  | 'SPLITTER'   // splits beam into two perpendicular
  | 'PRISM'      // splits WHITE into RGB
  | 'BLOCKER'
  | 'COLORFILTER';

export interface Piece {
  type: PieceType;
  color?: BeamColor;           // for SOURCE, TARGET, COLORFILTER
  direction?: Direction;       // for SOURCE: emit direction
  mirror?: MirrorType;         // for MIRROR
  fixed?: boolean;             // pre-placed, cannot be moved
}

export interface Cell {
  piece: Piece | null;
}

export type Grid = Cell[][];

// A beam segment tracks which beams travel through a cell
export interface BeamSegment {
  enterDir: Direction;
  exitDir: Direction;
  color: BeamColor;
}

export type BeamMap = Map<string, BeamSegment[]>; // key: "row,col"

export interface PuzzleState {
  grid: Grid;
  hand: Piece[];               // pieces the player can place
  beams: BeamMap;
  solved: boolean;
  moves: number;
  targetCount: number;
  targetsHit: number;
}

export interface Level {
  id: string;
  name: string;
  description: string;
  rows: number;
  cols: number;
  grid: Grid;
  hand: Piece[];
}

export interface PlayerProgress {
  completedLevels: string[];
  dailyStreakDate: string | null;
  dailyStreakCount: number;
  bestMoves: Record<string, number>;
}
