import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context.js';
import { api, haptic } from '../api.js';
import { Avatar, BellBtn, Empty, Icon, Loader, StatusPill } from '../components/ui.jsx';
import {
  PERIOD, addPeriod, arc, daysUntil, fmtDate, fullName, joined, money, myPosition, num, pot, progressPct, queueLine, relTime,
} from '../utils.js';

export default function Home() {
  const { me, go, openSheet, setGroup, setSummary, run, toast, tick } = useApp();
  const [H, setH] = useState(null);

  const load = useCallback(async silent => {
    try {
      const x = await api('/api/home');
      setH(x);
      setSummary(x.unread);
      x.groups.forEach(setGroup);
    } catch (e) { if (!silent) toast(e.message, 'err'); }
  }, [setGroup, setSummary, toast]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (tick) load(true); }, [tick, load]);

  const accept = code => run(async () => {
    const out = await api(`/api/invite/${code}/join`, { method: 'POST', body: {} });
    haptic('ok'); toast('Guruhga qo‘shildingiz'); go('group', { id: out.id });
  });
  const decline = id => run(async () => {
    await api(`/api/groups/${id}/decline`, { method: 'POST', body: {} });
    toast('Taklif rad etildi'); load(true);
  });

  const header = (
    <header className="phead">
      <button className="me-btn" onClick={() => go('profile')}>
        <Avatar img={me.photo} name={fullName(me)} size={46} />
        <span className="grow"><small>Xush kelibsiz,</small><b>{me.firstName}</b></span>
      </button>
      <div className="phead-r"><BellBtn /></div>
    </header>
  );
  if (!H) return <>{header}<Loader /></>;

  const live = H.groups.filter(g => g.status !== 'completed');
  const done = H.groups.filter(g => g.status === 'completed');
  const net = H.wallet.received - H.wallet.paid;

  return (
    <>
      {header}
      <section className="balance">
        <svg className="deco" viewBox="0 0 200 200" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
            <path key={i} d={arc(100, 100, 70, -90 + i * 45 + 4, -90 + (i + 1) * 45 - 4)} fill="none" strokeWidth="22"
              stroke={i === 0 ? 'var(--accent)' : 'var(--hero-muted)'} strokeOpacity={i === 0 ? 1 : 0.35} />
          ))}
        </svg>
        <div className="bal-top"><span className="eyebrow">Umumiy balans</span><span className="sim">Olingan − to‘langan</span></div>
        <div className="bal-num">{money(net)}</div>
        <div className="bal-row">
          <div><small>Olingan</small><b>{money(H.wallet.received)}</b></div>
          <div><small>To‘langan</small><b>{money(H.wallet.paid)}</b></div>
          <div><small>Faol guruhlar</small><b>{live.length}</b></div>
        </div>
        <div className="bal-actions">
          <button className="btn btn-accent" onClick={() => go('create')}><Icon n="plus" s={18} /> Guruh yaratish</button>
          <button className="btn btn-hero-ghost" onClick={() => openSheet('join')}><Icon n="link" s={18} /> Havola bilan qo‘shilish</button>
        </div>
      </section>

      <div className="home-grid">
        <div className="col">
          <section className="block">
            <div className="block-h"><h2>Faol guruhlar</h2>{live.length > 0 && <button className="link" onClick={() => go('create')}><Icon n="plus" s={16} /> Yangi guruh</button>}</div>
            {live.length ? <div className="gcards">{live.map(g => <GroupCard key={g.id} g={g} />)}</div> : (
              <Empty icon="users" title="Hali guruhingiz yo‘q" text="4–12 kishilik guruh yarating: badal miqdori va davriylikni belgilang, ishtirokchilarni taklif qiling va navbatni aniqlang.">
                <button className="btn btn-primary" onClick={() => go('create')}><Icon n="plus" s={18} /> Birinchi guruhni yaratish</button>
              </Empty>
            )}
          </section>

          <section className="block">
            <div className="block-h"><h2>Taklif qilingan guruhlar</h2></div>
            {H.invites.length ? (
              <div className="stack">
                {H.invites.map(inv => (
                  <div className="card invite" key={inv.id}>
                    <Avatar name={inv.name} size={44} sq />
                    <div className="t"><b>{inv.name}</b><small>{inv.creator} taklif qildi · {inv.size} kishi · {money(inv.amount)} · {PERIOD[inv.period]}</small></div>
                    <div className="row">
                      <button className="btn btn-ghost btn-sm" onClick={() => decline(inv.id)}>Rad etish</button>
                      <button className="btn btn-primary btn-sm" onClick={() => accept(inv.code)}>Qabul qilish</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-sm"><Icon n="hand" /><p>Telefon raqamingiz bo‘yicha yuborilgan takliflar shu yerda ko‘rinadi. Havola olgan bo‘lsangiz, <button className="link" onClick={() => openSheet('join')}>havola bilan qo‘shiling</button>.</p></div>
            )}
          </section>

          {done.length > 0 && (
            <section className="block"><div className="block-h"><h2>Yakunlangan guruhlar</h2></div><div className="gcards">{done.map(g => <GroupCard key={g.id} g={g} />)}</div></section>
          )}

          <section className="block">
            <div className="block-h"><h2>So‘nggi faoliyatlar</h2></div>
            {H.activity.length ? (
              <ul className="rows card">
                {H.activity.map(a => (
                  <li key={a.id}>
                    <span className={`ri ${a.amount > 0 ? 'ok' : a.amount < 0 ? 'dan' : 'prim'}`}><Icon n={a.icon || 'info'} s={18} /></span>
                    <div className="t"><b>{a.title}</b><small>{a.sub || ''} · {relTime(a.ts)}</small></div>
                    {a.amount ? <span className={`amt ${a.amount > 0 ? 'plus' : ''}`}>{a.amount > 0 ? '+' : ''}{money(a.amount)}</span> : null}
                  </li>
                ))}
              </ul>
            ) : <div className="empty-sm"><Icon n="clock" /><p>Guruh yaratish, to‘lovlar va pul tushumlari shu yerda ko‘rinadi.</p></div>}
          </section>
        </div>

        <div className="col">
          <MyQueue groups={H.groups} />
          <NextPayout groups={H.groups} />
          <section className="block">
            <div className="block-h"><h2>Yangiliklar va e’lonlar</h2></div>
            <ul className="rows card news">
              <li><span className="ri acc"><Icon n="megaphone" s={18} /></span><div className="t"><b style={{ whiteSpace: 'normal' }}>Kassachi qanday ishlaydi</b><small>Har davrda bitta ishtirokchi qolganlarning badalini oladi. Oluvchi o‘sha davrda o‘ziga to‘lamaydi.</small></div></li>
              <li><span className="ri prim"><Icon n="cash" s={18} /></span><div className="t"><b style={{ whiteSpace: 'normal' }}>Naqd to‘lov</b><small>To‘lovchi “Naqd topshirdim” deydi, oluvchi “Qabul qildim” bilan tasdiqlaydi. Ilova pulni o‘zi o‘tkazmaydi.</small></div></li>
              <li><span className="ri"><Icon n="lock" s={18} /></span><div className="t"><b style={{ whiteSpace: 'normal' }}>Qur’a qoidasi</b><small>Qur’a yoki qo‘lda belgilangan navbat tasdiqlangach, uni o‘zgartirib bo‘lmaydi.</small></div></li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

function GroupCard({ g }) {
  const { go } = useApp();
  const pos = myPosition(g);
  return (
    <button className="gcard" onClick={() => go('group', { id: g.id })}>
      <div className="gcard-top"><Avatar img={g.image} name={g.name} size={46} sq /><div className="gcard-t"><b>{g.name}</b><StatusPill status={g.status} /></div><span className="muted"><Icon n="chev" s={18} /></span></div>
      <div className="gmeta"><div><small>Ishtirokchi</small><b>{joined(g)}/{g.size}</b></div><div><small>Badal</small><b>{num(g.amount)}</b></div><div><small>Davriylik</small><b>{PERIOD[g.period]}</b></div></div>
      <div className="gprog"><div className="bar"><i style={{ width: `${progressPct(g)}%` }} /></div><span>{queueLine(g)}{pos ? ` · Siz: ${pos}-navbat` : ''}</span></div>
    </button>
  );
}

function MyQueue({ groups }) {
  const { go } = useApp();
  const gs = groups.filter(g => g.status === 'ready' || g.status === 'active');
  return (
    <section className="block">
      <div className="block-h"><h2>Mening navbatim</h2></div>
      {!gs.length ? <div className="empty-sm"><Icon n="repeat" /><p>Navbat belgilangan guruhlarda o‘rningiz va pul olish sanangiz shu yerda ko‘rinadi.</p></div> : (
        <ul className="rows card mine-q">
          {gs.map(g => {
            const pos = myPosition(g);
            if (!pos) return <li key={g.id}><span className="pos">?</span><div className="t"><b>{g.name}</b><small>Har davr boshida tasodifiy aniqlanadi</small></div></li>;
            const r = g.rounds[pos - 1];
            const st = r ? (r.status === 'paid_out' ? <span className="pill ok">Olingan</span> : <span className="pill accent">Joriy davr</span>) : <span className="pill mut">Kutilmoqda</span>;
            return (
              <li key={g.id} onClick={() => go('group', { id: g.id })} style={{ cursor: 'pointer' }}>
                <span className="pos">{pos}</span>
                <div className="t"><b>{g.name}</b><small>{fmtDate(addPeriod(g.startDate, g.period, pos - 1))} · {money(pot(g))}</small></div>{st}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function NextPayout({ groups }) {
  const { go } = useApp();
  let best = null;
  groups.forEach(g => {
    if (g.status !== 'ready' && g.status !== 'active') return;
    const pos = myPosition(g); if (!pos) return;
    const r = g.rounds[pos - 1]; if (r && r.status === 'paid_out') return;
    const d = addPeriod(g.startDate, g.period, pos - 1);
    if (!best || d < best.d) best = { g, d };
  });
  if (!best) return (
    <section className="block"><div className="block-h"><h2>Keyingi pul tushumi</h2></div>
      <div className="empty-sm"><Icon n="calendar" /><p>Navbatingiz belgilangach, pul tushadigan sana shu yerda chiqadi.</p></div></section>
  );
  const dl = daysUntil(best.d);
  return (
    <section className="block"><div className="block-h"><h2>Keyingi pul tushumi</h2></div>
      <button className="card nextpay" style={{ width: '100%' }} onClick={() => go('group', { id: best.g.id })}>
        <span className="eyebrow">{best.g.name}</span><span className="big">{fmtDate(best.d)}</span>
        <span className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <b className="tnum" style={{ color: 'var(--primary)' }}>+{money(pot(best.g))}</b>
          <span className={`pill ${dl <= 0 ? 'accent' : 'mut'}`}>{dl > 0 ? `${dl} kun qoldi` : dl === 0 ? 'Bugun' : 'Joriy davr'}</span>
        </span>
      </button>
    </section>
  );
}
