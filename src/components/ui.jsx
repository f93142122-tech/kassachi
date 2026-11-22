import React from 'react';
import { useApp } from '../context.js';
import { inTelegram } from '../api.js';
import { arc, polar, myPosition, BRAND } from '../utils.js';

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  chev: '<path d="m9 18 6-6-6-6"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.6a6.5 6.5 0 0 1 3.5 5.4"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  repeat: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  video: '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/>',
  qr: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h.01M17.5 17.5H21V21h-3.5z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  wallet: '<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M21 8h-5a4 4 0 0 0 0 8h5z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2"/><circle cx="15.5" cy="15.5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="15.5" cy="8.5" r="1.2"/><circle cx="8.5" cy="15.5" r="1.2"/>',
  hand: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8a5 5 0 0 1 0 8"/>',
  arrowdown: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  arrowup: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  flag: '<path d="M4 22V4a1 1 0 0 1 1-1h12l-2 4 2 4H5"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  play: '<path d="m7 4 13 8-13 8z"/>',
  cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>',
  monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
};

// Yorug'/qorong'i rejimni tez almashtirish tugmasi
export function ThemeBtn() {
  const { setTheme, resolved } = useApp();
  const next = resolved === 'dark' ? 'light' : 'dark';
  return (
    <button className="icon-btn" onClick={() => setTheme(next)} aria-label={next === 'dark' ? 'Qorong‘i rejim' : 'Yorug‘ rejim'} title={next === 'dark' ? 'Qorong‘i rejim' : 'Yorug‘ rejim'}>
      <Icon n={resolved === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}

export function Icon({ n, s = 20 }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONS[n] || '' }} />
  );
}

const initials = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase() || '?';
function hue(s) { let x = 7; for (const c of String(s)) x = (x * 31 + c.charCodeAt(0)) % 360; return x; }

export function Avatar({ img, name, size = 40, sq = false }) {
  const st = { width: size, height: size, fontSize: Math.round(size * 0.36) };
  const cls = 'av' + (sq ? ' sq' : '');
  if (img) return <span className={cls} style={st}><img src={img} alt="" referrerPolicy="no-referrer" /></span>;
  return <span className={cls} style={{ ...st, background: `hsl(${hue(name)} 40% 40%)` }}>{initials(name)}</span>;
}

// Guruh a'zosining avatari (o'zim bo'lsam — profil rasmim)
export function MAvatar({ g, m, size = 36 }) {
  const { me } = useApp();
  if (m.id === g.me) return <Avatar img={me.photo} name={`${me.firstName} ${me.lastName}`} size={size} />;
  return <Avatar img={m.photo} name={m.name} size={size} />;
}

export function Logo({ size }) {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" aria-hidden="true" style={size ? { width: size, height: size } : undefined}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <path key={i} d={arc(20, 20, 14, -90 + i * 60 + 7, -90 + (i + 1) * 60 - 7)} fill="none" strokeWidth="7"
          stroke={i === 0 ? 'var(--accent)' : 'var(--primary)'} strokeLinecap="round" />
      ))}
    </svg>
  );
}

// Navbat aylanasi: har bir davr — bitta segment
export function Ring({ g }) {
  const n = g.size, cx = 100, cy = 100, r = 76, gap = n > 8 ? 3 : 5;
  const pos = myPosition(g);
  const done = g.rounds.filter(x => x.status === 'paid_out').length;
  const big = g.status === 'active' ? `${g.currentRound + 1}/${n}` : `${done}/${n}`;
  return (
    <svg viewBox="0 0 200 200" className="ring" role="img" aria-label={`Navbat aylanasi: ${n} ta davr`}>
      {Array.from({ length: n }, (_, i) => {
        const a0 = -90 + (i * 360) / n + gap / 2, a1 = -90 + ((i + 1) * 360) / n - gap / 2;
        const rd = g.rounds[i];
        const st = rd && rd.status === 'paid_out' ? 'done' : g.status === 'active' && g.currentRound === i ? 'cur' : 'up';
        const [lx, ly] = polar(cx, cy, r, (a0 + a1) / 2);
        const [mx, my] = polar(cx, cy, r + 18, (a0 + a1) / 2);
        return (
          <g key={i}>
            <path d={arc(cx, cy, r, a0, a1)} className={`seg ${st}`} />
            <text x={lx} y={ly} className={`sn ${st}`} textAnchor="middle" dominantBaseline="central">{i + 1}</text>
            {pos === i + 1 && <circle cx={mx} cy={my} r="4" fill="var(--accent)" />}
          </g>
        );
      })}
      <text x="100" y="94" className="rb" textAnchor="middle">{big}</text>
      <text x="100" y="118" className="rs" textAnchor="middle">davr</text>
    </svg>
  );
}

const STATUS = {
  forming: ['warn', 'Shakllanmoqda'], queue: ['accent', 'Navbat kutilmoqda'], ready: ['prim', 'Boshlashga tayyor'],
  active: ['ok', 'Faol'], completed: ['mut', 'Yakunlangan'],
};
export function StatusPill({ status }) {
  const s = STATUS[status];
  return s ? <span className={`pill ${s[0]}`}>{s[1]}</span> : null;
}

export function BellBtn() {
  const { summary, go } = useApp();
  const n = summary.notifs;
  return (
    <button className="icon-btn" onClick={() => go('notifications')} aria-label="Bildirishnomalar">
      <Icon n="bell" />{n > 0 && <span className="badge">{n > 9 ? '9+' : n}</span>}
    </button>
  );
}

export function Head({ title, sub, back, right }) {
  const { back: goBack } = useApp();
  return (
    <header className="phead">
      {back && !inTelegram && <button className="icon-btn" onClick={goBack} aria-label="Orqaga"><Icon n="back" /></button>}
      <div className="phead-t"><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      <div className="phead-r">{right}</div>
    </header>
  );
}

export const Loader = () => <div className="loader"><div className="spinner" /></div>;

export function Empty({ icon, title, text, children }) {
  return (
    <div className="empty">
      <div className="em-ic"><Icon n={icon} s={26} /></div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}

export function CardVisual({ c }) {
  return (
    <div className={`bcard ${c.type}`}>
      <div className="top"><span className="brand">{BRAND[c.type]}</span>{c.primary && <span className="prim"><Icon n="star" s={12} /> Asosiy</span>}</div>
      <div className="num">{c.first4 || '••••'} •••• •••• {c.last4}</div>
      <div className="bot"><div>Karta egasi<b>{c.holder}</b></div><div style={{ textAlign: 'right' }}>Amal qiladi<b>{c.exp}</b></div></div>
    </div>
  );
}
