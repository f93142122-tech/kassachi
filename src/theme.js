// Yorug' / qorong'i rejim. Tanlov brauzerda saqlanadi.
// 'system' — Telegram (yoki qurilma) mavzusiga moslashadi.
import { inTelegram, tg } from './api.js';

const KEY = 'kassachi.theme';
export const THEMES = ['system', 'light', 'dark'];

export function getThemePref() {
  try {
    const v = localStorage.getItem(KEY);
    return THEMES.includes(v) ? v : 'system';
  } catch (e) {
    return 'system';
  }
}

// Hozir amalda qaysi rejim ko'rinyapti
export function resolvedTheme(pref) {
  if (pref === 'light' || pref === 'dark') return pref;
  if (inTelegram && tg.colorScheme) return tg.colorScheme;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(pref = getThemePref()) {
  const root = document.documentElement;
  if (pref === 'system' && !inTelegram) root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', resolvedTheme(pref));
  // Telegram sarlavha va fon rangini sahifaga moslash
  if (inTelegram) {
    try {
      const bg = getComputedStyle(document.body).getPropertyValue('background-color');
      if (tg.setHeaderColor) tg.setHeaderColor(bg);
      if (tg.setBackgroundColor) tg.setBackgroundColor(bg);
    } catch (e) { /* eski versiyalar */ }
  }
}

export function saveThemePref(pref) {
  try { localStorage.setItem(KEY, pref); } catch (e) { /* xotira yopiq */ }
  applyTheme(pref);
}
