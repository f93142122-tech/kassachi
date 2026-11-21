import React, { useEffect, useState } from 'react';
import { useApp } from '../context.js';
import { api, haptic } from '../api.js';
import { Avatar, Head, Icon } from '../components/ui.jsx';
import {
  METHOD, PERIOD, addPeriod, amountInput, fmtDate, fmtPhone, fullName, money, num, phoneDigits, phoneInput, pickFile,
  resizeImage, todayISO,
} from '../utils.js';

const newWizard = () => ({ step: 1, name: '', image: null, size: 4, amount: '', period: 'monthly', startDate: todayISO(), method: 'lottery', contacts: [] });
const STEPS = ['Asosiy', 'Davr va navbat', 'Ishtirokchilar', 'Tasdiqlash'];

export default function CreatePage() {
  const { wizard, setWizard } = useApp();
  useEffect(() => { if (!wizard) setWizard(newWizard()); }, [wizard, setWizard]);
  if (!wizard) return null;
  const w = wizard;
  const upd = patch => setWizard(p => ({ ...p, ...patch }));
  const Step = [Step1, Step2, Step3, Step4][w.step - 1];
  return (
    <>
      <Head title="Guruh yaratish" back />
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i + 1 < w.step ? 'done' : i + 1 === w.step ? 'cur' : ''}>
            <span>{i + 1 < w.step ? <Icon n="check" s={13} /> : i + 1}</span><em>{s}</em>
          </li>
        ))}
      </ol>
      <div className="card wiz"><Step w={w} upd={upd} /></div>
    </>
  );
}

function Calc({ size, amount }) {
  const a = +amount || 0;
  return (
    <div className="calc">
      <div className="r"><span>Har davrda to‘lovchilar</span><b>{size - 1} kishi × {num(a)}</b></div>
      <div className="r tot"><span>Oluvchiga har davrda</span><b>{money(a * (size - 1))}</b></div>
    </div>
  );
}

function Step1({ w, upd }) {
  const { toast } = useApp();
  const [amountText, setAmountText] = useState(w.amount ? num(w.amount) : '');
  const amount = +amountText.replace(/\D/g, '') || 0;
  const next = e => {
    e.preventDefault();
    if (w.name.trim().length < 2) { toast('Guruh nomini kiriting', 'err'); return; }
    if (amount < 1000) { toast('Badal miqdorini kiriting (kamida 1 000 so‘m)', 'err'); return; }
    const contacts = w.contacts.slice(0, w.size - 1);
    if (contacts.length < w.contacts.length) toast('Ortiqcha kontaktlar olib tashlandi');
    upd({ amount, contacts, name: w.name.trim(), step: 2 });
    window.scrollTo(0, 0);
  };
  return (
    <form className="stack" onSubmit={next} noValidate>
      <div className="imgpick">
        <div className="ph">{w.image ? <img src={w.image} alt="" /> : <Icon n="image" s={26} />}</div>
        <div><b>Guruh rasmi</b><div className="hint">Ixtiyoriy</div>
          <button type="button" className="link" style={{ marginTop: 4 }} onClick={() => pickFile('image/*', f => resizeImage(f, 256, 0.82).then(url => upd({ image: url })))}>{w.image ? 'Almashtirish' : 'Rasm tanlash'}</button></div>
      </div>
      <label className="field"><span>Guruh nomi</span><input className="input" maxLength={40} placeholder="Masalan: Oilaviy kassa" value={w.name} onChange={e => upd({ name: e.target.value })} /></label>
      <div className="field"><span>Ishtirokchilar soni (siz bilan birga)</span>
        <div className="sizeval"><b>{w.size} kishi</b><span className="hint">siz + {w.size - 1} kishi</span></div>
        <input type="range" min={4} max={12} step={1} value={w.size} onChange={e => upd({ size: +e.target.value })} />
        <div className="row hint" style={{ justifyContent: 'space-between' }}><span>4</span><span>12</span></div>
      </div>
      <label className="field"><span>Har bir ishtirokchining badali</span>
        <div className="prefix"><input className="input" inputMode="numeric" placeholder="500 000" value={amountText} onChange={e => setAmountText(amountInput(e.target.value))} /><b style={{ padding: '0 14px 0 0' }}>so‘m</b></div>
      </label>
      <div className="chips">{[100000, 200000, 500000, 1000000].map(v => <button type="button" key={v} className="chip" onClick={() => setAmountText(num(v))}>{num(v)}</button>)}</div>
      <Calc size={w.size} amount={amount} />
      <div className="wiz-foot"><button className="btn btn-primary">Keyingi <Icon n="chev" s={18} /></button></div>
    </form>
  );
}

