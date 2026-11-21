import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context.js';
import { api } from '../api.js';
import { useConfirm, useGroupCall } from '../hooks.js';
import { Avatar, Head, Icon, Loader, MAvatar, Ring, StatusPill } from '../components/ui.jsx';
import {
  METHOD, PERIOD, M, addPeriod, curRound, fmtDate, fmtDateShort, fmtPhone, fullName, joined, memberName, money, num, pot,
} from '../utils.js';

export default function GroupPage() {
  const { route, groups, setGroup, cards, loadCards, toast, go, tick } = useApp();
  const id = route.id;
  const g = groups[id];

  const load = useCallback(async silent => {
    try { setGroup(await api(`/api/groups/${id}`)); }
    catch (e) { if (!silent) { toast(e.message, 'err'); go('home'); } }
  }, [id, setGroup, toast, go]);
  useEffect(() => { load(); if (!cards) loadCards().catch(() => {}); /* eslint-disable-next-line */ }, [id]);
  useEffect(() => { if (tick) load(true); }, [tick, load]);

  if (!g) return <><Head title="Guruh" back /><Loader /></>;
  return <GroupView g={g} />;
}

function GroupView({ g }) {
  const { go, openSheet, run, dropGroup, toast } = useApp();
  const confirm = useConfirm();

  const removeGroup = () => confirm({
    title: g.isOwner ? 'Guruhni o‘chirish' : 'Guruhdan chiqish',
    text: g.isOwner
      ? `“${g.name}” guruhi, uning navbati va chati barcha a’zolar uchun o‘chiriladi. Buni qaytarib bo‘lmaydi.`
      : `“${g.name}” guruhidan chiqasiz.${g.status !== 'forming' ? ' Navbat bekor qilinadi va guruh qayta shakllanadi.' : ''}`,
    yes: g.isOwner ? 'O‘chirish' : 'Chiqish',
    danger: true,
    onYes: () => run(async () => {
      await api(`/api/groups/${g.id}`, { method: 'DELETE' });
      dropGroup(g.id);
      toast(g.isOwner ? 'Guruh o‘chirildi' : 'Guruhdan chiqdingiz');
      go('home');
    }),
  });

  return (
    <>
      <Head title={g.name} back sub={`${PERIOD[g.period]} · ${g.size} kishi · ${METHOD[g.queueMethod]}`}
        right={<button className="icon-btn" onClick={() => go('chat', { id: g.id })} aria-label="Guruh chati"><Icon n="chat" /></button>} />
      <section className="card ghero">
        <div className="ghero-l"><Ring g={g} /></div>
        <div style={{ minWidth: 0 }}>
          <div className="ghero-id"><Avatar img={g.image} name={g.name} size={54} sq /><div style={{ minWidth: 0 }}><h2>{g.name}</h2><StatusPill status={g.status} /></div></div>
          <dl className="stats">
            <div><dt>Badal (har kishi)</dt><dd>{money(g.amount)}</dd></div>
            <div><dt>Oluvchiga har davrda</dt><dd className="acc">{money(pot(g))}</dd></div>
            <div><dt>Davriylik</dt><dd>{PERIOD[g.period]}</dd></div>
            <div><dt>Boshlanish</dt><dd>{fmtDate(g.startDate)}</dd></div>
            <div><dt>Tugash</dt><dd>{fmtDate(addPeriod(g.startDate, g.period, g.size - 1))}</dd></div>
            <div><dt>Navbat usuli</dt><dd>{METHOD[g.queueMethod]}</dd></div>
          </dl>
          <div className="row-btns">
            <button className="btn btn-soft btn-sm" onClick={() => go('queue', { id: g.id })}><Icon n="list" s={18} /> Navbat jadvali</button>
            <button className="btn btn-soft btn-sm" onClick={() => go('chat', { id: g.id })}><Icon n="chat" s={18} /> Guruh chati</button>
            {g.status === 'forming' && <button className="btn btn-soft btn-sm" onClick={() => openSheet('invite', { gid: g.id })}><Icon n="qr" s={18} /> Taklif qilish</button>}
            {g.status !== 'completed' && g.status !== 'forming' && <button className="btn btn-soft btn-sm" onClick={() => openSheet('paysettings', { gid: g.id })}><Icon n="wallet" s={18} /> To‘lov usulim</button>}
          </div>
        </div>
      </section>
      <StagePanel g={g} />
      <Members g={g} />
      <section className="block"><div className="row-btns">
        {g.isOwner
          ? <button className="btn btn-danger btn-sm" onClick={removeGroup}><Icon n="trash" s={16} /> Guruhni o‘chirish</button>
          : g.status !== 'active' && <button className="btn btn-danger btn-sm" onClick={removeGroup}><Icon n="logout" s={16} /> Guruhdan chiqish</button>}
      </div></section>
    </>
  );
}

