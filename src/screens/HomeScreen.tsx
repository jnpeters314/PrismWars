import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { PlayerProgress } from '../types/game';
import { loadProgress } from '../utils/storage';
import { PIECE_COLORS, BEAM_COLORS } from '../utils/colors';
import { LEVELS } from '../data/levels';

interface Props {
  onStartCampaign: () => void;
  onStartDaily: () => void;
  onStartMultiplayer: () => void;
}

export default function HomeScreen({ onStartCampaign, onStartDaily, onStartMultiplayer }: Props) {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const completedCount = progress?.completedLevels.length ?? 0;
  const totalLevels = LEVELS.length;
  const streak = progress?.dailyStreakCount ?? 0;
  const dailyDone = progress?.dailyStreakDate === today;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleTop}>PRISM</Text>
          <Text style={styles.titleBottom}>WARS</Text>
          <Text style={styles.subtitle}>Route the light. Hit every target.</Text>
        </View>

        <View style={styles.stats}>
          <StatPill label="LEVELS" value={`${completedCount}/${totalLevels}`} color={BEAM_COLORS.GREEN} />
          <StatPill label="STREAK" value={`${streak}🔥`} color={BEAM_COLORS.YELLOW} />
        </View>

        <View style={styles.menu}>
          <MenuButton
            label="Campaign"
            sub={`${completedCount} of ${totalLevels} solved`}
            color={BEAM_COLORS.BLUE}
            onPress={onStartCampaign}
          />
          <MenuButton
            label={dailyDone ? 'Daily ✓' : 'Daily Challenge'}
            sub={dailyDone ? 'Completed today!' : `Streak: ${streak} days`}
            color={dailyDone ? BEAM_COLORS.GREEN : BEAM_COLORS.YELLOW}
            onPress={onStartDaily}
          />
          <MenuButton
            label="Pass & Play"
            sub="2 players, local"
            color={BEAM_COLORS.MAGENTA}
            onPress={onStartMultiplayer}
          />
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendTitle}>PIECES</Text>
          <View style={styles.legendRow}>
            <LegendItem icon="╱" label="Mirror ╱" />
            <LegendItem icon="╲" label="Mirror ╲" />
            <LegendItem icon="✦" label="Splitter" />
            <LegendItem icon="△" label="Prism" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.statPill, { borderColor: color + '40' }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function MenuButton({ label, sub, color, onPress }: {
  label: string; sub: string; color: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuBtn, { borderColor: color + '60' }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.menuAccent, { backgroundColor: color }]} />
      <View style={styles.menuText}>
        <Text style={styles.menuLabel}>{label}</Text>
        <Text style={styles.menuSub}>{sub}</Text>
      </View>
      <Text style={[styles.menuArrow, { color }]}>›</Text>
    </TouchableOpacity>
  );
}

function LegendItem({ icon, label }: { icon: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <Text style={styles.legendIcon}>{icon}</Text>
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PIECE_COLORS.background },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', paddingTop: 32, paddingBottom: 20 },
  titleTop: {
    fontSize: 48, fontWeight: '900', color: BEAM_COLORS.WHITE,
    letterSpacing: 12, lineHeight: 52,
  },
  titleBottom: {
    fontSize: 48, fontWeight: '900',
    color: BEAM_COLORS.CYAN, letterSpacing: 12, lineHeight: 52,
  },
  subtitle: { color: PIECE_COLORS.textDim, fontSize: 13, marginTop: 8, letterSpacing: 1 },
  stats: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 28 },
  statPill: {
    borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 10,
    alignItems: 'center', minWidth: 90,
  },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { color: PIECE_COLORS.textDim, fontSize: 10, letterSpacing: 1, marginTop: 2 },
  menu: { gap: 10 },
  menuBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: PIECE_COLORS.cellBg,
    borderWidth: 1, borderRadius: 12,
    paddingVertical: 16, paddingHorizontal: 4,
    overflow: 'hidden',
  },
  menuAccent: { width: 4, height: '100%', borderRadius: 2, marginRight: 16 },
  menuText: { flex: 1 },
  menuLabel: { color: PIECE_COLORS.text, fontSize: 17, fontWeight: '600' },
  menuSub: { color: PIECE_COLORS.textDim, fontSize: 12, marginTop: 2 },
  menuArrow: { fontSize: 28, fontWeight: '300', marginRight: 16 },
  legend: { marginTop: 28 },
  legendTitle: {
    color: PIECE_COLORS.textDim, fontSize: 10,
    letterSpacing: 2, fontWeight: '700', marginBottom: 10,
  },
  legendRow: { flexDirection: 'row', gap: 12 },
  legendItem: { alignItems: 'center', flex: 1 },
  legendIcon: { color: PIECE_COLORS.text, fontSize: 20 },
  legendLabel: { color: PIECE_COLORS.textDim, fontSize: 10, marginTop: 4, textAlign: 'center' },
});
