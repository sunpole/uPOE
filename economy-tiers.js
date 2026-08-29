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
        <h2>Строгая шкала стоимости Currency</h2>
        <p>Базовая единица — Chaos Orb. На контрольной точке 29.08.2026 17:00 UTC: 1 Divine Orb = 258 Chaos Orb. Границы не пересекаются.</p>
      </div>
    </div>
    <div class="economy-table-wrap">
      <table class="economy-table">
        <thead><tr><th>Tier</th><th>uPOE</th><th>Диапазон</th><th>Сегодня при 1d = 258c</th><th>Смысл</th></tr></thead>
        <tbody>
          <tr><td>1</td><td class="tier-name">SIMPLE</td><td class="range">price &lt; 10c</td><td>&lt; 10 Chaos</td><td>дешёвая валюта</td></tr>
          <tr><td>2</td><td class="tier-name">MEDIUM</td><td class="range">10c ≤ price &lt; 1d</td><td>10c – 257.99c</td><td>заметная, но не топовая</td></tr>
          <tr><td>3</td><td class="tier-name">HIGH</td><td class="range">price ≥ 1d</td><td>≥ 258c</td><td>дорогая / топовая валюта</td></tr>
        </tbody>
      </table>
    </div>
    <div class="economy-rule">
      <div><strong>Без пересечений</strong><span>Ровно 10c уже MEDIUM. Ровно 1 Divine уже HIGH. HIGH никогда не должен быть дешевле MEDIUM.</span></div>
      <div><strong>League ≠ Tier 4</strong><span>Allflame — это метка/тип. League-предмет всё равно получает SIMPLE, MEDIUM или HIGH по своей цене.</span></div>
      <div><strong>HIGH actions</strong><span>Вся HIGH-группа: Sound 1 + PlayEffect Green. MinimapIcon получают только корректно пересчитанные market TOP 10.</span></div>
    </div>
    <div class="selected-line">Инвариант: max(SIMPLE) &lt; min(MEDIUM) &lt; min(HIGH)</div>
  `;
  sounds.parentNode.insertBefore(section, sounds);

  document.querySelectorAll('.notice').forEach(n => {
    if (n.textContent.includes('Текущий TOP 10')) {
      n.innerHTML = '<strong>TOP 10 по цене:</strong> прежний частичный список снят с роли источника истины. Иконки TOP 1–5 / TOP 6–10 должны пересчитываться только из полной актуальной выборки Currency с надёжной рыночной ценой.';
    }
  });
})();
