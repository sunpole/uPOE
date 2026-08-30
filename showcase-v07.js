(() => {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    .drop-label.upstream{font-size:15px;color:#c8c2b6;background:#11100e;border-color:#655f55;font-weight:600}
    .drop-label.upstream.gold{color:#f0cf70;border-color:#8e7436;background:#171307}
    .drop-label.upstream.map{color:#e8e3d7;border-color:#7a7468;background:#12110f}
    .drop-label.upstream.divcard{color:#83d7f2;border-color:#3f8298;background:#071317}
    .drop-label.upstream.unique{color:#d99b65;border-color:#8d5d39;background:#1a1008}
    .drop-label.upstream.rare{color:#f1e36b;border-color:#8b7d32;background:#171506}
    .drop-label.upstream.scarab{color:#c5b2f2;border-color:#715c9a;background:#100b18}
    .drop-label.upstream.flask{color:#b8d8df;border-color:#5c7880;background:#0a1113}
    .drop-label.upstream.jewel{color:#d5c7d8;border-color:#766a78;background:#120f13}
    .drop-label.upstream.fragment{color:#c8d9ae;border-color:#647451;background:#0d120a}
    .drop-label.upstream.heist{color:#c9b697;border-color:#746348;background:#151109}
    .upstream-signal{display:flex;align-items:center;gap:5px;margin-top:3px;font-size:9px;color:#777b73;white-space:nowrap}
    .upstream-dot{width:5px;height:5px;border-radius:50%;background:#737b70;display:inline-block}
    .random-item .drop-wrap{align-items:flex-start}
    .quick-sound-status{font-size:10px;color:#72806e;padding:0 3px;white-space:nowrap}
    .drop-label.link6,.drop-label.link5,.drop-label.link4,.drop-label.gem3,.drop-label.gem2,.drop-label.gem1{white-space:nowrap}
    @media(max-width:700px){.drop-label.upstream{font-size:12px}.upstream-signal{font-size:8px}.quick-sound-status{width:100%}}
  `;
  document.head.appendChild(style);

  const upstreamPools = {
    gold:['Gold','Gold × 487','Gold × 1260'],
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
    el.className=`drop-label upstream ${kind}`;
    el.textContent=choice(upstreamPools[kind]);
    wrap.appendChild(el);
    const meta=document.createElement('span');
    meta.className='upstream-signal';
    meta.innerHTML='<span class="upstream-dot"></span><span>UPSTREAM · NeverSink 0-SOFT</span>';
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

    // One guaranteed alert item makes the laboratory useful for sound testing,
    // while the rest of the board represents many different PoE drop classes.
    const alertTier=choice(['simplePlus','medium','high','league']);
    const linkKind=choice(['link4','link5','link6']);
    const alertId=alertSoundFor(alertTier, linkKind);

    addRandomItem(layer,currencyRenderer('simpleLow'),12,16);
    addRandomItem(layer,currencyRenderer(alertTier),39,15,alertTier==='high'?'#65ff62':null);
    addRandomItem(layer,()=>customSimpleDrop(choice(['gem1','gem2','gem3'])),68,15);
    addRandomItem(layer,()=>customSimpleDrop(linkKind),86,29,linkKind==='link6'?'#ff62c8':null);

    addRandomItem(layer,()=>upstreamDrop('gold'),14,39);
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

  installTopSoundTest();
  setTimeout(recoverSilentLocalOnly,350);
  setTimeout(()=>renderRandom(false),0);
})();
