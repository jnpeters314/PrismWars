import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Grid, BeamMap, Piece } from '../types/game';
import Cell from './Cell';
import BeamLayer from './BeamLayer';

interface Props {
  grid: Grid;
  beams: BeamMap;
  hitTargets: Set<string>;
  cellSize: number;
  selectedHandPiece: Piece | null;
  hintCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
}

export default function GameBoard({
  grid,
  beams,
  hitTargets,
  cellSize,
  hintCell,
  onCellPress,
}: Props) {
  const rows = grid.length;
  const cols = grid[0].length;

  return (
    <View style={{ position: 'relative' }}>
      <View style={styles.grid}>
        {grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((cell, c) => {
              const cellKey = `${r},${c}`;
              const isHit = hitTargets.has(cellKey);
              const isHint = hintCell?.row === r && hintCell?.col === c;
              return (
                <Cell
                  key={c}
                  piece={cell.piece}
                  size={cellSize}
                  onPress={() => onCellPress(r, c)}
                  isHit={isHit}
                  isHint={isHint}
                />
              );
            })}
          </View>
        ))}
      </View>
      <BeamLayer beams={beams} rows={rows} cols={cols} cellSize={cellSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
});
