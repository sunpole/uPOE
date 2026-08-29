const currency = {
  simple:[
    "Armourer's Scrap","Jeweller's Orb","Orb of Binding","Orb of Chance","Alchemy Shard","Alteration Shard",
    "Blacksmith's Whetstone","Orb of Transmutation","Orb of Augmentation","Transmutation Shard","Portal Scroll","Scroll of Wisdom"
  ],
  medium:[
    "Abrasive Catalyst","Accelerating Catalyst","Astragali","Blessed Orb","Burial Medallion","Chaos Orb","Chromatic Orb",
    "Coin of Desecration","Coin of Restoration","Eldritch Exalted Orb","Enkindling Orb","Exalted Orb","Foulborn Orb of Augmentation",
    "Gemcutter's Prism","Glassblower's Bauble","Grand Eldritch Ichor","Greater Eldritch Ember","Greater Eldritch Ichor",
    "Imbued Catalyst","Instilling Orb","Intrinsic Catalyst","Lesser Eldritch Ember","Lesser Eldritch Ichor","Noxious Catalyst",
    "Orb of Alchemy","Orb of Alteration","Orb of Fusing","Orb of Intention","Orb of Regret","Orb of Scouring","Orb of Unmaking",
    "Regal Orb","Ritual Splinter","Scrap Metal","Stacked Deck","Tainted Armourer's Scrap","Tainted Blacksmith's Whetstone",
    "Tainted Chromatic Orb","Tainted Jeweller's Orb","Tempering Catalyst","Turbulent Catalyst","Vaal Orb","Veiled Scarab"
  ],
  high:[
    "Albino Rhoa Feather","Ancient Orb","Awakener's Orb","Chaotic Astrolabe","Coin of Knowledge","Coin of Power","Coin of Skill",
    "Crusader's Exalted Orb","Crystallised Rancour","Crescent Splinter","Deceptive Astrolabe","Dextral Catalyst","Divine Orb",
    "Elder's Exalted Orb","Eldritch Chaos Orb","Eldritch Orb of Annulment","Eternal Orb","Exceptional Eldritch Ember",
    "Exceptional Eldritch Ichor","Exotic Coinage","Fertile Catalyst","Flesh of Xesht","Foulborn Exalted Orb","Foulborn Regal Orb",
    "Fracturing Orb","Fracturing Shard","Fruiting Astrolabe","Fungal Astrolabe","Grand Eldritch Ember","Grasping Astrolabe",
    "Hinekora's Lock","Hunter's Exalted Orb","Lightless Astrolabe","Maven's Chisel of Avarice","Maven's Chisel of Divination",
    "Maven's Chisel of Procurement","Maven's Chisel of Proliferation","Maven's Chisel of Scarabs","Memory of Loneliness",
    "Memory of Reverence","Memory of Trauma","Mirror of Kalandra","Mirror Shard","Nameless Astrolabe","Orb of Annulment",
    "Orb of Conflict","Orb of Dominance","Orb of Remembrance","Orb of Unravelling","Prismatic Catalyst","Redeemer's Exalted Orb",
    "Reflecting Mist","Refracting Fog","Ritual Vessel","Runic Astrolabe","Sacred Crystallised Lifeforce","Sacred Orb",
    "Shaper's Exalted Orb","Sinistral Catalyst","Tainted Catalyst","Tainted Chaos Orb","Tainted Divine Teardrop","Tainted Exalted Orb",
    "Tainted Mythic Orb","Tainted Orb of Fusing","Tailoring Orb","Tempering Orb","Templar Astrolabe","Timeless Astrolabe",
    "Unstable Catalyst","Valdo's Puzzle Box","Veiled Chaos Orb","Veiled Exalted Orb","Volatile Vaal Orb","Warlord's Exalted Orb"
  ],
  league:[
    "Dead Man's Sulphur","Message in a Bottle","Karui Enshrouding Crystal","Imperial Enshrouding Crystal","Vaal Enshrouding Crystal",
    "Templar Enshrouding Crystal","Maraketh Enshrouding Crystal","Merrick's Ducat","Cyaxan's Ducat","The Changeling's Ducat",
    "The Genteel's Ducat","Kishara's Ducat","Telesia's Ducat","Rotmother's Ducat","Brinehook's Ducat","Katakohi's Ducat",
    "Tzamoto's Ducat","Ukatoa's Ducat","Cursed Ducat (class)"
  ]
};

const leagueSet = new Set(currency.league);
Object.keys(currency).forEach(tier=>{ if(tier!=="league") currency[tier]=currency[tier].filter(x=>!leagueSet.has(x)); });

