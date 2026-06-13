import { useState, useEffect, useCallback } from 'react';

export interface ColorScheme {
  name: string;
  label: string;
  colors: {
    accentCyan: string;
    accentMagenta: string;
    accentPurple: string;
    accentGold: string;
  };
  fluidColors: string[];
}

const schemes: ColorScheme[] = [
  {
    name: 'neural',
    label: 'Neural',
    colors: {
      accentCyan: '#00f3ff',
      accentMagenta: '#ff00ff',
      accentPurple: '#8b5cf6',
      accentGold: '#ffd700',
    },
    fluidColors: ['#00f3ff', '#ff00ff', '#8b5cf6'],
  },
  {
    name: 'ember',
    label: 'Ember',
    colors: {
      accentCyan: '#ff6b35',
      accentMagenta: '#f7c59f',
      accentPurple: '#ef6461',
      accentGold: '#ffd700',
    },
    fluidColors: ['#ff6b35', '#ef6461', '#f7c59f'],
  },
  {
    name: 'forest',
    label: 'Forest',
    colors: {
      accentCyan: '#2dd4bf',
      accentMagenta: '#a78bfa',
      accentPurple: '#34d399',
      accentGold: '#fbbf24',
    },
    fluidColors: ['#2dd4bf', '#34d399', '#a78bfa'],
  },
  {
    name: 'mono',
    label: 'Mono',
    colors: {
      accentCyan: '#e2e8f0',
      accentMagenta: '#94a3b8',
      accentPurple: '#64748b',
      accentGold: '#f8fafc',
    },
    fluidColors: ['#e2e8f0', '#94a3b8', '#64748b'],
  },
];

const STORAGE_KEY = 'saino-color-scheme';

export function useColorScheme() {
  const [current, setCurrent] = useState<ColorScheme>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const found = schemes.find((s) => s.name === stored);
        if (found) return found;
      }
    } catch {}
    return schemes[0];
  });

  const setScheme = useCallback((name: string) => {
    const found = schemes.find((s) => s.name === name);
    if (found) {
      setCurrent(found);
      try { localStorage.setItem(STORAGE_KEY, name); } catch {}
    }
  }, []);

  // Apply CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    const { colors } = current;
    root.style.setProperty('--color-accent-cyan', colors.accentCyan);
    root.style.setProperty('--color-accent-magenta', colors.accentMagenta);
    root.style.setProperty('--color-accent-purple', colors.accentPurple);
    root.style.setProperty('--color-accent-gold', colors.accentGold);
  }, [current]);

  return {
    scheme: current,
    schemes,
    setScheme,
    isNeural: current.name === 'neural',
  };
}
