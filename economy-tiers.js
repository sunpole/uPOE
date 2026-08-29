(() => {
  'use strict';

  // Keep the browser simulator aligned with the playable Currency v0.4 filter.
  currency.simple = [
    "Chaos Orb","Armourer's Scrap","Blacksmith's Whetstone","Jeweller's Orb","Orb of Binding","Orb of Chance",
    "Alchemy Shard","Alteration Shard","Transmutation Shard","Orb of Transmutation","Orb of Augmentation","Portal Scroll",
    "Scroll of Wisdom","Chromatic Orb","Stacked Deck","Exalted Orb","Orb of Fusing","Orb of Alchemy","Orb of Alteration",
    "Orb of Regret","Orb of Scouring","Orb of Unmaking","Regal Orb","Instilling Orb","Blessed Orb","Gemcutter's Prism",
    "Glassblower's Bauble","Enkindling Orb","Abrasive Catalyst","Accelerating Catalyst","Imbued Catalyst","Intrinsic Catalyst",
    "Noxious Catalyst","Tainted Catalyst","Tempering Catalyst","Turbulent Catalyst","Unstable Catalyst","Fracturing Shard",
    "Tainted Blacksmith's Whetstone","Tainted Jeweller's Orb","Greater Eldritch Ichor","Lesser Eldritch Ember",
    "Lesser Eldritch Ichor","Grand Eldritch Ichor","Vaal Orb"
  ];

  currency.medium = [
    "Warlord's Exalted Orb","Shaper's Exalted Orb","Elder's Exalted Orb","Sacred Crystallised Lifeforce","Veiled Chaos Orb",
    "Sinistral Catalyst","Redeemer's Exalted Orb","Maven's Chisel of Proliferation","Crystallised Rancour",
    "Eldritch Orb of Annulment","Eldritch Chaos Orb","Prismatic Catalyst","Maven's Chisel of Scarabs",
    "Maven's Chisel of Divination","Maven's Chisel of Procurement","Crusader's Exalted Orb","Foulborn Orb of Augmentation",
    "Tainted Chromatic Orb","Orb of Intention","Eldritch Exalted Orb","Greater Eldritch Ember","Tainted Armourer's Scrap",
    "Grand Eldritch Ember","Foulborn Regal Orb","Orb of Annulment","Fertile Catalyst","Coin of Desecration",
    "Coin of Restoration","Coin of Knowledge","Coin of Power","Coin of Skill","Chaotic Astrolabe","Deceptive Astrolabe",
    "Fruiting Astrolabe","Fungal Astrolabe","Grasping Astrolabe","Lightless Astrolabe","Nameless Astrolabe",
    "Runic Astrolabe","Templar Astrolabe","Timeless Astrolabe","Sacred Orb","Tainted Chaos Orb","Tainted Mythic Orb",
    "Tainted Orb of Fusing","Orb of Unravelling","Ritual Vessel"
  ];

  currency.high = [
    "Mirror of Kalandra","Hinekora's Lock","Mirror Shard","Reflecting Mist","Veiled Exalted Orb",
    "Tainted Divine Teardrop","Volatile Vaal Orb","Orb of Dominance","Refracting Fog","Foulborn Exalted Orb",
    "Awakener's Orb","Tailoring Orb","Tempering Orb","Fracturing Orb","Orb of Conflict","Hunter's Exalted Orb",
    "Dextral Catalyst","Flesh of Xesht","Exceptional Eldritch Ember","Exceptional Eldritch Ichor","Tainted Exalted Orb",
    "Orb of Remembrance","Maven's Chisel of Avarice","Valdo's Puzzle Box","Eternal Orb","Divine Orb"
  ];

  if (typeof mode !== 'undefined') {
    if (mode === 'all' && typeof renderAll === 'function') renderAll();
    else if (typeof renderRandom === 'function') renderRandom(false);
  }

  const style = document.createElement('style');
  style.textContent = `
    .economy-table-wrap{overflow:auto;border:1px solid #1f291f;background:#080c08}
    .economy-table{width:100%;border-collapse:collapse;min-width:760px}
    .economy-table th,.economy-table td{padding:11px 12px;border-right:1px solid #1f291f;border-bottom:1px solid #1f291f;text-align:left;font-size:12px}
    .economy-table th{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#768372;background:#0d120d}
    .economy-table tr:last-child td{border-bottom:0}.economy-table th:last-child,.economy-table td:last-child{border-right:0}
    .economy-table .tier-name{font-family:Georgia,serif;font-size:17px}.economy-table .range{font:12px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#c8e6a0}
    .economy-rule{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.economy-rule>div{border:1px solid #222d21;background:#0a0e0a;padding:10px}
    .economy-rule strong{display:block;margin-bottom:4px}.economy-rule span{font-size:11px;color:#7d8979;line-height:1.45}
    @media(max-width:700px){.economy-rule{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const sounds = document.getElementById('sounds');
  if (!sounds || document.getElementById('economy')) return;

  const section = document.createElement('section');
  section.className = 'section card lab-card';
  section.id = 'economy';
  section.innerHTML = `
    <div class="section-head">
      <div>
        <div class="eyebrow">Economy tier rules</div>
        <h2>Строгая шкала стоимости Currency</h2>
        <p>Базовая единица — Chaos Orb. Контрольная точка 29.08.2026: 1 Divine примерно 250–260 Chaos. Границы не пересекаются.</p>
      </div>
    </div>
    <div class="economy-table-wrap">
      <table class="economy-table">
        <thead><tr><th>Tier</th><th>uPOE</th><th>Диапазон</th><th>Смысл</th></tr></thead>
        <tbody>
          <tr><td>1</td><td class="tier-name">SIMPLE</td><td class="range">price &lt; 10c</td><td>дешёвая валюта</td></tr>
          <tr><td>2</td><td class="tier-name">MEDIUM</td><td class="range">10c ≤ price &lt; 1d</td><td>заметная, но не топовая</td></tr>
          <tr><td>3</td><td class="tier-name">HIGH</td><td class="range">price ≥ 1d</td><td>дорогая / топовая валюта</td></tr>
        </tbody>
      </table>
    </div>
    <div class="economy-rule">
      <div><strong>Без пересечений</strong><span>Ровно 10c уже MEDIUM. Ровно 1 Divine уже HIGH. HIGH никогда не должен быть дешевле MEDIUM.</span></div>
      <div><strong>Safety fallback</strong><span>Новая или пока не проверенная Stackable Currency временно получает MEDIUM, а не SIMPLE.</span></div>
      <div><strong>HIGH actions</strong><span>Вся HIGH-группа: Sound 1 + PlayEffect Green. TOP 1–5: Green Cross 0. TOP 6–10: Green Circle 0.</span></div>
    </div>
    <div class="selected-line">Инвариант: max(SIMPLE) &lt; min(MEDIUM) &lt; min(HIGH)</div>
  `;
  sounds.parentNode.insertBefore(section, sounds);
})();