function Step2({ w, upd }) {
  const { toast } = useApp();
  const next = e => {
    e.preventDefault();
    if (w.startDate < todayISO()) { toast('Boshlanish sanasi bugundan oldin bo‘lmasin', 'err'); return; }
    upd({ step: 3 });
    window.scrollTo(0, 0);
  };
  const opt = (v, t, d, icn) => (
    <label className="opt" key={v}>
      <input type="radio" name="method" checked={w.method === v} onChange={() => upd({ method: v })} />
      <span><Icon n={icn} s={22} /></span><div><b>{t}</b><small>{d}</small></div>
    </label>
  );
  return (
    <form className="stack" onSubmit={next} noValidate>
      <div className="field"><span>Pul aylanish davriyligi</span>
        <div className="segctl">
          <label><input type="radio" name="period" checked={w.period === 'weekly'} onChange={() => upd({ period: 'weekly' })} /><span><Icon n="repeat" s={16} /> Haftalik</span></label>
          <label><input type="radio" name="period" checked={w.period === 'monthly'} onChange={() => upd({ period: 'monthly' })} /><span><Icon n="calendar" s={16} /> Oylik</span></label>
        </div>
      </div>
      <label className="field"><span>Boshlanish sanasi (1-davr to‘lov muddati)</span>
        <input className="input" type="date" min={todayISO()} value={w.startDate} onChange={e => upd({ startDate: e.target.value || todayISO() })} />
      </label>
      <div className="field"><span>Pul olish navbatini belgilash usuli</span>
        <div className="opts">
          {opt('lottery', 'Qur’a', 'Guruh to‘lgach, tizim butun navbatni tasodifiy tuzadi. Tasdiqlangan natija o‘zgarmaydi.', 'dice')}
          {opt('manual', 'Qo‘lda', 'Siz (yaratuvchi) navbatni o‘zingiz belgilaysiz va tasdiqlaysiz.', 'list')}
          {opt('random', 'Tasodifiy tanlash', 'Har davr boshida tizim hali pul olmaganlar orasidan oluvchini tanlaydi.', 'target')}
        </div>
      </div>
      <div className="wiz-foot">
        <button type="button" className="btn btn-ghost" onClick={() => upd({ step: 1 })}><Icon n="back" s={18} /> Orqaga</button>
        <button className="btn btn-primary">Keyingi <Icon n="chev" s={18} /></button>
      </div>
    </form>
  );
}

