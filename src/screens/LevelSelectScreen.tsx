import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { LEVELS } from '../data/levels';
import { PlayerProgress } from '../types/game';
import { PIECE_COLORS, BEAM_COLORS } from '../utils/colors';

interface Props {
  progress: PlayerProgress;
  onSelectLevel: (levelId: string) => void;
  onBack: () => void;
}

const GROUPS = [
  { prefix: 'tutorial', label: 'Tutorial', color: BEAM_COLORS.GREEN },
  { prefix: 'colors', label: 'Colors', color: BEAM_COLORS.CYAN },
  { prefix: 'strategy', label: 'Strategy', color: BEAM_COLORS.BLUE },
  { prefix: 'master', label: 'Master', color: BEAM_COLORS.MAGENTA },
];

export default function LevelSelectScreen({ progress, onSelectLevel, onBack }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.back}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Campaign</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {GROUPS.map(group => {
          const levels = LEVELS.filter(l => l.id.startsWith(group.prefix));
          return (
            <View key={group.prefix} style={styles.group}>
              <Text style={[styles.groupLabel, { color: group.color }]}>{group.label}</Text>
              <View style={styles.levelGrid}>
                {levels.map((level, i) => {
                  const done = progress.completedLevels.includes(level.id);
                  const best = progress.bestMoves[level.id];
                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.levelBtn,
                        { borderColor: done ? group.color + '80' : PIECE_COLORS.gridLine },
                        done && { backgroundColor: group.color + '15' },
                      ]}
                      onPress={() => onSelectLevel(level.id)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.levelNum, { color: done ? group.color : PIECE_COLORS.textDim }]}>
                        {i + 1}
                      </Text>
                      <Text style={styles.levelName} numberOfLines={1}>{level.name}</Text>
                      {done && best && (
                        <Text style={[styles.levelBest, { color: group.color }]}>{best} moves</Text>
                      )}
                      {done && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PIECE_COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: PIECE_COLORS.gridLine,
  },
  back: { width: 60 },
  backText: { color: BEAM_COLORS.CYAN, fontSize: 17 },
  title: { color: PIECE_COLORS.text, fontSize: 17, fontWeight: '600' },
  scroll: { padding: 16 },
  group: { marginBottom: 24 },
  groupLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 10 },
  levelGrid: { gap: 8 },
  levelBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: PIECE_COLORS.cellBg,
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  levelNum: { fontSize: 18, fontWeight: '700', width: 28 },
  levelName: { flex: 1, color: PIECE_COLORS.text, fontSize: 15, fontWeight: '500' },
  levelBest: { fontSize: 11, marginRight: 8 },
  checkmark: { color: BEAM_COLORS.GREEN, fontSize: 16, fontWeight: '700' },
});
