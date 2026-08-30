(() => {
  'use strict';

  // app.js keeps the historical internal key `simplePlus`; from Currency v0.7
  // that key represents the explicit T2B 0.9c–<10c attention tier.
  if (typeof tierNames !== 'undefined') {
    tierNames.simpleLow = 'T1 · LOW <0.9c';
    tierNames.simplePlus = 'T2B · ATTENTION 0.9c–<10c';
    tierNames.medium = 'T2A · MEDIUM 10c–<1d';
    tierNames.high = 'T3 · HIGH ≥1 DIVINE';
  }
  if (typeof soundUsage !== 'undefined') soundUsage[14] = 'Currency T2B / T2A';

  const style = document.createElement('style');
  style.textContent = `
    /* Exact web counterpart of uPOE.filter [4005] T2B. */
    .drop-label.simpleplus{color:rgb(158 210 80);background:rgba(13,19,11,.973);border-color:rgb(98 138 50);font-size:17px}

    /* UPSTREAM classes stay neutral until their real NeverSink section is mirrored. */
    .drop-label.upstream{font-size:15px;color:#b7bab4;background:#101210;border-color:#4b5049;font-weight:600}
    .upstream-signal{display:flex;align-items:center;gap:5px;margin-top:3px;font-size:9px;color:#777b73;white-space:nowrap}
    .upstream-dot{width:5px;height:5px;border-radius:50%;background:#737b70;display:inline-block}

    /* NeverSink [[0200]] Gold — exact RGB/threshold families, scaled for browser preview. */
    .drop-label.ns-gold{font-weight:600;white-space:nowrap}
    .drop-label.ns-gold.gold-low{font-size:17px;color:rgb(180 180 180);background:rgba(20,20,0,.706);border-color:rgb(0 0 0)}
    .drop-label.ns-gold.gold-stack1{font-size:20px;color:rgb(255 255 255);background:rgb(20 20 0);border-color:rgb(255 255 255)}
    .drop-label.ns-gold.gold-stack2{font-size:22px;color:rgb(255 255 255);background:rgb(20 20 0);border-color:rgb(255 255 255)}
    .drop-label.ns-gold.gold-stack3{font-size:22px;color:rgb(235 200 110);background:rgb(20 20 0);border-color:rgb(235 200 110)}
    .gold-signal{display:flex;align-items:center;gap:5px;margin-top:3px;font-size:9px;color:#989c91;white-space:nowrap}

    .random-item .drop-wrap{align-items:flex-start}
    .quick-sound-status{font-size:10px;color:#72806e;padding:0 3px;white-space:nowrap}
    .drop-label.link6,.drop-label.link5,.drop-label.link4,.drop-label.gem3,.drop-label.gem2,.drop-label.gem1{white-space:nowrap}
    @media(max-width:700px){
      .drop-label.simpleplus{font-size:15px}
      .drop-label.upstream{font-size:12px}
      .drop-label.ns-gold.gold-low{font-size:14px}
      .drop-label.ns-gold.gold-stack1{font-size:16px}
      .drop-label.ns-gold.gold-stack2,.drop-label.ns-gold.gold-stack3{font-size:18px}
      .upstream-signal,.gold-signal{font-size:8px}
      .quick-sound-status{width:100%}
    }
  `;
  document.head.appendChild(style);

  function syncStaticCurrencyCopy(){
    const section=document.getElementById('currency');
    if(!section)return;
    const eyebrow=section.querySelector('.head .eyebrow');
    const heading=section.querySelector('.head h2');
    const lead=section.querySelector('.head .lead');
    if(eyebrow)eyebrow.textContent='[[4000]] Currency v0.7 · T2B attention';
    if(heading)heading.textContent='Живая симуляция всего дропа';
    if(lead)lead.innerHTML='Режим «Случайный весь дроп» смешивает Currency, Gems, Links и примеры UPSTREAM-классов. Кнопка «Вся Currency» показывает точные текущие списки uPOE: T1 &lt;0.9c → T2B 0.9–&lt;10c → T2A 10c–&lt;1 Divine → T3 ≥1 Divine.';

    const rows=[...section.querySelectorAll('.legend-row')];
    if(rows[0]){
      const meta=rows[0].querySelector('.legend-meta');
      if(meta)meta.innerHTML='T1 LOW<br>&lt;0.9c<br>Font 32<br>тихо';
    }
    if(rows[1]){
      const rgb=rows[1].querySelector('.rgb');
      const meta=rows[1].querySelector('.legend-meta');
      if(rgb)rgb.textContent='158 210 80 / 13 19 11 / 98 138 50';
      if(meta)meta.innerHTML='T2B<br>0.9c–&lt;10c<br>Font 35<br>Sound 14<br>▲ Green 0';
    }
    if(rows[2]){
      const meta=rows[2].querySelector('.legend-meta');
      if(meta)meta.innerHTML='T2A<br>10c–&lt;1d<br>Font 37<br>Sound 14<br>▲ Green 0';
    }
    const notices=[...section.querySelectorAll('.notice')];
    if(notices[2])notices[2].innerHTML='<strong>Важно:</strong><br>Currency v0.7 пересортирована по свежему Allflame snapshot. Рыночные цены меняются, поэтому списки периодически пересматриваем; T2B начинается от 0.9 Chaos.';

    const marker=document.querySelector('.marker-summary');
    if(marker)marker.textContent='T2B/T2A → Green Triangle 0 · T3 TOP 1–5 → Green Cross 0 · T3 TOP 6–10 → Green Circle 0 · T4 → Green Moon 1';
  }

  const upstreamPools = {
    map:['Dunes Map','Cemetery Map','Strand Map','Jungle Valley Map'],
    scarab:['Cartography Scarab','Ambush Scarab','Divination Scarab','Expedition Scarab'],
    divcard:['The Gambler','The Saint’s Treasure','The Nurse','Rain of Chaos'],
    unique:['Tabula Rasa','Goldrim','Headhunter','Wanderlust'],
    rare:['Rare Amethyst Ring','Rare Vaal Regalia','Rare Spine Bow','Rare Two-Toned Boots'],
    flask:['Quicksilver Flask','Granite Flask','Divine Life Flask','Diamond Flask'],
    jewel:['Crimson Jewel','Cobalt Jewel','Viridian Jewel','Large Cluster Jewel'],
    fragment:['Sacrifice at Dusk','Mortal Hope','Timeless Karui Splinter','Simulacrum Splinter'],
    heist:['Contract: Lockpicking','Contract: Perception','Blueprint: Laboratory','Blueprint: Repository']
  };

  const gemPools = {
    gem1:['Fireball','Determination','Added Cold Damage Support','Frostblink'],
    gem2:['Vaal Haste','Level 19 Grace','20% Quality Fireball','Vaal Molten Shell'],
    gem3:['Awakened Added Cold Damage Support','Empower Support','21/20 Fireball','Transfigured Gem']
  };

  const linkPools = {
    link4:['4L Rare Boots','4L Rare Gloves','4L Body Armour'],
    link5:['5L Body Armour','5L Two-Handed Weapon'],
    link6:['6L Body Armour','6L Two-Handed Weapon']
  };

  function choice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function upstreamDrop(kind){
    const wrap=document.createElement('div');
    wrap.className='drop-wrap compact';
    const el=document.createElement('span');
    el.className='drop-label upstream';
    el.textContent=choice(upstreamPools[kind]);
    wrap.appendChild(el);
    const meta=document.createElement('span');
    meta.className='upstream-signal';
    meta.innerHTML='<span class="upstream-dot"></span><span>UPSTREAM · style not mirrored yet</span>';
    wrap.appendChild(meta);
    return wrap;
  }

  // Exact NeverSink [[0200]] Gold thresholds. The showcase uses campaign AreaLevel 60
  // so stacks 50–149 follow the special campaign rule visible to a levelling character.
  function goldDrop(){
    const stack=choice([18,34,58,82,126,214,487,728,1260,3420]);
    const areaLevel=60;
    let css='gold-low';
    let font=35;
    let icon={color:'Grey',shape:'Cross',size:2};
    let signal='Grey Cross 2';
    let beamColor=null;

    if(stack>=3001){
      css='gold-stack3';font=45;
      icon={color:'Yellow',shape:'Cross',size:1};
      signal='Sound 2 · Orange beam · Yellow Cross 1';
      beamColor=effectColors.Orange;
    }else if(stack>=500){
      css='gold-stack2';font=45;
      icon={color:'White',shape:'Cross',size:1};
      signal='Orange Temp beam · White Cross 1';
      beamColor=effectColors.Orange;
    }else if(stack>=150 || (stack>=50 && areaLevel<=68)){
      css='gold-stack1';font=40;
      icon={color:'Grey',shape:'Cross',size:2};
      signal='Grey Cross 2';
    }

    const wrap=document.createElement('div');
    wrap.className='drop-wrap compact';
    if(beamColor) wrap.appendChild(beam(beamColor));

    const el=document.createElement('span');
    el.className=`drop-label ns-gold ${css}`;
    el.textContent=`Gold × ${stack}`;
    wrap.appendChild(el);

    const meta=document.createElement('span');
    meta.className='gold-signal';
    const hex=effectColors[icon.color] || effectColors.Grey;
    meta.innerHTML=`${iconSvg(icon.shape,hex,icon.size)}<span>NeverSink [[0200]] · Font ${font} · ${signal}</span>`;
    wrap.appendChild(meta);
    return wrap;
  }

  function customSimpleDrop(kind){
    const wrap=document.createElement('div');
    wrap.className='drop-wrap compact';
    const el=document.createElement('span');
    el.className=`drop-label ${kind}`;
    el.textContent=choice(kind.startsWith('gem') ? gemPools[kind] : linkPools[kind]);
    wrap.appendChild(el);
    return wrap;
  }

  function addRandomItem(layer, renderer, x, y, withBeam=null){
    const item=document.createElement('div');
    item.className='random-item';
    item.style.left=`${Math.max(7,Math.min(93,x+rand(-2.5,2.5)))}%`;
    item.style.top=`${Math.max(8,Math.min(92,y+rand(-2.5,2.5)))}%`;
    if(withBeam) item.appendChild(beam(withBeam));
    item.appendChild(renderer());
    layer.appendChild(item);
  }

  function currencyRenderer(tier){
    return () => {
      let name=pick(currency[tier]);
      if(tier==='high' && Math.random()>.7) name=Math.random()>.5?'Divine Orb':'Mirror of Kalandra';
      return makeDrop(name,tier,true);
    };
  }

  function alertSoundFor(tier, linkKind){
    if(tier==='high') return 1;
    if(linkKind==='link6') return 2;
    if(tier==='league') return 16;
    if(tier==='medium' || tier==='simplePlus') return 14;
    return null;
  }

  renderRandom = function(play=true){
    if(!groundWorld) return;
    mode='random';
    clearGround();
    const layer=document.createElement('div');
    layer.className='random-layer diverse-drop';
    groundWorld.appendChild(layer);

    const alertTier=choice(['simplePlus','medium','high','league']);
    const linkKind=choice(['link4','link5','link6']);
    const alertId=alertSoundFor(alertTier, linkKind);

    addRandomItem(layer,currencyRenderer('simpleLow'),12,16);
    addRandomItem(layer,currencyRenderer(alertTier),39,15,alertTier==='high'?'#65ff62':null);
    addRandomItem(layer,()=>customSimpleDrop(choice(['gem1','gem2','gem3'])),68,15);
    addRandomItem(layer,()=>customSimpleDrop(linkKind),86,29,linkKind==='link6'?'#ff62c8':null);
    addRandomItem(layer,goldDrop,14,39);
    addRandomItem(layer,()=>upstreamDrop('map'),38,39);
    addRandomItem(layer,()=>upstreamDrop('scarab'),65,40);
    addRandomItem(layer,()=>upstreamDrop('divcard'),85,50);
    addRandomItem(layer,()=>upstreamDrop('unique'),13,62);
    addRandomItem(layer,()=>upstreamDrop('rare'),38,61);
    addRandomItem(layer,()=>upstreamDrop('flask'),63,63);
    addRandomItem(layer,()=>upstreamDrop('jewel'),84,69);
    addRandomItem(layer,()=>upstreamDrop('fragment'),18,82);
    addRandomItem(layer,()=>upstreamDrop('heist'),45,83);
    addRandomItem(layer,currencyRenderer(choice(['simplePlus','medium'])),72,84);

    if(counter) counter.textContent='15 предметов · разные классы';
    setZoom(1);
    syncModeButtons();

    if(play && soundEnabled && alertId){
      selectedSound=alertId;
      const selected=document.getElementById('selectedSound');
      if(selected) selected.textContent=`PlayAlertSound ${alertId} 300${soundUsage[alertId]?` — ${soundUsage[alertId]}`:''}`;
      playDemoSound(alertId);
      renderSounds();
    }
  };

  function installTopSoundTest(){
    const toggle=document.getElementById('soundToggle');
    if(!toggle || document.getElementById('quickSoundTest')) return;
    const btn=document.createElement('button');
    btn.className='btn';
    btn.id='quickSoundTest';
    btn.type='button';
    btn.textContent='▶ Тест звука';
    btn.addEventListener('click',()=>{
      soundEnabled=true;
      const toggleBtn=document.getElementById('soundToggle');
      if(toggleBtn){toggleBtn.classList.add('active');toggleBtn.textContent='🔊 Звук: ВКЛ';}
      playDemoSound(selectedSound || 1);
    });
    toggle.after(btn);

    const status=document.createElement('span');
    status.id='quickSoundStatus';
    status.className='quick-sound-status';
    btn.after(status);
    refreshSoundStatus();
  }

  function refreshSoundStatus(){
    const el=document.getElementById('quickSoundStatus');
    if(!el) return;
    const active=document.querySelector('.source-mode.active');
    const modeName=active?.textContent?.trim() || 'AUTO';
    el.textContent=`источник: ${modeName}`;
  }

  function recoverSilentLocalOnly(){
    const savedMode=localStorage.getItem('upoe-sound-source-mode');
    const summary=document.getElementById('localSoundSummary');
    const empty=summary && /^0\s*\/\s*16/.test(summary.textContent.trim());
    if(savedMode==='local' && empty){
      const auto=document.querySelector('[data-source-mode="auto"]');
      if(auto) auto.click();
    }
    document.querySelectorAll('[data-source-mode]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(refreshSoundStatus,0)));
    refreshSoundStatus();
  }

  const randomButton=document.querySelector('[data-mode="random"]');
  if(randomButton) randomButton.textContent='Случайный весь дроп';
  const allButton=document.querySelector('[data-mode="all"]');
  if(allButton) allButton.textContent='Вся Currency';

  syncStaticCurrencyCopy();
  installTopSoundTest();
  setTimeout(recoverSilentLocalOnly,350);
  setTimeout(()=>renderRandom(false),0);
})();
