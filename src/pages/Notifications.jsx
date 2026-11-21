import React, { useEffect, useState } from 'react';
import { useApp } from '../context.js';
import { api } from '../api.js';
import { Empty, Head, Icon, Loader } from '../components/ui.jsx';
import { relTime } from '../utils.js';

const IC = { invited: 'hand', full: 'users', lottery: 'dice', queue: 'list', due: 'clock', paid: 'arrowup', received: 'arrowdown', turn: 'repeat', completed: 'flag' };

export default function NotificationsPage() {
  const { go, run, toast, setSummary } = useApp();
  const [list, setList] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const l = await api('/api/notifications');
        setList(l);
        if (l.some(n => !n.read)) {
          await api('/api/notifications/read', { method: 'POST' });
          setSummary(s => ({ ...s, notifs: 0 }));
        }
      } catch (e) { toast(e.message, 'err'); }
    })();
  }, [toast, setSummary]);

  const clear = () => run(async () => { await api('/api/notifications', { method: 'DELETE' }); setList([]); });

  return (
    <>
      <Head title="Bildirishnomalar" back right={list && list.length > 0 && <button className="btn btn-ghost btn-sm" onClick={clear}>Tozalash</button>} />
      {!list ? <Loader /> : list.length ? (
        <ul className="rows card">
          {list.map(n => (
            <li key={n.id} onClick={n.gid ? () => go('group', { id: n.gid }) : undefined} style={n.gid ? { cursor: 'pointer' } : undefined}>
              <span className={`ri ${n.type === 'received' ? 'ok' : n.type === 'due' ? 'acc' : 'prim'}`}><Icon n={IC[n.type] || 'bell'} s={18} /></span>
              <div className="t"><b style={{ whiteSpace: 'normal' }}>{n.text}</b><small>{relTime(n.ts)}</small></div>
              {!n.read && <span className="unread" style={{ minWidth: 10, height: 10, padding: 0 }} />}
            </li>
          ))}
        </ul>
      ) : (
        <Empty icon="bell" title="Bildirishnoma yo‘q" text="Takliflar, qur’a natijalari, to‘lov muddatlari va pul tushumlari haqida shu yerda va Telegram chatida xabar beramiz." />
      )}
    </>
  );
}
