import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Piece } from '../types/game';
import { BEAM_COLORS, PIECE_COLORS } from '../utils/colors';

interface Props {
  hand: Piece[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

function pieceLabel(piece: Piece): string {
  switch (piece.type) {
    case 'MIRROR': return piece.mirror === 'FORWARD' ? '╱' : '╲';
    case 'SPLITTER': return '✦';
    case 'PRISM': return '△';
    case 'BLOCKER': return '■';
    case 'COLORFILTER': return '▣';
    default: return '?';
  }
}

function pieceColor(piece: Piece): string {
  if (piece.type === 'COLORFILTER' && piece.color) return BEAM_COLORS[piece.color];
  return PIECE_COLORS.text;
}

function pieceName(piece: Piece): string {
  switch (piece.type) {
    case 'MIRROR': return piece.mirror === 'FORWARD' ? 'Mirror ╱' : 'Mirror ╲';
    case 'SPLITTER': return 'Splitter';
    case 'PRISM': return 'Prism';
    case 'BLOCKER': return 'Blocker';
    case 'COLORFILTER': return `Filter`;
    default: return piece.type;
  }
}

export default function PieceHand({ hand, selectedIndex, onSelect }: Props) {
  if (hand.length === 0) {
    return (
      <View style={styles.emptyHand}>
        <Text style={styles.emptyText}>No pieces left</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>HAND</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {hand.map((piece, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.piece,
              selectedIndex === i && styles.pieceSelected,
            ]}
            onPress={() => onSelect(i)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pieceIcon, { color: pieceColor(piece) }]}>
              {pieceLabel(piece)}
            </Text>
            <Text style={styles.pieceName}>{pieceName(piece)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: PIECE_COLORS.handBg,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: PIECE_COLORS.gridLine,
  },
  label: {
    color: PIECE_COLORS.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  piece: {
    width: 64,
    height: 64,
    backgroundColor: PIECE_COLORS.pieceBody,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PIECE_COLORS.gridLine,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pieceSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#252550',
  },
  pieceIcon: {
    fontSize: 22,
    fontWeight: '600',
  },
  pieceName: {
    color: PIECE_COLORS.textDim,
    fontSize: 9,
    textAlign: 'center',
  },
  emptyHand: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PIECE_COLORS.handBg,
    borderTopWidth: 1,
    borderTopColor: PIECE_COLORS.gridLine,
  },
  emptyText: {
    color: PIECE_COLORS.textDim,
    fontSize: 13,
  },
});