function Stage({ n, title, text, children }) {
  return (
    <section className="card stage">
      <div className="stage-h"><div className="grow"><div className="stage-n">{n}</div><h3>{title}</h3>{text && <p>{text}</p>}</div></div>
      {children}
    </section>
  );
}

function payLabel(g, cards) {
  const p = g.myPay;
  if (!p) return '—';
  if (p.method === 'card') { const c = (cards || []).find(x => x.id === p.cardId); return `karta${c ? ' •• ' + c.last4 : ''}${p.autopay ? ' · avto' : ''}`; }
  return 'naqd';
}

function StagePanel({ g }) {
  const { me, openSheet, cards } = useApp();
  const call = useGroupCall();
  const confirm = useConfirm();
  const own = g.isOwner;
  const [order, setOrder] = useState(() => g.members.map(m => m.id));
  useEffect(() => { if (order.length !== g.members.length) setOrder(g.members.map(m => m.id)); }, [g.members, order.length]);

  if (g.status === 'forming') {
    const need = g.size - g.members.length;
    const inv = g.members.filter(m => m.status === 'invited').length;
    return (
      <Stage n="1-bosqich · Ishtirokchilar" title="Guruh shakllanmoqda"
        text={need > 0 ? `Yaratuvchidan tashqari yana ${g.size - 1} kishi kerak. Hozir ${need} ta o‘rin bo‘sh.` : inv ? `${inv} ta taklif javobini kutmoqda.` : ''}>
        <div className="slots" aria-label={`${joined(g)} / ${g.size} qo‘shildi`}>
          {g.members.map(m => <i key={m.id} className={m.status === 'joined' ? 'on' : 'inv'} />)}
          {Array.from({ length: Math.max(0, need) }, (_, i) => <i key={'e' + i} />)}
        </div>
        <div className="row-btns">
          {own && need > 0 && <button className="btn btn-primary" onClick={() => openSheet('contact', { gid: g.id })}><Icon n="plus" s={18} /> Kontakt qo‘shish</button>}
          <button className="btn btn-ghost" onClick={() => openSheet('invite', { gid: g.id })}><Icon n="qr" s={18} /> Havola va QR-kod</button>
        </div>
        {inv > 0 && <div className="demo-box"><div><Icon n="info" s={16} /><span>Taklif qilinganlar havola orqali Telegram’da qo‘shiladi. Telegram’dan foydalanmaydigan ishtirokchini yaratuvchi “Telegram’siz qo‘shish” tugmasi bilan tasdiqlaydi.</span></div></div>}
      </Stage>
    );
  }

  if (g.status === 'queue') {
    if (!own) return <Stage n="2-bosqich · Navbat" title="Navbat belgilanishi kutilmoqda" text="Guruh yaratuvchisi navbatni belgilaydi." />;
    if (g.queueMethod === 'lottery') {
      if (g.draftOrder && g.draftOrder.length) return (
        <Stage n="2-bosqich · Navbat" title="Qur’a natijasi" text="Natijani tasdiqlasangiz, navbat o‘zgarmaydi. Kerak bo‘lsa, qayta o‘tkazing.">
          <OrderList g={g} ids={g.draftOrder} />
          <div className="row-btns">
            <button className="btn btn-ghost" onClick={() => openSheet('lottery', { gid: g.id })}><Icon n="shuffle" s={18} /> Qayta o‘tkazish</button>
            <button className="btn btn-primary" onClick={() => confirm({ title: 'Qur’a natijasini tasdiqlaysizmi?', text: 'Tasdiqlangandan so‘ng navbat o‘zgarmaydi.', yes: 'Tasdiqlash', onYes: () => call(g.id, '/lock', {}, 'Qur’a natijasi tasdiqlandi') })}><Icon n="lock" s={18} /> Natijani tasdiqlash</button>
          </div>
        </Stage>
      );
      return (
        <Stage n="2-bosqich · Navbat" title="Qur’a o‘tkazing" text="Tizim barcha ishtirokchilar navbatini tasodifiy aniqlaydi. Natija tasdiqlangach, navbat o‘zgarmaydi.">
          <button className="btn btn-primary" onClick={() => openSheet('lottery', { gid: g.id })}><Icon n="dice" s={18} /> Qur’ani o‘tkazish</button>
        </Stage>
      );
    }
    if (g.queueMethod === 'random') return (
      <Stage n="2-bosqich · Navbat" title="Tasodifiy tanlash" text="Oluvchi oldindan belgilanmaydi: har davr boshida tizim hali pul olmaganlar orasidan bittasini tasodifiy tanlaydi.">
        <button className="btn btn-primary" onClick={() => call(g.id, '/lock', {}, 'Navbat usuli tasdiqlandi')}><Icon n="target" s={18} /> Usulni tasdiqlash</button>
      </Stage>
    );
    const move = (i, d) => setOrder(o => { const n = o.slice(); const j = i + d; if (j < 0 || j >= n.length) return o; [n[i], n[j]] = [n[j], n[i]]; return n; });
    return (
      <Stage n="2-bosqich · Navbat" title="Navbatni qo‘lda belgilang" text="Strelkalar bilan tartibni o‘zgartiring. Tasdiqlangandan so‘ng navbat o‘zgarmaydi.">
        <ol className="morder">
          {order.map((id, i) => (
            <li key={id}>
              <span className="n">{i + 1}</span><MAvatar g={g} m={M(g, id)} size={32} />
              <div className="grow"><b>{memberName(g, id, me)}</b><div className="hint">{fmtDate(addPeriod(g.startDate, g.period, i))}</div></div>
              <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Yuqoriga"><Icon n="up" s={18} /></button>
              <button className="icon-btn" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label="Pastga"><Icon n="down" s={18} /></button>
            </li>
          ))}
        </ol>
        <button className="btn btn-primary" onClick={() => confirm({
          title: 'Navbatni tasdiqlaysizmi?',
          text: 'Tasdiqlangandan so‘ng navbat o‘zgarmaydi: ' + order.map((id, i) => `${i + 1}. ${memberName(g, id, me)}`).join(', '),
          yes: 'Tasdiqlash',
          onYes: () => call(g.id, '/lock', { order }, 'Navbat belgilandi'),
        })}><Icon n="lock" s={18} /> Navbatni tasdiqlash</button>
      </Stage>
    );
  }

  if (g.status === 'ready') return (
    <Stage n="3-bosqich · Boshlash" title="To‘lov usulini tanlang va guruhni boshlang" text="Har bir a’zo o‘z to‘lov usulini tanlaydi: naqd yoki karta (simulyatsiya). Yaratuvchi guruhni boshlaydi.">
      {g.queueMethod === 'random' ? <p className="hint">Oluvchilar har davr boshida tasodifiy aniqlanadi.</p> : <OrderList g={g} ids={g.order} />}
      <div className="row-btns">
        <button className="btn btn-ghost" onClick={() => openSheet('paysettings', { gid: g.id })}><Icon n="wallet" s={18} /> To‘lov usulim: {payLabel(g, cards)}</button>
        {own && <button className="btn btn-primary" onClick={() => confirm({
          title: 'Guruhni boshlaysizmi?', text: `1-davr boshlanadi: muddat ${fmtDate(g.startDate)}. Barcha a’zolarga bildirishnoma yuboriladi.`, yes: 'Boshlash',
          onYes: () => call(g.id, '/start', {}, 'Guruh boshlandi'),
        })}><Icon n="play" s={18} /> Guruhni boshlash</button>}
      </div>
      {!own && <p className="hint" style={{ marginTop: 10 }}>Yaratuvchi guruhni boshlashini kuting.</p>}
    </Stage>
  );

  if (g.status === 'active') return <RoundPanel g={g} />;

  const rec = g.rounds.find(r => r.recipientId === g.me);
  return (
    <Stage n="Yakunlandi" title="Barcha davrlar tugadi" text={`Har bir ishtirokchi o‘z navbatida ${money(pot(g))} oldi${rec ? `. Siz ${rec.index + 1}-davrda oldingiz` : ''}.`} />
  );
}

