import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Piece } from '../types/game';
import { BEAM_COLORS, PIECE_COLORS } from '../utils/colors';

interface Props {
  piece: Piece | null;
  size: number;
  onPress: () => void;
  isSelected?: boolean;
  isHit?: boolean;
  isHint?: boolean;
}

function pieceLabel(piece: Piece): string {
  switch (piece.type) {
    case 'SOURCE': return dirArrow(piece.direction ?? 'RIGHT');
    case 'TARGET': return '◎';
    case 'MIRROR': return piece.mirror === 'FORWARD' ? '╱' : '╲';
    case 'SPLITTER': return '✦';
    case 'PRISM': return '△';
    case 'BLOCKER': return '■';
    case 'COLORFILTER': return '▣';
    default: return '?';
  }
}

function dirArrow(dir: string): string {
  if (dir === 'UP') return '↑';
  if (dir === 'DOWN') return '↓';
  if (dir === 'LEFT') return '←';
  return '→';
}

const HINT_COLOR = '#BF5AF2'; // purple hint highlight

export default function Cell({ piece, size, onPress, isSelected, isHit, isHint }: Props) {
  const isFixed = piece?.fixed;

  let bgColor = PIECE_COLORS.cellBg;
  if (isFixed) bgColor = PIECE_COLORS.cellBgFixed;

  let pieceColor = PIECE_COLORS.text;
  if (piece?.type === 'SOURCE' && piece.color) pieceColor = BEAM_COLORS[piece.color];
  if (piece?.type === 'TARGET' && piece.color) pieceColor = isHit ? BEAM_COLORS[piece.color] : PIECE_COLORS.textDim;
  if (piece?.type === 'COLORFILTER' && piece.color) pieceColor = BEAM_COLORS[piece.color];

  const borderColor = isHint
    ? HINT_COLOR
    : isSelected
    ? '#FFFFFF'
    : piece?.type === 'TARGET' && isHit
    ? (piece.color ? BEAM_COLORS[piece.color] : PIECE_COLORS.solved)
    : PIECE_COLORS.gridLine;

  const borderWidth = isSelected || isHint ? 2 : 1;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isFixed ? 1 : 0.7}
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor: bgColor,
          borderColor,
          borderWidth,
        },
      ]}
    >
      {isHint && (
        <View
          style={[
            styles.overlay,
            { width: size, height: size, backgroundColor: `${HINT_COLOR}18` },
          ]}
        />
      )}
      {piece && (
        <Text style={[styles.pieceText, { color: pieceColor, fontSize: size * 0.4 }]}>
          {pieceLabel(piece)}
        </Text>
      )}
      {piece?.type === 'TARGET' && isHit && (
        <View
          style={[
            styles.glow,
            {
              width: size * 0.7,
              height: size * 0.7,
              borderRadius: size * 0.35,
              backgroundColor: piece.color ? `${BEAM_COLORS[piece.color]}30` : '#ffffff20',
            },
          ]}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pieceText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
  },
  glow: {
    position: 'absolute',
  },
});
