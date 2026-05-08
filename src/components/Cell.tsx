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
  if (piece?.type === 'TARGET' && piece.color) {
    const c = BEAM_COLORS[piece.color];
    pieceColor = isHit ? c : `${c}70`;
  }
  if (piece?.type === 'COLORFILTER' && piece.color) pieceColor = BEAM_COLORS[piece.color];

  const targetColor = piece?.type === 'TARGET' && piece.color ? BEAM_COLORS[piece.color] : null;

  const borderColor = isHint
    ? HINT_COLOR
    : isSelected
    ? '#FFFFFF'
    : targetColor
    ? (isHit ? targetColor : `${targetColor}45`)
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
      {piece?.type === 'TARGET' && targetColor && (
        <View
          style={[
            styles.targetDot,
            {
              width: size * 0.42,
              height: size * 0.42,
              borderRadius: size * 0.21,
              backgroundColor: isHit ? `${targetColor}50` : `${targetColor}28`,
              borderWidth: isHit ? 2 : 1.5,
              borderColor: isHit ? targetColor : `${targetColor}70`,
            },
          ]}
        />
      )}
      {piece && (
        <Text style={[styles.pieceText, { color: pieceColor, fontSize: size * 0.38 }]}>
          {pieceLabel(piece)}
        </Text>
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
  targetDot: {
    position: 'absolute',
  },
});