function Step3({ w, upd }) {
  const { me, toast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const need = w.size - 1;
  const full = w.contacts.length >= need;
  const add = e => {
    e.preventDefault();
    const n = name.trim(), d = phoneDigits(phone);
    let err = null;
    if (n.length < 2) err = 'Kontakt ismini kiriting';
    else if (d.length !== 9) err = 'Telefon raqamini to‘liq kiriting: 9 ta raqam';
    else if (me.phone && '998' + d === me.phone) err = 'Bu sizning raqamingiz — siz allaqachon ishtirokchisiz';
    else if (w.contacts.some(c => c.phone === '998' + d)) err = 'Bu raqam allaqachon qo‘shilgan';
    if (err) { toast(err, 'err'); return; }
    upd({ contacts: [...w.contacts, { name: n, phone: '998' + d }] });
    setName(''); setPhone('');
  };
  return (
    <div className="stack">
      <div><h3>Ishtirokchilarni qo‘shing</h3>
        <p className="hint" style={{ marginTop: 4 }}>Siz ham ishtirokchisiz. {w.size} kishilik guruh uchun sizdan tashqari yana <b>{need}</b> kishi kerak. Hozir: {w.contacts.length}/{need}. Kontaktlarni keyin ham qo‘shish yoki havola orqali taklif qilish mumkin.</p></div>
      <ul className="members card">
        <li><Avatar img={me.photo} name={fullName(me)} size={38} /><div className="t"><b>{fullName(me)} (siz)</b><small>{fmtPhone(me.phone)}</small></div><span className="pill prim">Yaratuvchi</span></li>
        {w.contacts.map((c, i) => (
          <li key={c.phone}><Avatar name={c.name} size={38} /><div className="t"><b>{c.name}</b><small>{fmtPhone(c.phone)}</small></div>
            <button className="icon-btn" aria-label="Olib tashlash" onClick={() => upd({ contacts: w.contacts.filter((_, j) => j !== i) })}><Icon n="x" s={18} /></button></li>
        ))}
      </ul>
      {full ? <div className="note"><Icon n="check" s={18} /><span>Barcha o‘rinlar to‘ldi.</span></div> : (
        <form className="card stack" style={{ padding: 16 }} onSubmit={add} noValidate>
          <b>Kontakt qo‘shish</b>
          <div className="grid2">
            <label className="field"><span>Ism</span><input className="input" maxLength={40} placeholder="Ali" value={name} onChange={e => setName(e.target.value)} /></label>
            <label className="field"><span>Telefon raqami</span><div className="prefix"><b>+998</b><input className="input" inputMode="tel" placeholder="90 123 45 67" value={phone} onChange={e => setPhone(phoneInput(e.target.value))} /></div></label>
          </div>
          <button className="btn btn-soft"><Icon n="plus" s={18} /> Qo‘shish</button>
        </form>
      )}
      <div className="wiz-foot">
        <button type="button" className="btn btn-ghost" onClick={() => upd({ step: 2 })}><Icon n="back" s={18} /> Orqaga</button>
        <button type="button" className="btn btn-primary" onClick={() => { upd({ step: 4 }); window.scrollTo(0, 0); }}>Keyingi <Icon n="chev" s={18} /></button>
      </div>
    </div>
  );
}

function Step4({ w, upd }) {
  const { run, go, toast, setWizard } = useApp();
  const p = w.amount * (w.size - 1);
  const create = () => run(async () => {
    const out = await api('/api/groups', {
      method: 'POST',
      body: { name: w.name, image: w.image, size: w.size, amount: w.amount, period: w.period, startDate: w.startDate, queueMethod: w.method, contacts: w.contacts },
    });
    setWizard(null); haptic('ok'); toast('Guruh yaratildi');
    go('group', { id: out.id });
  });
  return (
    <div className="stack">
      <div className="ghero-id"><Avatar img={w.image} name={w.name} size={54} sq /><div><h2>{w.name}</h2><span className="pill warn">Yangi guruh</span></div></div>
      <div className="calc">
        <div className="r"><span>Ishtirokchilar</span><b>{w.size} kishi (siz + {w.size - 1})</b></div>
        <div className="r"><span>Qo‘shilgan kontaktlar</span><b>{w.contacts.length} / {w.size - 1}</b></div>
        <div className="r"><span>Badal</span><b>{money(w.amount)}</b></div>
        <div className="r"><span>Davriylik</span><b>{PERIOD[w.period]}</b></div>
        <div className="r"><span>Muddat</span><b>{fmtDate(w.startDate)} — {fmtDate(addPeriod(w.startDate, w.period, w.size - 1))}</b></div>
        <div className="r"><span>Navbat usuli</span><b>{METHOD[w.method]}</b></div>
        <div className="r tot"><span>Har davrda oluvchiga</span><b>{money(p)}</b></div>
      </div>
      <div className="note"><Icon n="info" s={18} /><span>Siz {w.size - 1} davrda {money(w.amount)}dan to‘laysiz (jami {money(p)}) va o‘z navbatingizda {money(p)} olasiz. O‘z navbatingiz kelgan davrda to‘lov qilmaysiz.</span></div>
      <div className="wiz-foot">
        <button type="button" className="btn btn-ghost" onClick={() => upd({ step: 3 })}><Icon n="back" s={18} /> Orqaga</button>
        <button type="button" className="btn btn-primary" onClick={create}><Icon n="check" s={18} /> Guruhni yaratish</button>
      </div>
    </div>
  );
}
