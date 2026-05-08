import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerProgress } from '../types/game';

const KEY = 'prism_wars_progress';

const DEFAULT: PlayerProgress = {
  completedLevels: [],
  dailyStreakDate: null,
  dailyStreakCount: 0,
  bestMoves: {},
};

export async function loadProgress(): Promise<PlayerProgress> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

export async function saveProgress(p: PlayerProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // silent fail
  }
}

export async function markLevelComplete(levelId: string, moves: number): Promise<PlayerProgress> {
  const p = await loadProgress();
  if (!p.completedLevels.includes(levelId)) {
    p.completedLevels.push(levelId);
  }
  if (!p.bestMoves[levelId] || moves < p.bestMoves[levelId]) {
    p.bestMoves[levelId] = moves;
  }
  await saveProgress(p);
  return p;
}

export async function updateDailyStreak(todayStr: string): Promise<PlayerProgress> {
  const p = await loadProgress();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split('T')[0];

  if (p.dailyStreakDate === todayStr) {
    // already played today
  } else if (p.dailyStreakDate === yStr) {
    p.dailyStreakCount += 1;
    p.dailyStreakDate = todayStr;
  } else {
    p.dailyStreakCount = 1;
    p.dailyStreakDate = todayStr;
  }
  await saveProgress(p);
  return p;
}
