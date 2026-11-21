import React, { useState } from 'react';
import { api, haptic, inTelegram, tg } from '../api.js';
import { Icon, Logo } from '../components/ui.jsx';
import { fmtPhone9, phoneDigits, phoneInput, pickFile, resizeImage, sleep, usernameInput } from '../utils.js';

// Telegram orqali kirgandan keyin profilni to'ldirish
export default function Register({ me, onDone }) {
  const [f, setF] = useState({
    firstName: me.firstName || '',
    lastName: me.lastName || '',
    username: usernameInput(me.tgUsername || ''),
    phone: me.phone ? fmtPhone9(phoneDigits(me.phone)) : '',
    photo: me.photo || null,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const pickAvatar = () => pickFile('image/*', file => resizeImage(file, 256, 0.82).then(url => set('photo', url)));

  const shareContact = () => {
    tg.requestContact((ok, resp) => {
      if (!ok) { setErr('Raqam ulashilmadi. Qo‘lda kiriting.'); return; }
      const phone = resp && resp.responseUnsafe && resp.responseUnsafe.contact && resp.responseUnsafe.contact.phone_number;
      const fill = p => { set('phone', fmtPhone9(phoneDigits(p).slice(-9))); setErr(''); haptic('ok'); };
      if (phone) { fill(phone); return; }
      // Eski Telegram versiyalari: raqam bot orqali serverga yoziladi
      (async () => {
        for (let i = 0; i < 5; i++) {
          await sleep(1200);
          try { const u = await api('/api/me'); if (u.phone) { fill(u.phone); return; } } catch (e) { /* qayta urinamiz */ }
        }
        setErr('Raqam hali kelmadi. Qo‘lda kiriting.');
      })();
    });
  };

  const submit = async e => {
    e.preventDefault();
    const d = phoneDigits(f.phone);
    if (d.length !== 9) { setErr('Telefon raqamini to‘liq kiriting yoki Telegram orqali ulashing'); return; }
    setBusy(true); setErr('');
    try {
      const u = await api('/api/me/register', {
        method: 'POST',
        body: {
          firstName: f.firstName.trim(), lastName: f.lastName.trim(), username: f.username.trim(), phone: '998' + d,
          photo: f.photo && f.photo.startsWith('data:') ? f.photo : undefined,
        },
      });
      haptic('ok');
      onDone(u);
    } catch (e2) {
      setErr(e2.message);
      haptic('error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-art">
        <div className="logo"><Logo />Kassachi</div>
        <div>
          <h2>Birgalikda jamg‘aring, navbat bilan oling</h2>
          <p>4–12 kishilik guruh tuzing, badal va davriylikni kelishing. Har davrda yig‘ilgan pul navbatdagi ishtirokchiga o‘tadi.</p>
        </div>
        <span className="hint" style={{ color: 'var(--hero-muted)' }}>Telegram Mini App</span>
      </div>
      <div className="auth-form">
        <div className="auth-box">
          <div className="logo auth-m-logo" style={{ padding: 0 }}><Logo />Kassachi</div>
          <div><h1>Profil yaratish</h1></div>
          <p className="sub">Telegram orqali kirdingiz. Guruh a’zolari sizni shu ma’lumotlar bilan ko‘radi.</p>
          <form className="stack" onSubmit={submit} noValidate>
            <div className="avpick">
              <div className="ph">{f.photo ? <img src={f.photo} alt="" /> : <Icon n="user" s={28} />}</div>
              <div><b>Profil rasmi</b><div className="hint">Ixtiyoriy</div><button type="button" className="link" onClick={pickAvatar}>{f.photo ? 'Almashtirish' : 'Rasm tanlash'}</button></div>
            </div>
            <div className="grid2">
              <label className="field"><span>Ism</span><input className="input" maxLength={30} autoComplete="given-name" value={f.firstName} onChange={e => set('firstName', e.target.value)} /></label>
              <label className="field"><span>Familiya</span><input className="input" maxLength={30} autoComplete="family-name" value={f.lastName} onChange={e => set('lastName', e.target.value)} /></label>
            </div>
            <label className="field"><span>Foydalanuvchi nomi</span>
              <div className="prefix"><b>@</b><input className="input" maxLength={20} placeholder="username" value={f.username} onChange={e => set('username', usernameInput(e.target.value))} /></div>
              <small className="hint">4–20 belgi: lotin harflari, raqamlar va “_”</small>
            </label>
            <label className="field"><span>Telefon raqami</span>
              <div className="prefix"><b>+998</b><input className="input" inputMode="tel" placeholder="90 123 45 67" value={f.phone} onChange={e => set('phone', phoneInput(e.target.value))} /></div>
            </label>
            {inTelegram && tg.requestContact && (
              <button type="button" className="btn btn-soft btn-block" onClick={shareContact}><Icon n="phone" s={18} /> Telegram raqamimni ulashish</button>
            )}
            <p className="hint">Telefon raqami sizni guruhga taklif qilinganingizda tanib olish uchun kerak.</p>
            {err && <div className="warnline"><Icon n="info" s={18} /><span>{err}</span></div>}
            <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Saqlanmoqda…' : 'Profilni yaratish'}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