const groundViewport=document.getElementById('groundViewport');
const groundWorld=document.getElementById('groundWorld');
const counter=document.getElementById('counter');
const zoomValue=document.getElementById('zoomValue');
let zoom=1;
let mode='random';
let soundEnabled=true;
let selectedSound=6;
let iconSize=0;

const tierOrder=['league','high','medium','simple'];
const tierNames={league:'CURRENT LEAGUE / ALLFLAME',high:'HIGH',medium:'MEDIUM',simple:'SIMPLE'};
const effectColors={Red:'#ff4545',Green:'#65ff62',Blue:'#4f78ff',Brown:'#a56c43',White:'#ffffff',Yellow:'#ffe94d',Cyan:'#45efff',Grey:'#9b9b9b',Orange:'#ff9a35',Pink:'#ff62c8',Purple:'#b36cff'};
const iconShapes=['Circle','Diamond','Hexagon','Square','Star','Triangle','Cross','Moon','Raindrop','Kite','Pentagon','UpsideDownHouse'];

function label(name,tier,extra=''){
  const el=document.createElement('span');
  el.className=`drop-label ${tier} ${extra}`.trim();
  el.textContent=name;
  return el;
}
function beam(x,y,color='#b9ff2d'){
  const el=document.createElement('span');el.className='beam';el.style.left=x;el.style.top=y;el.style.color=color;return el;
}
function pick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function rand(min,max){return Math.random()*(max-min)+min}
function clearGround(){groundWorld.innerHTML='';groundViewport.scrollTop=0;groundViewport.scrollLeft=0}

function renderRandom(play=true){
  mode='random'; clearGround();
  const layer=document.createElement('div');layer.className='random-layer';groundWorld.appendChild(layer);
  const layout=[['simple',14,20],['medium',37,18],['league',72,20],['simple',82,42],['high',49,47],['medium',22,62],['league',70,70],['simple',40,81],['medium',86,84]];
  layout.forEach(([tier,x,y],i)=>{
    const n=i===4?(Math.random()>.6?'Mirror of Kalandra':'Divine Orb'):pick(currency[tier]);
    const xx=Math.max(8,Math.min(92,x+rand(-3,3))), yy=Math.max(9,Math.min(91,y+rand(-3,3)));
    if(tier==='high') layer.appendChild(beam(`${xx}%`,`${yy}%`));
    const el=label(n,tier,'random-label');el.style.left=`${xx}%`;el.style.top=`${yy}%`;layer.appendChild(el);
  });
  counter.textContent='9 предметов';
  setZoom(1);
  if(play&&soundEnabled) playDemoSound(selectedSound);
  syncModeButtons();
}

function renderAll(){
  mode='all';clearGround();
  const board=document.createElement('div');board.className='all-board';groundWorld.appendChild(board);
  let count=0;
  tierOrder.forEach(tier=>{
    const sec=document.createElement('section');sec.className='tier-section';
    const title=document.createElement('div');title.className='tier-title';title.textContent=`${tierNames[tier]} · ${currency[tier].length}`;sec.appendChild(title);
    const grid=document.createElement('div');grid.className='tier-grid';
    currency[tier].forEach(name=>{grid.appendChild(label(name,tier));count++;});
    sec.appendChild(grid);board.appendChild(sec);
  });
  counter.textContent=`${count} видов валюты`;
  requestAnimationFrame(()=>fitAll());
  syncModeButtons();
}
function syncModeButtons(){document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));}

function setZoom(next){
  zoom=Math.max(.5,Math.min(1.5,next));
  groundWorld.style.transform=`scale(${zoom})`;
  groundWorld.style.width=`${100/zoom}%`;
  zoomValue.textContent=`${Math.round(zoom*100)}%`;
}
function fitAll(){
  if(mode!=='all'){setZoom(1);return;}
  const desired=Math.min(1,Math.max(.5,(groundViewport.clientWidth-30)/1120));setZoom(desired);
}
document.getElementById('zoomOut').addEventListener('click',()=>setZoom(zoom-.1));
document.getElementById('zoomIn').addEventListener('click',()=>setZoom(zoom+.1));
document.getElementById('zoomReset').addEventListener('click',()=>setZoom(1));
document.getElementById('zoomFit').addEventListener('click',fitAll);
document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>b.dataset.mode==='all'?renderAll():renderRandom(false)));
document.getElementById('reroll').addEventListener('click',()=>renderRandom(true));

