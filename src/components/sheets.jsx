import React, { useEffect, useMemo, useState } from 'react';
import qrcode from 'qrcode-generator';
import { useApp } from '../context.js';
import { api, haptic, inTelegram, tg } from '../api.js';
import { useGroupCall } from '../hooks.js';
import { Avatar, CardVisual, Icon, Loader, MAvatar } from './ui.jsx';
import {
  BRAND, METHOD, PERIOD, brandOf, cardInput, curRound, digitsInput, expInput, fmtDate, fmtDateShort, fmtPhone, fmtPhone9,
  fullName, memberName, money, parseInvite, phoneDigits, phoneInput, pickFile, planRounds, pot, resizeImage, shuffle, sleep,
  usernameInput,
} from '../utils.js';

function SheetHead({ title, sub }) {
  const { closeSheet } = useApp();
  return (
    <div className="sh-h">
      <div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>
      <button className="icon-btn" onClick={closeSheet} aria-label="Yopish"><Icon n="x" /></button>
    </div>
  );
}

function Confirm({ title, text, yes, danger, onYes }) {
  const { closeSheet } = useApp();
  return (
    <>
      <SheetHead title={title} sub={text} />
      <div className="row" style={{ justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost" onClick={closeSheet}>Bekor qilish</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => { closeSheet(); if (onYes) onYes(); }}>{yes || 'Tasdiqlash'}</button>
      </div>
    </>
  );
}

function Join() {
  const { openSheet, toast } = useApp();
  const [val, setVal] = useState('');
  const submit = e => {
    e.preventDefault();
    const code = parseInvite(val);
    if (!code) { toast('Havola tanilmadi. To‘liq nusxalang.', 'err'); return; }
    openSheet('joinPreview', { code });
  };
  return (
    <>
      <SheetHead title="Havola bilan qo‘shilish" sub="Guruh yaratuvchisi yuborgan havolani yoki kodni joylashtiring." />
      <form className="stack" onSubmit={submit} noValidate>
        <label className="field"><span>Taklif havolasi yoki kodi</span>
          <textarea className="input" placeholder="https://t.me/…?start=join_…" value={val} onChange={e => setVal(e.target.value)} autoFocus /></label>
        <button className="btn btn-primary btn-block">Taklifni ko‘rish</button>
      </form>
    </>
  );
}

function JoinPreview({ code }) {
  const { run, go, toast, closeSheet } = useApp();
  const [p, setP] = useState(null);
  useEffect(() => {
    api(`/api/invite/${code}`).then(setP).catch(e => { toast(e.message, 'err'); closeSheet(); });
  }, [code, toast, closeSheet]);
  const join = () => run(async () => {
    const out = await api(`/api/invite/${code}/join`, { method: 'POST', body: {} });
    haptic('ok'); toast('Guruhga qo‘shildingiz'); go('group', { id: out.id });
  });
  if (!p) return <><SheetHead title="Guruhga taklif" /><Loader /></>;
  return (
    <>
      <SheetHead title="Guruhga taklif" sub={`${p.creator} taklif qildi`} />
      <div className="stack">
        <div className="ghero-id"><Avatar img={p.image} name={p.name} size={54} sq /><div><h2>{p.name}</h2><span className="pill warn">{p.members}/{p.size} ishtirokchi</span></div></div>
        <div className="calc">
          <div className="r"><span>Badal</span><b>{money(p.amount)}</b></div>
          <div className="r"><span>Davriylik</span><b>{PERIOD[p.period]}</b></div>
          <div className="r"><span>Boshlanish</span><b>{fmtDate(p.startDate)}</b></div>
          <div className="r"><span>Navbat usuli</span><b>{METHOD[p.queueMethod]}</b></div>
          <div className="r tot"><span>Har davrda oluvchiga</span><b>{money(p.amount * (p.size - 1))}</b></div>
        </div>
        {p.joined ? <button className="btn btn-primary btn-block" onClick={() => go('group', { id: p.id })}>Guruhni ochish</button>
          : p.status !== 'forming' ? <div className="warnline"><Icon n="info" s={18} /><span>Guruh allaqachon shakllangan.</span></div>
            : <button className="btn btn-primary btn-block" onClick={join}><Icon n="check" s={18} /> Guruhga qo‘shilish</button>}
      </div>
    </>
  );
}

function Invite({ gid }) {
  const { groups, toast } = useApp();
  const g = groups[gid];
  const link = g.inviteLink || '';
  const svg = useMemo(() => {
    if (!link) return null;
    try { const q = qrcode(0, 'M'); q.addData(link); q.make(); return q.createSvgTag(4, 2); } catch (e) { return null; }
  }, [link]);
  const copy = () => {
    try { navigator.clipboard.writeText(link).then(() => toast('Havola nusxalandi'), () => toast('Nusxalab bo‘lmadi — havolani belgilab oling', 'err')); }
    catch (e) { toast('Nusxalab bo‘lmadi — havolani belgilab oling', 'err'); }
  };
  const share = () => {
    if (!link) { toast('Havola tayyor emas', 'err'); return; }
    const text = `“${g.name}” guruhiga qo‘shiling: ${g.size} kishi, ${money(g.amount)}, ${PERIOD[g.period].toLowerCase()}.`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
    if (inTelegram && tg.openTelegramLink) tg.openTelegramLink(url); else window.open(url, '_blank');
  };
  return (
    <>
      <SheetHead title="Guruhga taklif qilish" sub={`“${g.name}” · ${g.members.length}/${g.size} ishtirokchi`} />
      <div className="stack">
        <div className="qrbox" aria-label="Taklif QR-kodi">
          {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="hint" style={{ color: '#333', textAlign: 'center' }}>QR-kod tayyor emas. Havoladan foydalaning.</p>}
        </div>
        <p className="hint" style={{ textAlign: 'center' }}>QR-kodni telefon kamerasi bilan skanerlang yoki havolani yuboring. Havola botni ochadi va bir bosishda guruhga qo‘shadi.</p>
        <div className="codeline">
          <input className="input" value={link} readOnly aria-label="Taklif havolasi" onFocus={e => e.target.select()} />
          <button className="btn btn-ghost btn-sm" onClick={copy}><Icon n="copy" s={16} /> Nusxa</button>
        </div>
        <div className="tg-share"><button className="btn btn-primary" onClick={share}><Icon n="send" s={18} /> Telegram’da yuborish</button></div>
      </div>
    </>
  );
}

function Contact({ gid }) {
  const { groups, me, toast } = useApp();
  const call = useGroupCall();
  const g = groups[gid];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const submit = e => {
    e.preventDefault();
    const n = name.trim(), d = phoneDigits(phone);
    let err = null;
    if (n.length < 2) err = 'Kontakt ismini kiriting';
    else if (d.length !== 9) err = 'Telefon raqamini to‘liq kiriting: 9 ta raqam';
    else if (me.phone && '998' + d === me.phone) err = 'Bu sizning raqamingiz — siz allaqachon ishtirokchisiz';
    else if (g.members.some(m => m.phone === '998' + d)) err = 'Bu raqam allaqachon qo‘shilgan';
    if (err) { toast(err, 'err'); return; }
    call(gid, '/contacts', { name: n, phone: '998' + d }, `${n} qo‘shildi`);
  };
  return (
    <>
      <SheetHead title="Kontakt qo‘shish" sub={`${g.members.length}/${g.size} · yana ${g.size - g.members.length} kishi qo‘shish mumkin`} />
      <form className="stack" onSubmit={submit} noValidate>
        <label className="field"><span>Ism</span><input className="input" maxLength={40} placeholder="Masalan: Vali" value={name} onChange={e => setName(e.target.value)} autoFocus /></label>
        <label className="field"><span>Telefon raqami</span><div className="prefix"><b>+998</b><input className="input" inputMode="tel" placeholder="90 123 45 67" value={phone} onChange={e => setPhone(phoneInput(e.target.value))} /></div></label>
        <p className="hint">Agar bu raqam Kassachi’da ro‘yxatdan o‘tgan bo‘lsa, unga bot orqali taklif boradi. Aks holda havolani o‘zingiz yuboring.</p>
        <button className="btn btn-primary btn-block"><Icon n="plus" s={18} /> Qo‘shish</button>
      </form>
    </>
  );
}

// Qur'a: server tasodifiy tartibni yaratadi, ekranda esa aralashtirish animatsiyasi
function Lottery({ gid }) {
  const { groups, me, setGroup, closeSheet, toast } = useApp();
  const g = groups[gid];
  const [order, setOrder] = useState(() => g.members.map(m => m.id));
  useEffect(() => {
    let alive = true;
    const ids = g.members.map(m => m.id);
    const timer = setInterval(() => setOrder(shuffle(ids)), 90);
    const t0 = Date.now();
    (async () => {
      try {
        const res = await api(`/api/groups/${gid}/lottery`, { method: 'POST', body: {} });
        const wait = 1600 - (Date.now() - t0);
        if (wait > 0) await sleep(wait);
        if (!alive) return;
        setGroup(res); haptic('ok');
      } catch (e) { toast(e.message, 'err'); haptic('error'); }
      finally { clearInterval(timer); if (alive) closeSheet(); }
    })();
    return () => { alive = false; clearInterval(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <SheetHead title="Qur’a" sub={`${g.size} ishtirokchi · tizim navbatni tasodifiy aniqlaydi`} />
      <ol className="lot spin">{order.map(id => <li key={id}><span className="n">?</span><b className="grow">{memberName(g, id, me)}</b></li>)}</ol>
      <button className="btn btn-primary btn-block" disabled><Icon n="dice" s={18} /> Aralashtirilmoqda…</button>
    </>
  );
}

function CardPick({ cards, value, onChange, showHolder }) {
  return (
    <div className="cardpick">
      {cards.map(c => (
        <label key={c.id}>
          <input type="radio" name="card" checked={value === c.id} onChange={() => onChange(c.id)} />
          <span className={`mini-brand ${c.type}`}>{BRAND[c.type]}</span>
          <span className="grow"><b>•••• {c.last4}</b>{showHolder && <div className="hint">{c.holder}</div>}</span>
        </label>
      ))}
    </div>
  );
}

function PaySettings({ gid }) {
  const { groups, cards, loadCards, go } = useApp();
  const call = useGroupCall();
  const g = groups[gid];
  const p = g.myPay || { method: 'cash' };
  const list = cards || [];
  useEffect(() => { if (!cards) loadCards().catch(() => {}); }, [cards, loadCards]);
  const primaryId = (list.find(c => c.primary) || list[0] || {}).id;
  const [method, setMethod] = useState(p.method === 'card' ? 'card' : 'cash');
  const [cardId, setCardId] = useState(p.cardId || null);
  const [autopay, setAutopay] = useState(!!p.autopay);
  const chosenCard = cardId || primaryId || null;
  const submit = e => {
    e.preventDefault();
    call(gid, '/paysettings', { method, cardId: method === 'card' ? chosenCard : null, autopay: method === 'card' && autopay }, 'To‘lov usuli saqlandi');
  };
  return (
    <>
      <SheetHead title="To‘lov usulim" sub={`${g.name} · har davrda ${money(g.amount)}`} />
      <form className="stack" onSubmit={submit} noValidate>
        <div className="opts">
          <label className="opt"><input type="radio" name="method" checked={method === 'cash'} onChange={() => setMethod('cash')} /><span><Icon n="cash" s={22} /></span>
            <div><b>Naqd</b><small>Pulni oluvchiga o‘zingiz topshirasiz, ilovada “Naqd topshirdim” deb belgilaysiz. Oluvchi tasdiqlaydi.</small></div></label>
          <label className="opt"><input type="radio" name="method" checked={method === 'card'} disabled={!list.length} onChange={() => setMethod('card')} /><span><Icon n="card" s={22} /></span>
            <div><b>Karta (simulyatsiya)</b><small>{list.length ? 'Bank ulanmagan: to‘lov qayd etiladi, lekin haqiqiy pul yechilmaydi.' : 'Avval “Karta” bo‘limida karta qo‘shing.'}</small></div></label>
        </div>
        {list.length ? (
          <>
            <CardPick cards={list} value={chosenCard} onChange={setCardId} showHolder />
            <label className="check"><input type="checkbox" checked={autopay} onChange={e => setAutopay(e.target.checked)} /><span>Avto-to‘lov: muddat kuni karta orqali avtomatik qayd etilsin (simulyatsiya)</span></label>
          </>
        ) : <button type="button" className="btn btn-ghost" onClick={() => go('cards')}><Icon n="plus" s={18} /> Karta qo‘shish</button>}
        <button className="btn btn-primary btn-block">Saqlash</button>
      </form>
    </>
  );
}

function Pay({ gid }) {
  const { groups, cards, loadCards, me } = useApp();
  const call = useGroupCall();
  const g = groups[gid];
  const r = curRound(g);
  const list = cards || [];
  useEffect(() => { if (!cards) loadCards().catch(() => {}); }, [cards, loadCards]);
  const def = (g.myPay && g.myPay.cardId) || (list.find(c => c.primary) || list[0] || {}).id;
  const [cardId, setCardId] = useState(null);
  if (!r) return <SheetHead title="Badalni to‘lash" sub="Hozir to‘lov yig‘ilayotgan davr yo‘q." />;
  return (
    <>
      <SheetHead title="Badalni to‘lash" sub={`${g.name} · ${r.index + 1}-davr`} />
      <div className="calc">
        <div className="r"><span>Oluvchi</span><b>{memberName(g, r.recipientId, me)}</b></div>
        <div className="r"><span>Muddat</span><b>{fmtDate(r.dueDate)}</b></div>
        <div className="r tot"><span>To‘lov miqdori</span><b>{money(g.amount)}</b></div>
      </div>
      <div className="stack" style={{ marginTop: 14 }}>
        <button className="btn btn-primary btn-block" onClick={() => call(gid, '/pay', { method: 'cash' }, 'Oluvchiga tasdiqlash uchun yuborildi')}><Icon n="cash" s={18} /> Naqd topshirdim</button>
        <p className="hint">Oluvchi “Qabul qildim” deb tasdiqlagach, to‘lov hisobga olinadi.</p>
        {list.length > 0 && (
          <>
            <CardPick cards={list} value={cardId || def} onChange={setCardId} />
            <button className="btn btn-ghost btn-block" onClick={() => call(gid, '/pay', { method: 'card', cardId: cardId || def }, 'To‘lov qayd etildi (simulyatsiya)')}><Icon n="card" s={18} /> Karta orqali (simulyatsiya)</button>
          </>
        )}
      </div>
    </>
  );
}

function AddCard() {
  const { run, setCards, closeSheet, toast } = useApp();
  const [f, setF] = useState({ type: 'uzcard', number: '', exp: '', holder: '' });
  const [otp, setOtp] = useState(null); // { sent, type, holderMasked, last4 }
  const [code, setCode] = useState('');
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const requestCode = e => {
    e.preventDefault();
    const n = f.number.replace(/\D/g, '');
    if (n.length !== 16) { toast('Karta raqami 16 ta raqamdan iborat bo‘lsin', 'err'); return; }
    run(async () => {
      const r = await api('/api/cards/otp', { method: 'POST', body: { number: n, exp: f.exp, holder: f.holder.trim().toUpperCase(), type: f.type } });
      setOtp(r); setCode('');
    });
  };
  const confirmCode = c => run(async () => {
    const card = await api('/api/cards/confirm', { method: 'POST', body: { code: c } });
    setCards(prev => [...(prev || []), card]);
    closeSheet(); toast('Karta qo‘shildi'); haptic('ok');
  });

  if (otp) {
    const n = f.number.replace(/\D/g, '');
    return (
      <>
        <SheetHead title="Tasdiqlash kodi" sub={otp.sent ? 'Kod Telegram chatingizga bot orqali yuborildi.' : 'Kod yuborilmadi: botni Telegram’da /start bilan ishga tushiring va qayta urinib ko‘ring.'} />
        <div className="stack">
          <CardVisual c={{ type: otp.type, first4: n.slice(0, 4), last4: otp.last4, holder: otp.holderMasked, exp: f.exp }} />
          <div className="calc"><div className="r"><span>Karta egasi (bank ma’lumoti, simulyatsiya)</span><b>{otp.holderMasked}</b></div></div>
          <form className="stack" onSubmit={e => { e.preventDefault(); confirmCode(code); }} noValidate>
            <label className="field"><span>Tasdiqlash kodi</span>
              <input className="input otp" inputMode="numeric" maxLength={6} autoComplete="one-time-code" placeholder="••••••" value={code} autoFocus
                onChange={e => { const v = digitsInput(e.target.value); setCode(v); if (v.length === 6) confirmCode(v); }} /></label>
            <button className="btn btn-primary btn-block">Kartani qo‘shish</button>
            <button type="button" className="btn btn-ghost btn-block" onClick={() => setOtp(null)}>Ma’lumotlarni o‘zgartirish</button>
          </form>
        </div>
      </>
    );
  }
  return (
    <>
      <SheetHead title="Karta qo‘shish" sub="Uzcard, Humo yoki Visa" />
      <form className="stack" onSubmit={requestCode} noValidate>
        <div className="warnline"><Icon n="shield" s={18} /><span>Bank ulanmagan: karta faqat simulyatsiya uchun. Raqam serverga to‘liq saqlanmaydi.</span></div>
        <div className="segctl">
          {['uzcard', 'humo', 'visa'].map(t => (
            <label key={t}><input type="radio" name="ctype" checked={f.type === t} onChange={() => set('type', t)} /><span>{BRAND[t]}</span></label>
          ))}
        </div>
        <label className="field"><span>Karta raqami</span>
          <input className="input tnum" inputMode="numeric" autoComplete="off" placeholder="0000 0000 0000 0000" value={f.number}
            onChange={e => { const v = cardInput(e.target.value); const b = brandOf(v.replace(/\D/g, '')); setF(p => ({ ...p, number: v, type: b || p.type })); }} /></label>
        <div className="grid2">
          <label className="field"><span>Amal qilish muddati</span><input className="input tnum" inputMode="numeric" autoComplete="off" placeholder="OO/YY" value={f.exp} onChange={e => set('exp', expInput(e.target.value))} /></label>
          <label className="field"><span>Karta egasi</span><input className="input" autoComplete="off" placeholder="ALI VALIYEV" value={f.holder} onChange={e => set('holder', e.target.value)} style={{ textTransform: 'uppercase' }} /></label>
        </div>
        <button className="btn btn-primary btn-block">Kod olish</button>
      </form>
    </>
  );
}

function EditProfile() {
  const { me, setMe, run, closeSheet, toast } = useApp();
  const [f, setF] = useState({
    firstName: me.firstName, lastName: me.lastName, username: me.username || '',
    phone: me.phone ? fmtPhone9(phoneDigits(me.phone)) : '', photo: me.photo,
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const submit = e => {
    e.preventDefault();
    const d = phoneDigits(f.phone);
    run(async () => {
      const body = { firstName: f.firstName.trim(), lastName: f.lastName.trim(), username: f.username.trim() };
      if (d) body.phone = '998' + d;
      if (f.photo === null) body.photo = null;
      else if (f.photo && f.photo.startsWith('data:')) body.photo = f.photo;
      setMe(await api('/api/me', { method: 'PATCH', body }));
      closeSheet(); toast('Profil saqlandi');
    });
  };
  return (
    <>
      <SheetHead title="Profilni tahrirlash" />
      <form className="stack" onSubmit={submit} noValidate>
        <div className="avpick">
          <div className="ph">{f.photo ? <img src={f.photo} alt="" /> : <Icon n="user" s={28} />}</div>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button type="button" className="link" onClick={() => pickFile('image/*', file => resizeImage(file, 256, 0.82).then(url => set('photo', url)))}>Rasm tanlash</button>
            {f.photo && <button type="button" className="link" style={{ color: 'var(--danger)' }} onClick={() => set('photo', null)}>O‘chirish</button>}
          </div>
        </div>
        <div className="grid2">
          <label className="field"><span>Ism</span><input className="input" maxLength={30} value={f.firstName} onChange={e => set('firstName', e.target.value)} /></label>
          <label className="field"><span>Familiya</span><input className="input" maxLength={30} value={f.lastName} onChange={e => set('lastName', e.target.value)} /></label>
        </div>
        <label className="field"><span>Foydalanuvchi nomi</span><div className="prefix"><b>@</b><input className="input" maxLength={20} value={f.username} onChange={e => set('username', usernameInput(e.target.value))} /></div></label>
        <label className="field"><span>Telefon raqami</span><div className="prefix"><b>+998</b><input className="input" inputMode="tel" value={f.phone} onChange={e => set('phone', phoneInput(e.target.value))} /></div></label>
        <button className="btn btn-primary btn-block">Saqlash</button>
      </form>
    </>
  );
}

function Members({ gid }) {
  const { groups, me, go } = useApp();
  const g = groups[gid];
  return (
    <>
      <SheetHead title="Guruh a’zolari" sub={`${g.members.length}/${g.size} · ${g.name}`} />
      <ul className="members card">
        {g.members.map(m => {
          const pos = (g.order || []).indexOf(m.id) + 1;
          return (
            <li key={m.id}>
              <MAvatar g={g} m={m} size={38} />
              <div className="t"><b>{m.id === g.me ? fullName(me) + ' (siz)' : m.name}</b><small>{fmtPhone(m.phone)}</small></div>
              <div className="acts">
                {pos > 0 && <span className="posn">{pos}-navbat</span>}
                {m.role === 'creator' && <span className="pill prim">Yaratuvchi</span>}
                {m.status === 'invited' && <span className="pill warn">Taklif</span>}
              </div>
            </li>
          );
        })}
      </ul>
      <button className="btn btn-soft btn-block" style={{ marginTop: 14 }} onClick={() => go('group', { id: g.id })}>Guruh sahifasi</button>
    </>
  );
}

function QueueInfo({ gid }) {
  const { groups, me, go } = useApp();
  const g = groups[gid];
  const plan = planRounds(g);
  return (
    <>
      <SheetHead title="Navbat haqida" sub={`${PERIOD[g.period]} · har davrda ${money(pot(g))}`} />
      <ul className="sched">
        {plan.map(p => (
          <li key={p.i}>
            <span className="d">{p.i + 1}. {fmtDateShort(p.due)}</span>
            <span className="grow">{p.rid ? memberName(g, p.rid, me) : 'Aniqlanmagan'}</span>
            {p.state === 'done' ? <span className="pill ok">Yakunlangan</span> : p.state === 'cur' ? <span className="pill accent">{p.paidN}/{g.size - 1}</span> : <span className="pill mut">Rejada</span>}
          </li>
        ))}
      </ul>
      <button className="btn btn-soft btn-block" style={{ marginTop: 14 }} onClick={() => go('queue', { id: g.id })}><Icon n="list" s={18} /> To‘liq navbat jadvali</button>
    </>
  );
}

export const SHEETS = {
  confirm: Confirm, join: Join, joinPreview: JoinPreview, invite: Invite, contact: Contact, lottery: Lottery,
  paysettings: PaySettings, pay: Pay, addCard: AddCard, editProfile: EditProfile, members: Members, queueInfo: QueueInfo,
};
