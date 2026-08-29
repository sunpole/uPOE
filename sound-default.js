(() => {
  'use strict';

  const economyScript = document.createElement('script');
  economyScript.src = './economy-tiers.js';
  economyScript.defer = true;
  document.body.appendChild(economyScript);

  const KEY = 'upoe-selected-sound';
  const saved = Number(localStorage.getItem(KEY));
  if (saved >= 1 && saved <= 16) return;

  selectedSound = 1;
  localStorage.setItem(KEY, '1');

  const selected = document.getElementById('selectedSound');
  if (selected) selected.textContent = 'PlayAlertSound 1 300';
  if (typeof renderSounds === 'function') renderSounds();
})();
