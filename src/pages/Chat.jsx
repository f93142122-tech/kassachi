import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useApp } from '../context.js';
import { api, inTelegram, mediaURL } from '../api.js';
import { Avatar, BellBtn, Empty, Head, Icon, Loader } from '../components/ui.jsx';
import {
  curRound, dayLabel, fmtDateShort, fmtTime, memberName, pad2, pickFile, queueLine, readFileURL, resizeImage,
} from '../utils.js';

export default function ChatPage() {
  const { route, go, tick, toast } = useApp();
  const [chats, setChats] = useState(null);
  const id = route.id;

  useEffect(() => {
    api('/api/chats').then(setChats).catch(e => toast(e.message, 'err'));
  }, [tick, id, toast]);

  const preview = l => {
    if (!l) return 'Xabarlar yo‘q';
    if (l.type === 'system') return (l.text || '').split('\n')[0];
    const p = l.type === 'image' ? '📷 Rasm' : l.type === 'video' ? '🎬 Video' : l.type === 'voice' ? '🎤 Ovozli xabar' : l.text;
    return (l.mine ? 'Siz' : l.name || '') + ': ' + p;
  };

  return (
    <div className={`chat-layout ${id ? 'has-room' : ''}`}>
      <aside className="chat-list">
        <Head title="Chat" right={<BellBtn />} />
        {!chats ? <Loader /> : chats.length ? chats.map(c => (
          <button key={c.id} className={`citem ${id === c.id ? 'on' : ''}`} onClick={() => go('chat', { id: c.id })}>
            <Avatar img={c.image} name={c.name} size={48} sq />
            <div className="t">
              <div><b>{c.name}</b><time>{c.last ? (dayLabel(c.last.ts) === 'Bugun' ? fmtTime(c.last.ts) : dayLabel(c.last.ts)) : ''}</time></div>
              <div><span>{preview(c.last)}</span>{c.unread > 0 && id !== c.id && <i className="unread">{c.unread}</i>}</div>
            </div>
          </button>
        )) : (
          <Empty icon="chat" title="Suhbatlar yo‘q" text="Har bir guruhning o‘z chati bor. Guruh yaratganingiz yoki qo‘shilganingizda chat shu yerda paydo bo‘ladi.">
            <button className="btn btn-primary" onClick={() => go('create')}><Icon n="plus" s={18} /> Guruh yaratish</button>
          </Empty>
        )}
      </aside>
      <section className="chat-room">
        {id ? <Room key={id} gid={id} /> : <div className="room-empty"><Icon n="chat" s={36} /><p>Suhbatni tanlang</p></div>}
      </section>
    </div>
  );
}

