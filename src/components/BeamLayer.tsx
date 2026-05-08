import React from 'react';
import Svg, { Line, Circle } from 'react-native-svg';
import { BeamMap, BeamSegment, Direction } from '../types/game';
import { BEAM_COLORS } from '../utils/colors';

interface Props {
  beams: BeamMap;
  rows: number;
  cols: number;
  cellSize: number;
}

function dirOffset(dir: Direction, half: number): [number, number] {
  if (dir === 'UP') return [0, -half];
  if (dir === 'DOWN') return [0, half];
  if (dir === 'LEFT') return [-half, 0];
  return [half, 0];
}

export default function BeamLayer({ beams, rows, cols, cellSize }: Props) {
  const half = cellSize / 2;
  const lines: React.ReactElement[] = [];
  let key = 0;

  beams.forEach((segments, cellKey) => {
    const [r, c] = cellKey.split(',').map(Number);
    const cx = c * cellSize + half;
    const cy = r * cellSize + half;

    for (const seg of segments) {
      const [x1off, y1off] = dirOffset(seg.enterDir, half);
      const [x2off, y2off] = dirOffset(seg.exitDir, half);
      const color = BEAM_COLORS[seg.color];

      // Glow line (wider, semi-transparent)
      lines.push(
        <Line
          key={`glow-${key}`}
          x1={cx + x1off} y1={cy + y1off}
          x2={cx + x2off} y2={cy + y2off}
          stroke={color}
          strokeWidth={8}
          strokeOpacity={0.2}
          strokeLinecap="round"
        />
      );
      // Core line
      lines.push(
        <Line
          key={`beam-${key}`}
          x1={cx + x1off} y1={cy + y1off}
          x2={cx + x2off} y2={cy + y2off}
          stroke={color}
          strokeWidth={3}
          strokeOpacity={0.9}
          strokeLinecap="round"
        />
      );
      key++;
    }
  });

  const width = cols * cellSize;
  const height = rows * cellSize;

  return (
    <Svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
      pointerEvents="none"
    >
      {lines}
    </Svg>
  );
}
