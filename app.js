const currency = window.uPOECurrency || {
  simpleLow:[], simplePlus:[], medium:[], high:[], league:[], topCross:[], topCircle:[]
};

const groundViewport = document.getElementById('groundViewport');
const groundWorld = document.getElementById('groundWorld');
const counter = document.getElementById('counter');
const zoomValue = document.getElementById('zoomValue');

let zoom = 1;
let mode = 'random';
let soundEnabled = true;
let selectedSound = 1;
let iconSize = 0;
let catalogMode = 'all';

const tierOrder = ['league','high','medium','simplePlus','simpleLow'];
const tierNames = {
  league:'T4 · LEAGUE / DYNAMIC',
  high:'T3 · HIGH ≥ 1 DIVINE',
  medium:'T2 · MEDIUM 10c–<1d',
  simplePlus:'T1+ · ≈1c–<10c · ATTENTION',
  simpleLow:'T1 · LOW <≈1c'
};
const tierClass = {
  league:'league', high:'high', medium:'medium', simplePlus:'simpleplus', simpleLow:'simplelow'
};
const topCross = new Set(currency.topCross || []);
const topCircle = new Set(currency.topCircle || []);
const effectColors = {
  Red:'#ff4545',Green:'#65ff62',Blue:'#4f78ff',Brown:'#a56c43',White:'#ffffff',Yellow:'#ffe94d',
  Cyan:'#45efff',Grey:'#9b9b9b',Orange:'#ff9a35',Pink:'#ff62c8',Purple:'#b36cff'
};
const iconShapes = ['Circle','Diamond','Hexagon','Square','Star','Triangle','Cross','Moon','Raindrop','Kite','Pentagon','UpsideDownHouse'];
const soundUsage = {
  1:'Currency T3 HIGH',
  2:'6-link',
  14:'Currency T1+ / T2',
  16:'Currency T4 dynamic'
};

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] || 'Unknown item'; }
function rand(min,max){ return Math.random()*(max-min)+min; }

function label(name,tier,extra=''){
  const el = document.createElement('span');
  el.className = `drop-label ${tierClass[tier] || tier} ${extra}`.trim();
  el.textContent = name;
  return el;
}

function beam(color='#65ff62'){
  const el = document.createElement('span');
  el.className = 'beam';
  el.style.color = color;
  return el;
}

function starPoints(){
  const pts=[];
  for(let i=0;i<10;i++){
    const a=-Math.PI/2+i*Math.PI/5, r=i%2?18:38;
    pts.push(`${50+Math.cos(a)*r},${50+Math.sin(a)*r}`);
  }
  return pts.join(' ');
}

function iconSvg(shape,color,size){
  const px=[34,27,21][size];
  let body='';
  switch(shape){
    case'Circle':body=`<circle cx="50" cy="50" r="34" fill="${color}"/>`;break;
    case'Diamond':body=`<polygon points="50,8 92,50 50,92 8,50" fill="${color}"/>`;break;
    case'Hexagon':body=`<polygon points="25,10 75,10 95,50 75,90 25,90 5,50" fill="${color}"/>`;break;
    case'Square':body=`<rect x="15" y="15" width="70" height="70" fill="${color}"/>`;break;
    case'Star':body=`<polygon points="${starPoints()}" fill="${color}"/>`;break;
    case'Triangle':body=`<polygon points="50,8 94,88 6,88" fill="${color}"/>`;break;
    case'Cross':body=`<path d="M35 8H65V35H92V65H65V92H35V65H8V35H35Z" fill="${color}"/>`;break;
    case'Moon':body=`<circle cx="44" cy="50" r="36" fill="${color}"/><circle cx="60" cy="39" r="31" fill="#0a0e0a"/>`;break;
    case'Raindrop':body=`<path d="M50 5C38 25 19 45 19 66a31 31 0 0 0 62 0C81 45 62 25 50 5Z" fill="${color}"/>`;break;
    case'Kite':body=`<polygon points="50,5 86,43 50,95 14,43" fill="${color}"/>`;break;
    case'Pentagon':body=`<polygon points="50,6 93,38 77,90 23,90 7,38" fill="${color}"/>`;break;
    case'UpsideDownHouse':body=`<polygon points="10,10 90,10 90,60 50,94 10,60" fill="${color}"/>`;break;
  }
  return `<svg class="icon-svg" width="${px}" height="${px}" viewBox="0 0 100 100" aria-hidden="true">${body}</svg>`;
}

