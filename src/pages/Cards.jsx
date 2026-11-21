import React, { useEffect } from 'react';
import { useApp } from '../context.js';
import { api } from '../api.js';
import { useConfirm } from '../hooks.js';
import { CardVisual, Empty, Head, Icon, Loader } from '../components/ui.jsx';

export default function CardsPage() {
  const { cards, loadCards, openSheet, run, toast } = useApp();
  const confirm = useConfirm();
  useEffect(() => { loadCards().catch(e => toast(e.message, 'err')); }, [loadCards, toast]);

  const setPrimary = id => run(async () => {
    await api(`/api/cards/${id}/primary`, { method: 'POST', body: {} });
    await loadCards(); toast('Asosiy karta o‘zgartirildi');
  });
  const del = c => confirm({
    title: 'Kartani o‘chirish',
    text: `•• ${c.last4} kartasi o‘chiriladi. Shu karta bilan sozlangan avto-to‘lovlar naqd usuliga o‘tadi.`,
    yes: 'O‘chirish', danger: true,
    onYes: () => run(async () => { await api(`/api/cards/${c.id}`, { method: 'DELETE' }); await loadCards(); toast('Karta o‘chirildi'); }),
  });

  return (
    <>
      <Head title="Kartalarim" right={<button className="btn btn-primary btn-sm" onClick={() => openSheet('addCard')}><Icon n="plus" s={18} /> Karta qo‘shish</button>} />
      <div className="warnline"><Icon n="shield" s={18} /><span>Bank integratsiyasi hali ulanmagan: karta orqali to‘lov simulyatsiya qilinadi. Karta raqami to‘liq saqlanmaydi — faqat birinchi va oxirgi 4 raqami.</span></div>
      {!cards ? <Loader /> : cards.length ? (
        <div className="bcards" style={{ marginTop: 18 }}>
          {cards.map(c => (
            <div className="bwrap" key={c.id}>
              <CardVisual c={c} />
              <div className="bacts">
                {c.primary
                  ? <span className="btn btn-soft btn-sm" style={{ cursor: 'default' }}><Icon n="star" s={16} /> Asosiy karta</span>
                  : <button className="btn btn-ghost btn-sm" onClick={() => setPrimary(c.id)}><Icon n="star" s={16} /> Asosiy qilish</button>}
                <button className="btn btn-danger btn-sm" onClick={() => del(c)}><Icon n="trash" s={16} /> O‘chirish</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 18 }}>
          <Empty icon="card" title="Karta qo‘shilmagan" text="Uzcard, Humo yoki Visa kartasini qo‘shing. Tasdiqlash kodi Telegram chatingizga bot orqali keladi.">
            <button className="btn btn-primary" onClick={() => openSheet('addCard')}><Icon n="plus" s={18} /> Karta qo‘shish</button>
          </Empty>
        </div>
      )}
    </>
  );
}
