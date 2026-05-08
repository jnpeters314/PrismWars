import React, { useState, useEffect, useCallback } from 'react';
import { Level, PlayerProgress } from './src/types/game';
import { loadProgress } from './src/utils/storage';
import { LEVELS, getDailyPuzzle } from './src/data/levels';
import HomeScreen from './src/screens/HomeScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import GameScreen from './src/screens/GameScreen';

type Screen = 'home' | 'campaign' | 'play';

const DEFAULT_PROGRESS: PlayerProgress = {
  completedLevels: [],
  dailyStreakDate: null,
  dailyStreakCount: 0,
  bestMoves: {},
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [playSource, setPlaySource] = useState<'campaign' | 'daily'>('campaign');
  const [progress, setProgress] = useState<PlayerProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const refreshProgress = useCallback(() => {
    loadProgress().then(setProgress);
  }, []);

  const handleStartCampaign = useCallback(() => {
    setScreen('campaign');
  }, []);

  const handleStartDaily = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentLevel(getDailyPuzzle(today));
    setPlaySource('daily');
    setScreen('play');
  }, []);

  const handleStartMultiplayer = useCallback(() => {
    // Pass & Play: placeholder — navigates to campaign for now
    setScreen('campaign');
  }, []);

  const handleSelectLevel = useCallback((levelId: string) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (level) {
      setCurrentLevel(level);
      setPlaySource('campaign');
      setScreen('play');
    }
  }, []);

  const handleBackFromPlay = useCallback(() => {
    refreshProgress();
    setScreen(playSource === 'campaign' ? 'campaign' : 'home');
  }, [playSource, refreshProgress]);

  const handleNextLevel = useCallback(() => {
    if (!currentLevel) return;
    const idx = LEVELS.findIndex(l => l.id === currentLevel.id);
    if (idx >= 0 && idx < LEVELS.length - 1) {
      setCurrentLevel(LEVELS[idx + 1]);
    } else {
      refreshProgress();
      setScreen('campaign');
    }
  }, [currentLevel, refreshProgress]);

  if (screen === 'campaign') {
    return (
      <LevelSelectScreen
        progress={progress}
        onSelectLevel={handleSelectLevel}
        onBack={() => { refreshProgress(); setScreen('home'); }}
      />
    );
  }

  if (screen === 'play' && currentLevel) {
    const isDaily = playSource === 'daily';
    const idx = isDaily ? -1 : LEVELS.findIndex(l => l.id === currentLevel.id);
    const hasNext = !isDaily && idx >= 0 && idx < LEVELS.length - 1;
    return (
      <GameScreen
        key={currentLevel.id}
        level={currentLevel}
        isDaily={isDaily}
        onBack={handleBackFromPlay}
        onNextLevel={hasNext ? handleNextLevel : null}
      />
    );
  }

  return (
    <HomeScreen
      onStartCampaign={handleStartCampaign}
      onStartDaily={handleStartDaily}
      onStartMultiplayer={handleStartMultiplayer}
    />
  );
}
