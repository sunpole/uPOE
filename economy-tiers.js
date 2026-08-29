(() => {
  'use strict';

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
        <h2>Четыре тира Currency</h2>
        <p>T1–T3 определяются ценой. T4 — отдельный динамический safety-tier для текущей лиги и ещё не классифицированной Stackable Currency.</p>
      </div>
    </div>
    <div class="economy-table-wrap">
      <table class="economy-table">
        <thead><tr><th>Tier</th><th>uPOE</th><th>Условие</th><th>Смысл</th></tr></thead>
        <tbody>
          <tr><td>1</td><td class="tier-name">SIMPLE</td><td class="range">price &lt; 10c</td><td>дешёвая валюта; холодный салатово-морской текст</td></tr>
          <tr><td>2</td><td class="tier-name">MEDIUM</td><td class="range">10c ≤ price &lt; 1d</td><td>средняя стоимость; базовый стиль</td></tr>
          <tr><td>3</td><td class="tier-name">HIGH</td><td class="range">price ≥ 1d</td><td>дорогая валюта; тёплый жёлто-салатовый текст, Sound 1, Green beam</td></tr>
          <tr><td>4</td><td class="tier-name">LEAGUE / DYNAMIC</td><td class="range">league OR unclassified</td><td>новая/неразмеченная Currency; Sound 16 + Size 1 Green Moon</td></tr>
        </tbody>
      </table>
    </div>
    <div class="economy-rule">
      <div><strong>T1–T3 без пересечений</strong><span>Ровно 10c уже T2. Ровно 1 Divine уже T3. Ценовая иерархия не пересекается.</span></div>
      <div><strong>T4 safety</strong><span>Любая новая Stackable Currency, которой нет в списках T1/T2/T3, автоматически попадает в последний Stackable Currency fallback.</span></div>
      <div><strong>Игровые сигналы</strong><span>T3: Sound 1 + Green beam; TOP 1–5 Cross 0, TOP 6–10 Circle 0. T4: Sound 16 + Green Moon 1.</span></div>
    </div>
    <div class="selected-line">TIER 4 не применяется к обычной броне/оружию: общий development fallback остаётся отдельным.</div>
  `;
  sounds.parentNode.insertBefore(section, sounds);
})();