function markerInfo(tier,name){
  if(tier==='league') return {shape:'Moon',size:1,label:'Sound 16 · Moon 1'};
  if(tier==='medium' || tier==='simplePlus') return {shape:'Triangle',size:0,label:'Sound 14 · Triangle 0'};
  if(tier==='high' && topCross.has(name)) return {shape:'Cross',size:0,label:'Sound 1 · Cross 0 · beam'};
  if(tier==='high' && topCircle.has(name)) return {shape:'Circle',size:0,label:'Sound 1 · Circle 0 · beam'};
  if(tier==='high') return {shape:null,size:0,label:'Sound 1 · Green beam'};
  return null;
}

function makeDrop(name,tier,compact=false){
  const wrap=document.createElement('div');
  wrap.className=`drop-wrap ${compact?'compact':''}`;
  const marker=markerInfo(tier,name);
  wrap.appendChild(label(name,tier));
  if(marker){
    const meta=document.createElement('span');
    meta.className='drop-signal';
    if(marker.shape) meta.innerHTML=iconSvg(marker.shape,effectColors.Green,marker.size);
    const txt=document.createElement('span');txt.textContent=marker.label;meta.appendChild(txt);
    wrap.appendChild(meta);
  }
  return wrap;
}

function clearGround(){
  if(!groundWorld || !groundViewport) return;
  groundWorld.innerHTML='';
  groundViewport.scrollTop=0;
  groundViewport.scrollLeft=0;
}

function renderRandom(play=true){
  if(!groundWorld) return;
  mode='random';
  clearGround();
  const layer=document.createElement('div');
  layer.className='random-layer';
  groundWorld.appendChild(layer);

  const layout=[
    ['simpleLow',14,18],['simplePlus',38,18],['medium',68,18],['league',84,36],
    ['simpleLow',18,48],['high',50,50],['simplePlus',78,62],['medium',28,75],['league',64,82]
  ];

  layout.forEach(([tier,x,y],i)=>{
    let name = pick(currency[tier]);
    if(i===5) name=Math.random()>.55?'Mirror of Kalandra':'Divine Orb';
    const xx=Math.max(8,Math.min(92,x+rand(-3,3)));
    const yy=Math.max(9,Math.min(91,y+rand(-3,3)));
    const item=document.createElement('div');
    item.className='random-item';
    item.style.left=`${xx}%`;
    item.style.top=`${yy}%`;
    if(tier==='high') item.appendChild(beam());
    item.appendChild(makeDrop(name,tier,true));
    layer.appendChild(item);
  });

  if(counter) counter.textContent='9 примеров';
  setZoom(1);
  if(play && soundEnabled){
    const ids=[14,1,16];
    playDemoSound(ids[Math.floor(Math.random()*ids.length)]);
  }
  syncModeButtons();
}

function renderAll(){
  if(!groundWorld) return;
  mode='all';
  clearGround();
  const board=document.createElement('div');
  board.className='all-board';
  groundWorld.appendChild(board);
  let count=0;

  tierOrder.forEach(tier=>{
    const sec=document.createElement('section');
    sec.className='tier-section';
    const title=document.createElement('div');
    title.className='tier-title';
    title.textContent=`${tierNames[tier]} · ${currency[tier].length}`;
    sec.appendChild(title);
    const grid=document.createElement('div');
    grid.className='tier-grid';
    currency[tier].forEach(name=>{grid.appendChild(makeDrop(name,tier));count++;});
    sec.appendChild(grid);
    board.appendChild(sec);
  });

  if(counter) counter.textContent=`${count} видов Currency`;
  requestAnimationFrame(fitAll);
  syncModeButtons();
}

function syncModeButtons(){
  document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
}

function setZoom(next){
  if(!groundWorld) return;
  zoom=Math.max(.5,Math.min(1.5,next));
  groundWorld.style.transform=`scale(${zoom})`;
  groundWorld.style.width=`${100/zoom}%`;
  if(zoomValue) zoomValue.textContent=`${Math.round(zoom*100)}%`;
}

function fitAll(){
  if(!groundViewport) return;
  if(mode!=='all'){setZoom(1);return;}
  const desired=Math.min(1,Math.max(.5,(groundViewport.clientWidth-30)/1180));
  setZoom(desired);
}

