(() => {
  'use strict';

  const style=document.createElement('style');
  style.textContent=`
    .economy-table-wrap{overflow:auto;border:1px solid #1f291f;background:#080c08}
    .economy-table{width:100%;border-collapse:collapse;min-width:860px}
    .economy-table th,.economy-table td{padding:11px 12px;border-right:1px solid #1f291f;border-bottom:1px solid #1f291f;text-align:left;font-size:12px}
    .economy-table th{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#768372;background:#0d120d}
    .economy-table tr:last-child td{border-bottom:0}.economy-table th:last-child,.economy-table td:last-child{border-right:0}
    .economy-table .tier-name{font-family:Georgia,serif;font-size:17px}.economy-table .range{font:12px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#c8e6a0}
    .economy-rule{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}.economy-rule>div{border:1px solid #222d21;background:#0a0e0a;padding:10px}
    .economy-rule strong{display:block;margin-bottom:4px}.economy-rule span{font-size:11px;color:#7d8979;line-height:1.45}
    @media(max-width:900px){.economy-rule{grid-template-columns:1fr 1fr}}@media(max-width:600px){.economy-rule{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const sounds=document.getElementById('sounds');
  if(!sounds||document.getElementById('economy'))return;

  const section=document.createElement('section');
  section.className='section card lab-card';
  section.id='economy';
  section.innerHTML=`
    <div class="section-head">
      <div><div class="eyebrow">[[4000]] Economy rules</div><h2>Currency v0.6 — цена + уровень внимания</h2><p>Основных экономических тира по-прежнему три. T1+ — не новый ценовой тир, а сигнал внимания внутри T1. T4 остаётся динамическим safety-слоем.</p></div>
      <span class="status-badge custom">CUSTOM</span>
    </div>
    <div class="economy-table-wrap">
      <table class="economy-table">
        <thead><tr><th>Слой</th><th>Диапазон</th><th>Вид</th><th>Сигнал</th><th>Смысл</th></tr></thead>
        <tbody>
          <tr><td class="tier-name">T1 LOW</td><td class="range">&lt;≈0.9c</td><td>холодный зелёный · Font 32</td><td>—</td><td>дешёвая Currency без лишнего шума</td></tr>
          <tr><td class="tier-name">T1+</td><td class="range">≈0.9c … &lt;10c</td><td>тот же T1 · Font 32</td><td>Sound 14 + Green Triangle 0</td><td>уже стоит заметить, но это всё ещё T1</td></tr>
          <tr><td class="tier-name">T2</td><td class="range">10c … &lt;1d</td><td>салатовый · Font 37</td><td>Sound 14 + Green Triangle 0</td><td>средняя стоимость</td></tr>
          <tr><td class="tier-name">T3</td><td class="range">≥1d</td><td>тёплый жёлто-зелёный · Font 45</td><td>Sound 1 + Green beam</td><td>дорогая Currency; TOP получает Cross/Circle</td></tr>
          <tr><td class="tier-name">T4 DYNAMIC</td><td class="range">league / unknown</td><td>жёлтый текст + морская рамка · Font 37</td><td>Sound 16 + Green Moon 1</td><td>страховка для новой и неразмеченной Currency</td></tr>
        </tbody>
      </table>
    </div>
    <div class="economy-rule">
      <div><strong>Ценовой закон</strong><span>T1 &lt;10c, T2 10c–&lt;1d, T3 ≥1d. Границы не пересекаются.</span></div>
      <div><strong>T1+ ≠ новый tier</strong><span>Это дополнительный audible/map marker внутри T1 около 1 Chaos и выше.</span></div>
      <div><strong>T3 TOP</strong><span>TOP 1–5 → Cross 0. TOP 6–10 → Circle 0. Остальной HIGH без MinimapIcon, но с Sound 1 и beam.</span></div>
      <div><strong>T4 safety</strong><span>Последний Stackable Currency fallback не даёт новому ресурсу выглядеть дешёвым и незаметным.</span></div>
    </div>`;
  sounds.parentNode.insertBefore(section,sounds);
})();