function Room({ gid }) {
  const { groups, setGroup, me, go, openSheet, run, toast, setSummary, back } = useApp();
  const g = groups[gid];
  const [msgs, setMsgs] = useState(null);
  const [text, setText] = useState('');
  const [rec, setRec] = useState(null); // { start, recorder, cancel }
  const [recSec, setRecSec] = useState(0);
  const [fallback, setFallback] = useState(false);
  const boxRef = useRef(null);
  const stickRef = useRef(true);
  const lastIdRef = useRef(0);

  const markRead = useCallback(lastId => {
    if (!lastId) return;
    api(`/api/groups/${gid}/read`, { method: 'POST', body: { lastId } })
      .then(() => api('/api/summary')).then(setSummary).catch(() => {});
  }, [gid, setSummary]);

  const append = useCallback(nw => {
    if (!nw.length) return;
    setMsgs(prev => {
      const list = prev || [];
      const fresh = nw.filter(m => !list.some(x => x.id === m.id));
      if (!fresh.length) return list;
      return [...list, ...fresh];
    });
    lastIdRef.current = Math.max(lastIdRef.current, ...nw.map(m => m.id));
    markRead(lastIdRef.current);
  }, [markRead]);

  // Boshlang'ich yuklash
  useEffect(() => {
    api(`/api/groups/${gid}`).then(setGroup).catch(e => { toast(e.message, 'err'); go('chat'); });
    api(`/api/groups/${gid}/messages`).then(list => {
      setMsgs(list);
      lastIdRef.current = list.length ? list[list.length - 1].id : 0;
      markRead(lastIdRef.current);
    }).catch(e => toast(e.message, 'err'));
  }, [gid, setGroup, toast, go, markRead]);

  // Yangi xabarlarni har 3 soniyada olish
  useEffect(() => {
    const t = setInterval(async () => {
      if (document.hidden) return;
      try {
        const nw = await api(`/api/groups/${gid}/messages?after=${lastIdRef.current}`);
        if (nw.length) {
          const box = boxRef.current;
          stickRef.current = !box || box.scrollHeight - box.scrollTop - box.clientHeight < 120;
          append(nw);
          if (nw.some(m => m.type === 'system')) setGroup(await api(`/api/groups/${gid}`));
        }
      } catch (e) { /* tarmoq xatosi */ }
    }, 3000);
    return () => clearInterval(t);
  }, [gid, append, setGroup]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (box && stickRef.current) box.scrollTop = box.scrollHeight;
  }, [msgs]);

  const send = useCallback(async body => {
    stickRef.current = true;
    const m = await api(`/api/groups/${gid}/messages`, { method: 'POST', body });
    append([m]);
  }, [gid, append]);

  const submit = e => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText('');
    send({ type: 'text', text: t }).catch(err => { toast(err.message, 'err'); setText(t); });
  };

  const attach = kind => {
    if (kind === 'image') pickFile('image/*', f => run(async () => send({ type: 'image', media: await resizeImage(f, 1280, 0.8) })));
    else pickFile('video/*', f => {
      if (f.size > 15 * 1024 * 1024) { toast('Video 15 MB dan katta bo‘lmasin', 'err'); return; }
      run(async () => send({ type: 'video', media: await readFileURL(f) }));
    });
  };

  // Ovozli xabar
  useEffect(() => {
    if (!rec) return undefined;
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - rec.start) / 1000);
      setRecSec(s);
      if (s >= 120) rec.recorder.stop();
    }, 500);
    return () => clearInterval(t);
  }, [rec]);
  useEffect(() => () => { if (rec) { rec.cancel = true; try { rec.recorder.stop(); } catch (e) { /* */ } } }, [rec]);

  const startRec = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) throw new Error('no');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      const state = { start: Date.now(), recorder, cancel: false };
      recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        setRec(null); setRecSec(0);
        if (state.cancel) return;
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        const sec = Math.round((Date.now() - state.start) / 1000);
        run(async () => send({ type: 'voice', media: await readFileURL(blob), duration: `${Math.floor(sec / 60)}:${pad2(sec % 60)}` }));
      };
      recorder.start();
      setRec(state);
    } catch (e) {
      setFallback(true);
      toast('Mikrofonga ruxsat berilmadi. Audio fayl tanlashingiz mumkin.', 'err');
    }
  };
  const stopRec = cancel => { if (rec) { rec.cancel = cancel; rec.recorder.stop(); } };
  const pickAudio = () => pickFile('audio/*', f => {
    if (f.size > 6 * 1024 * 1024) { toast('Audio 6 MB dan katta bo‘lmasin', 'err'); return; }
    setFallback(false);
    run(async () => send({ type: 'voice', media: await readFileURL(f) }));
  });

  if (!g) return <div className="room"><Loader /></div>;
  const r = g.status === 'active' && curRound(g);

  let lastDay = '';
  const rows = [];
  (msgs || []).forEach(m => {
    const d = dayLabel(m.ts);
    if (d !== lastDay) { rows.push(<div key={'d' + m.id} className="dsep">{d}</div>); lastDay = d; }
    rows.push(<Msg key={m.id} m={m} />);
  });

  return (
    <div className="room">
      <header className="room-h">
        {!inTelegram && <button className="icon-btn only-m" onClick={back} aria-label="Orqaga"><Icon n="back" /></button>}
        <Avatar img={g.image} name={g.name} size={40} sq />
        <button className="room-t" onClick={() => openSheet('members', { gid })}><b>{g.name}</b><small>{g.members.length} a’zo · {queueLine(g)}</small></button>
        <button className="icon-btn" onClick={() => openSheet('queueInfo', { gid })} aria-label="Navbat ma’lumotlari"><Icon n="list" /></button>
        <button className="icon-btn" onClick={() => openSheet('members', { gid })} aria-label="Guruh a’zolari"><Icon n="users" /></button>
      </header>
      {r && (
        <div className="strip">
          <Icon n="repeat" s={16} />
          <span>{r.index + 1}-davr: {memberName(g, r.recipientId, me)} oladi · muddat {fmtDateShort(r.dueDate)} · {Object.values(r.payments).filter(p => p.status === 'paid').length}/{g.size - 1} to‘landi</span>
          <button className="link" onClick={() => go('group', { id: g.id })}>Ochish</button>
        </div>
      )}
      <div className="msgs" ref={boxRef}>
        {!msgs ? <Loader /> : rows.length ? rows : <div className="room-empty"><p>Xabarlar yo‘q</p></div>}
      </div>
      {rec ? (
        <div className="composer">
          <span className="rec-dot" /><span id="rec-time">{Math.floor(recSec / 60)}:{pad2(recSec % 60)}</span>
          <span className="grow muted" style={{ paddingLeft: 8 }}>Ovoz yozilmoqda…</span>
          <button className="btn btn-ghost btn-sm" onClick={() => stopRec(true)}>Bekor qilish</button>
          <button className="send" onClick={() => stopRec(false)} aria-label="Yuborish"><Icon n="send" /></button>
        </div>
      ) : fallback ? (
        <div className="composer">
          <span className="grow muted" style={{ padding: '0 8px', fontSize: 13.5 }}>Mikrofon ruxsati yo‘q. Audio fayl tanlang.</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setFallback(false)}>Bekor</button>
          <button className="btn btn-primary btn-sm" onClick={pickAudio}><Icon n="mic" s={16} /> Fayl</button>
        </div>
      ) : (
        <form className="composer" onSubmit={submit} autoComplete="off">
          <button type="button" className="icon-btn" onClick={() => attach('image')} aria-label="Rasm yuborish"><Icon n="image" /></button>
          <button type="button" className="icon-btn" onClick={() => attach('video')} aria-label="Video yuborish"><Icon n="video" /></button>
          <input className="input" placeholder="Xabar yozing…" maxLength={2000} value={text} onChange={e => setText(e.target.value)} />
          <button type="button" className="icon-btn" onClick={startRec} aria-label="Ovozli xabar"><Icon n="mic" /></button>
          <button className="send" aria-label="Yuborish"><Icon n="send" /></button>
        </form>
      )}
    </div>
  );
}

function Msg({ m }) {
  if (m.type === 'system') {
    return (
      <div className={`m-sys ${m.kind || ''}`}>
        <span className="tag">Kassachi tizimi</span>
        <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
        <time>{fmtTime(m.ts)}</time>
      </div>
    );
  }
  const src = mediaURL(m.media);
  let c = null;
  if (m.type === 'text') c = <span style={{ whiteSpace: 'pre-line' }}>{m.text}</span>;
  else if (m.type === 'image') c = <img src={src} alt="Rasm" loading="lazy" />;
  else if (m.type === 'video') c = <video src={src} controls playsInline preload="metadata" />;
  else if (m.type === 'voice') c = <><audio src={src} controls preload="metadata" />{m.duration && <small>🎤 {m.duration}</small>}</>;
  if (m.mine) return <div className="m"><div className="bub">{c}<time>{fmtTime(m.ts)}</time></div></div>;
  return (
    <div className="m them">
      <Avatar img={m.photo} name={m.name || '?'} size={30} />
      <div className="bub"><span className="who">{m.name || 'A’zo'}</span>{c}<time>{fmtTime(m.ts)}</time></div>
    </div>
  );
}