function audioCtx(){
  const C=window.AudioContext||window.webkitAudioContext;
  if(!C)return null;
  window.__upoeAudio=window.__upoeAudio||new C();
  return window.__upoeAudio;
}

function playDemoSound(id){
  if(!soundEnabled)return;
  const ctx=audioCtx();if(!ctx)return;
  const t=ctx.currentTime;
  const base=180+(id*37)%520;
  const count=1+(id%3);
  const wave=['sine','triangle','square','sawtooth'][id%4];
  for(let i=0;i<count;i++){
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=wave;
    o.frequency.setValueAtTime(base*(1+i*.28),t+i*.055);
    o.frequency.exponentialRampToValueAtTime(Math.max(80,base*.72),t+.22+i*.055);
    g.gain.setValueAtTime(.0001,t+i*.055);
    g.gain.exponentialRampToValueAtTime(.12,t+.012+i*.055);
    g.gain.exponentialRampToValueAtTime(.0001,t+.25+i*.055);
    o.connect(g).connect(ctx.destination);o.start(t+i*.055);o.stop(t+.28+i*.055);
  }
}

function renderSounds(){
  const grid=document.getElementById('soundGrid');if(!grid)return;
  grid.innerHTML='';
  for(let i=1;i<=16;i++){
    const card=document.createElement('div');
    card.className=`sound-card ${soundUsage[i]?'used':''}`;
    card.innerHTML=`<div class="sound-top"><div class="sound-id">${i}</div>${soundUsage[i]?`<span class="usage-badge">uPOE</span>`:''}</div><small>PlayAlertSound ${i}<br>${soundUsage[i]||'свободен / резерв'}</small><button class="btn small" type="button">▶ Демо</button>`;
    card.querySelector('button').addEventListener('click',()=>{
      selectedSound=i;
      const selected=document.getElementById('selectedSound');
      if(selected) selected.textContent=`PlayAlertSound ${i} 300${soundUsage[i]?` — ${soundUsage[i]}`:''}`;
      playDemoSound(i);
      renderSounds();
    });
    if(i===selectedSound) card.classList.add('selected');
    grid.appendChild(card);
  }
}

function renderIcons(){
  const table=document.getElementById('iconTable');if(!table)return;
  table.innerHTML='';
  const header=document.createElement('div');
  header.className='icon-row';
  header.innerHTML='<div class="icon-cell name">Shape / Colour</div>'+Object.keys(effectColors).map(c=>`<div class="icon-cell">${c}</div>`).join('');
  table.appendChild(header);
  iconShapes.forEach(shape=>{
    const row=document.createElement('div');
    row.className='icon-row';
    row.innerHTML=`<div class="icon-cell name">${shape}</div>`+Object.entries(effectColors).map(([name,hex])=>`<div class="icon-cell" title="MinimapIcon ${iconSize} ${name} ${shape}">${iconSvg(shape,hex,iconSize)}</div>`).join('');
    table.appendChild(row);
  });
}

function renderEffects(){
  const grid=document.getElementById('effectGrid');if(!grid)return;
  grid.innerHTML='';
  Object.entries(effectColors).forEach(([name,hex])=>{
    const card=document.createElement('div');
    card.className='effect-card';
    card.innerHTML=`<div class="mini-beam" style="--beam-color:${hex}"></div><small>${name}<br>PlayEffect ${name}</small>`;
    grid.appendChild(card);
  });
}

