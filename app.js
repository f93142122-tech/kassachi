"use strict";
/* =====================================================================
   KASSACHI — Telegram Mini App (frontend)
   Ma'lumotlar backend API (Render + Neon) orqali keladi.
   Tuzilma: 1) yordamchilar  2) API va holat  3) ko'rinishlar
            4) oynalar  5) amallar  6) ishga tushirish
   ===================================================================== */

/* ---------- 1. Yordamchilar */
const ICONS={
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  card:'<rect x="2" y="5" width="20" height="14" rx="2.5"/><path d="M2 10h20M6 15h4"/>',
  chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  bell:'<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  back:'<path d="m15 18-6-6 6-6"/>',
  chev:'<path d="m9 18 6-6-6-6"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.6a6.5 6.5 0 0 1 3.5 5.4"/>',
  calendar:'<rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  send:'<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
  video:'<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4z"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/>',
  qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3M21 14v.01M14 21h.01M17.5 17.5H21V21h-3.5z"/>',
  link:'<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  copy:'<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  star:'<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9z"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  shuffle:'<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  up:'<path d="m18 15-6-6-6 6"/>',
  down:'<path d="m6 9 6 6 6-6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  wallet:'<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M21 8h-5a4 4 0 0 0 0 8h5z"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  dice:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.2"/><circle cx="15.5" cy="15.5" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="15.5" cy="8.5" r="1.2"/><circle cx="8.5" cy="15.5" r="1.2"/>',
  hand:'<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v6M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  megaphone:'<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M17 8a5 5 0 0 1 0 8"/>',
  coins:'<circle cx="9" cy="9" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.4 18M7 7h3v4"/>',
  arrowdown:'<path d="M12 5v14M19 12l-7 7-7-7"/>',
  arrowup:'<path d="M12 19V5M5 12l7-7 7 7"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
  flag:'<path d="M4 22V4a1 1 0 0 1 1-1h12l-2 4 2 4H5"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  play:'<path d="m7 4 13 8-13 8z"/>',
  cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  server:'<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>'
};
const ic=(n,s=20)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>String(Math.abs(Math.round(n)||0)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const money=n=>(n<0?'−':'')+num(n)+' so‘m';
const MONTHS=['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr'];
const pad2=n=>String(n).padStart(2,'0');
const isoOf=d=>`${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const todayISO=()=>isoOf(new Date());
const parseISO=s=>new Date(String(s).slice(0,10)+'T00:00:00');
const fmtDate=s=>{const d=parseISO(s);return `${d.getDate()}-${MONTHS[d.getMonth()]} ${d.getFullYear()}`};
const fmtDateShort=s=>{const d=parseISO(s);return `${d.getDate()}-${MONTHS[d.getMonth()]}`};
const tsOf=t=>typeof t==='number'?t:new Date(t).getTime();
const fmtTime=t=>{const d=new Date(tsOf(t));return pad2(d.getHours())+':'+pad2(d.getMinutes())};
const daysUntil=s=>Math.round((parseISO(s)-parseISO(todayISO()))/864e5);
function relTime(t){const s=(Date.now()-tsOf(t))/1000;if(s<60)return 'hozirgina';if(s<3600)return Math.floor(s/60)+' daqiqa oldin';if(s<86400)return Math.floor(s/3600)+' soat oldin';const d=new Date(tsOf(t));return `${d.getDate()}-${MONTHS[d.getMonth()]}, ${fmtTime(t)}`}
function dayLabel(t){const d=new Date(tsOf(t)),n=new Date();const k=x=>x.toDateString();if(k(d)===k(n))return 'Bugun';if(k(d)===k(new Date(Date.now()-864e5)))return 'Kecha';return `${d.getDate()}-${MONTHS[d.getMonth()]}`}
const initials=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';
function hue(s){let x=7;for(const c of String(s))x=(x*31+c.charCodeAt(0))%360;return x}
function avatar(img,name,size=40,cls=''){const st=`width:${size}px;height:${size}px;font-size:${Math.round(size*.36)}px`;if(img)return `<span class="av ${cls}" style="${st}"><img src="${h(img)}" alt="" referrerpolicy="no-referrer"></span>`;return `<span class="av ${cls}" style="${st};background:hsl(${hue(name)} 40% 40%)">${h(initials(name))}</span>`}
const fmtPhone9=d=>[d.slice(0,2),d.slice(2,5),d.slice(5,7),d.slice(7,9)].filter(Boolean).join(' ');
const fmtPhone=p=>{if(!p)return 'Raqam ko‘rsatilmagan';const d=String(p).replace(/\D/g,'').replace(/^998/,'');return '+998 '+fmtPhone9(d)};
const phoneDigits=v=>{let d=String(v||'').replace(/\D/g,'');if(d.startsWith('998')&&d.length===12)d=d.slice(3);return d};
const PERIOD={weekly:'Haftalik',monthly:'Oylik'};
const METHOD={lottery:'Qur’a',manual:'Qo‘lda',random:'Tasodifiy tanlash'};
const BRAND={uzcard:'UZCARD',humo:'HUMO',visa:'VISA'};
function addPeriod(iso,period,n){const d=parseISO(iso);if(period==='weekly'){d.setDate(d.getDate()+7*n)}else{const day=d.getDate();d.setDate(1);d.setMonth(d.getMonth()+n);const last=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(day,last))}return isoOf(d)}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function readFileURL(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function resizeImage(file,max=1024,q=.82){return readFileURL(file).then(src=>new Promise(res=>{const img=new Image();img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',q))};img.onerror=()=>res(src);img.src=src}))}
function pickFile(accept,cb){const inp=document.getElementById('file-input');inp.value='';inp.accept=accept;inp.onchange=()=>{const f=inp.files&&inp.files[0];if(f)cb(f)};inp.click()}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- 2. API va holat */
const CFG=window.KASSACHI_CONFIG||{};
const API=String(CFG.API_URL||'').replace(/\/$/,'');
const tg=window.Telegram&&window.Telegram.WebApp;
const inTelegram=!!(tg&&tg.initData);
const D={me:null,home:null,groups:{},chats:null,cards:null,notifs:null,msgs:{},summary:{notifs:0,chats:0}};
const UI={route:{name:'home'},sheet:null,wizard:null,manualOrder:{},rec:null,recFallback:null,lastKey:'',reg:{},busy:false};

async function api(path,{method='GET',body}={}){
  const headers={};
  if(body!==undefined)headers['content-type']='application/json';
  if(inTelegram)headers.Authorization='tma '+tg.initData;
  else if(CFG.DEV_USER)headers['x-dev-user']=String(CFG.DEV_USER);
  let r;
  try{r=await fetch(API+path,{method,headers,body:body!==undefined?JSON.stringify(body):undefined})}
  catch(e){throw new Error('Server bilan aloqa yo‘q. Internetni tekshiring yoki birozdan keyin urinib ko‘ring.')}
  let j=null;try{j=await r.json()}catch(e){}
  if(!r.ok)throw new Error((j&&j.error)||`Xatolik yuz berdi (${r.status})`);
  return j;
}
const mediaURL=p=>p?(p.startsWith('http')||p.startsWith('data:')?p:API+p):null;
function haptic(kind){try{if(!tg||!tg.HapticFeedback)return;if(kind==='ok')tg.HapticFeedback.notificationOccurred('success');else if(kind==='error')tg.HapticFeedback.notificationOccurred('error');else tg.HapticFeedback.impactOccurred('light')}catch(e){}}
async function run(fn){
  if(UI.busy)return;UI.busy=true;document.body.classList.add('busy');
  try{return await fn()}catch(e){toast(e.message,'err');haptic('error')}
  finally{UI.busy=false;document.body.classList.remove('busy')}
}

const G=id=>D.groups[id];
const M=(g,id)=>g.members.find(m=>m.id===id)||{id,name:'Noma’lum',phone:''};
const fullName=u=>`${u.firstName} ${u.lastName}`.trim();
const memberName=(g,id)=>id===g.me?`${D.me.firstName} (siz)`:M(g,id).name;
const pot=g=>g.amount*(g.size-1);
const joined=g=>g.members.filter(m=>m.status==='joined').length;
const myPosition=g=>{const i=(g.order||[]).indexOf(g.me);return i+1};
function mAvatar(g,m,size){return m.id===g.me?avatar(D.me.photo,fullName(D.me),size):avatar(m.photo,m.name,size)}

/* ---------- 3. Ko'rinishlar */
const VIEWS={},SHEETS={},ACT={},FORM={};
const TAB_OF={home:'home',group:'home',queue:'home',create:'home',notifications:'home',cards:'cards',chat:'chat',profile:'profile'};
const MAIN_TABS=['home','cards','chat','profile'];
function polar(cx,cy,r,a){const t=a*Math.PI/180;return [+(cx+r*Math.cos(t)).toFixed(2),+(cy+r*Math.sin(t)).toFixed(2)]}
function arc(cx,cy,r,a0,a1){const [x0,y0]=polar(cx,cy,r,a0),[x1,y1]=polar(cx,cy,r,a1);return `M${x0} ${y0}A${r} ${r} 0 ${a1-a0>180?1:0} 1 ${x1} ${y1}`}
function logoSVG(){return `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">${[0,1,2,3,4,5].map(i=>`<path d="${arc(20,20,14,-90+i*60+7,-90+(i+1)*60-7)}" fill="none" stroke-width="7" stroke="${i===0?'var(--accent)':'var(--primary)'}" stroke-linecap="round"/>`).join('')}</svg>`}
function ring(g){
  const n=g.size,cx=100,cy=100,r=76,gap=n>8?3:5;let s='';const pos=myPosition(g);
  for(let i=0;i<n;i++){
    const a0=-90+i*360/n+gap/2,a1=-90+(i+1)*360/n-gap/2;const rd=g.rounds[i];
    const st=rd&&rd.status==='paid_out'?'done':(g.status==='active'&&g.currentRound===i?'cur':'up');
    s+=`<path d="${arc(cx,cy,r,a0,a1)}" class="seg ${st}"/>`;
    const [lx,ly]=polar(cx,cy,r,(a0+a1)/2);
    s+=`<text x="${lx}" y="${ly}" class="sn ${st}" text-anchor="middle" dominant-baseline="central">${i+1}</text>`;
    if(pos===i+1){const [mx,my]=polar(cx,cy,r+18,(a0+a1)/2);s+=`<circle cx="${mx}" cy="${my}" r="4" fill="var(--accent)"/>`}
  }
  const done=g.rounds.filter(x=>x.status==='paid_out').length;
  const big=g.status==='active'?`${g.currentRound+1}/${n}`:`${done}/${n}`;
  return `<svg viewBox="0 0 200 200" class="ring" role="img" aria-label="Navbat aylanasi: ${n} ta davr">${s}<text x="100" y="94" class="rb" text-anchor="middle">${big}</text><text x="100" y="118" class="rs" text-anchor="middle">davr</text></svg>`;
}
function statusPill(g){return ({forming:'<span class="pill warn">Shakllanmoqda</span>',queue:'<span class="pill accent">Navbat kutilmoqda</span>',ready:'<span class="pill prim">Boshlashga tayyor</span>',active:'<span class="pill ok">Faol</span>',completed:'<span class="pill mut">Yakunlangan</span>'})[g.status]||''}
function curRound(g){return g.rounds.find(r=>r.index===g.currentRound)}
function queueLine(g){
  if(g.status==='forming')return `Ishtirokchilar yig‘ilmoqda · ${joined(g)}/${g.size}`;
  if(g.status==='queue')return 'Navbat hali belgilanmagan';
  if(g.status==='ready')return 'Navbat tayyor · boshlash kutilmoqda';
  if(g.status==='active'){const r=curRound(g);return r?`${r.index+1}/${g.size}-davr · ${r.recipientId===g.me?'siz olasiz':M(g,r.recipientId).name+' oladi'}`:'Faol'}
  return 'Barcha davrlar yakunlangan';
}
function progressPct(g){if(g.status==='forming')return joined(g)/g.size*100;if(g.status==='queue'||g.status==='ready')return 100;return g.rounds.filter(r=>r.status==='paid_out').length/g.size*100}
function groupAvatar(g,size){return avatar(g.image,g.name,size,'sq')}
function bellBtn(){const n=D.summary.notifs;return `<button class="icon-btn" data-act="go" data-to="notifications" aria-label="Bildirishnomalar">${ic('bell')}${n?`<span class="badge">${n>9?'9+':n}</span>`:''}</button>`}
function head(title,o={}){const showBack=o.back&&!inTelegram;return `<header class="phead">${showBack?`<button class="icon-btn" data-act="back" aria-label="Orqaga">${ic('back')}</button>`:''}<div class="phead-t"><h1>${h(title)}</h1>${o.sub?`<p>${o.sub}</p>`:''}</div><div class="phead-r">${o.right||''}</div></header>`}
const loader=()=>`<div class="loader"><div class="spinner"></div></div>`;

function sidebar(){
  const t=TAB_OF[UI.route.name];const unread=D.summary.chats;
  const item=(k,icn,l,c)=>`<button class="nav-i ${t===k?'on':''}" data-act="go" data-to="${k}">${ic(icn)}${l}${c?`<span class="cnt">${c}</span>`:''}</button>`;
  return `<aside class="side"><div class="logo">${logoSVG()}Kassachi</div>
  ${item('home','home','Bosh ekran')}${item('cards','card','Karta')}${item('chat','chat','Chat',unread)}${item('profile','user','Profil')}
  <div class="side-foot"><button class="btn btn-primary btn-block" data-act="go" data-to="create">${ic('plus',18)} Guruh yaratish</button>
  <button class="side-me" data-act="go" data-to="profile">${avatar(D.me.photo,fullName(D.me),38)}<span class="grow"><b>${h(fullName(D.me))}</b><small>@${h(D.me.username)}</small></span></button></div></aside>`;
}
function tabbar(){
  const t=TAB_OF[UI.route.name];const unread=D.summary.chats;
  const item=(k,icn,l,c)=>`<button class="tab ${t===k?'on':''}" data-act="go" data-to="${k}" aria-label="${l}">${ic(icn,22)}${l}${c?`<span class="dot">${c>99?'99+':c}</span>`:''}</button>`;
  return `<nav class="tabbar">${item('home','home','Bosh ekran')}${item('cards','card','Karta')}${item('chat','chat','Chat',unread)}${item('profile','user','Profil')}</nav>`;
}

/* --- Bosh ekran */
VIEWS.home=()=>{
  const H=D.home;const u=D.me;
  const header=`<header class="phead"><button class="me-btn" data-act="go" data-to="profile">${avatar(u.photo,fullName(u),46)}<span class="grow"><small>Xush kelibsiz,</small><b>${h(u.firstName)}</b></span></button><div class="phead-r">${bellBtn()}</div></header>`;
  if(!H)return header+loader();
  const live=H.groups.filter(g=>g.status!=='completed');const done=H.groups.filter(g=>g.status==='completed');
  const net=H.wallet.received-H.wallet.paid;
  const deco=`<svg class="deco" viewBox="0 0 200 200" aria-hidden="true">${[0,1,2,3,4,5,6,7].map(i=>`<path d="${arc(100,100,70,-90+i*45+4,-90+(i+1)*45-4)}" fill="none" stroke="${i===0?'var(--accent)':'var(--hero-muted)'}" stroke-opacity="${i===0?1:.35}" stroke-width="22"/>`).join('')}</svg>`;
  return `${header}
  <section class="balance">${deco}
    <div class="bal-top"><span class="eyebrow">Umumiy balans</span><span class="sim">Olingan − to‘langan</span></div>
    <div class="bal-num">${money(net)}</div>
    <div class="bal-row"><div><small>Olingan</small><b>${money(H.wallet.received)}</b></div><div><small>To‘langan</small><b>${money(H.wallet.paid)}</b></div><div><small>Faol guruhlar</small><b>${live.length}</b></div></div>
    <div class="bal-actions"><button class="btn btn-accent" data-act="go" data-to="create">${ic('plus',18)} Guruh yaratish</button><button class="btn btn-hero-ghost" data-act="sheet" data-name="join">${ic('link',18)} Havola bilan qo‘shilish</button></div>
  </section>
  <div class="home-grid">
    <div class="col">
      <section class="block"><div class="block-h"><h2>Faol guruhlar</h2>${live.length?`<button class="link" data-act="go" data-to="create">${ic('plus',16)} Yangi guruh</button>`:''}</div>
        ${live.length?`<div class="gcards">${live.map(groupCard).join('')}</div>`:`<div class="empty"><div class="em-ic">${ic('users',26)}</div><h3>Hali guruhingiz yo‘q</h3><p>4–12 kishilik guruh yarating: badal miqdori va davriylikni belgilang, ishtirokchilarni taklif qiling va navbatni aniqlang.</p><button class="btn btn-primary" data-act="go" data-to="create">${ic('plus',18)} Birinchi guruhni yaratish</button></div>`}
      </section>
      <section class="block"><div class="block-h"><h2>Taklif qilingan guruhlar</h2></div>
        ${H.invites.length?`<div class="stack">${H.invites.map(inviteCard).join('')}</div>`:`<div class="empty-sm">${ic('hand')}<p>Telefon raqamingiz bo‘yicha yuborilgan takliflar shu yerda ko‘rinadi. Havola olgan bo‘lsangiz, <button class="link" data-act="sheet" data-name="join">havola bilan qo‘shiling</button>.</p></div>`}
      </section>
      ${done.length?`<section class="block"><div class="block-h"><h2>Yakunlangan guruhlar</h2></div><div class="gcards">${done.map(groupCard).join('')}</div></section>`:''}
      <section class="block"><div class="block-h"><h2>So‘nggi faoliyatlar</h2></div>
        ${H.activity.length?`<ul class="rows card">${H.activity.map(a=>`<li><span class="ri ${a.amount>0?'ok':a.amount<0?'dan':'prim'}">${ic(a.icon||'info',18)}</span><div class="t"><b>${h(a.title)}</b><small>${h(a.sub||'')} · ${relTime(a.ts)}</small></div>${a.amount?`<span class="amt ${a.amount>0?'plus':''}">${a.amount>0?'+':''}${money(a.amount)}</span>`:''}</li>`).join('')}</ul>`:`<div class="empty-sm">${ic('clock')}<p>Guruh yaratish, to‘lovlar va pul tushumlari shu yerda ko‘rinadi.</p></div>`}
      </section>
    </div>
    <div class="col">
      ${myQueueBlock(H.groups)}
      ${nextPayoutBlock(H.groups)}
      <section class="block"><div class="block-h"><h2>Yangiliklar va e’lonlar</h2></div>
        <ul class="rows card news">
          <li><span class="ri acc">${ic('megaphone',18)}</span><div class="t"><b style="white-space:normal">Kassachi qanday ishlaydi</b><small>Har davrda bitta ishtirokchi qolganlarning badalini oladi. Oluvchi o‘sha davrda o‘ziga to‘lamaydi.</small></div></li>
          <li><span class="ri prim">${ic('cash',18)}</span><div class="t"><b style="white-space:normal">Naqd to‘lov</b><small>To‘lovchi “Naqd topshirdim” deydi, oluvchi “Qabul qildim” bilan tasdiqlaydi. Ilova pulni o‘zi o‘tkazmaydi.</small></div></li>
          <li><span class="ri">${ic('lock',18)}</span><div class="t"><b style="white-space:normal">Qur’a qoidasi</b><small>Qur’a yoki qo‘lda belgilangan navbat tasdiqlangach, uni o‘zgartirib bo‘lmaydi.</small></div></li>
        </ul>
      </section>
    </div>
  </div>`;
};
function groupCard(g){
  const pos=myPosition(g);
  return `<button class="gcard" data-act="go" data-to="group" data-id="${g.id}">
    <div class="gcard-top">${groupAvatar(g,46)}<div class="gcard-t"><b>${h(g.name)}</b>${statusPill(g)}</div><span class="muted">${ic('chev',18)}</span></div>
    <div class="gmeta"><div><small>Ishtirokchi</small><b>${joined(g)}/${g.size}</b></div><div><small>Badal</small><b>${num(g.amount)}</b></div><div><small>Davriylik</small><b>${PERIOD[g.period]}</b></div></div>
    <div class="gprog"><div class="bar"><i style="width:${progressPct(g)}%"></i></div><span>${h(queueLine(g))}${pos?` · Siz: ${pos}-navbat`:''}</span></div>
  </button>`;
}
function inviteCard(inv){
  return `<div class="card invite">${avatar(null,inv.name,44,'sq')}<div class="t"><b>${h(inv.name)}</b><small>${h(inv.creator)} taklif qildi · ${inv.size} kishi · ${money(inv.amount)} · ${PERIOD[inv.period]}</small></div>
  <div class="row"><button class="btn btn-ghost btn-sm" data-act="declineInvite" data-id="${inv.id}">Rad etish</button><button class="btn btn-primary btn-sm" data-act="acceptInvite" data-code="${inv.code}">Qabul qilish</button></div></div>`;
}
function myQueueBlock(groups){
  const gs=groups.filter(g=>g.status==='ready'||g.status==='active');
  let body;
  if(!gs.length)body=`<div class="empty-sm">${ic('repeat')}<p>Navbat belgilangan guruhlarda o‘rningiz va pul olish sanangiz shu yerda ko‘rinadi.</p></div>`;
  else body=`<ul class="rows card mine-q">${gs.map(g=>{
    const pos=myPosition(g);
    if(!pos)return `<li><span class="pos">?</span><div class="t"><b>${h(g.name)}</b><small>Har davr boshida tasodifiy aniqlanadi</small></div></li>`;
    const r=g.rounds[pos-1];const st=r?(r.status==='paid_out'?'<span class="pill ok">Olingan</span>':'<span class="pill accent">Joriy davr</span>'):'<span class="pill mut">Kutilmoqda</span>';
    return `<li data-act="go" data-to="group" data-id="${g.id}" style="cursor:pointer"><span class="pos">${pos}</span><div class="t"><b>${h(g.name)}</b><small>${fmtDate(addPeriod(g.startDate,g.period,pos-1))} · ${money(pot(g))}</small></div>${st}</li>`}).join('')}</ul>`;
  return `<section class="block"><div class="block-h"><h2>Mening navbatim</h2></div>${body}</section>`;
}
function nextPayoutBlock(groups){
  let best=null;
  groups.forEach(g=>{if(g.status!=='ready'&&g.status!=='active')return;const pos=myPosition(g);if(!pos)return;const r=g.rounds[pos-1];if(r&&r.status==='paid_out')return;const d=addPeriod(g.startDate,g.period,pos-1);if(!best||d<best.d)best={g,d}});
  if(!best)return `<section class="block"><div class="block-h"><h2>Keyingi pul tushumi</h2></div><div class="empty-sm">${ic('calendar')}<p>Navbatingiz belgilangach, pul tushadigan sana shu yerda chiqadi.</p></div></section>`;
  const dl=daysUntil(best.d);
  return `<section class="block"><div class="block-h"><h2>Keyingi pul tushumi</h2></div><button class="card nextpay" style="width:100%" data-act="go" data-to="group" data-id="${best.g.id}">
    <span class="eyebrow">${h(best.g.name)}</span><span class="big">${fmtDate(best.d)}</span>
    <span class="row" style="justify-content:space-between;flex-wrap:wrap"><b class="tnum" style="color:var(--primary)">+${money(pot(best.g))}</b><span class="pill ${dl<=0?'accent':'mut'}">${dl>0?dl+' kun qoldi':dl===0?'Bugun':'Joriy davr'}</span></span></button></section>`;
}

/* --- Guruh sahifasi */
VIEWS.group=()=>{
  const g=G(UI.route.id);if(!g)return head('Guruh',{back:true})+loader();
  return `${head(g.name,{back:true,sub:`${PERIOD[g.period]} · ${g.size} kishi · ${METHOD[g.queueMethod]}`,right:`<button class="icon-btn" data-act="openChat" data-id="${g.id}" aria-label="Guruh chati">${ic('chat')}</button>`})}
  <section class="card ghero">
    <div class="ghero-l">${ring(g)}</div>
    <div style="min-width:0">
      <div class="ghero-id">${groupAvatar(g,54)}<div style="min-width:0"><h2>${h(g.name)}</h2>${statusPill(g)}</div></div>
      <dl class="stats">
        <div><dt>Badal (har kishi)</dt><dd>${money(g.amount)}</dd></div>
        <div><dt>Oluvchiga har davrda</dt><dd class="acc">${money(pot(g))}</dd></div>
        <div><dt>Davriylik</dt><dd>${PERIOD[g.period]}</dd></div>
        <div><dt>Boshlanish</dt><dd>${fmtDate(g.startDate)}</dd></div>
        <div><dt>Tugash</dt><dd>${fmtDate(addPeriod(g.startDate,g.period,g.size-1))}</dd></div>
        <div><dt>Navbat usuli</dt><dd>${METHOD[g.queueMethod]}</dd></div>
      </dl>
      <div class="row-btns">
        <button class="btn btn-soft btn-sm" data-act="go" data-to="queue" data-id="${g.id}">${ic('list',18)} Navbat jadvali</button>
        <button class="btn btn-soft btn-sm" data-act="openChat" data-id="${g.id}">${ic('chat',18)} Guruh chati</button>
        ${g.status==='forming'?`<button class="btn btn-soft btn-sm" data-act="sheet" data-name="invite" data-id="${g.id}">${ic('qr',18)} Taklif qilish</button>`:''}
        ${g.status!=='completed'&&g.status!=='forming'?`<button class="btn btn-soft btn-sm" data-act="sheet" data-name="paysettings" data-id="${g.id}">${ic('wallet',18)} To‘lov usulim</button>`:''}
      </div>
    </div>
  </section>
  ${stagePanel(g)}
  ${membersBlock(g)}
  <section class="block"><div class="row-btns">${g.isOwner?`<button class="btn btn-danger btn-sm" data-act="deleteGroup" data-id="${g.id}">${ic('trash',16)} Guruhni o‘chirish</button>`:g.status!=='active'?`<button class="btn btn-danger btn-sm" data-act="deleteGroup" data-id="${g.id}">${ic('logout',16)} Guruhdan chiqish</button>`:''}</div></section>`;
};
function stagePanel(g){
  const own=g.isOwner;
  const stage=(n,title,text,body)=>`<section class="card stage"><div class="stage-h"><div class="grow"><div class="stage-n">${n}</div><h3>${title}</h3>${text?`<p>${text}</p>`:''}</div></div>${body}</section>`;
  if(g.status==='forming'){
    const need=g.size-g.members.length;const inv=g.members.filter(m=>m.status==='invited').length;
    const slots=g.members.map(m=>`<i class="${m.status==='joined'?'on':'inv'}"></i>`).join('')+'<i></i>'.repeat(Math.max(0,need));
    return stage('1-bosqich · Ishtirokchilar','Guruh shakllanmoqda',
      need>0?`Yaratuvchidan tashqari yana ${g.size-1} kishi kerak. Hozir ${need} ta o‘rin bo‘sh.`:inv?`${inv} ta taklif javobini kutmoqda.`:'',
      `<div class="slots" aria-label="${joined(g)} / ${g.size} qo‘shildi">${slots}</div>
      <div class="row-btns">${own&&need>0?`<button class="btn btn-primary" data-act="sheet" data-name="contact" data-id="${g.id}">${ic('plus',18)} Kontakt qo‘shish</button>`:''}<button class="btn btn-ghost" data-act="sheet" data-name="invite" data-id="${g.id}">${ic('qr',18)} Havola va QR-kod</button></div>
      ${inv?`<div class="demo-box"><div>${ic('info',16)}<span>Taklif qilinganlar havola orqali Telegram’da qo‘shiladi. Telegram’dan foydalanmaydigan ishtirokchini yaratuvchi “Telegram’siz qo‘shish” tugmasi bilan tasdiqlaydi.</span></div></div>`:''}`);
  }
  if(g.status==='queue'){
    if(!own)return stage('2-bosqich · Navbat','Navbat belgilanishi kutilmoqda','Guruh yaratuvchisi navbatni belgilaydi.','');
    if(g.queueMethod==='lottery'){
      if(g.draftOrder&&g.draftOrder.length)return stage('2-bosqich · Navbat','Qur’a natijasi','Natijani tasdiqlasangiz, navbat o‘zgarmaydi. Kerak bo‘lsa, qayta o‘tkazing.',
        `<ol class="morder">${g.draftOrder.map((id,i)=>`<li><span class="n">${i+1}</span>${mAvatar(g,M(g,id),30)}<div class="grow"><b>${h(memberName(g,id))}</b></div><span class="hint">${fmtDateShort(addPeriod(g.startDate,g.period,i))}</span></li>`).join('')}</ol>
        <div class="row-btns"><button class="btn btn-ghost" data-act="lottery" data-id="${g.id}">${ic('shuffle',18)} Qayta o‘tkazish</button><button class="btn btn-primary" data-act="lockLottery" data-id="${g.id}">${ic('lock',18)} Natijani tasdiqlash</button></div>`);
      return stage('2-bosqich · Navbat','Qur’a o‘tkazing','Tizim barcha ishtirokchilar navbatini tasodifiy aniqlaydi. Natija tasdiqlangach, navbat o‘zgarmaydi.',`<button class="btn btn-primary" data-act="lottery" data-id="${g.id}">${ic('dice',18)} Qur’ani o‘tkazish</button>`);
    }
    if(g.queueMethod==='random')return stage('2-bosqich · Navbat','Tasodifiy tanlash','Oluvchi oldindan belgilanmaydi: har davr boshida tizim hali pul olmaganlar orasidan bittasini tasodifiy tanlaydi.',`<button class="btn btn-primary" data-act="lockRandom" data-id="${g.id}">${ic('target',18)} Usulni tasdiqlash</button>`);
    let ord=UI.manualOrder[g.id];
    if(!ord||ord.length!==g.members.length)ord=UI.manualOrder[g.id]=g.members.map(m=>m.id);
    return stage('2-bosqich · Navbat','Navbatni qo‘lda belgilang','Strelkalar bilan tartibni o‘zgartiring. Tasdiqlangandan so‘ng navbat o‘zgarmaydi.',
      `<ol class="morder">${ord.map((id,i)=>`<li><span class="n">${i+1}</span>${mAvatar(g,M(g,id),32)}<div class="grow"><b>${h(memberName(g,id))}</b><div class="hint">${fmtDate(addPeriod(g.startDate,g.period,i))}</div></div>
        <button class="icon-btn" data-act="mv" data-id="${g.id}" data-i="${i}" data-d="-1" ${i===0?'disabled':''} aria-label="Yuqoriga">${ic('up',18)}</button><button class="icon-btn" data-act="mv" data-id="${g.id}" data-i="${i}" data-d="1" ${i===ord.length-1?'disabled':''} aria-label="Pastga">${ic('down',18)}</button></li>`).join('')}</ol>
      <button class="btn btn-primary" data-act="lockManual" data-id="${g.id}">${ic('lock',18)} Navbatni tasdiqlash</button>`);
  }
  if(g.status==='ready'){
    const preview=g.queueMethod==='random'?'<p class="hint">Oluvchilar har davr boshida tasodifiy aniqlanadi.</p>':`<ol class="morder">${g.order.map((id,i)=>`<li><span class="n">${i+1}</span>${mAvatar(g,M(g,id),30)}<div class="grow"><b>${h(memberName(g,id))}</b></div><span class="hint">${fmtDateShort(addPeriod(g.startDate,g.period,i))}</span></li>`).join('')}</ol>`;
    return stage('3-bosqich · Boshlash','To‘lov usulini tanlang va guruhni boshlang','Har bir a’zo o‘z to‘lov usulini tanlaydi: naqd yoki karta (simulyatsiya). Yaratuvchi guruhni boshlaydi.',
      `${preview}<div class="row-btns"><button class="btn btn-ghost" data-act="sheet" data-name="paysettings" data-id="${g.id}">${ic('wallet',18)} To‘lov usulim: ${payLabel(g)}</button>${own?`<button class="btn btn-primary" data-act="startGroup" data-id="${g.id}">${ic('play',18)} Guruhni boshlash</button>`:''}</div>${own?'':'<p class="hint" style="margin-top:10px">Yaratuvchi guruhni boshlashini kuting.</p>'}`);
  }
  if(g.status==='active')return roundPanel(g);
  const rec=g.rounds.find(r=>r.recipientId===g.me);
  return stage('Yakunlandi','Barcha davrlar tugadi',`Har bir ishtirokchi o‘z navbatida ${money(pot(g))} oldi${rec?`. Siz ${rec.index+1}-davrda oldingiz`:''}.`,`<button class="btn btn-soft" data-act="go" data-to="queue" data-id="${g.id}">${ic('list',18)} To‘liq jadval</button>`);
}
function payLabel(g){const p=g.myPay;if(!p)return '—';if(p.method==='card'){const c=(D.cards||[]).find(x=>x.id===p.cardId);return `karta${c?' •• '+c.last4:''}${p.autopay?' · avto':''}`}return 'naqd'}
function roundPanel(g){
  const r=curRound(g);if(!r)return '';
  const rec=r.recipientId;const ids=Object.keys(r.payments).map(Number);
  const paidN=ids.filter(id=>r.payments[id].status==='paid').length;
  const canConfirm=rec===g.me||g.isOwner;
  const mine=r.payments[g.me];
  return `<section class="card stage">
    <div class="round-h"><div><span class="eyebrow">${r.index+1}-davr · muddat ${fmtDate(r.dueDate)}</span><h3>${rec===g.me?'Bu davrda pulni siz olasiz 🎉':`${h(M(g,rec).name)} pul oladi`}</h3></div>
    <div class="pot"><small>Yig‘ildi</small><b>${num(paidN*g.amount)}</b><span>/ ${money(pot(g))}</span></div></div>
    <div class="bar big"><i style="width:${ids.length?paidN/ids.length*100:0}%"></i></div>
    <ul class="pays">
      <li class="rcv">${mAvatar(g,M(g,rec),36)}<div class="t"><b>${h(memberName(g,rec))}</b><small>Oluvchi · bu davrda o‘ziga to‘lamaydi</small></div><span class="pill accent">+${money(pot(g))}</span></li>
      ${ids.map(id=>{const p=r.payments[id];const isMe=id===g.me;let actions='';
        if(p.status==='paid')actions=`<span class="pill ok">${ic('check',14)} To‘landi${p.method==='card'?' · karta':' · naqd'}</span>`;
        else{
          if(p.status==='claimed')actions+=`<span class="pill info">Naqd topshirildi</span>`;else actions+=`<span class="pill warn">Kutilmoqda</span>`;
          if(isMe&&p.status==='pending')actions+=`<button class="btn btn-primary btn-sm" data-act="sheet" data-name="pay" data-id="${g.id}">To‘lash</button>`;
          if(!isMe&&canConfirm)actions+=`<button class="btn ${p.status==='claimed'?'btn-primary':'btn-ghost'} btn-xs" data-act="confirmPay" data-id="${g.id}" data-p="${p.id}" data-name="${h(M(g,id).name)}">Qabul qildim</button>`;
        }
        return `<li>${mAvatar(g,M(g,id),36)}<div class="t"><b>${h(memberName(g,id))}</b><small>${money(g.amount)} → ${h(rec===g.me?'sizga':M(g,rec).name+'ga')}</small></div><div class="acts">${actions}</div></li>`}).join('')}
    </ul>
    <div class="demo-box"><div>${ic('info',16)}<span>${canConfirm?'Naqd pulni olgach, “Qabul qildim” tugmasini bosing. ':''}Hamma to‘lagach, davr yakunlanadi va navbat keyingi ishtirokchiga o‘tadi. Karta to‘lovlari simulyatsiya — ilova haqiqiy pul o‘tkazmaydi.</span></div></div>
    ${mine&&mine.status==='pending'?`<p class="hint" style="margin-top:10px">Sizning ${money(g.amount)} to‘lovingiz kutilmoqda.</p>`:''}
  </section>`;
}
function membersBlock(g){
  const own=g.isOwner;const forming=g.status==='forming';
  const rows=g.members.map(m=>{
    const pos=(g.order||[]).indexOf(m.id)+1;const isMe=m.id===g.me;
    return `<li>${mAvatar(g,m,40)}<div class="t"><b>${h(isMe?fullName(D.me)+' (siz)':m.name)}</b><small>${fmtPhone(m.phone)}${m.offline?' · Telegram’siz':''}</small></div><div class="acts">
      ${pos?`<span class="posn">${pos}-navbat</span>`:''}
      ${m.role==='creator'?'<span class="pill prim">Yaratuvchi</span>':''}
      ${m.status==='invited'?`<span class="pill warn">Taklif yuborildi</span>${own&&forming?`<button class="btn btn-ghost btn-xs" data-act="offlineMember" data-id="${g.id}" data-m="${m.id}" data-name="${h(m.name)}">Telegram’siz qo‘shish</button>`:''}`:''}
      ${forming&&own&&m.role!=='creator'?`<button class="icon-btn" data-act="removeMember" data-id="${g.id}" data-m="${m.id}" data-name="${h(m.name)}" aria-label="Olib tashlash">${ic('x',18)}</button>`:''}
    </div></li>`}).join('');
  const empty=forming&&own?Array.from({length:g.size-g.members.length},()=>`<li class="slot" data-act="sheet" data-name="contact" data-id="${g.id}"><span class="av" style="width:40px;height:40px">${ic('plus',18)}</span><div class="t"><b>Bo‘sh o‘rin</b><small>Kontakt qo‘shish</small></div></li>`).join(''):'';
  return `<section class="block"><div class="block-h"><h2>Ishtirokchilar <span class="count">${g.members.length}/${g.size}</span></h2></div><ul class="members card">${rows}${empty}</ul></section>`;
}

/* --- Navbat jadvali */
function planRounds(g){
  const out=[];
  for(let i=0;i<g.size;i++){
    const r=g.rounds[i];let rid=r?r.recipientId:null;
    if(!rid&&g.queueMethod!=='random'&&g.orderLocked&&g.order[i])rid=g.order[i];
    const payers=rid?g.members.filter(m=>m.id!==rid):[];
    const paidN=r?Object.values(r.payments).filter(p=>p.status==='paid').length:0;
    out.push({i,r,rid,due:addPeriod(g.startDate,g.period,i),payers,paidN,state:r?(r.status==='paid_out'?'done':'cur'):'plan',sent:r?(r.status==='paid_out'?pot(g):paidN*g.amount):0});
  }
  return out;
}
VIEWS.queue=()=>{
  const g=G(UI.route.id);if(!g)return head('Navbat jadvali',{back:true})+loader();
  const plan=planRounds(g);
  return `${head('Navbat jadvali',{back:true,sub:h(g.name)})}
  <div class="qsum">
    <div class="card"><small>Har davrda oluvchiga</small><b>${money(pot(g))}</b></div>
    <div class="card"><small>Har bir ishtirokchi jami to‘laydi</small><b>${money(pot(g))}</b></div>
    <div class="card"><small>Davrlar soni</small><b>${g.size} · ${PERIOD[g.period].toLowerCase()}</b></div>
    <div class="card"><small>Umumiy aylanma</small><b>${money(pot(g)*g.size)}</b></div>
  </div>
  <div class="note">${ic('info',18)}<span>Har davrda pul oluvchi o‘ziga to‘lamaydi: qolgan ${g.size-1} ishtirokchi ${money(g.amount)}dan to‘laydi va oluvchi ${g.size-1} × ${num(g.amount)} = <b>${money(pot(g))}</b> oladi. ${g.queueMethod==='random'?'Oluvchilar har davr boshida tasodifiy aniqlanadi.':!g.orderLocked?'Navbat hali belgilanmagan.':''}</span></div>
  ${plan.map(p=>{
    const rn=p.rid?memberName(g,p.rid):'Aniqlanmagan';
    const pill=p.state==='done'?'<span class="pill ok">Yakunlangan</span>':p.state==='cur'?'<span class="pill accent">Yig‘ilmoqda</span>':'<span class="pill mut">Rejalashtirilgan</span>';
    const rows=p.rid?p.payers.map(m=>{const st=p.r?(p.r.payments[m.id]||{}).status:'plan';return `<tr><td>${h(memberName(g,m.id))}</td><td>${money(g.amount)}</td><td>${fmtDateShort(p.due)}</td><td>${st==='paid'?'<span class="pill ok">To‘landi</span>':st==='claimed'?'<span class="pill info">Tasdiq kutilmoqda</span>':st==='pending'?'<span class="pill warn">Kutilmoqda</span>':'<span class="pill mut">Rejada</span>'}</td></tr>`}).join('')
      +`<tr class="rcv"><td><b>${h(rn)}</b> — oluvchi</td><td>—</td><td>${fmtDateShort(p.due)}</td><td><b>${p.state==='done'?'+'+money(pot(g)):'+'+money(p.sent)+' / '+num(pot(g))}</b></td></tr>`
      :`<tr><td colspan="4" class="muted">${g.size-1} ishtirokchi × ${money(g.amount)} — oluvchi davr boshida aniqlanadi</td></tr>`;
    return `<article class="card qround ${p.state}"><div class="qr-h"><span class="qr-n">${p.i+1}</span><div class="qr-t"><b>${h(rn)}</b><small>${fmtDate(p.due)} · to‘lov muddati</small></div><div class="qr-sum"><small>Oluvchiga yetkazilgan</small><b>${money(p.sent)}</b></div>${pill}</div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>To‘lovchi</th><th>Miqdor</th><th>Muddat</th><th>Holat</th></tr></thead><tbody>${rows}</tbody></table></div></article>`}).join('')}`;
};

/* --- Guruh yaratish */
function newWizard(){return{step:1,name:'',image:null,size:4,amount:'',period:'monthly',startDate:todayISO(),method:'lottery',contacts:[]}}
VIEWS.create=()=>{
  const w=UI.wizard||(UI.wizard=newWizard());
  const steps=['Asosiy','Davr va navbat','Ishtirokchilar','Tasdiqlash'];
  return `${head('Guruh yaratish',{back:true})}
  <ol class="steps">${steps.map((s,i)=>`<li class="${i+1<w.step?'done':i+1===w.step?'cur':''}"><span>${i+1<w.step?ic('check',13):i+1}</span><em>${s}</em></li>`).join('')}</ol>
  <div class="card wiz">${[wiz1,wiz2,wiz3,wiz4][w.step-1](w)}</div>`;
};
function calcHtml(size,amount){const a=+amount||0;return `<div class="r"><span>Har davrda to‘lovchilar</span><b>${size-1} kishi × ${num(a)}</b></div><div class="r tot"><span>Oluvchiga har davrda</span><b>${money(a*(size-1))}</b></div>`}
function wiz1(w){
  return `<form data-form="w1" class="stack" novalidate>
    <div class="imgpick"><div class="ph" id="gimg-ph">${w.image?`<img src="${w.image}" alt="">`:ic('image',26)}</div><div><b>Guruh rasmi</b><div class="hint">Ixtiyoriy</div><button type="button" class="link" data-act="pickGroupImage" style="margin-top:4px">${w.image?'Almashtirish':'Rasm tanlash'}</button></div></div>
    <label class="field"><span>Guruh nomi</span><input class="input" id="w-name" name="name" maxlength="40" placeholder="Masalan: Oilaviy kassa" value="${h(w.name)}"></label>
    <div class="field"><span>Ishtirokchilar soni (siz bilan birga)</span><div class="sizeval"><b id="w-size-val">${w.size} kishi</b><span class="hint" id="w-size-hint">siz + ${w.size-1} kishi</span></div><input type="range" id="w-size" name="size" min="4" max="12" step="1" value="${w.size}"><div class="row hint" style="justify-content:space-between"><span>4</span><span>12</span></div></div>
    <label class="field"><span>Har bir ishtirokchining badali</span><div class="prefix"><input class="input" id="w-amount" name="amount" inputmode="numeric" data-fmt="amount" placeholder="500 000" value="${w.amount?num(w.amount):''}"><b style="padding:0 14px 0 0">so‘m</b></div></label>
    <div class="chips">${[100000,200000,500000,1000000].map(v=>`<button type="button" class="chip" data-act="preset" data-v="${v}">${num(v)}</button>`).join('')}</div>
    <div class="calc" id="w-calc">${calcHtml(w.size,w.amount)}</div>
    <div class="wiz-foot"><button class="btn btn-primary">Keyingi ${ic('chev',18)}</button></div>
  </form>`;
}
function wiz2(w){
  const mopt=(v,t,d,icn)=>`<label class="opt"><input type="radio" name="method" value="${v}" ${w.method===v?'checked':''}><span>${ic(icn,22)}</span><div><b>${t}</b><small>${d}</small></div></label>`;
  return `<form data-form="w2" class="stack" novalidate>
    <div class="field"><span>Pul aylanish davriyligi</span><div class="segctl"><label><input type="radio" name="period" value="weekly" ${w.period==='weekly'?'checked':''}><span>${ic('repeat',16)} Haftalik</span></label><label><input type="radio" name="period" value="monthly" ${w.period==='monthly'?'checked':''}><span>${ic('calendar',16)} Oylik</span></label></div></div>
    <label class="field"><span>Boshlanish sanasi (1-davr to‘lov muddati)</span><input class="input" type="date" id="w-date" name="startDate" min="${todayISO()}" value="${w.startDate}"></label>
    <div class="field"><span>Pul olish navbatini belgilash usuli</span><div class="opts">
      ${mopt('lottery','Qur’a','Guruh to‘lgach, tizim butun navbatni tasodifiy tuzadi. Tasdiqlangan natija o‘zgarmaydi.','dice')}
      ${mopt('manual','Qo‘lda','Siz (yaratuvchi) navbatni o‘zingiz belgilaysiz va tasdiqlaysiz.','list')}
      ${mopt('random','Tasodifiy tanlash','Har davr boshida tizim hali pul olmaganlar orasidan oluvchini tanlaydi.','target')}
    </div></div>
    <div class="wiz-foot"><button type="button" class="btn btn-ghost" data-act="wizBack">${ic('back',18)} Orqaga</button><button class="btn btn-primary">Keyingi ${ic('chev',18)}</button></div>
  </form>`;
}
function wiz3(w){
  const need=w.size-1;const full=w.contacts.length>=need;
  return `<div class="stack">
    <div><h3>Ishtirokchilarni qo‘shing</h3><p class="hint" style="margin-top:4px">Siz ham ishtirokchisiz. ${w.size} kishilik guruh uchun sizdan tashqari yana <b>${need}</b> kishi kerak. Hozir: ${w.contacts.length}/${need}. Kontaktlarni keyin ham qo‘shish yoki havola orqali taklif qilish mumkin.</p></div>
    <ul class="members card">
      <li>${avatar(D.me.photo,fullName(D.me),38)}<div class="t"><b>${h(fullName(D.me))} (siz)</b><small>${fmtPhone(D.me.phone)}</small></div><span class="pill prim">Yaratuvchi</span></li>
      ${w.contacts.map((c,i)=>`<li>${avatar(null,c.name,38)}<div class="t"><b>${h(c.name)}</b><small>${fmtPhone(c.phone)}</small></div><button class="icon-btn" data-act="wizRemove" data-i="${i}" aria-label="Olib tashlash">${ic('x',18)}</button></li>`).join('')}
    </ul>
    ${full?`<div class="note">${ic('check',18)}<span>Barcha o‘rinlar to‘ldi.</span></div>`:`<form data-form="w3add" class="card stack" style="padding:16px" novalidate><b>Kontakt qo‘shish</b>
      <div class="grid2"><label class="field"><span>Ism</span><input class="input" id="c-name" name="name" maxlength="40" placeholder="Ali"></label>
      <label class="field"><span>Telefon raqami</span><div class="prefix"><b>+998</b><input class="input" id="c-phone" name="phone" inputmode="tel" data-fmt="phone" placeholder="90 123 45 67"></div></label></div>
      <button class="btn btn-soft">${ic('plus',18)} Qo‘shish</button></form>`}
    <div class="wiz-foot"><button type="button" class="btn btn-ghost" data-act="wizBack">${ic('back',18)} Orqaga</button><button type="button" class="btn btn-primary" data-act="wizNext3">Keyingi ${ic('chev',18)}</button></div>
  </div>`;
}
function wiz4(w){
  const a=+w.amount;const p=a*(w.size-1);const end=addPeriod(w.startDate,w.period,w.size-1);
  return `<div class="stack">
    <div class="ghero-id">${avatar(w.image,w.name,54,'sq')}<div><h2>${h(w.name)}</h2><span class="pill warn">Yangi guruh</span></div></div>
    <div class="calc">
      <div class="r"><span>Ishtirokchilar</span><b>${w.size} kishi (siz + ${w.size-1})</b></div>
      <div class="r"><span>Qo‘shilgan kontaktlar</span><b>${w.contacts.length} / ${w.size-1}</b></div>
      <div class="r"><span>Badal</span><b>${money(a)}</b></div>
      <div class="r"><span>Davriylik</span><b>${PERIOD[w.period]}</b></div>
      <div class="r"><span>Muddat</span><b>${fmtDate(w.startDate)} — ${fmtDate(end)}</b></div>
      <div class="r"><span>Navbat usuli</span><b>${METHOD[w.method]}</b></div>
      <div class="r tot"><span>Har davrda oluvchiga</span><b>${money(p)}</b></div>
    </div>
    <div class="note">${ic('info',18)}<span>Siz ${w.size-1} davrda ${money(a)}dan to‘laysiz (jami ${money(p)}) va o‘z navbatingizda ${money(p)} olasiz. O‘z navbatingiz kelgan davrda to‘lov qilmaysiz.</span></div>
    <div class="wiz-foot"><button type="button" class="btn btn-ghost" data-act="wizBack">${ic('back',18)} Orqaga</button><button type="button" class="btn btn-primary" data-act="createGroup">${ic('check',18)} Guruhni yaratish</button></div>
  </div>`;
}

/* --- Kartalar */
VIEWS.cards=()=>{
  const top=head('Kartalarim',{right:`<button class="btn btn-primary btn-sm" data-act="sheet" data-name="addCard">${ic('plus',18)} Karta qo‘shish</button>`});
  const warn=`<div class="warnline">${ic('shield',18)}<span>Bank integratsiyasi hali ulanmagan: karta orqali to‘lov simulyatsiya qilinadi. Karta raqami to‘liq saqlanmaydi — faqat birinchi va oxirgi 4 raqami.</span></div>`;
  if(!D.cards)return top+warn+loader();
  return `${top}${warn}
  ${D.cards.length?`<div class="bcards" style="margin-top:18px">${D.cards.map(c=>`<div class="bwrap">${cardVisual(c)}<div class="bacts">${c.primary?`<span class="btn btn-soft btn-sm" style="cursor:default">${ic('star',16)} Asosiy karta</span>`:`<button class="btn btn-ghost btn-sm" data-act="setPrimary" data-id="${c.id}">${ic('star',16)} Asosiy qilish</button>`}<button class="btn btn-danger btn-sm" data-act="delCard" data-id="${c.id}" data-l="${c.last4}">${ic('trash',16)} O‘chirish</button></div></div>`).join('')}</div>`
  :`<div class="empty" style="margin-top:18px"><div class="em-ic">${ic('card',26)}</div><h3>Karta qo‘shilmagan</h3><p>Uzcard, Humo yoki Visa kartasini qo‘shing. Tasdiqlash kodi Telegram chatingizga bot orqali keladi.</p><button class="btn btn-primary" data-act="sheet" data-name="addCard">${ic('plus',18)} Karta qo‘shish</button></div>`}`;
};
function cardVisual(c){return `<div class="bcard ${c.type}"><div class="top"><span class="brand">${BRAND[c.type]}</span>${c.primary?`<span class="prim">${ic('star',12)} Asosiy</span>`:''}</div><div class="num">${c.first4||'••••'} •••• •••• ${c.last4}</div><div class="bot"><div>Karta egasi<b>${h(c.holder)}</b></div><div style="text-align:right">Amal qiladi<b>${h(c.exp)}</b></div></div></div>`}
const cardLabel=c=>`${BRAND[c.type]} •• ${c.last4}`;

/* --- Chat */
VIEWS.chat=()=>{
  const id=UI.route.id;const g=id&&G(id);
  const list=D.chats;
  return `<div class="chat-layout ${id?'has-room':''}">
    <aside class="chat-list">${head('Chat',{right:bellBtn()})}
      ${!list?loader():list.length?list.map(chatItem).join(''):`<div class="empty"><div class="em-ic">${ic('chat',26)}</div><h3>Suhbatlar yo‘q</h3><p>Har bir guruhning o‘z chati bor. Guruh yaratganingiz yoki qo‘shilganingizda chat shu yerda paydo bo‘ladi.</p><button class="btn btn-primary" data-act="go" data-to="create">${ic('plus',18)} Guruh yaratish</button></div>`}
    </aside>
    <section class="chat-room">${id?(g?room(g):`<div class="room">${loader()}</div>`):`<div class="room-empty">${ic('chat',36)}<p>Suhbatni tanlang</p></div>`}</section>
  </div>`;
};
function preview(l){if(!l)return 'Xabarlar yo‘q';if(l.type==='system')return (l.text||'').split('\n')[0];const p=l.type==='image'?'📷 Rasm':l.type==='video'?'🎬 Video':l.type==='voice'?'🎤 Ovozli xabar':l.text;return (l.mine?'Siz':l.name||'')+': '+p}
function chatItem(c){
  return `<button class="citem ${UI.route.id===c.id?'on':''}" data-act="openChat" data-id="${c.id}">${avatar(c.image,c.name,48,'sq')}<div class="t"><div><b>${h(c.name)}</b><time>${c.last?(dayLabel(c.last.ts)==='Bugun'?fmtTime(c.last.ts):dayLabel(c.last.ts)):''}</time></div><div><span>${h(preview(c.last))}</span>${c.unread?`<i class="unread">${c.unread}</i>`:''}</div></div></button>`;
}
function room(g){
  const msgs=D.msgs[g.id];
  const r=g.status==='active'&&curRound(g);
  const strip=r?`<div class="strip">${ic('repeat',16)}<span>${r.index+1}-davr: ${h(memberName(g,r.recipientId))} oladi · muddat ${fmtDateShort(r.dueDate)} · ${Object.values(r.payments).filter(p=>p.status==='paid').length}/${g.size-1} to‘landi</span><button class="link" data-act="go" data-to="group" data-id="${g.id}">Ochish</button></div>`:'';
  return `<div class="room">
    <header class="room-h">${inTelegram?'':`<button class="icon-btn only-m" data-act="back" aria-label="Orqaga">${ic('back')}</button>`}${groupAvatar(g,40)}
    <button class="room-t" data-act="sheet" data-name="members" data-id="${g.id}"><b>${h(g.name)}</b><small>${g.members.length} a’zo · ${h(queueLine(g))}</small></button>
    <button class="icon-btn" data-act="sheet" data-name="queueInfo" data-id="${g.id}" aria-label="Navbat ma’lumotlari">${ic('list')}</button><button class="icon-btn" data-act="sheet" data-name="members" data-id="${g.id}" aria-label="Guruh a’zolari">${ic('users')}</button></header>
    ${strip}
    <div class="msgs" id="msgs">${msgs?msgsHtml(msgs):loader()}</div>
    ${composer(g)}
  </div>`;
}
function msgsHtml(list,prevTs){let out='',lastDay=prevTs?dayLabel(prevTs):'';list.forEach(m=>{const d=dayLabel(m.ts);if(d!==lastDay){out+=`<div class="dsep">${d}</div>`;lastDay=d}out+=msgHtml(m)});return out||'<div class="room-empty"><p>Xabarlar yo‘q</p></div>'}
function msgHtml(m){
  if(m.type==='system')return `<div class="m-sys ${m.kind||''}"><span class="tag">Kassachi tizimi</span><div>${h(m.text).replace(/\n/g,'<br>')}</div><time>${fmtTime(m.ts)}</time></div>`;
  const src=mediaURL(m.media);let c='';
  if(m.type==='text')c=h(m.text).replace(/\n/g,'<br>');
  else if(m.type==='image')c=`<img src="${h(src)}" alt="Rasm" loading="lazy">`;
  else if(m.type==='video')c=`<video src="${h(src)}" controls playsinline preload="metadata"></video>`;
  else if(m.type==='voice')c=`<audio src="${h(src)}" controls preload="metadata"></audio>${m.duration?`<small>🎤 ${h(m.duration)}</small>`:''}`;
  if(m.mine)return `<div class="m"><div class="bub">${c}<time>${fmtTime(m.ts)}</time></div></div>`;
  return `<div class="m them">${avatar(m.photo,m.name||'?',30)}<div class="bub"><span class="who">${h(m.name||'A’zo')}</span>${c}<time>${fmtTime(m.ts)}</time></div></div>`;
}
function composer(g){
  if(UI.rec&&UI.rec.gid===g.id)return `<div class="composer"><span class="rec-dot"></span><span id="rec-time">0:00</span><span class="grow muted" style="padding-left:8px">Ovoz yozilmoqda…</span><button class="btn btn-ghost btn-sm" data-act="recCancel">Bekor qilish</button><button class="send" data-act="recStop" aria-label="Yuborish">${ic('send')}</button></div>`;
  if(UI.recFallback===g.id)return `<div class="composer"><span class="grow muted" style="padding:0 8px;font-size:13.5px">Mikrofon ruxsati yo‘q. Audio fayl tanlang.</span><button class="btn btn-ghost btn-sm" data-act="recFallbackOff">Bekor</button><button class="btn btn-primary btn-sm" data-act="recFile" data-id="${g.id}">${ic('mic',16)} Fayl</button></div>`;
  return `<form class="composer" data-form="msg" data-id="${g.id}" autocomplete="off">
    <button type="button" class="icon-btn" data-act="attach" data-kind="image" data-id="${g.id}" aria-label="Rasm yuborish">${ic('image')}</button>
    <button type="button" class="icon-btn" data-act="attach" data-kind="video" data-id="${g.id}" aria-label="Video yuborish">${ic('video')}</button>
    <input class="input" id="msg-input" name="text" placeholder="Xabar yozing…" maxlength="2000">
    <button type="button" class="icon-btn" data-act="rec" data-id="${g.id}" aria-label="Ovozli xabar">${ic('mic')}</button>
    <button class="send" aria-label="Yuborish">${ic('send')}</button>
  </form>`;
}

/* --- Profil */
const NL={invited:'Guruhga taklif va qo‘shilish',full:'Guruh to‘liq shakllandi',lottery:'Qur’a yakunlandi',queue:'Navbat belgilandi',due:'To‘lov muddati yaqinlashdi',paid:'To‘lov amalga oshirildi',received:'Pul qabul qilindi',turn:'Navbat almashdi',completed:'Guruh yakunlandi'};
VIEWS.profile=()=>{
  const u=D.me;const n=u.notif||{};
  const prim=(D.cards||[]).find(c=>c.primary);
  return `${head('Profil',{right:bellBtn()})}
  <section class="card pcard">${avatar(u.photo,fullName(u),76)}<div class="t"><h2>${h(fullName(u))}</h2><p>@${h(u.username)} · ${fmtPhone(u.phone)}</p></div><button class="btn btn-ghost btn-sm" data-act="sheet" data-name="editProfile">${ic('edit',16)} Tahrirlash</button></section>
  <section class="block"><div class="block-h"><h2>Kartalar</h2></div><ul class="setl card"><li><button class="setrow" data-act="go" data-to="cards"><span class="ri prim">${ic('card',18)}</span><span class="t"><b>Kartalarim</b><small>${D.cards?(D.cards.length?`${D.cards.length} ta karta${prim?' · asosiy: '+cardLabel(prim):''}`:'Karta qo‘shilmagan'):'…'}</small></span>${ic('chev',18)}</button></li></ul></section>
  <section class="block"><div class="block-h"><h2>Bildirishnomalar</h2></div><p class="hint" style="margin:-4px 0 10px">Yoqilganlari ilovada va Telegram chatida bot orqali keladi.</p><ul class="setl card">${Object.keys(NL).map(k=>`<li><div class="t"><b>${NL[k]}</b></div><label class="switch"><input type="checkbox" data-change="notif" data-k="${k}" ${n[k]!==false?'checked':''} aria-label="${NL[k]}"><i></i></label></li>`).join('')}</ul></section>
  <section class="block"><div class="block-h"><h2>Hozircha cheklovlar</h2></div><ul class="setl card limits">
    ${[['card','Bank to‘lovlari','Uzcard/Humo/Visa ekvayring provayderi ulanmagan: karta to‘lovlari simulyatsiya, naqd to‘lovlar esa ilovada qayd etiladi.'],['shield','Kirish','Telegram akkauntingiz orqali xavfsiz kirasiz — alohida SMS kerak emas.'],['bell','Bildirishnomalar','Telegram bot orqali yuboriladi. Botni bloklasangiz, xabarlar faqat ilovada ko‘rinadi.']].map(x=>`<li><span class="ri">${ic(x[0],18)}</span><div class="t"><b>${x[1]}</b><small>${x[2]}</small></div></li>`).join('')}
  </ul></section>
  <section class="block"><button class="btn btn-danger" data-act="deleteAccount">${ic('trash',18)} Hisobni o‘chirish</button></section>`;
};

/* --- Bildirishnomalar */
VIEWS.notifications=()=>{
  const IC={invited:'hand',full:'users',lottery:'dice',queue:'list',due:'clock',paid:'arrowup',received:'arrowdown',turn:'repeat',completed:'flag'};
  const L=D.notifs;
  return `${head('Bildirishnomalar',{back:true,right:L&&L.length?`<button class="btn btn-ghost btn-sm" data-act="clearNotifs">Tozalash</button>`:''})}
  ${!L?loader():L.length?`<ul class="rows card">${L.map(n=>`<li ${n.gid?`data-act="go" data-to="group" data-id="${n.gid}" style="cursor:pointer"`:''}><span class="ri ${n.type==='received'?'ok':n.type==='due'?'acc':'prim'}">${ic(IC[n.type]||'bell',18)}</span><div class="t"><b style="white-space:normal">${h(n.text)}</b><small>${relTime(n.ts)}</small></div>${n.read?'':'<span class="unread" style="min-width:10px;height:10px;padding:0"></span>'}</li>`).join('')}</ul>`
  :`<div class="empty"><div class="em-ic">${ic('bell',26)}</div><h3>Bildirishnoma yo‘q</h3><p>Takliflar, qur’a natijalari, to‘lov muddatlari va pul tushumlari haqida shu yerda va Telegram chatida xabar beramiz.</p></div>`}`;
};

/* --- Ro'yxatdan o'tish (Telegram orqali kirgandan keyin profilni to'ldirish) */
function renderReg(){
  const a=UI.reg;
  document.getElementById('root').innerHTML=`<div class="auth"><div class="auth-art"><div class="logo">${logoSVG()}Kassachi</div><div><h2>Birgalikda jamg‘aring, navbat bilan oling</h2><p>4–12 kishilik guruh tuzing, badal va davriylikni kelishing. Har davrda yig‘ilgan pul navbatdagi ishtirokchiga o‘tadi.</p></div><span class="hint" style="color:var(--hero-muted)">Telegram Mini App</span></div>
  <div class="auth-form"><div class="auth-box"><div class="logo auth-m-logo" style="padding:0">${logoSVG()}Kassachi</div>
    <div><h1>Profil yaratish</h1></div><p class="sub">Telegram orqali kirdingiz. Guruh a’zolari sizni shu ma’lumotlar bilan ko‘radi.</p>
    <form data-form="register" class="stack" novalidate>
      <div class="avpick"><div class="ph" id="av-ph">${a.photo?`<img src="${h(a.photo)}" alt="">`:ic('user',28)}</div><div><b>Profil rasmi</b><div class="hint">Ixtiyoriy</div><button type="button" class="link" data-act="pickAvatar">${a.photo?'Almashtirish':'Rasm tanlash'}</button></div></div>
      <div class="grid2"><label class="field"><span>Ism</span><input class="input" id="p-first" name="firstName" maxlength="30" autocomplete="given-name" value="${h(a.firstName||'')}"></label><label class="field"><span>Familiya</span><input class="input" id="p-last" name="lastName" maxlength="30" autocomplete="family-name" value="${h(a.lastName||'')}"></label></div>
      <label class="field"><span>Foydalanuvchi nomi</span><div class="prefix"><b>@</b><input class="input" id="p-user" name="username" maxlength="20" data-fmt="username" placeholder="username" value="${h(a.username||'')}"></div><small class="hint">4–20 belgi: lotin harflari, raqamlar va “_”</small></label>
      <label class="field"><span>Telefon raqami</span><div class="prefix"><b>+998</b><input class="input" id="p-phone" name="phone" inputmode="tel" data-fmt="phone" placeholder="90 123 45 67" value="${a.phone?fmtPhone9(phoneDigits(a.phone)):''}"></div></label>
      ${inTelegram&&tg.requestContact?`<button type="button" class="btn btn-soft btn-block" data-act="shareContact">${ic('phone',18)} Telegram raqamimni ulashish</button>`:''}
      <p class="hint">Telefon raqami sizni guruhga taklif qilinganingizda tanib olish uchun kerak.</p>
      <button class="btn btn-primary btn-block">Profilni yaratish</button>
    </form></div></div></div>`;
}
function centerScreen(title,text,{retry=false,link=null}={}){
  document.getElementById('root').innerHTML=`<div class="center-screen">${logoSVG().replace('logo-mark','logo-mark" style="width:56px;height:56px')}<h1>${h(title)}</h1><p>${h(text)}</p>${link?`<a class="btn btn-primary" href="${h(link)}">Telegram’da ochish</a>`:''}${retry?`<button class="btn btn-primary" data-act="reload">Qayta urinish</button>`:''}</div>`;
}

/* ---------- 4. Oynalar */
function sheetHead(t,sub){return `<div class="sh-h"><div><h3>${t}</h3>${sub?`<p>${sub}</p>`:''}</div><button class="icon-btn" data-act="closeSheet" aria-label="Yopish">${ic('x')}</button></div>`}
SHEETS.confirm=s=>`${sheetHead(s.title,s.text)}<div class="row" style="justify-content:flex-end;gap:10px;flex-wrap:wrap"><button class="btn btn-ghost" data-act="closeSheet">Bekor qilish</button><button class="btn ${s.danger?'btn-danger':'btn-primary'}" data-act="confirmYes">${s.yes||'Tasdiqlash'}</button></div>`;
SHEETS.join=()=>`${sheetHead('Havola bilan qo‘shilish','Guruh yaratuvchisi yuborgan havolani yoki kodni joylashtiring.')}
  <form data-form="join" class="stack" novalidate><label class="field"><span>Taklif havolasi yoki kodi</span><textarea class="input" id="join-code" name="code" placeholder="https://t.me/…?start=join_…"></textarea></label><button class="btn btn-primary btn-block">Taklifni ko‘rish</button></form>`;
SHEETS.joinPreview=s=>{const p=s.p;
  return `${sheetHead('Guruhga taklif',`${h(p.creator)} taklif qildi`)}
  <div class="stack"><div class="ghero-id">${avatar(p.image,p.name,54,'sq')}<div><h2>${h(p.name)}</h2><span class="pill warn">${p.members}/${p.size} ishtirokchi</span></div></div>
  <div class="calc"><div class="r"><span>Badal</span><b>${money(p.amount)}</b></div><div class="r"><span>Davriylik</span><b>${PERIOD[p.period]}</b></div><div class="r"><span>Boshlanish</span><b>${fmtDate(p.startDate)}</b></div><div class="r"><span>Navbat usuli</span><b>${METHOD[p.queueMethod]}</b></div><div class="r tot"><span>Har davrda oluvchiga</span><b>${money(p.amount*(p.size-1))}</b></div></div>
  ${p.joined?`<button class="btn btn-primary btn-block" data-act="go" data-to="group" data-id="${p.id}">Guruhni ochish</button>`:p.status!=='forming'?`<div class="warnline">${ic('info',18)}<span>Guruh allaqachon shakllangan.</span></div>`:`<button class="btn btn-primary btn-block" data-act="doJoin" data-code="${h(s.code)}">${ic('check',18)} Guruhga qo‘shilish</button>`}</div>`};
SHEETS.invite=s=>{const g=G(s.id);const link=g.inviteLink||'';
  return `${sheetHead('Guruhga taklif qilish',`“${h(g.name)}” · ${g.members.length}/${g.size} ishtirokchi`)}
  <div class="stack"><div class="qrbox" id="qr-box" aria-label="Taklif QR-kodi"></div>
  <p class="hint" style="text-align:center">QR-kodni telefon kamerasi bilan skanerlang yoki havolani yuboring. Havola botni ochadi va bir bosishda guruhga qo‘shadi.</p>
  <div class="codeline"><input class="input" id="invite-link" value="${h(link)}" readonly aria-label="Taklif havolasi"><button class="btn btn-ghost btn-sm" data-act="copyLink">${ic('copy',16)} Nusxa</button></div>
  <div class="tg-share"><button class="btn btn-primary" data-act="shareLink" data-id="${g.id}">${ic('send',18)} Telegram’da yuborish</button></div></div>`};
SHEETS.contact=s=>{const g=G(s.id);
  return `${sheetHead('Kontakt qo‘shish',`${g.members.length}/${g.size} · yana ${g.size-g.members.length} kishi qo‘shish mumkin`)}
  <form data-form="contact" class="stack" novalidate><label class="field"><span>Ism</span><input class="input" id="ct-name" name="name" maxlength="40" placeholder="Masalan: Vali"></label>
  <label class="field"><span>Telefon raqami</span><div class="prefix"><b>+998</b><input class="input" id="ct-phone" name="phone" inputmode="tel" data-fmt="phone" placeholder="90 123 45 67"></div></label>
  <p class="hint">Agar bu raqam Kassachi’da ro‘yxatdan o‘tgan bo‘lsa, unga bot orqali taklif boradi. Aks holda havolani o‘zingiz yuboring.</p>
  <button class="btn btn-primary btn-block">${ic('plus',18)} Qo‘shish</button></form>`};
SHEETS.lottery=s=>{const g=G(s.id);
  return `${sheetHead('Qur’a',`${g.size} ishtirokchi · tizim navbatni tasodifiy aniqlaydi`)}<ol class="lot spin" id="lot-list">${g.members.map(m=>`<li><span class="n">?</span><b class="grow">${h(memberName(g,m.id))}</b></li>`).join('')}</ol><button class="btn btn-primary btn-block" disabled>${ic('dice',18)} Aralashtirilmoqda…</button>`};
SHEETS.paysettings=s=>{const g=G(s.id);const p=g.myPay||{method:'cash'};const cards=D.cards||[];
  return `${sheetHead('To‘lov usulim',`${h(g.name)} · har davrda ${money(g.amount)}`)}
  <form data-form="paysettings" class="stack" novalidate>
    <div class="opts">
      <label class="opt"><input type="radio" name="method" value="cash" ${p.method!=='card'?'checked':''}><span>${ic('cash',22)}</span><div><b>Naqd</b><small>Pulni oluvchiga o‘zingiz topshirasiz, ilovada “Naqd topshirdim” deb belgilaysiz. Oluvchi tasdiqlaydi.</small></div></label>
      <label class="opt"><input type="radio" name="method" value="card" ${p.method==='card'?'checked':''} ${cards.length?'':'disabled'}><span>${ic('card',22)}</span><div><b>Karta (simulyatsiya)</b><small>${cards.length?'Bank ulanmagan: to‘lov qayd etiladi, lekin haqiqiy pul yechilmaydi.':'Avval “Karta” bo‘limida karta qo‘shing.'}</small></div></label>
    </div>
    ${cards.length?`<div class="cardpick">${cards.map(c=>`<label><input type="radio" name="card" value="${c.id}" ${(p.cardId?p.cardId===c.id:c.primary)?'checked':''}><span class="mini-brand ${c.type}">${BRAND[c.type]}</span><span class="grow"><b>•••• ${c.last4}</b><div class="hint">${h(c.holder)}</div></span></label>`).join('')}</div>
    <label class="check"><input type="checkbox" name="autopay" ${p.autopay?'checked':''}><span>Avto-to‘lov: muddat kuni karta orqali avtomatik qayd etilsin (simulyatsiya)</span></label>`:`<button type="button" class="btn btn-ghost" data-act="go" data-to="cards">${ic('plus',18)} Karta qo‘shish</button>`}
    <button class="btn btn-primary btn-block">Saqlash</button></form>`};
SHEETS.pay=s=>{const g=G(s.id);const r=curRound(g);const cards=D.cards||[];
  return `${sheetHead('Badalni to‘lash',`${h(g.name)} · ${r.index+1}-davr`)}
  <div class="calc"><div class="r"><span>Oluvchi</span><b>${h(memberName(g,r.recipientId))}</b></div><div class="r"><span>Muddat</span><b>${fmtDate(r.dueDate)}</b></div><div class="r tot"><span>To‘lov miqdori</span><b>${money(g.amount)}</b></div></div>
  <div class="stack" style="margin-top:14px">
    <button class="btn btn-primary btn-block" data-act="payCash" data-id="${g.id}">${ic('cash',18)} Naqd topshirdim</button>
    <p class="hint">Oluvchi “Qabul qildim” deb tasdiqlagach, to‘lov hisobga olinadi.</p>
    ${cards.length?`<form data-form="payCard" class="stack" novalidate><div class="cardpick">${cards.map(c=>`<label><input type="radio" name="card" value="${c.id}" ${((g.myPay&&g.myPay.cardId)||((cards.find(x=>x.primary)||{}).id))===c.id?'checked':''}><span class="mini-brand ${c.type}">${BRAND[c.type]}</span><span class="grow"><b>•••• ${c.last4}</b></span></label>`).join('')}</div><button class="btn btn-ghost btn-block">${ic('card',18)} Karta orqali (simulyatsiya)</button></form>`:''}
  </div>`};
SHEETS.addCard=s=>{
  if(s.step==='otp')return `${sheetHead('Tasdiqlash kodi',s.sent?'Kod Telegram chatingizga bot orqali yuborildi.':'Kod yuborilmadi: botni Telegram’da /start bilan ishga tushiring va qayta urinib ko‘ring.')}
    <div class="stack">${cardVisual({type:s.type,first4:s.number.slice(0,4),last4:s.last4,holder:s.holderMasked,exp:s.exp})}
    <div class="calc"><div class="r"><span>Karta egasi (bank ma’lumoti, simulyatsiya)</span><b>${h(s.holderMasked)}</b></div></div>
    <form data-form="cardOtp" class="stack" novalidate><label class="field"><span>Tasdiqlash kodi</span><input class="input otp" id="otp-input" name="code" inputmode="numeric" maxlength="6" data-fmt="digits" autocomplete="one-time-code" placeholder="••••••"></label>
    <button class="btn btn-primary btn-block">Kartani qo‘shish</button><button type="button" class="btn btn-ghost btn-block" data-act="cardBack">Ma’lumotlarni o‘zgartirish</button></form></div>`;
  return `${sheetHead('Karta qo‘shish','Uzcard, Humo yoki Visa')}
  <form data-form="cardForm" class="stack" novalidate>
    <div class="warnline">${ic('shield',18)}<span>Bank ulanmagan: karta faqat simulyatsiya uchun. Raqam serverga to‘liq saqlanmaydi.</span></div>
    <div class="segctl">${['uzcard','humo','visa'].map(t=>`<label><input type="radio" name="ctype" value="${t}" ${(s.type||'uzcard')===t?'checked':''}><span>${BRAND[t]}</span></label>`).join('')}</div>
    <label class="field"><span>Karta raqami</span><input class="input tnum" id="cd-num" name="number" inputmode="numeric" autocomplete="off" data-fmt="card" placeholder="0000 0000 0000 0000" value="${s.number?s.number.replace(/(\d{4})(?=\d)/g,'$1 '):''}"></label>
    <div class="grid2"><label class="field"><span>Amal qilish muddati</span><input class="input tnum" id="cd-exp" name="exp" inputmode="numeric" autocomplete="off" data-fmt="exp" placeholder="OO/YY" value="${h(s.exp||'')}"></label>
    <label class="field"><span>Karta egasi</span><input class="input" id="cd-holder" name="holder" autocomplete="off" placeholder="ALI VALIYEV" value="${h(s.holder||'')}" style="text-transform:uppercase"></label></div>
    <button class="btn btn-primary btn-block">Kod olish</button>
  </form>`};
SHEETS.editProfile=s=>{const u=D.me;
  return `${sheetHead('Profilni tahrirlash')}<form data-form="editProfile" class="stack" novalidate>
  <div class="avpick"><div class="ph" id="av-ph">${s.photo?`<img src="${h(s.photo)}" alt="">`:ic('user',28)}</div><div class="row" style="gap:12px;flex-wrap:wrap"><button type="button" class="link" data-act="pickAvatar">Rasm tanlash</button>${s.photo?`<button type="button" class="link" style="color:var(--danger)" data-act="removeAvatar">O‘chirish</button>`:''}</div></div>
  <div class="grid2"><label class="field"><span>Ism</span><input class="input" id="e-first" name="firstName" maxlength="30" value="${h(u.firstName)}"></label><label class="field"><span>Familiya</span><input class="input" id="e-last" name="lastName" maxlength="30" value="${h(u.lastName)}"></label></div>
  <label class="field"><span>Foydalanuvchi nomi</span><div class="prefix"><b>@</b><input class="input" id="e-user" name="username" maxlength="20" data-fmt="username" value="${h(u.username)}"></div></label>
  <label class="field"><span>Telefon raqami</span><div class="prefix"><b>+998</b><input class="input" id="e-phone" name="phone" inputmode="tel" data-fmt="phone" value="${u.phone?fmtPhone9(phoneDigits(u.phone)):''}"></div></label>
  <button class="btn btn-primary btn-block">Saqlash</button></form>`};
SHEETS.members=s=>{const g=G(s.id);
  return `${sheetHead('Guruh a’zolari',`${g.members.length}/${g.size} · ${h(g.name)}`)}<ul class="members card">${g.members.map(m=>{const pos=(g.order||[]).indexOf(m.id)+1;
    return `<li>${mAvatar(g,m,38)}<div class="t"><b>${h(m.id===g.me?fullName(D.me)+' (siz)':m.name)}</b><small>${fmtPhone(m.phone)}</small></div><div class="acts">${pos?`<span class="posn">${pos}-navbat</span>`:''}${m.role==='creator'?'<span class="pill prim">Yaratuvchi</span>':''}${m.status==='invited'?'<span class="pill warn">Taklif</span>':''}</div></li>`}).join('')}</ul>
  <button class="btn btn-soft btn-block" style="margin-top:14px" data-act="go" data-to="group" data-id="${g.id}">Guruh sahifasi</button>`};
SHEETS.queueInfo=s=>{const g=G(s.id);const plan=planRounds(g);
  return `${sheetHead('Navbat haqida',`${PERIOD[g.period]} · har davrda ${money(pot(g))}`)}<ul class="sched">${plan.map(p=>`<li><span class="d">${p.i+1}. ${fmtDateShort(p.due)}</span><span class="grow">${p.rid?h(memberName(g,p.rid)):'Aniqlanmagan'}</span>${p.state==='done'?'<span class="pill ok">Yakunlangan</span>':p.state==='cur'?`<span class="pill accent">${p.paidN}/${g.size-1}</span>`:'<span class="pill mut">Rejada</span>'}</li>`).join('')}</ul>
  <button class="btn btn-soft btn-block" style="margin-top:14px" data-act="go" data-to="queue" data-id="${g.id}">${ic('list',18)} To‘liq navbat jadvali</button>`};

function openSheet(name,data={}){UI.sheet=Object.assign({name},data);renderSheet();syncBackButton()}
function closeSheet(){UI.sheet=null;renderSheet();syncBackButton()}
function renderSheet(){
  const el=document.getElementById('sheet-root');
  if(!UI.sheet){el.innerHTML='';return}
  el.innerHTML=`<div class="sheet-wrap"><div class="sheet" role="dialog" aria-modal="true">${SHEETS[UI.sheet.name](UI.sheet)}</div></div>`;
  if(UI.sheet.name==='invite'){const g=G(UI.sheet.id);const box=document.getElementById('qr-box');try{if(!g.inviteLink)throw 0;const qq=qrcode(0,'M');qq.addData(g.inviteLink);qq.make();box.innerHTML=qq.createSvgTag(4,2)}catch(e){box.innerHTML='<p class="hint" style="color:#333;text-align:center">QR-kod tayyor emas. Havoladan foydalaning.</p>'}}
}
function confirmBox(o){openSheet('confirm',o)}

function toast(text,kind=''){
  const root=document.getElementById('toast-root');const t=document.createElement('div');t.className='toast '+(kind==='err'?'err':'');
  t.innerHTML=`${ic(kind==='err'?'info':'check',18)}<span>${h(text)}</span>`;root.appendChild(t);
  while(root.children.length>3)root.firstChild.remove();
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),260)},3400);
}

