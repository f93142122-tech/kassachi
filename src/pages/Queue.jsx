import React, { useEffect } from 'react';
import { useApp } from '../context.js';
import { api } from '../api.js';
import { Head, Icon, Loader } from '../components/ui.jsx';
import { PERIOD, fmtDate, fmtDateShort, memberName, money, num, planRounds, pot } from '../utils.js';

const PAY_PILL = {
  paid: ['ok', 'To‘landi'], claimed: ['info', 'Tasdiq kutilmoqda'], pending: ['warn', 'Kutilmoqda'], plan: ['mut', 'Rejada'],
};

export default function QueuePage() {
  const { route, groups, setGroup, toast, me, tick } = useApp();
  const g = groups[route.id];
  useEffect(() => {
    api(`/api/groups/${route.id}`).then(setGroup).catch(e => toast(e.message, 'err'));
  }, [route.id, tick, setGroup, toast]);

  if (!g) return <><Head title="Navbat jadvali" back /><Loader /></>;
  const plan = planRounds(g);
  return (
    <>
      <Head title="Navbat jadvali" back sub={g.name} />
      <div className="qsum">
        <div className="card"><small>Har davrda oluvchiga</small><b>{money(pot(g))}</b></div>
        <div className="card"><small>Har bir ishtirokchi jami to‘laydi</small><b>{money(pot(g))}</b></div>
        <div className="card"><small>Davrlar soni</small><b>{g.size} · {PERIOD[g.period].toLowerCase()}</b></div>
        <div className="card"><small>Umumiy aylanma</small><b>{money(pot(g) * g.size)}</b></div>
      </div>
      <div className="note"><Icon n="info" s={18} /><span>
        Har davrda pul oluvchi o‘ziga to‘lamaydi: qolgan {g.size - 1} ishtirokchi {money(g.amount)}dan to‘laydi va oluvchi {g.size - 1} × {num(g.amount)} = <b>{money(pot(g))}</b> oladi.
        {' '}{g.queueMethod === 'random' ? 'Oluvchilar har davr boshida tasodifiy aniqlanadi.' : !g.orderLocked ? 'Navbat hali belgilanmagan.' : ''}
      </span></div>
      {plan.map(p => {
        const rn = p.rid ? memberName(g, p.rid, me) : 'Aniqlanmagan';
        const pill = p.state === 'done' ? ['ok', 'Yakunlangan'] : p.state === 'cur' ? ['accent', 'Yig‘ilmoqda'] : ['mut', 'Rejalashtirilgan'];
        return (
          <article key={p.i} className={`card qround ${p.state}`}>
            <div className="qr-h">
              <span className="qr-n">{p.i + 1}</span>
              <div className="qr-t"><b>{rn}</b><small>{fmtDate(p.due)} · to‘lov muddati</small></div>
              <div className="qr-sum"><small>Oluvchiga yetkazilgan</small><b>{money(p.sent)}</b></div>
              <span className={`pill ${pill[0]}`}>{pill[1]}</span>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>To‘lovchi</th><th>Miqdor</th><th>Muddat</th><th>Holat</th></tr></thead>
                <tbody>
                  {p.rid ? (
                    <>
                      {p.payers.map(m => {
                        const st = p.r ? (p.r.payments[m.id] || {}).status || 'plan' : 'plan';
                        const pp = PAY_PILL[st] || PAY_PILL.plan;
                        return <tr key={m.id}><td>{memberName(g, m.id, me)}</td><td>{money(g.amount)}</td><td>{fmtDateShort(p.due)}</td><td><span className={`pill ${pp[0]}`}>{pp[1]}</span></td></tr>;
                      })}
                      <tr className="rcv"><td><b>{rn}</b> — oluvchi</td><td>—</td><td>{fmtDateShort(p.due)}</td>
                        <td><b>{p.state === 'done' ? '+' + money(pot(g)) : `+${money(p.sent)} / ${num(pot(g))}`}</b></td></tr>
                    </>
                  ) : (
                    <tr><td colSpan={4} className="muted">{g.size - 1} ishtirokchi × {money(g.amount)} — oluvchi davr boshida aniqlanadi</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        );
      })}
    </>
  );
}