function OrderList({ g, ids }) {
  const { me } = useApp();
  return (
    <ol className="morder">
      {ids.map((id, i) => (
        <li key={id}><span className="n">{i + 1}</span><MAvatar g={g} m={M(g, id)} size={30} /><div className="grow"><b>{memberName(g, id, me)}</b></div><span className="hint">{fmtDateShort(addPeriod(g.startDate, g.period, i))}</span></li>
      ))}
    </ol>
  );
}

function RoundPanel({ g }) {
  const { me, openSheet } = useApp();
  const call = useGroupCall();
  const confirm = useConfirm();
  const r = curRound(g);
  if (!r) return null;
  const rec = r.recipientId;
  const ids = Object.keys(r.payments).map(Number);
  const paidN = ids.filter(id => r.payments[id].status === 'paid').length;
  const canConfirm = rec === g.me || g.isOwner;
  const mine = r.payments[g.me];

  return (
    <section className="card stage">
      <div className="round-h">
        <div><span className="eyebrow">{r.index + 1}-davr · muddat {fmtDate(r.dueDate)}</span><h3>{rec === g.me ? 'Bu davrda pulni siz olasiz 🎉' : `${M(g, rec).name} pul oladi`}</h3></div>
        <div className="pot"><small>Yig‘ildi</small><b>{num(paidN * g.amount)}</b><span>/ {money(pot(g))}</span></div>
      </div>
      <div className="bar big"><i style={{ width: `${ids.length ? (paidN / ids.length) * 100 : 0}%` }} /></div>
      <ul className="pays">
        <li className="rcv"><MAvatar g={g} m={M(g, rec)} /><div className="t"><b>{memberName(g, rec, me)}</b><small>Oluvchi · bu davrda o‘ziga to‘lamaydi</small></div><span className="pill accent">+{money(pot(g))}</span></li>
        {ids.map(id => {
          const p = r.payments[id];
          const isMe = id === g.me;
          return (
            <li key={id}>
              <MAvatar g={g} m={M(g, id)} />
              <div className="t"><b>{memberName(g, id, me)}</b><small>{money(g.amount)} → {rec === g.me ? 'sizga' : M(g, rec).name + 'ga'}</small></div>
              <div className="acts">
                {p.status === 'paid' ? <span className="pill ok"><Icon n="check" s={14} /> To‘landi · {p.method === 'card' ? 'karta' : 'naqd'}</span> : (
                  <>
                    {p.status === 'claimed' ? <span className="pill info">Naqd topshirildi</span> : <span className="pill warn">Kutilmoqda</span>}
                    {isMe && p.status === 'pending' && <button className="btn btn-primary btn-sm" onClick={() => openSheet('pay', { gid: g.id })}>To‘lash</button>}
                    {!isMe && canConfirm && (
                      <button className={`btn ${p.status === 'claimed' ? 'btn-primary' : 'btn-ghost'} btn-xs`} onClick={() => confirm({
                        title: 'To‘lovni tasdiqlash', text: `${M(g, id).name}dan ${money(g.amount)} naqd olganingizni tasdiqlaysizmi?`, yes: 'Ha, qabul qildim',
                        onYes: () => call(g.id, `/payments/${p.id}/confirm`, {}, 'To‘lov tasdiqlandi'),
                      })}>Qabul qildim</button>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="demo-box"><div><Icon n="info" s={16} /><span>{canConfirm ? 'Naqd pulni olgach, “Qabul qildim” tugmasini bosing. ' : ''}Hamma to‘lagach, davr yakunlanadi va navbat keyingi ishtirokchiga o‘tadi. Karta to‘lovlari simulyatsiya — ilova haqiqiy pul o‘tkazmaydi.</span></div></div>
      {mine && mine.status === 'pending' && <p className="hint" style={{ marginTop: 10 }}>Sizning {money(g.amount)} to‘lovingiz kutilmoqda.</p>}
    </section>
  );
}

function Members({ g }) {
  const { me, openSheet } = useApp();
  const call = useGroupCall();
  const confirm = useConfirm();
  const own = g.isOwner;
  const forming = g.status === 'forming';
  return (
    <section className="block">
      <div className="block-h"><h2>Ishtirokchilar <span className="count">{g.members.length}/{g.size}</span></h2></div>
      <ul className="members card">
        {g.members.map(m => {
          const pos = (g.order || []).indexOf(m.id) + 1;
          const isMe = m.id === g.me;
          return (
            <li key={m.id}>
              <MAvatar g={g} m={m} size={40} />
              <div className="t"><b>{isMe ? fullName(me) + ' (siz)' : m.name}</b><small>{fmtPhone(m.phone)}{m.offline ? ' · Telegram’siz' : ''}</small></div>
              <div className="acts">
                {pos > 0 && <span className="posn">{pos}-navbat</span>}
                {m.role === 'creator' && <span className="pill prim">Yaratuvchi</span>}
                {m.status === 'invited' && <span className="pill warn">Taklif yuborildi</span>}
                {m.status === 'invited' && own && forming && (
                  <button className="btn btn-ghost btn-xs" onClick={() => confirm({
                    title: 'Telegram’siz qo‘shish',
                    text: `${m.name} Telegram’dan foydalanmaydi va guruhga qo‘shilishga rozi ekanini tasdiqlaysizmi? Uning to‘lovlarini siz yoki oluvchi “Qabul qildim” bilan belgilaysiz.`,
                    yes: 'Tasdiqlash',
                    onYes: () => call(g.id, `/members/${m.id}/offline`, {}, `${m.name} qo‘shildi`),
                  })}>Telegram’siz qo‘shish</button>
                )}
                {forming && own && m.role !== 'creator' && (
                  <button className="icon-btn" aria-label="Olib tashlash" onClick={() => confirm({
                    title: 'Ishtirokchini olib tashlash', text: `${m.name} guruh ro‘yxatidan olib tashlanadi.`, yes: 'Olib tashlash', danger: true,
                    onYes: () => call(g.id, `/members/${m.id}`, undefined, `${m.name} olib tashlandi`, 'DELETE'),
                  })}><Icon n="x" s={18} /></button>
                )}
              </div>
            </li>
          );
        })}
        {forming && own && Array.from({ length: g.size - g.members.length }, (_, i) => (
          <li key={'slot' + i} className="slot" onClick={() => openSheet('contact', { gid: g.id })}>
            <span className="av" style={{ width: 40, height: 40 }}><Icon n="plus" s={18} /></span>
            <div className="t"><b>Bo‘sh o‘rin</b><small>Kontakt qo‘shish</small></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
