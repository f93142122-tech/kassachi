// Backend bilan aloqa va Telegram WebApp yordamchilari
const CFG = window.KASSACHI_CONFIG || {};
export const API = String(CFG.API_URL || import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const DEV_USER = CFG.DEV_USER || import.meta.env.VITE_DEV_USER || null;
export const tg = window.Telegram && window.Telegram.WebApp;
export const inTelegram = !!(tg && tg.initData);

export async function api(path, { method = 'GET', body } = {}) {
  const headers = {};
  if (body !== undefined) headers['content-type'] = 'application/json';
  if (inTelegram) headers.Authorization = 'tma ' + tg.initData;
  else if (DEV_USER) headers['x-dev-user'] = String(DEV_USER);
  let r;
  try {
    r = await fetch(API + path, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch (e) {
    throw new Error('Server bilan aloqa yo‘q. Internetni tekshiring yoki birozdan keyin urinib ko‘ring.');
  }
  let j = null;
  try { j = await r.json(); } catch (e) { /* bo'sh javob */ }
  if (!r.ok) throw new Error((j && j.error) || `Xatolik yuz berdi (${r.status})`);
  return j;
}

export const mediaURL = p => (p ? (p.startsWith('http') || p.startsWith('data:') ? p : API + p) : null);

export function haptic(kind) {
  try {
    if (!tg || !tg.HapticFeedback) return;
    if (kind === 'ok') tg.HapticFeedback.notificationOccurred('success');
    else if (kind === 'error') tg.HapticFeedback.notificationOccurred('error');
    else tg.HapticFeedback.impactOccurred('light');
  } catch (e) { /* eski Telegram versiyalari */ }
}
