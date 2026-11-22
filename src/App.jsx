import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppCtx, useApp } from './context.js';
import { api, API, DEV_USER, haptic, inTelegram, tg } from './api.js';
import { fullName } from './utils.js';
import { applyTheme, getThemePref, resolvedTheme, saveThemePref } from './theme.js';
import { Avatar, Icon, Logo } from './components/ui.jsx';
import { SHEETS } from './components/sheets.jsx';
import Home from './pages/Home.jsx';
import GroupPage from './pages/Group.jsx';
import QueuePage from './pages/Queue.jsx';
import CreatePage from './pages/Create.jsx';
import CardsPage from './pages/Cards.jsx';
import ChatPage from './pages/Chat.jsx';
import ProfilePage from './pages/Profile.jsx';
import NotificationsPage from './pages/Notifications.jsx';
import Register from './pages/Register.jsx';

const PAGES = {
  home: Home, group: GroupPage, queue: QueuePage, create: CreatePage, cards: CardsPage,
  chat: ChatPage, profile: ProfilePage, notifications: NotificationsPage,
};
const TAB_OF = { home: 'home', group: 'home', queue: 'home', create: 'home', notifications: 'home', cards: 'cards', chat: 'chat', profile: 'profile' };
const MAIN_TABS = ['home', 'cards', 'chat', 'profile'];

function CenterScreen({ title, text, link, retry, spinner }) {
  return (
    <div className="center-screen">
      {spinner ? <div className="spinner" /> : <Logo size={56} />}
      {title && <h1>{title}</h1>}
      {text && <p>{text}</p>}
      {link && <a className="btn btn-primary" href={link}>Telegram’da ochish</a>}
      {retry && <button className="btn btn-primary" onClick={() => location.reload()}>Qayta urinish</button>}
    </div>
  );
}


export default function App() {
  const [phase, setPhase] = useState('loading'); // loading | slow | error | gate | config | register | app
  const [error, setError] = useState('');
  const [bot, setBot] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => {
    if (inTelegram) {
      try {
        tg.ready(); tg.expand(); tg.onEvent('themeChanged', () => applyTheme());
        if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
      } catch (e) { /* eski versiyalar */ }
    }
    applyTheme();
    (async () => {
      if (!API) { setPhase('config'); return; }
      if (!inTelegram && !DEV_USER) {
        try { setBot((await api('/api/config')).botUsername); } catch (e) { /* server uxlayotgan bo'lishi mumkin */ }
        setPhase('gate');
        return;
      }
      const slow = setTimeout(() => setPhase(p => (p === 'loading' ? 'slow' : p)), 2500);
      try {
        const u = await api('/api/me');
        clearTimeout(slow);
        setMe(u);
        setPhase(u.registered ? 'app' : 'register');
      } catch (e) {
        clearTimeout(slow);
        setError(e.message);
        setPhase('error');
      }
    })();
  }, []);

  if (phase === 'loading') return <CenterScreen spinner />;
  if (phase === 'slow') return <CenterScreen spinner title="Server ishga tushmoqda…" text="Bepul serverda birinchi ochilish 30–60 soniya olishi mumkin. Iltimos, kuting." />;
  if (phase === 'config') return <CenterScreen title="Sozlash kerak" text="public/config.js faylida API_URL ko‘rsatilmagan." />;
  if (phase === 'gate') return <CenterScreen title="Telegram orqali oching" text="Kassachi Telegram Mini App sifatida ishlaydi. Botni oching va “Kassachi” tugmasini bosing." link={bot ? `https://t.me/${bot}` : null} />;
  if (phase === 'error') return <CenterScreen title="Ulanib bo‘lmadi" text={error} retry />;
  if (phase === 'register') return <Register me={me} onDone={u => { setMe(u); setPhase('app'); }} />;
  return <Shell me={me} setMe={setMe} />;
}

