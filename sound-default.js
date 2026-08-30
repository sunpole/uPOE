(() => {
  'use strict';

  const KEY = 'upoe-selected-sound';
  const saved = Number(localStorage.getItem(KEY));

  if (!(saved >= 1 && saved <= 16)) {
    selectedSound = 1;
    localStorage.setItem(KEY, '1');
    const selected = document.getElementById('selectedSound');
    if (selected) selected.textContent = 'PlayAlertSound 1 300 — Currency T3 HIGH';
    if (typeof renderSounds === 'function') renderSounds();
  }

  const currencySection = document.getElementById('currency');
  const eyebrow = currencySection?.querySelector('.head .eyebrow');
  const title = currencySection?.querySelector('.head h2');
  const lead = currencySection?.querySelector('.head .lead');
  if (eyebrow) eyebrow.textContent = 'DROP SHOWCASE · Currency v0.6 · Gems · Links · NeverSink';
  if (title) title.textContent = 'Живая симуляция всего дропа';
  if (lead) lead.innerHTML = 'Режим <strong>«Случайный весь дроп»</strong> смешивает Currency, Gems, Links и типичные категории, которые пока ведёт NeverSink. Кнопка <strong>«Вся Currency»</strong> остаётся отдельной подробной проверкой валюты.';

  // Loaded after local-sounds.js so the showcase can reuse the final sound wrapper
  // and recover a stale LOCAL ONLY state when the local library is empty.
  const showcase = document.createElement('script');
  showcase.src = './showcase-v07.js';
  showcase.async = false;
  document.body.appendChild(showcase);
})();
