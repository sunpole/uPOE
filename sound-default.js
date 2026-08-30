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

  // Site-wide showcase enhancements are loaded after local-sounds.js so they can
  // recover a stale LOCAL ONLY state and reuse the final sound wrapper.
  const showcase = document.createElement('script');
  showcase.src = './showcase-v07.js';
  showcase.async = false;
  document.body.appendChild(showcase);
})();
