import React, { useEffect } from 'react';
import { useApp } from '../context.js';
import { api, inTelegram, tg } from '../api.js';
import { useConfirm } from '../hooks.js';
import { Avatar, BellBtn, Head, Icon } from '../components/ui.jsx';
import { cardLabel, fmtPhone, fullName } from '../utils.js';

const NL = {
  invited: 'Guruhga taklif va qo‘shilish', full: 'Guruh to‘liq shakllandi', lottery: 'Qur’a yakunlandi', queue: 'Navbat belgilandi',
  due: 'To‘lov muddati yaqinlashdi', paid: 'To‘lov amalga oshirildi', received: 'Pul qabul qilindi', turn: 'Navbat almashdi', completed: 'Guruh yakunlandi',
};
const LIMITS = [
  ['card', 'Bank to‘lovlari', 'Uzcard/Humo/Visa ekvayring provayderi ulanmagan: karta to‘lovlari simulyatsiya, naqd to‘lovlar esa ilovada qayd etiladi.'],
  ['shield', 'Kirish', 'Telegram akkauntingiz orqali xavfsiz kirasiz — alohida SMS kerak emas.'],
  ['bell', 'Bildirishnomalar', 'Telegram bot orqali yuboriladi. Botni bloklasangiz, xabarlar faqat ilovada ko‘rinadi.'],
];

export default function ProfilePage() {
  const { me, setMe, cards, loadCards, go, openSheet, run, toast, theme, setTheme } = useApp();
  const confirm = useConfirm();
  useEffect(() => { if (!cards) loadCards().catch(() => {}); }, [cards, loadCards]);
  const prim = (cards || []).find(c => c.primary);
  const notif = me.notif || {};

  const toggle = async (k, val) => {
    try { setMe(await api('/api/me/notif', { method: 'PATCH', body: { [k]: val } })); toast(val ? 'Bildirishnoma yoqildi' : 'Bildirishnoma o‘chirildi'); }
    catch (e) { toast(e.message, 'err'); }
  };
  const deleteAccount = () => confirm({
    title: 'Hisobni o‘chirish',
    text: 'Profilingiz, kartalaringiz va siz yaratgan (faol bo‘lmagan) guruhlar o‘chiriladi. Buni qaytarib bo‘lmaydi.',
    yes: 'O‘chirish', danger: true,
    onYes: () => run(async () => {
      await api('/api/me/delete', { method: 'POST' });
      toast('Hisob o‘chirildi');
      setTimeout(() => (inTelegram ? tg.close() : location.reload()), 900);
    }),
  });

  return (
    <>
      <Head title="Profil" right={<BellBtn />} />
      <section className="card pcard">
        <Avatar img={me.photo} name={fullName(me)} size={76} />
        <div className="t"><h2>{fullName(me)}</h2><p>@{me.username} · {fmtPhone(me.phone)}</p></div>
        <button className="btn btn-ghost btn-sm" onClick={() => openSheet('editProfile')}><Icon n="edit" s={16} /> Tahrirlash</button>
      </section>
      <section className="block"><div className="block-h"><h2>Kartalar</h2></div>
        <ul className="setl card"><li>
          <button className="setrow" onClick={() => go('cards')}>
            <span className="ri prim"><Icon n="card" s={18} /></span>
            <span className="t"><b>Kartalarim</b><small>{cards ? (cards.length ? `${cards.length} ta karta${prim ? ' · asosiy: ' + cardLabel(prim) : ''}` : 'Karta qo‘shilmagan') : '…'}</small></span>
            <Icon n="chev" s={18} />
          </button>
        </li></ul>
      </section>
      <section className="block"><div className="block-h"><h2>Ko‘rinish</h2></div>
        <div className="segctl" role="radiogroup" aria-label="Mavzu">
          {[['system', 'monitor', 'Avtomatik'], ['light', 'sun', 'Yorug‘'], ['dark', 'moon', 'Qorong‘i']].map(([v, icn, l]) => (
            <label key={v}><input type="radio" name="theme" checked={theme === v} onChange={() => setTheme(v)} /><span><Icon n={icn} s={16} /> {l}</span></label>
          ))}
        </div>
        <p className="hint" style={{ marginTop: 8 }}>“Avtomatik” Telegram yoki qurilmangiz mavzusiga moslashadi.</p>
      </section>
      <section className="block"><div className="block-h"><h2>Bildirishnomalar</h2></div>
        <p className="hint" style={{ margin: '-4px 0 10px' }}>Yoqilganlari ilovada va Telegram chatida bot orqali keladi.</p>
        <ul className="setl card">
          {Object.keys(NL).map(k => (
            <li key={k}><div className="t"><b>{NL[k]}</b></div>
              <label className="switch"><input type="checkbox" checked={notif[k] !== false} onChange={e => toggle(k, e.target.checked)} aria-label={NL[k]} /><i /></label></li>
          ))}
        </ul>
      </section>
      <section className="block"><div className="block-h"><h2>Hozircha cheklovlar</h2></div>
        <ul className="setl card limits">
          {LIMITS.map(x => <li key={x[1]}><span className="ri"><Icon n={x[0]} s={18} /></span><div className="t"><b>{x[1]}</b><small>{x[2]}</small></div></li>)}
        </ul>
      </section>
      <section className="block"><button className="btn btn-danger" onClick={deleteAccount}><Icon n="trash" s={18} /> Hisobni o‘chirish</button></section>
    </>
  );
}