/* ---------- render, navigatsiya, ma'lumot yuklash */
function render(){
  const root=document.getElementById('root');
  const r=UI.route;const key=r.name+(r.id||'');const anim=key!==UI.lastKey;UI.lastKey=key;
  const inRoom=r.name==='chat'&&r.id;
  const keepScroll=!anim?window.scrollY:0;
  root.innerHTML=`<div class="app ${inRoom?'in-room':''}">${sidebar()}<main class="main ${anim&&r.name!=='chat'?'enter':''} ${r.name==='chat'?'chatmain':''}" id="main">${(VIEWS[r.name]||VIEWS.home)()}</main>${tabbar()}</div>`;
  if(!anim)window.scrollTo(0,keepScroll);
  renderSheet();
  if(inRoom){const m=document.getElementById('msgs');if(m)m.scrollTop=m.scrollHeight;if(UI.focusMsg){const i=document.getElementById('msg-input');if(i)i.focus();UI.focusMsg=false}}
  syncBackButton();
}
function syncBackButton(){
  if(!inTelegram||!tg.BackButton)return;
  const sub=UI.sheet||!MAIN_TABS.includes(UI.route.name)||(UI.route.name==='chat'&&UI.route.id);
  try{sub?tg.BackButton.show():tg.BackButton.hide()}catch(e){}
}
function goBack(){
  if(UI.sheet){closeSheet();return}
  const r=UI.route;
  if(r.name==='chat'&&r.id)return go('chat');
  if(r.name==='queue')return go('group',{id:r.id});
  if(r.name==='create'&&UI.wizard&&UI.wizard.step>1){UI.wizard.step--;return render()}
  go('home');
}
async function loadRoute(){
  const r=UI.route;
  const jobs=[];
  if(r.name==='home')jobs.push(api('/api/home').then(x=>{D.home=x;D.summary=x.unread;x.groups.forEach(g=>D.groups[g.id]=g)}));
  if(r.name==='group'||r.name==='queue')jobs.push(api(`/api/groups/${r.id}`).then(x=>{D.groups[r.id]=x}));
  if(r.name==='chat'){
    jobs.push(api('/api/chats').then(x=>{D.chats=x}));
    if(r.id){jobs.push(api(`/api/groups/${r.id}`).then(x=>{D.groups[r.id]=x}));jobs.push(api(`/api/groups/${r.id}/messages`).then(x=>{D.msgs[r.id]=x}))}
  }
  if(r.name==='cards'||r.name==='profile'||r.name==='group')jobs.push(api('/api/cards').then(x=>{D.cards=x}));
  if(r.name==='notifications')jobs.push(api('/api/notifications').then(x=>{D.notifs=x}));
  await Promise.all(jobs);
  if(r.name==='chat'&&r.id)markRead(r.id);
  if(r.name==='notifications'&&D.notifs.some(n=>!n.read)){api('/api/notifications/read',{method:'POST'}).then(()=>{D.summary.notifs=0}).catch(()=>{})}
}
async function go(name,params={}){
  UI.route=Object.assign({name},params);UI.sheet=null;UI.recFallback=null;
  if(UI.rec)ACT.recCancel();
  render();window.scrollTo(0,0);
  try{await loadRoute()}catch(e){toast(e.message,'err');if(e.message.includes('a’zosi emas')||e.message.includes('topilmadi')){UI.route={name:'home'};await loadRoute().catch(()=>{})}}
  if(UI.route.name===name&&String(UI.route.id||'')===String(params.id||''))render();
  if(name==='chat'&&params.id)startRoomPoll(params.id);else stopRoomPoll();
}
async function refresh(){try{await loadRoute();render()}catch(e){toast(e.message,'err')}}
function markRead(gid){const l=D.msgs[gid];if(!l||!l.length)return;const last=l[l.length-1].id;api(`/api/groups/${gid}/read`,{method:'POST',body:{lastId:last}}).then(()=>api('/api/summary')).then(s=>{D.summary=s;updateBadges()}).catch(()=>{})}
function updateBadges(){/* yengil yangilash: faqat sheet ochiq bo'lmasa va matn kiritilmayotgan bo'lsa qayta chizamiz */
  const a=document.activeElement;if(UI.sheet||(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA')))return;render()}

/* Chat xonasi: yangi xabarlarni har 3 soniyada olish */
let roomTimer=null;
function stopRoomPoll(){if(roomTimer){clearInterval(roomTimer);roomTimer=null}}
function startRoomPoll(gid){
  stopRoomPoll();
  roomTimer=setInterval(async()=>{
    if(UI.route.name!=='chat'||UI.route.id!==gid||document.hidden)return;
    const l=D.msgs[gid];if(!l)return;
    const after=l.length?l[l.length-1].id:0;
    try{
      const nw=await api(`/api/groups/${gid}/messages?after=${after}`);
      if(nw.length)appendMessages(gid,nw);
      if(nw.some(m=>m.type==='system')){D.groups[gid]=await api(`/api/groups/${gid}`)}
    }catch(e){}
  },3000);
}
function appendMessages(gid,nw){
  const l=D.msgs[gid];const fresh=nw.filter(m=>!l.some(x=>x.id===m.id));if(!fresh.length)return;
  const prev=l.length?l[l.length-1].ts:null;l.push(...fresh);
  const box=document.getElementById('msgs');
  if(box&&UI.route.name==='chat'&&UI.route.id===gid){
    const nearBottom=box.scrollHeight-box.scrollTop-box.clientHeight<120;
    if(l.length===fresh.length)box.innerHTML='';
    box.insertAdjacentHTML('beforeend',msgsHtml(fresh,prev));
    if(nearBottom||fresh.some(m=>m.mine))box.scrollTop=box.scrollHeight;
    markRead(gid);
  }
}
/* Umumiy so'rov: o'qilmaganlar soni va ochiq sahifani yangilash */
async function poll(){
  if(document.hidden||!D.me||!D.me.registered)return;
  try{
    const s=await api('/api/summary');const changed=s.notifs!==D.summary.notifs||s.chats!==D.summary.chats;D.summary=s;
    const r=UI.route.name;
    if(r==='home'||r==='group'||r==='queue'){await loadRoute();updateBadges()}
    else if(changed)updateBadges();
  }catch(e){}
}

/* ---------- 5. Amallar */
ACT.reload=()=>location.reload();
ACT.back=()=>goBack();
ACT.go=d=>go(d.to,d.id?{id:Number(d.id)}:{});
ACT.sheet=async d=>{const o={id:d.id?Number(d.id):undefined};
  if(d.name==='editProfile')o.photo=D.me.photo;
  if((d.name==='paysettings'||d.name==='pay')&&!D.cards){await run(async()=>{D.cards=await api('/api/cards')})}
  openSheet(d.name,o)};
ACT.closeSheet=()=>closeSheet();
ACT.confirmYes=()=>{const fn=UI.sheet&&UI.sheet.onYes;closeSheet();if(fn)fn()};
ACT.openChat=d=>go('chat',{id:Number(d.id)});

/* profil */
ACT.pickAvatar=()=>pickFile('image/*',f=>resizeImage(f,256,.82).then(url=>{if(UI.sheet&&UI.sheet.name==='editProfile')UI.sheet.photo=url;else UI.reg.photo=url;const ph=document.getElementById('av-ph');if(ph)ph.innerHTML=`<img src="${url}" alt="">`}));
ACT.removeAvatar=()=>{UI.sheet.photo=null;const ph=document.getElementById('av-ph');if(ph)ph.innerHTML=ic('user',28)};
ACT.shareContact=()=>{
  tg.requestContact((ok,resp)=>{
    if(!ok){toast('Raqam ulashilmadi. Qo‘lda kiriting.','err');return}
    let phone=resp&&resp.responseUnsafe&&resp.responseUnsafe.contact&&resp.responseUnsafe.contact.phone_number;
    const fill=p=>{const i=document.getElementById('p-phone');if(i&&p){i.value=fmtPhone9(phoneDigits(p).slice(-9));toast('Raqam olindi');haptic('ok')}};
    if(phone)return fill(phone);
    // Eski Telegram versiyalari: raqam bot orqali saqlanadi, serverdan so'raymiz
    (async()=>{for(let i=0;i<5;i++){await sleep(1200);try{const me=await api('/api/me');if(me.phone){fill(me.phone);return}}catch(e){}}toast('Raqam hali kelmadi. Qo‘lda kiriting.','err')})();
  });
};
function profileBody(fd,photo){return{firstName:String(fd.get('firstName')||'').trim(),lastName:String(fd.get('lastName')||'').trim(),username:String(fd.get('username')||'').trim(),phone:phoneDigits(fd.get('phone'))?'998'+phoneDigits(fd.get('phone')):'',photo}}
FORM.register=fd=>run(async()=>{
  const b=profileBody(fd,UI.reg.photo||undefined);Object.assign(UI.reg,b);
  if(b.phone.length!==12)throw new Error('Telefon raqamini to‘liq kiriting yoki Telegram orqali ulashing');
  D.me=await api('/api/me/register',{method:'POST',body:b});haptic('ok');toast(`Xush kelibsiz, ${D.me.firstName}!`);
  await enterApp();
});
FORM.editProfile=fd=>run(async()=>{
  const b=profileBody(fd,UI.sheet.photo===null?null:UI.sheet.photo&&UI.sheet.photo.startsWith('data:')?UI.sheet.photo:undefined);
  if(!b.phone)delete b.phone;
  D.me=await api('/api/me',{method:'PATCH',body:b});closeSheet();render();toast('Profil saqlandi');
});
ACT.deleteAccount=()=>confirmBox({title:'Hisobni o‘chirish',text:'Profilingiz, kartalaringiz va siz yaratgan (faol bo‘lmagan) guruhlar o‘chiriladi. Buni qaytarib bo‘lmaydi.',yes:'O‘chirish',danger:true,onYes:()=>run(async()=>{await api('/api/me/delete',{method:'POST'});toast('Hisob o‘chirildi');if(inTelegram)setTimeout(()=>tg.close(),900);else location.reload()})});

/* guruh yaratish */
ACT.preset=d=>{const i=document.getElementById('w-amount');if(i){i.value=num(+d.v);updateCalc()}};
ACT.pickGroupImage=()=>pickFile('image/*',f=>resizeImage(f,256,.82).then(url=>{UI.wizard.image=url;const ph=document.getElementById('gimg-ph');if(ph)ph.innerHTML=`<img src="${url}" alt="">`}));
function updateCalc(){const s=document.getElementById('w-size'),a=document.getElementById('w-amount'),c=document.getElementById('w-calc');if(!s||!c)return;const n=+s.value;document.getElementById('w-size-val').textContent=n+' kishi';document.getElementById('w-size-hint').textContent=`siz + ${n-1} kishi`;c.innerHTML=calcHtml(n,+(a.value.replace(/\D/g,'')||0))}
FORM.w1=fd=>{const w=UI.wizard;w.name=String(fd.get('name')||'').trim();w.size=+fd.get('size');w.amount=+(String(fd.get('amount')||'').replace(/\D/g,''));
  if(w.name.length<2){toast('Guruh nomini kiriting','err');return}if(!w.amount||w.amount<1000){toast('Badal miqdorini kiriting (kamida 1 000 so‘m)','err');return}
  if(w.contacts.length>w.size-1){w.contacts=w.contacts.slice(0,w.size-1);toast('Ortiqcha kontaktlar olib tashlandi')}
  w.step=2;render();window.scrollTo(0,0)};
FORM.w2=fd=>{const w=UI.wizard;w.period=fd.get('period')||'monthly';w.startDate=fd.get('startDate')||todayISO();w.method=fd.get('method')||'lottery';
  if(w.startDate<todayISO()){toast('Boshlanish sanasi bugundan oldin bo‘lmasin','err');return}w.step=3;render();window.scrollTo(0,0)};
ACT.wizBack=(d,el)=>{const w=UI.wizard;const f=el.closest('form');if(f&&f.dataset.form==='w2'){const fd=new FormData(f);w.period=fd.get('period');w.startDate=fd.get('startDate')||w.startDate;w.method=fd.get('method')}w.step=Math.max(1,w.step-1);render()};
function validContact(name,phone,existing){
  if(name.length<2)return 'Kontakt ismini kiriting';if(phone.length!==9)return 'Telefon raqamini to‘liq kiriting: 9 ta raqam';
  if(D.me.phone&&'998'+phone===D.me.phone)return 'Bu sizning raqamingiz — siz allaqachon ishtirokchisiz';
  if(existing.some(p=>String(p||'').replace(/^998/,'')===phone))return 'Bu raqam allaqachon qo‘shilgan';return null}
FORM.w3add=fd=>{const w=UI.wizard;const name=String(fd.get('name')||'').trim(),phone=phoneDigits(fd.get('phone'));
  const err=validContact(name,phone,w.contacts.map(c=>c.phone));if(err){toast(err,'err');return}
  w.contacts.push({name,phone:'998'+phone});render();const i=document.getElementById('c-name');if(i)i.focus()};
ACT.wizRemove=d=>{UI.wizard.contacts.splice(+d.i,1);render()};
ACT.wizNext3=()=>{UI.wizard.step=4;render();window.scrollTo(0,0)};
ACT.createGroup=()=>run(async()=>{const w=UI.wizard;
  const out=await api('/api/groups',{method:'POST',body:{name:w.name,image:w.image,size:w.size,amount:w.amount,period:w.period,startDate:w.startDate,queueMethod:w.method,contacts:w.contacts}});
  UI.wizard=null;haptic('ok');toast('Guruh yaratildi');await go('group',{id:out.id})});

/* guruh amallari: har biri yangilangan guruhni qaytaradi */
async function groupCall(gid,path,body,okText){
  const g=await api(`/api/groups/${gid}${path}`,{method:'POST',body:body||{}});
  D.groups[gid]=g;closeSheet();render();if(okText){toast(okText);haptic('ok')}
  return g;
}
FORM.contact=fd=>run(async()=>{const gid=UI.sheet.id;const name=String(fd.get('name')||'').trim(),phone=phoneDigits(fd.get('phone'));
  const err=validContact(name,phone,G(gid).members.map(m=>m.phone));if(err)throw new Error(err);
  await groupCall(gid,'/contacts',{name,phone:'998'+phone},`${name} qo‘shildi`)});
ACT.removeMember=d=>confirmBox({title:'Ishtirokchini olib tashlash',text:`${d.name} guruh ro‘yxatidan olib tashlanadi.`,yes:'Olib tashlash',danger:true,
  onYes:()=>run(async()=>{D.groups[d.id]=await api(`/api/groups/${d.id}/members/${d.m}`,{method:'DELETE'});render()})});
ACT.offlineMember=d=>confirmBox({title:'Telegram’siz qo‘shish',text:`${d.name} Telegram’dan foydalanmaydi va guruhga qo‘shilishga rozi ekanini tasdiqlaysizmi? Uning to‘lovlarini siz yoki oluvchi “Qabul qildim” bilan belgilaysiz.`,yes:'Tasdiqlash',
  onYes:()=>run(()=>groupCall(d.id,`/members/${d.m}/offline`,{},`${d.name} qo‘shildi`))});
ACT.mv=d=>{const o=UI.manualOrder[d.id];const i=+d.i,j=i+(+d.d);if(j<0||j>=o.length)return;[o[i],o[j]]=[o[j],o[i]];render()};
ACT.lockManual=d=>{const g=G(d.id);const o=UI.manualOrder[d.id];confirmBox({title:'Navbatni tasdiqlaysizmi?',text:'Tasdiqlangandan so‘ng navbat o‘zgarmaydi: '+o.map((id,i)=>`${i+1}. ${memberName(g,id)}`).join(', '),yes:'Tasdiqlash',
  onYes:()=>run(async()=>{await groupCall(d.id,'/lock',{order:o},'Navbat belgilandi');delete UI.manualOrder[d.id]})})};
ACT.lockRandom=d=>run(()=>groupCall(d.id,'/lock',{},'Navbat usuli tasdiqlandi'));
ACT.lottery=d=>{const gid=Number(d.id);const g=G(gid);openSheet('lottery',{id:gid});
  const ids=g.members.map(m=>m.id);const t0=Date.now();
  const timer=setInterval(()=>{const l=document.getElementById('lot-list');if(!l){clearInterval(timer);return}l.innerHTML=shuffle(ids).map(id=>`<li><span class="n">?</span><b class="grow">${h(memberName(g,id))}</b></li>`).join('')},90);
  run(async()=>{const res=await api(`/api/groups/${gid}/lottery`,{method:'POST',body:{}});const wait=1600-(Date.now()-t0);if(wait>0)await sleep(wait);D.groups[gid]=res;haptic('ok')}).finally(()=>{clearInterval(timer);closeSheet();render()})};
ACT.lockLottery=d=>confirmBox({title:'Qur’a natijasini tasdiqlaysizmi?',text:'Tasdiqlangandan so‘ng navbat o‘zgarmaydi.',yes:'Tasdiqlash',onYes:()=>run(()=>groupCall(d.id,'/lock',{},'Qur’a natijasi tasdiqlandi'))});
ACT.startGroup=d=>{const g=G(d.id);confirmBox({title:'Guruhni boshlaysizmi?',text:`1-davr boshlanadi: muddat ${fmtDate(g.startDate)}. Barcha a’zolarga bildirishnoma yuboriladi.`,yes:'Boshlash',onYes:()=>run(()=>groupCall(d.id,'/start',{},'Guruh boshlandi'))})};
FORM.paysettings=fd=>run(()=>groupCall(UI.sheet.id,'/paysettings',{method:fd.get('method'),cardId:fd.get('card')?Number(fd.get('card')):null,autopay:!!fd.get('autopay')},'To‘lov usuli saqlandi'));
ACT.payCash=d=>run(()=>groupCall(d.id,'/pay',{method:'cash'},'Oluvchiga tasdiqlash uchun yuborildi'));
FORM.payCard=fd=>run(()=>groupCall(UI.sheet.id,'/pay',{method:'card',cardId:Number(fd.get('card'))},'To‘lov qayd etildi (simulyatsiya)'));
ACT.confirmPay=d=>confirmBox({title:'To‘lovni tasdiqlash',text:`${d.name}dan ${money(G(d.id).amount)} naqd olganingizni tasdiqlaysizmi?`,yes:'Ha, qabul qildim',onYes:()=>run(()=>groupCall(d.id,`/payments/${d.p}/confirm`,{},'To‘lov tasdiqlandi'))});
ACT.deleteGroup=d=>{const g=G(d.id);const own=g.isOwner;
  confirmBox({title:own?'Guruhni o‘chirish':'Guruhdan chiqish',text:own?`“${g.name}” guruhi, uning navbati va chati barcha a’zolar uchun o‘chiriladi. Buni qaytarib bo‘lmaydi.`:`“${g.name}” guruhidan chiqasiz.${g.status!=='forming'?' Navbat bekor qilinadi va guruh qayta shakllanadi.':''}`,yes:own?'O‘chirish':'Chiqish',danger:true,
    onYes:()=>run(async()=>{await api(`/api/groups/${g.id}`,{method:'DELETE'});delete D.groups[g.id];toast(own?'Guruh o‘chirildi':'Guruhdan chiqdingiz');await go('home')})})};

/* takliflar */
function parseInvite(text){const s=String(text||'').trim();const m=s.match(/join[_=]([a-z0-9]{6,20})/i);if(m)return m[1].toLowerCase();if(/^[a-z0-9]{6,20}$/i.test(s))return s.toLowerCase();return null}
FORM.join=fd=>{const code=parseInvite(fd.get('code'));if(!code){toast('Havola tanilmadi. To‘liq nusxalang.','err');return}openJoin(code)};
function openJoin(code){run(async()=>{const p=await api(`/api/invite/${code}`);openSheet('joinPreview',{p,code})})}
ACT.doJoin=d=>run(async()=>{const out=await api(`/api/invite/${d.code}/join`,{method:'POST',body:{}});haptic('ok');toast('Guruhga qo‘shildingiz');await go('group',{id:out.id})});
ACT.acceptInvite=d=>ACT.doJoin({code:d.code});
ACT.declineInvite=d=>run(async()=>{await api(`/api/groups/${d.id}/decline`,{method:'POST',body:{}});toast('Taklif rad etildi');await refresh()});
ACT.copyLink=()=>{const i=document.getElementById('invite-link');try{navigator.clipboard.writeText(i.value).then(()=>toast('Havola nusxalandi'),()=>{i.select();toast('Belgilandi — nusxalang')})}catch(e){i.select();toast('Belgilandi — nusxalang')}};
ACT.shareLink=d=>{const g=G(Number(d.id));if(!g.inviteLink){toast('Havola tayyor emas','err');return}
  const text=`“${g.name}” guruhiga qo‘shiling: ${g.size} kishi, ${money(g.amount)}, ${PERIOD[g.period].toLowerCase()}.`;
  const url=`https://t.me/share/url?url=${encodeURIComponent(g.inviteLink)}&text=${encodeURIComponent(text)}`;
  if(inTelegram&&tg.openTelegramLink)tg.openTelegramLink(url);else window.open(url,'_blank')};

/* kartalar */
function brandOf(n){if(/^(8600|5614)/.test(n))return 'uzcard';if(/^9860/.test(n))return 'humo';if(/^4/.test(n))return 'visa';return null}
FORM.cardForm=fd=>run(async()=>{const s=UI.sheet;const n=String(fd.get('number')||'').replace(/\D/g,'');
  Object.assign(s,{number:n,exp:String(fd.get('exp')||''),holder:String(fd.get('holder')||'').trim().toUpperCase(),type:fd.get('ctype')});
  if(n.length!==16)throw new Error('Karta raqami 16 ta raqamdan iborat bo‘lsin');
  const r=await api('/api/cards/otp',{method:'POST',body:{number:n,exp:s.exp,holder:s.holder,type:s.type}});
  Object.assign(s,{step:'otp',sent:r.sent,type:r.type,holderMasked:r.holderMasked,last4:r.last4});renderSheet()});
ACT.cardBack=()=>{UI.sheet.step='form';renderSheet()};
FORM.cardOtp=fd=>run(async()=>{const c=await api('/api/cards/confirm',{method:'POST',body:{code:String(fd.get('code')||'')}});
  D.cards=[...(D.cards||[]),c];closeSheet();render();toast('Karta qo‘shildi');haptic('ok')});
ACT.setPrimary=d=>run(async()=>{await api(`/api/cards/${d.id}/primary`,{method:'POST',body:{}});D.cards=await api('/api/cards');render();toast('Asosiy karta o‘zgartirildi')});
ACT.delCard=d=>confirmBox({title:'Kartani o‘chirish',text:`•• ${d.l} kartasi o‘chiriladi. Shu karta bilan sozlangan avto-to‘lovlar naqd usuliga o‘tadi.`,yes:'O‘chirish',danger:true,
  onYes:()=>run(async()=>{await api(`/api/cards/${d.id}`,{method:'DELETE'});D.cards=await api('/api/cards');render();toast('Karta o‘chirildi')})});

/* bildirishnomalar */
ACT.clearNotifs=()=>run(async()=>{await api('/api/notifications',{method:'DELETE'});D.notifs=[];D.summary.notifs=0;render()});

/* chat */
async function sendMsg(gid,body){
  const m=await api(`/api/groups/${gid}/messages`,{method:'POST',body});
  appendMessages(gid,[m]);
}
FORM.msg=(fd,f)=>{const t=String(fd.get('text')||'').trim();if(!t)return;const gid=Number(f.dataset.id);const i=document.getElementById('msg-input');if(i){i.value='';i.focus()}
  sendMsg(gid,{type:'text',text:t}).catch(e=>{toast(e.message,'err');if(i&&!i.value)i.value=t})};
ACT.attach=d=>{const gid=Number(d.id);
  if(d.kind==='image')pickFile('image/*',f=>run(async()=>{const url=await resizeImage(f,1280,.8);await sendMsg(gid,{type:'image',media:url})}));
  else pickFile('video/*',f=>{if(f.size>15*1024*1024){toast('Video 15 MB dan katta bo‘lmasin','err');return}run(async()=>{const url=await readFileURL(f);await sendMsg(gid,{type:'video',media:url})})})};
ACT.rec=async d=>{const gid=Number(d.id);
  try{if(!navigator.mediaDevices||!window.MediaRecorder)throw new Error('no');
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});const rec=new MediaRecorder(stream);const chunks=[];
    rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
    rec.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const st=UI.rec;UI.rec=null;clearInterval(UI.recTimer);render();if(!st||st.cancel)return;
      const blob=new Blob(chunks,{type:rec.mimeType||'audio/webm'});const sec=Math.round((Date.now()-st.start)/1000);
      run(async()=>{const url=await readFileURL(blob);await sendMsg(gid,{type:'voice',media:url,duration:`${Math.floor(sec/60)}:${pad2(sec%60)}`})})};
    rec.start();UI.rec={gid,rec,start:Date.now()};render();
    UI.recTimer=setInterval(()=>{const el=document.getElementById('rec-time');if(!el||!UI.rec)return;const s=Math.floor((Date.now()-UI.rec.start)/1000);el.textContent=`${Math.floor(s/60)}:${pad2(s%60)}`;if(s>=120)ACT.recStop()},500);
  }catch(e){UI.recFallback=gid;render();toast('Mikrofonga ruxsat berilmadi. Audio fayl tanlashingiz mumkin.','err')}};
