export const PERIOD = { weekly: 'Haftalik', monthly: 'Oylik' };
export const METHOD = { lottery: 'Qur’a', manual: 'Qo‘lda', random: 'Tasodifiy tanlash' };
export const BRAND = { uzcard: 'UZCARD', humo: 'HUMO', visa: 'VISA' };
const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

export const num = n => String(Math.abs(Math.round(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
export const money = n => (n < 0 ? '−' : '') + num(n) + ' so‘m';
export const pad2 = n => String(n).padStart(2, '0');
export const isoOf = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const todayISO = () => isoOf(new Date());
const parseISO = s => new Date(String(s).slice(0, 10) + 'T00:00:00');
export const fmtDate = s => { const d = parseISO(s); return `${d.getDate()}-${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
export const fmtDateShort = s => { const d = parseISO(s); return `${d.getDate()}-${MONTHS[d.getMonth()]}`; };
const tsOf = t => (typeof t === 'number' ? t : new Date(t).getTime());
export const fmtTime = t => { const d = new Date(tsOf(t)); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
export const daysUntil = s => Math.round((parseISO(s) - parseISO(todayISO())) / 864e5);
export function relTime(t) {
  const s = (Date.now() - tsOf(t)) / 1000;
  if (s < 60) return 'hozirgina';
  if (s < 3600) return Math.floor(s / 60) + ' daqiqa oldin';
  if (s < 86400) return Math.floor(s / 3600) + ' soat oldin';
  const d = new Date(tsOf(t));
  return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${fmtTime(t)}`;
}
export function dayLabel(t) {
  const d = new Date(tsOf(t));
  const k = x => x.toDateString();
  if (k(d) === k(new Date())) return 'Bugun';
  if (k(d) === k(new Date(Date.now() - 864e5))) return 'Kecha';
  return `${d.getDate()}-${MONTHS[d.getMonth()]}`;
}
export function addPeriod(iso, period, n) {
  const d = parseISO(iso);
  if (period === 'weekly') d.setDate(d.getDate() + 7 * n);
  else {
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + n);
    const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, last));
  }
  return isoOf(d);
}
export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
export const sleep = ms => new Promise(r => setTimeout(r, ms));

/* --- Telefon va karta formatlari */
export const fmtPhone9 = d => [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
export const fmtPhone = p => { if (!p) return 'Raqam ko‘rsatilmagan'; const d = String(p).replace(/\D/g, '').replace(/^998/, ''); return '+998 ' + fmtPhone9(d); };
export const phoneDigits = v => { let d = String(v || '').replace(/\D/g, ''); if (d.startsWith('998') && d.length === 12) d = d.slice(3); return d; };
export const phoneInput = v => { let d = String(v).replace(/\D/g, ''); if (d.startsWith('998') && d.length > 9) d = d.slice(3); return fmtPhone9(d.slice(0, 9)); };
export const cardInput = v => String(v).replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
export const expInput = v => { const d = String(v).replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; };
export const amountInput = v => { const d = String(v).replace(/\D/g, '').slice(0, 10); return d ? num(+d) : ''; };
export const usernameInput = v => String(v).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 20);
export const digitsInput = v => String(v).replace(/\D/g, '').slice(0, 6);
export function brandOf(n) {
  if (/^(8600|5614)/.test(n)) return 'uzcard';
  if (/^9860/.test(n)) return 'humo';
  if (/^4/.test(n)) return 'visa';
  return null;
}
export const cardLabel = c => `${BRAND[c.type]} •• ${c.last4}`;

/* --- Fayllar */
export function readFileURL(file) {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
}
export function resizeImage(file, max = 1024, q = 0.82) {
  return readFileURL(file).then(src => new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', q));
    };
    img.onerror = () => res(src);
    img.src = src;
  }));
}
export function pickFile(accept, cb) {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = accept;
  inp.onchange = () => { const f = inp.files && inp.files[0]; if (f) cb(f); };
  inp.click();
}

/* --- Guruh yordamchilari (me = joriy foydalanuvchi profili) */
export const fullName = u => `${u.firstName} ${u.lastName}`.trim();
export const M = (g, id) => g.members.find(m => m.id === id) || { id, name: 'Noma’lum', phone: '' };
export const memberName = (g, id, me) => (id === g.me ? `${me.firstName} (siz)` : M(g, id).name);
export const pot = g => g.amount * (g.size - 1);
export const joined = g => g.members.filter(m => m.status === 'joined').length;
export const myPosition = g => (g.order || []).indexOf(g.me) + 1;
export const curRound = g => g.rounds.find(r => r.index === g.currentRound);
export function queueLine(g) {
  if (g.status === 'forming') return `Ishtirokchilar yig‘ilmoqda · ${joined(g)}/${g.size}`;
  if (g.status === 'queue') return 'Navbat hali belgilanmagan';
  if (g.status === 'ready') return 'Navbat tayyor · boshlash kutilmoqda';
  if (g.status === 'active') {
    const r = curRound(g);
    return r ? `${r.index + 1}/${g.size}-davr · ${r.recipientId === g.me ? 'siz olasiz' : M(g, r.recipientId).name + ' oladi'}` : 'Faol';
  }
  return 'Barcha davrlar yakunlangan';
}
export function progressPct(g) {
  if (g.status === 'forming') return (joined(g) / g.size) * 100;
  if (g.status === 'queue' || g.status === 'ready') return 100;
  return (g.rounds.filter(r => r.status === 'paid_out').length / g.size) * 100;
}
export function planRounds(g) {
  const out = [];
  for (let i = 0; i < g.size; i++) {
    const r = g.rounds[i];
    let rid = r ? r.recipientId : null;
    if (!rid && g.queueMethod !== 'random' && g.orderLocked && g.order[i]) rid = g.order[i];
    const payers = rid ? g.members.filter(m => m.id !== rid) : [];
    const paidN = r ? Object.values(r.payments).filter(p => p.status === 'paid').length : 0;
    out.push({
      i, r, rid, due: addPeriod(g.startDate, g.period, i), payers, paidN,
      state: r ? (r.status === 'paid_out' ? 'done' : 'cur') : 'plan',
      sent: r ? (r.status === 'paid_out' ? pot(g) : paidN * g.amount) : 0,
    });
  }
  return out;
}
export function parseInvite(text) {
  const s = String(text || '').trim();
  const m = s.match(/join[_=]([a-z0-9]{6,20})/i);
  if (m) return m[1].toLowerCase();
  if (/^[a-z0-9]{6,20}$/i.test(s)) return s.toLowerCase();
  return null;
}

/* --- SVG halqa geometriyasi */
export function polar(cx, cy, r, a) { const t = (a * Math.PI) / 180; return [+(cx + r * Math.cos(t)).toFixed(2), +(cy + r * Math.sin(t)).toFixed(2)]; }
export function arc(cx, cy, r, a0, a1) {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
  return `M${x0} ${y0}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
}