function Shell({ me, setMe }) {
  const params = new URLSearchParams(location.search);
  const startGid = Number(params.get('g')) || null;
  const [route, setRoute] = useState(startGid ? { name: 'group', id: startGid } : { name: 'home' });
  const [sheet, setSheet] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState({ notifs: 0, chats: 0 });
  const [groups, setGroups] = useState({});
  const [cards, setCards] = useState(null);
  const [tick, setTick] = useState(0);
  const [wizard, setWizard] = useState(null);
  const [theme, setThemeState] = useState(getThemePref);
  const [resolved, setResolved] = useState(() => resolvedTheme(getThemePref()));
  const busyRef = useRef(false);

  // Mavzu: tanlovni saqlash va qo'llash; "system" bo'lsa Telegram/qurilma o'zgarishini kuzatish
  const setTheme = useCallback(pref => { saveThemePref(pref); setThemeState(pref); setResolved(resolvedTheme(pref)); }, []);
  useEffect(() => {
    const sync = () => { if (getThemePref() === 'system') { applyTheme('system'); setResolved(resolvedTheme('system')); } };
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (mq && mq.addEventListener) mq.addEventListener('change', sync);
    if (inTelegram) tg.onEvent('themeChanged', sync);
    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener('change', sync);
      if (inTelegram) tg.offEvent('themeChanged', sync);
    };
  }, []);

  const toast = useCallback((text, kind = '') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t.slice(-2), { id, text, kind }]);
    setTimeout(() => setToasts(t => t.map(x => (x.id === id ? { ...x, out: true } : x))), 3400);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3700);
  }, []);

  const run = useCallback(async fn => {
    if (busyRef.current) return undefined;
    busyRef.current = true; setBusy(true);
    try { return await fn(); }
    catch (e) { toast(e.message, 'err'); haptic('error'); return undefined; }
    finally { busyRef.current = false; setBusy(false); }
  }, [toast]);

  const setGroup = useCallback(g => setGroups(prev => ({ ...prev, [g.id]: g })), []);
  const dropGroup = useCallback(id => setGroups(prev => { const n = { ...prev }; delete n[id]; return n; }), []);
  const loadCards = useCallback(async () => { const c = await api('/api/cards'); setCards(c); return c; }, []);
  const openSheet = useCallback((name, props = {}) => setSheet({ name, ...props }), []);
  const closeSheet = useCallback(() => setSheet(null), []);
  const go = useCallback((name, params = {}) => { setSheet(null); setRoute({ name, ...params }); window.scrollTo(0, 0); }, []);

  const back = useCallback(() => {
    if (sheet) { setSheet(null); return; }
    if (route.name === 'chat' && route.id) return go('chat');
    if (route.name === 'queue') return go('group', { id: route.id });
    if (route.name === 'create' && wizard && wizard.step > 1) { setWizard(w => ({ ...w, step: w.step - 1 })); return; }
    go('home');
  }, [sheet, route, wizard, go]);

  // Telegram "Orqaga" tugmasi
  const backRef = useRef(back);
  backRef.current = back;
  useEffect(() => {
    if (!inTelegram || !tg.BackButton) return undefined;
    const h = () => backRef.current();
    tg.BackButton.onClick(h);
    return () => tg.BackButton.offClick(h);
  }, []);
  useEffect(() => {
    if (!inTelegram || !tg.BackButton) return;
    const sub = sheet || !MAIN_TABS.includes(route.name) || (route.name === 'chat' && route.id);
    try { sub ? tg.BackButton.show() : tg.BackButton.hide(); } catch (e) { /* */ }
  }, [sheet, route]);

  useEffect(() => { document.body.classList.toggle('busy', busy); }, [busy]);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setSheet(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // O'qilmaganlar soni va ochiq sahifani har 15 soniyada yangilash
  useEffect(() => {
    const poll = async () => {
      if (document.hidden) return;
      try { setSummary(await api('/api/summary')); setTick(t => t + 1); } catch (e) { /* tarmoq xatosi */ }
    };
    poll();
    const id = setInterval(poll, 15000);
    const onVis = () => { if (!document.hidden) poll(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis); };
  }, []);

  // Taklif havolasi orqali ochilgan bo'lsa
  useEffect(() => {
    const sp = (inTelegram && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || '';
    const join = params.get('join') || (sp.startsWith('join_') ? sp.slice(5) : null);
    if (join) setSheet({ name: 'joinPreview', code: join });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ctx = useMemo(() => ({
    me, setMe, route, go, back, sheet, openSheet, closeSheet, toast, run, busy,
    summary, setSummary, groups, setGroup, dropGroup, cards, setCards, loadCards, tick, wizard, setWizard,
    theme, setTheme, resolved,
  }), [me, route, go, back, sheet, openSheet, closeSheet, toast, run, busy, summary, groups, setGroup, dropGroup, cards, loadCards, tick, wizard, theme, setTheme, resolved]);

  const Page = PAGES[route.name] || Home;
  const inRoom = route.name === 'chat' && !!route.id;
  const key = route.name + (route.id || '');
  const SheetC = sheet && SHEETS[sheet.name];

  return (
    <AppCtx.Provider value={ctx}>
      <div className="topbar-progress" />
      <div className={`app ${inRoom ? 'in-room' : ''}`}>
        <Sidebar />
        <main key={key} className={`main ${route.name === 'chat' ? 'chatmain' : 'enter'}`}><Page /></main>
        <Tabbar />
      </div>
      {SheetC && (
        <div className="sheet-wrap" onClick={e => { if (e.target === e.currentTarget) closeSheet(); }}>
          <div className="sheet" role="dialog" aria-modal="true"><SheetC {...sheet} /></div>
        </div>
      )}
      <div id="toast-root" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.kind === 'err' ? 'err' : ''} ${t.out ? 'out' : ''}`}>
            <Icon n={t.kind === 'err' ? 'info' : 'check'} s={18} /><span>{t.text}</span>
          </div>
        ))}
      </div>
    </AppCtx.Provider>
  );
}

function Sidebar() {
  const { route, go, summary, me, resolved, setTheme } = useApp();
  const t = TAB_OF[route.name];
  const item = (k, icn, l, c) => (
    <button key={k} className={`nav-i ${t === k ? 'on' : ''}`} onClick={() => go(k)}>
      <Icon n={icn} />{l}{c > 0 && <span className="cnt">{c}</span>}
    </button>
  );
  return (
    <aside className="side">
      <div className="logo"><Logo />Kassachi</div>
      {item('home', 'home', 'Bosh ekran')}{item('cards', 'card', 'Karta')}{item('chat', 'chat', 'Chat', summary.chats)}{item('profile', 'user', 'Profil')}
      <div className="side-foot">
        <button className="nav-i" onClick={() => setTheme(resolved === 'dark' ? 'light' : 'dark')}>
          <Icon n={resolved === 'dark' ? 'sun' : 'moon'} />{resolved === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘i rejim'}
        </button>
        <button className="btn btn-primary btn-block" onClick={() => go('create')}><Icon n="plus" s={18} /> Guruh yaratish</button>
        <button className="side-me" onClick={() => go('profile')}>
          <Avatar img={me.photo} name={fullName(me)} size={38} />
          <span className="grow"><b>{fullName(me)}</b><small>@{me.username}</small></span>
        </button>
      </div>
    </aside>
  );
}

function Tabbar() {
  const { route, go, summary } = useApp();
  const t = TAB_OF[route.name];
  const item = (k, icn, l, c) => (
    <button key={k} className={`tab ${t === k ? 'on' : ''}`} onClick={() => go(k)} aria-label={l}>
      <Icon n={icn} s={22} />{l}{c > 0 && <span className="dot">{c > 99 ? '99+' : c}</span>}
    </button>
  );
  return (
    <nav className="tabbar">
      {item('home', 'home', 'Bosh ekran')}{item('cards', 'card', 'Karta')}{item('chat', 'chat', 'Chat', summary.chats)}{item('profile', 'user', 'Profil')}
    </nav>
  );
}