ACT.recStop=()=>{if(UI.rec)UI.rec.rec.stop()};
ACT.recCancel=()=>{if(UI.rec){UI.rec.cancel=true;UI.rec.rec.stop()}};
ACT.recFallbackOff=()=>{UI.recFallback=null;render()};
ACT.recFile=d=>pickFile('audio/*',f=>{if(f.size>6*1024*1024){toast('Audio 6 MB dan katta bo‘lmasin','err');return}UI.recFallback=null;run(async()=>{const url=await readFileURL(f);await sendMsg(Number(d.id),{type:'voice',media:url})})});

/* ---------- 6. Hodisalar va ishga tushirish */
document.addEventListener('click',e=>{
  if(e.target.classList&&e.target.classList.contains('sheet-wrap')){closeSheet();return}
  const el=e.target.closest('[data-act]');if(!el||el.disabled)return;
  const fn=ACT[el.dataset.act];if(fn){e.preventDefault();fn(el.dataset,el,e)}
});
document.addEventListener('submit',e=>{const f=e.target;const fn=FORM[f.dataset.form];if(fn){e.preventDefault();fn(new FormData(f),f)}});
document.addEventListener('change',e=>{const t=e.target;
  if(t.dataset.change==='notif'){const k=t.dataset.k;api('/api/me/notif',{method:'PATCH',body:{[k]:t.checked}}).then(me=>{D.me=me;toast(t.checked?'Bildirishnoma yoqildi':'Bildirishnoma o‘chirildi')}).catch(err=>{t.checked=!t.checked;toast(err.message,'err')})}
});
document.addEventListener('input',e=>{const t=e.target;const f=t.dataset&&t.dataset.fmt;
  if(f==='phone'){let d=t.value.replace(/\D/g,'');if(d.startsWith('998')&&d.length>9)d=d.slice(3);t.value=fmtPhone9(d.slice(0,9))}
  else if(f==='card'){const d=t.value.replace(/\D/g,'').slice(0,16);t.value=d.replace(/(\d{4})(?=\d)/g,'$1 ');const b=brandOf(d);if(b){const r=document.querySelector(`input[name="ctype"][value="${b}"]`);if(r)r.checked=true}}
  else if(f==='exp'){const d=t.value.replace(/\D/g,'').slice(0,4);t.value=d.length>2?d.slice(0,2)+'/'+d.slice(2):d}
  else if(f==='digits'){t.value=t.value.replace(/\D/g,'').slice(0,6);if(t.classList.contains('otp')&&t.value.length===6&&t.form)t.form.requestSubmit()}
  else if(f==='amount'){const d=t.value.replace(/\D/g,'').slice(0,10);t.value=d?num(+d):'';updateCalc()}
  else if(f==='username'){t.value=t.value.toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20)}
  if(t.id==='w-size')updateCalc();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&UI.sheet)closeSheet()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});

