/**
 * Gamification utilities — streak, XP, levels, greeting
 */

import { ls } from "./lsEngine";

const STREAK_KEY = "rs_streak4";

const DEFAULT_STREAK = {
  last: "",
  count: 0,
  xp: 0,
  totalQuizCorrect: 0,
  aiGenCount: 0,
  tabsVisited: [],
  achievementsUnlocked: [],
  lastQuizDate: "",
};

export function getStreak() {
  const data = ls.get(STREAK_KEY, { ...DEFAULT_STREAK });
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (data.last === today) return data;
  if (data.last === yesterday) { data.count++; data.xp += 10; } else { data.count = 1; data.xp += 5; }
  data.last = today;
  ls.set(STREAK_KEY, data);
  return data;
}

export function saveStreak(data) {
  ls.set(STREAK_KEY, data);
}

export function addXP(amount, data) {
  const d = { ...data, xp: data.xp + amount };
  saveStreak(d);
  return d;
}

export function getLevel(xp) {
  return Math.max(1, Math.floor(Math.sqrt(xp / 50)));
}

export function getLevelXP(level) {
  return level * level * 50;
}

export function getLevelProgress(xp) {
  const level = getLevel(xp);
  const curr = getLevelXP(level);
  const next = getLevelXP(level + 1);
  return (xp - curr) / (next - curr);
}

/**
 * Get localized time-of-day greeting
 */
export function getGreeting(lang) {
  const h = new Date().getHours();
  const map = {
    ru: [" Доброй ночи", " Доброе утро", " Добрый день", " Добрый вечер"],
    en: [" Good night", " Good morning", " Good afternoon", " Good evening"],
    ua: [" Доброї ночі", " Доброго ранку", " Добрий день", " Добрий вечір"],
    kz: [" Жақсы түн", " Қайырлы таң", " Жақсы күн", " Жақсы кеш"],
    by: [" Добрай ночы", " Добрай раніцы", " Добры дзень", " Добры вечар"],
  };
  return (map[lang] || map.ru)[h < 6 ? 0 : h < 12 ? 1 : h < 18 ? 2 : 3];
}
