import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  useWindowDimensions, SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { Level, Grid, Piece } from '../types/game';
import { traceBeams, countTargets } from '../logic/beamTracer';
import { findHint } from '../logic/solver';
import GameBoard from '../components/GameBoard';
import PieceHand from '../components/PieceHand';
import { PIECE_COLORS, BEAM_COLORS } from '../utils/colors';
import { markLevelComplete, updateDailyStreak } from '../utils/storage';

interface Props {
  level: Level;
  isDaily: boolean;
  onBack: () => void;
  onNextLevel: (() => void) | null;
}

function deepCopyGrid(grid: Grid): Grid {
  return grid.map(row => row.map(cell => ({
    piece: cell.piece ? { ...cell.piece } : null,
  })));
}

export default function GameScreen({ level, isDaily, onBack, onNextLevel }: Props) {
  const { width: screenWidth } = useWindowDimensions();

  const cellSize = useMemo(
    () => Math.min(Math.floor((screenWidth - 32) / level.cols), 64),
    [screenWidth, level.cols],
  );

  const targetCount = useMemo(() => countTargets(level.grid), [level.grid]);

  const [grid, setGrid] = useState<Grid>(() => deepCopyGrid(level.grid));
  const [hand, setHand] = useState<Piece[]>(() => [...level.hand]);
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [showVictory, setShowVictory] = useState(false);
  const [hintCell, setHintCell] = useState<{ row: number; col: number } | null>(null);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, []);

  const { beams, hitTargets } = useMemo(() => traceBeams(grid), [grid]);

  const clearHint = useCallback(() => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    setHintCell(null);
    setHintMessage(null);
  }, []);

  const handleReset = useCallback(() => {
    clearHint();
    setGrid(deepCopyGrid(level.grid));
    setHand([...level.hand]);
    setSelectedHandIndex(null);
    setMoves(0);
    setShowVictory(false);
  }, [level, clearHint]);

  const handleCellPress = useCallback((r: number, c: number) => {
    clearHint();

    const cell = grid[r][c];
    const piece = cell.piece;

    if (piece?.fixed) return;

    const newGrid = deepCopyGrid(grid);
    const newHand = [...hand];
    let placed = false;

    if (selectedHandIndex !== null) {
      const placing = newHand[selectedHandIndex];
      if (piece) {
        newHand[selectedHandIndex] = piece;
      } else {
        newHand.splice(selectedHandIndex, 1);
      }
      newGrid[r][c] = { piece: placing };
      placed = true;
      setSelectedHandIndex(null);
    } else if (piece) {
      newHand.push(piece);
      newGrid[r][c] = { piece: null };
    } else {
      return;
    }

    setGrid(newGrid);
    setHand(newHand);
    if (placed) setMoves(m => m + 1);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (placed) {
      const { hitTargets: newHit } = traceBeams(newGrid);
      if (newHit.size === targetCount && targetCount > 0) {
        const finalMoves = moves + 1;
        setShowVictory(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        markLevelComplete(level.id, finalMoves);
        if (isDaily) {
          updateDailyStreak(new Date().toISOString().split('T')[0]);
        }
      }
    }
  }, [grid, hand, selectedHandIndex, moves, targetCount, level.id, isDaily, clearHint]);

  const handleHandSelect = useCallback((i: number) => {
    clearHint();
    setSelectedHandIndex(prev => prev === i ? null : i);
  }, [clearHint]);

  const handleHint = useCallback(() => {
    if (showVictory) return;
    clearHint();

    const result = findHint(grid, hand, targetCount);
    if (result) {
      setSelectedHandIndex(result.handIndex);
      setHintCell({ row: result.row, col: result.col });
      setHintMessage(`Place the highlighted piece on the glowing cell`);
      hintTimerRef.current = setTimeout(clearHint, 6000);
    } else {
      setHintMessage('No hint found — try rearranging pieces');
      hintTimerRef.current = setTimeout(() => setHintMessage(null), 3000);
    }
  }, [showVictory, grid, hand, targetCount, clearHint]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.levelName} numberOfLines={1}>{level.name}</Text>
          <Text style={styles.levelDesc} numberOfLines={1}>{level.description}</Text>
        </View>
        <TouchableOpacity onPress={handleReset} style={styles.headerBtn}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {hitTargets.size}/{targetCount} targets · {moves} move{moves !== 1 ? 's' : ''}
        </Text>
        <TouchableOpacity
          onPress={handleHint}
          disabled={showVictory}
          style={styles.hintBtn}
        >
          <Text style={[styles.hintBtnText, showVictory && styles.hintBtnDim]}>
            Hint ?
          </Text>
        </TouchableOpacity>
      </View>

      {hintMessage != null && (
        <View style={styles.hintBanner}>
          <Text style={styles.hintBannerText}>{hintMessage}</Text>
        </View>
      )}

      <View style={styles.boardArea}>
        <GameBoard
          grid={grid}
          beams={beams}
          hitTargets={hitTargets}
          cellSize={cellSize}
          selectedHandPiece={selectedHandIndex !== null ? hand[selectedHandIndex] : null}
          hintCell={hintCell}
          onCellPress={handleCellPress}
        />
      </View>

      <PieceHand
        hand={hand}
        selectedIndex={selectedHandIndex}
        onSelect={handleHandSelect}
      />

      <Modal visible={showVictory} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.victoryCard}>
            <Text style={styles.victoryIcon}>✦</Text>
            <Text style={styles.victoryTitle}>Solved!</Text>
            <Text style={styles.victoryMoves}>
              {moves} move{moves !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.victoryTargets}>
              {hitTargets.size}/{targetCount} targets
            </Text>
            <View style={styles.victoryBtns}>
              {onNextLevel && (
                <TouchableOpacity style={[styles.victoryBtn, styles.nextBtn]} onPress={onNextLevel}>
                  <Text style={styles.nextBtnText}>Next Level →</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.victoryBtn} onPress={onBack}>
                <Text style={styles.victoryBtnText}>Back to Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: PIECE_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: PIECE_COLORS.gridLine,
  },
  headerBtn: {
    width: 60,
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  backText: {
    color: BEAM_COLORS.CYAN,
    fontSize: 30,
    lineHeight: 34,
  },
  levelName: {
    color: PIECE_COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  levelDesc: {
    color: PIECE_COLORS.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  resetText: {
    color: BEAM_COLORS.YELLOW,
    fontSize: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: PIECE_COLORS.gridLine,
  },
  progressText: {
    flex: 1,
    color: PIECE_COLORS.textDim,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  hintBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BF5AF260',
  },
  hintBtnText: {
    color: '#BF5AF2',
    fontSize: 13,
    fontWeight: '600',
  },
  hintBtnDim: {
    opacity: 0.4,
  },
  hintBanner: {
    backgroundColor: '#BF5AF222',
    borderBottomWidth: 1,
    borderBottomColor: '#BF5AF240',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  hintBannerText: {
    color: '#BF5AF2',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  boardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000090',
    alignItems: 'center',
    justifyContent: 'center',
  },
  victoryCard: {
    backgroundColor: PIECE_COLORS.cellBgFixed,
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BEAM_COLORS.CYAN + '60',
    minWidth: 280,
  },
  victoryIcon: {
    fontSize: 44,
    color: BEAM_COLORS.YELLOW,
    marginBottom: 8,
  },
  victoryTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: PIECE_COLORS.text,
    letterSpacing: 2,
  },
  victoryMoves: {
    fontSize: 20,
    color: BEAM_COLORS.CYAN,
    marginTop: 8,
  },
  victoryTargets: {
    fontSize: 13,
    color: PIECE_COLORS.textDim,
    marginTop: 4,
    marginBottom: 28,
  },
  victoryBtns: {
    gap: 10,
    width: '100%',
  },
  victoryBtn: {
    backgroundColor: PIECE_COLORS.cellBg,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PIECE_COLORS.gridLine,
  },
  nextBtn: {
    borderColor: BEAM_COLORS.CYAN + '80',
    backgroundColor: BEAM_COLORS.CYAN + '15',
  },
  nextBtnText: {
    color: BEAM_COLORS.CYAN,
    fontSize: 16,
    fontWeight: '600',
  },
  victoryBtnText: {
    color: PIECE_COLORS.text,
    fontSize: 16,
  },
});