function applyTheme(){
  const scheme=inTelegram?tg.colorScheme:null;
  if(scheme)document.documentElement.setAttribute('data-theme',scheme);
  try{if(inTelegram){const bg=getComputedStyle(document.body).getPropertyValue('background-color');tg.setHeaderColor&&tg.setHeaderColor(bg);tg.setBackgroundColor&&tg.setBackgroundColor(bg)}}catch(e){}
}
async function enterApp(){
  const params=new URLSearchParams(location.search);
  const sp=(inTelegram&&tg.initDataUnsafe&&tg.initDataUnsafe.start_param)||'';
  const join=params.get('join')||(sp.startsWith('join_')?sp.slice(5):null);
  const gid=Number(params.get('g'))||null;
  await go(gid?'group':'home',gid?{id:gid}:{});
  if(join)openJoin(join);
  if(!UI.pollTimer)UI.pollTimer=setInterval(poll,15000);
}
async function boot(){
  if(inTelegram){try{tg.ready();tg.expand();tg.onEvent('themeChanged',applyTheme);tg.BackButton.onClick(goBack);if(tg.disableVerticalSwipes)tg.disableVerticalSwipes()}catch(e){}}
  applyTheme();
  if(!API){centerScreen('Sozlash kerak','config.js faylida API_URL ko‘rsatilmagan.');return}
  if(!inTelegram&&!CFG.DEV_USER){
    let bot=null;try{bot=(await api('/api/config')).botUsername}catch(e){}
    centerScreen('Telegram orqali oching','Kassachi Telegram Mini App sifatida ishlaydi. Botni oching va “Kassachi” tugmasini bosing.',{link:bot?`https://t.me/${bot}`:null});return;
  }
  const slow=setTimeout(()=>centerScreen('Server ishga tushmoqda…','Bepul serverda birinchi ochilish 30–60 soniya olishi mumkin. Iltimos, kuting.'),2500);
  try{D.me=await api('/api/me')}
  catch(e){clearTimeout(slow);centerScreen('Ulanib bo‘lmadi',e.message,{retry:true});return}
  clearTimeout(slow);
  if(!D.me.registered){
    UI.reg={firstName:D.me.firstName,lastName:D.me.lastName,username:(D.me.tgUsername||'').toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,20),phone:D.me.phone,photo:D.me.photo};
    renderReg();return;
  }
  await enterApp();
}
boot();
