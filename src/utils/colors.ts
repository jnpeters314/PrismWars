import { BeamColor } from '../types/game';

export const BEAM_COLORS: Record<BeamColor, string> = {
  RED: '#FF3B30',
  GREEN: '#34C759',
  BLUE: '#007AFF',
  WHITE: '#FFFFFF',
  YELLOW: '#FFD60A',
  CYAN: '#32ADE6',
  MAGENTA: '#FF2D92',
};

export const BEAM_GLOW: Record<BeamColor, string> = {
  RED: '#FF3B3060',
  GREEN: '#34C75960',
  BLUE: '#007AFF60',
  WHITE: '#FFFFFF40',
  YELLOW: '#FFD60A60',
  CYAN: '#32ADE660',
  MAGENTA: '#FF2D9260',
};

export const PIECE_COLORS = {
  background: '#0A0A1A',
  gridLine: '#1A1A3A',
  cellBg: '#0D0D22',
  cellBgFixed: '#12123A',
  pieceBody: '#1E1E40',
  pieceFixed: '#252550',
  text: '#E0E0FF',
  textDim: '#6060A0',
  accent: '#4040FF',
  handBg: '#070714',
  solved: '#34C759',
  headerBg: '#07071A',
};