function audioCtx(){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;window.__upoeAudio=window.__upoeAudio||new C();return window.__upoeAudio;}
function playDemoSound(id){
  if(!soundEnabled)return;const ctx=audioCtx();if(!ctx)return;const t=ctx.currentTime;
  const base=180+(id*37)%520;const count=1+(id%3);const wave=['sine','triangle','square','sawtooth'][id%4];
  for(let i=0;i<count;i++){
    const o=ctx.createOscillator(),g=ctx.createGain();o.type=wave;o.frequency.setValueAtTime(base*(1+i*.28),t+i*.055);o.frequency.exponentialRampToValueAtTime(Math.max(80,base*.72),t+.22+i*.055);
    g.gain.setValueAtTime(.0001,t+i*.055);g.gain.exponentialRampToValueAtTime(.12,t+.012+i*.055);g.gain.exponentialRampToValueAtTime(.0001,t+.25+i*.055);o.connect(g).connect(ctx.destination);o.start(t+i*.055);o.stop(t+.28+i*.055);
  }
}
function renderSounds(){
  const grid=document.getElementById('soundGrid');grid.innerHTML='';
  for(let i=1;i<=16;i++){
    const card=document.createElement('div');card.className='sound-card';
    card.innerHTML=`<div class="sound-id">${i}</div><small>PlayAlertSound ${i}<br>веб-демо, не оригинал GGG</small><button class="btn small" type="button">▶ Слушать</button>`;
    card.querySelector('button').addEventListener('click',()=>{selectedSound=i;document.getElementById('selectedSound').textContent=`PlayAlertSound ${i} 300`;playDemoSound(i);renderSounds();});
    if(i===selectedSound)card.style.borderColor='#789e4b';grid.appendChild(card);
  }
}
document.getElementById('soundToggle').addEventListener('click',e=>{soundEnabled=!soundEnabled;e.currentTarget.classList.toggle('active',soundEnabled);e.currentTarget.textContent=soundEnabled?'🔊 Звук: ВКЛ':'🔇 Звук: ВЫКЛ';});
document.getElementById('soundTest').addEventListener('click',()=>playDemoSound(selectedSound));

function starPoints(){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?18:38;pts.push(`${50+Math.cos(a)*r},${50+Math.sin(a)*r}`)}return pts.join(' ')}
function iconSvg(shape,color,size){
  const px=[34,27,21][size];let body='';
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
function renderIcons(){
  const table=document.getElementById('iconTable');table.innerHTML='';
  const header=document.createElement('div');header.className='icon-row';header.innerHTML='<div class="icon-cell name">Shape / Colour</div>'+Object.keys(effectColors).map(c=>`<div class="icon-cell">${c}</div>`).join('');table.appendChild(header);
  iconShapes.forEach(shape=>{
    const row=document.createElement('div');row.className='icon-row';row.innerHTML=`<div class="icon-cell name">${shape}</div>`+Object.entries(effectColors).map(([name,hex])=>`<div class="icon-cell" title="MinimapIcon ${iconSize} ${name} ${shape}">${iconSvg(shape,hex,iconSize)}</div>`).join('');table.appendChild(row);
  });
}
document.querySelectorAll('[data-icon-size]').forEach(b=>b.addEventListener('click',()=>{iconSize=Number(b.dataset.iconSize);document.querySelectorAll('[data-icon-size]').forEach(x=>x.classList.toggle('active',Number(x.dataset.iconSize)===iconSize));renderIcons();}));

function renderEffects(){
  const grid=document.getElementById('effectGrid');grid.innerHTML='';Object.entries(effectColors).forEach(([name,hex])=>{const card=document.createElement('div');card.className='effect-card';card.innerHTML=`<div class="mini-beam" style="--beam-color:${hex}"></div><small>${name}<br>PlayEffect ${name}</small>`;grid.appendChild(card);});
}

async function openFilter(){
  const modal=document.getElementById('filterModal'),code=document.getElementById('filterCode');modal.classList.add('open');document.body.classList.add('modal-open');code.textContent='Загрузка uPOE.filter…';
  try{const r=await fetch('./uPOE.filter',{cache:'no-store'});code.textContent=await r.text();}catch{code.textContent='Не удалось загрузить uPOE.filter.'}
}
function closeFilter(){document.getElementById('filterModal').classList.remove('open');document.body.classList.remove('modal-open')}
document.getElementById('showFilter').addEventListener('click',openFilter);document.getElementById('closeFilter').addEventListener('click',closeFilter);document.getElementById('filterModal').addEventListener('click',e=>{if(e.target.id==='filterModal')closeFilter()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeFilter()});
document.getElementById('copyFilter').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(document.getElementById('filterCode').textContent);document.getElementById('copyFilter').textContent='Скопировано';setTimeout(()=>document.getElementById('copyFilter').textContent='Копировать',1200)}catch{}});

renderSounds();renderIcons();renderEffects();renderRandom(false);