function cleanCatalogName(value){
  return value.replace(/`/g,'').replace(/\*\*/g,'').trim();
}

async function renderCatalog(){
  const body=document.getElementById('catalogRows');
  const summary=document.getElementById('catalogSummary');
  if(!body)return;
  body.innerHTML='<tr><td colspan="3" class="catalog-loading">Загрузка docs/CATALOG.md…</td></tr>';
  try{
    const r=await fetch('./docs/CATALOG.md',{cache:'no-store'});
    if(!r.ok) throw new Error('catalog fetch failed');
    const text=await r.text();
    const rows=[];
    text.split(/\r?\n/).forEach(line=>{
      const m=line.match(/^\|\s*(\d{4})\s*\|\s*(.*?)\s*\|\s*(CUSTOM|PARTIAL|UPSTREAM|SYSTEM)\s*\|$/);
      if(m) rows.push({num:m[1],name:cleanCatalogName(m[2]),status:m[3]});
    });
    const counts={CUSTOM:0,PARTIAL:0,UPSTREAM:0,SYSTEM:0};
    rows.forEach(x=>counts[x.status]++);
    if(summary) summary.textContent=`${rows.length} разделов · CUSTOM ${counts.CUSTOM} · PARTIAL ${counts.PARTIAL} · UPSTREAM ${counts.UPSTREAM}`;
    const c=document.getElementById('countCustom');if(c)c.textContent=counts.CUSTOM;
    const p=document.getElementById('countPartial');if(p)p.textContent=counts.PARTIAL;
    const u=document.getElementById('countUpstream');if(u)u.textContent=counts.UPSTREAM;

    body.innerHTML='';
    rows.filter(x=>catalogMode==='all'||x.status.toLowerCase()===catalogMode).forEach(x=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td class="catalog-num">${x.num}</td><td>${x.name}</td><td><span class="status-badge ${x.status.toLowerCase()}">${x.status}</span></td>`;
      body.appendChild(tr);
    });
    if(!body.children.length) body.innerHTML='<tr><td colspan="3" class="catalog-loading">Нет разделов с таким статусом.</td></tr>';
  }catch(err){
    body.innerHTML='<tr><td colspan="3" class="catalog-loading">Не удалось загрузить каталог. Игровой uPOE.filter остаётся источником истины.</td></tr>';
  }
}

async function openFilter(){
  const modal=document.getElementById('filterModal'),code=document.getElementById('filterCode');
  if(!modal||!code)return;
  modal.classList.add('open');document.body.classList.add('modal-open');code.textContent='Загрузка uPOE.filter…';
  try{const r=await fetch('./uPOE.filter',{cache:'no-store'});code.textContent=await r.text();}
  catch{code.textContent='Не удалось загрузить uPOE.filter.';}
}
function closeFilter(){
  const modal=document.getElementById('filterModal');if(modal)modal.classList.remove('open');document.body.classList.remove('modal-open');
}

function bindUI(){
  document.getElementById('zoomOut')?.addEventListener('click',()=>setZoom(zoom-.1));
  document.getElementById('zoomIn')?.addEventListener('click',()=>setZoom(zoom+.1));
  document.getElementById('zoomReset')?.addEventListener('click',()=>setZoom(1));
  document.getElementById('zoomFit')?.addEventListener('click',fitAll);
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>b.dataset.mode==='all'?renderAll():renderRandom(false)));
  document.getElementById('reroll')?.addEventListener('click',()=>renderRandom(true));
  document.getElementById('soundToggle')?.addEventListener('click',e=>{
    soundEnabled=!soundEnabled;e.currentTarget.classList.toggle('active',soundEnabled);e.currentTarget.textContent=soundEnabled?'🔊 Звук: ВКЛ':'🔇 Звук: ВЫКЛ';
  });
  document.getElementById('soundTest')?.addEventListener('click',()=>playDemoSound(selectedSound));
  document.querySelectorAll('[data-icon-size]').forEach(b=>b.addEventListener('click',()=>{
    iconSize=Number(b.dataset.iconSize);
    document.querySelectorAll('[data-icon-size]').forEach(x=>x.classList.toggle('active',Number(x.dataset.iconSize)===iconSize));
    renderIcons();
  }));
  document.querySelectorAll('[data-catalog]').forEach(b=>b.addEventListener('click',()=>{
    catalogMode=b.dataset.catalog;
    document.querySelectorAll('[data-catalog]').forEach(x=>x.classList.toggle('active',x.dataset.catalog===catalogMode));
    renderCatalog();
  }));
  document.getElementById('showFilter')?.addEventListener('click',openFilter);
  document.getElementById('closeFilter')?.addEventListener('click',closeFilter);
  document.getElementById('filterModal')?.addEventListener('click',e=>{if(e.target.id==='filterModal')closeFilter();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFilter();});
  document.getElementById('copyFilter')?.addEventListener('click',async()=>{
    const button=document.getElementById('copyFilter');
    try{
      await navigator.clipboard.writeText(document.getElementById('filterCode').textContent);
      button.textContent='Скопировано';setTimeout(()=>button.textContent='Копировать',1200);
    }catch{button.textContent='Ошибка';setTimeout(()=>button.textContent='Копировать',1200);}
  });
}

bindUI();
renderRandom(false);
renderSounds();
renderIcons();
renderEffects();
renderCatalog();
