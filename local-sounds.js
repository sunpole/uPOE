(() => {
  'use strict';

  const DB_NAME = 'uPOE-local-audio';
  const DB_VERSION = 1;
  const STORE = 'sounds';
  const MODE_KEY = 'upoe-sound-source-mode';
  const SELECTED_KEY = 'upoe-selected-sound';
  const localSounds = new Map();
  let sourceMode = localStorage.getItem(MODE_KEY) || 'auto';
  let assignTarget = null;
  let currentAudio = null;
  let currentUrl = null;

  const originalPlayDemoSound = playDemoSound;
  const originalRenderSounds = renderSounds;

  const savedSelected = Number(localStorage.getItem(SELECTED_KEY));
  if (savedSelected >= 1 && savedSelected <= 16) selectedSound = savedSelected;

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function dbGetAll() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  }

  async function dbPut(record) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(record);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async function dbDelete(id) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(id);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  async function dbClear() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).clear();
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    });
  }

  function stopLocalAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
      currentUrl = null;
    }
  }

  function playBlob(record) {
    stopLocalAudio();
    currentUrl = URL.createObjectURL(record.blob);
    currentAudio = new Audio(currentUrl);
    currentAudio.volume = 1;
    const cleanup = () => stopLocalAudio();
    currentAudio.addEventListener('ended', cleanup, { once: true });
    currentAudio.addEventListener('error', cleanup, { once: true });
    return currentAudio.play().catch(() => {
      setStatus('Браузер не смог воспроизвести этот формат. Попробуй WAV, MP3 или OGG.', true);
      cleanup();
    });
  }

  function playSelectedSource(id) {
    if (!soundEnabled) return;
    const local = localSounds.get(id);
    if (sourceMode === 'demo') return originalPlayDemoSound(id);
    if (local) return playBlob(local);
    if (sourceMode === 'local') {
      setStatus(`Для Sound ${id} ещё не загружен локальный файл.`, true);
      return;
    }
    return originalPlayDemoSound(id);
  }

  playDemoSound = playSelectedSource;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .local-sound-panel{border:1px solid #2b3828;background:#080d08;padding:12px;margin:9px 0 12px;display:grid;gap:10px}
      .local-sound-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap}
      .local-sound-head strong{display:block;font:18px Georgia,serif;font-weight:500;margin-bottom:3px}
      .local-sound-head p{margin:0;color:#7e8a7b;font-size:11px;line-height:1.5;max-width:820px}
      .local-sound-actions,.source-modes{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
      .source-mode{border:1px solid #2c392b;background:#101510;color:#8e9a89;padding:6px 9px;cursor:pointer;font-size:11px}
      .source-mode.active{border-color:#789e4b;background:#172111;color:#e0ffb4}
      .local-summary{font:11px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#93a28e}
      .local-status{min-height:18px;font-size:11px;color:#81907d}
      .local-status.error{color:#e1a78f}
      .local-file-row{margin-top:7px;padding-top:7px;border-top:1px solid #1d271c;display:grid;gap:6px}
      .local-file-name{font-size:9px;line-height:1.35;color:#89a071;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .local-file-name.empty{color:#596456}
      .local-card-actions{display:flex;gap:5px}
      .local-card-actions .btn{flex:1;min-width:0;padding:5px 6px;font-size:10px}
      .local-badge{display:inline-block;margin-left:5px;border:1px solid #4d6d35;color:#bfe88d;background:#10190d;padding:1px 4px;font-size:8px;vertical-align:middle}
      @media(max-width:700px){.local-sound-actions{width:100%}.local-sound-actions .btn{flex:1}.source-modes{width:100%}.source-mode{flex:1}}
    `;
    document.head.appendChild(style);
  }

  function createPanel() {
    const soundGrid = document.getElementById('soundGrid');
    if (!soundGrid || document.getElementById('localSoundPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'localSoundPanel';
    panel.className = 'local-sound-panel';
    panel.innerHTML = `
      <div class="local-sound-head">
        <div>
          <strong>REAL / LOCAL sounds</strong>
          <p>Аудиофайлы сохраняются только в IndexedDB этого браузера. Они не загружаются на GitHub и не отправляются на сервер. AUTO играет локальный файл, если он есть, иначе — синтезированное DEMO.</p>
        </div>
        <div class="local-summary" id="localSoundSummary">0 / 16 local</div>
      </div>
      <div class="source-modes" aria-label="Источник звука">
        <button class="source-mode" data-source-mode="auto" type="button">AUTO</button>
        <button class="source-mode" data-source-mode="local" type="button">LOCAL ONLY</button>
        <button class="source-mode" data-source-mode="demo" type="button">DEMO</button>
      </div>
      <div class="local-sound-actions">
        <button class="btn small" id="bulkSoundLoad" type="button">Загрузить файлы 1–16</button>
        <button class="btn small" id="playLoadedSequence" type="button">▶ Прослушать загруженные</button>
        <button class="btn small" id="clearLocalSounds" type="button">Очистить local</button>
      </div>
      <div class="local-status" id="localSoundStatus"></div>
      <input id="bulkSoundInput" type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" multiple hidden>
      <input id="singleSoundInput" type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac" hidden>
    `;
    soundGrid.parentNode.insertBefore(panel, soundGrid);

    panel.querySelectorAll('[data-source-mode]').forEach(btn => btn.addEventListener('click', () => setSourceMode(btn.dataset.sourceMode)));
    document.getElementById('bulkSoundLoad').addEventListener('click', () => document.getElementById('bulkSoundInput').click());
    document.getElementById('bulkSoundInput').addEventListener('change', e => importBulk([...e.target.files]));
    document.getElementById('singleSoundInput').addEventListener('change', e => importSingle(e.target.files[0]));
    document.getElementById('clearLocalSounds').addEventListener('click', clearAllLocal);
    document.getElementById('playLoadedSequence').addEventListener('click', playLoadedSequence);
    refreshModeButtons();
  }

  function setSourceMode(mode) {
    if (!['auto','local','demo'].includes(mode)) return;
    sourceMode = mode;
    localStorage.setItem(MODE_KEY, mode);
    refreshModeButtons();
    setStatus(mode === 'auto' ? 'AUTO: локальный звук используется при наличии, иначе DEMO.' : mode === 'local' ? 'LOCAL ONLY: незагруженные ID будут молчать.' : 'DEMO: локальные файлы временно не используются.');
  }

  function refreshModeButtons() {
    document.querySelectorAll('[data-source-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.sourceMode === sourceMode));
  }

  function setStatus(text, error = false) {
    const el = document.getElementById('localSoundStatus');
    if (!el) return;
    el.textContent = text || '';
    el.classList.toggle('error', !!error);
  }

  function soundIdFromName(name) {
    const base = name.replace(/\.[^.]+$/, '');
    const strong = base.match(/(?:sound|alert|id|poe)[ _.-]*0?(1[0-6]|[1-9])(?:\D|$)/i);
    if (strong) return Number(strong[1]);
    const standalone = base.match(/(?:^|\D)0?(1[0-6]|[1-9])(?:\D|$)/);
    return standalone ? Number(standalone[1]) : null;
  }

  function naturalSort(files) {
    return [...files].sort((a,b) => a.name.localeCompare(b.name, undefined, { numeric:true, sensitivity:'base' }));
  }

  async function saveFile(id, file) {
    if (!file || id < 1 || id > 16) return;
    const record = { id, name:file.name, type:file.type || 'audio/*', size:file.size, updatedAt:Date.now(), blob:file };
    await dbPut(record);
    localSounds.set(id, record);
  }

  async function importSingle(file) {
    if (!file || !assignTarget) return;
    try {
      await saveFile(assignTarget, file);
      setStatus(`Sound ${assignTarget} → ${file.name}`);
      assignTarget = null;
      renderSounds();
    } catch (err) {
      setStatus(`Не удалось сохранить файл: ${err?.message || err}`, true);
    }
    document.getElementById('singleSoundInput').value = '';
  }

  async function importBulk(files) {
    if (!files.length) return;
    const mapped = new Map();
    const unresolved = [];
    files.forEach(file => {
      const id = soundIdFromName(file.name);
      if (id && !mapped.has(id)) mapped.set(id, file); else unresolved.push(file);
    });

    if (mapped.size === 0 && files.length === 16) {
      naturalSort(files).forEach((file, idx) => mapped.set(idx + 1, file));
      setStatus('В именах не найдено ID: 16 файлов сопоставлены по естественной сортировке имён 1→16. Проверь их на слух.');
    } else if (unresolved.length) {
      const free = Array.from({length:16},(_,i)=>i+1).filter(id => !mapped.has(id));
      if (unresolved.length === free.length) naturalSort(unresolved).forEach((file, idx) => mapped.set(free[idx], file));
    }

    if (!mapped.size) {
      setStatus('Не удалось определить номера. Назови файлы, например Sound01.wav … Sound16.wav, или загружай их по одному.', true);
      document.getElementById('bulkSoundInput').value = '';
      return;
    }

    try {
      for (const [id,file] of mapped) await saveFile(id,file);
      setStatus(`Сохранено локально: ${mapped.size} файлов. Ничего не отправлено в GitHub.`);
      renderSounds();
    } catch (err) {
      setStatus(`Ошибка IndexedDB: ${err?.message || err}`, true);
    }
    document.getElementById('bulkSoundInput').value = '';
  }

  async function removeLocal(id) {
    await dbDelete(id);
    localSounds.delete(id);
    setStatus(`Локальный Sound ${id} удалён.`);
    renderSounds();
  }

  async function clearAllLocal() {
    if (!localSounds.size) return setStatus('Локальная библиотека уже пустая.');
    if (!confirm('Удалить все локально сохранённые звуки uPOE из этого браузера?')) return;
    stopLocalAudio();
    await dbClear();
    localSounds.clear();
    setStatus('Все локальные звуки удалены.');
    renderSounds();
  }

  async function playLoadedSequence() {
    const ids = [...localSounds.keys()].sort((a,b)=>a-b);
    if (!ids.length) return setStatus('Сначала загрузи хотя бы один реальный звук.', true);
    stopLocalAudio();
    let index = 0;
    const next = () => {
      if (index >= ids.length) return setStatus('Прослушивание локальной библиотеки завершено.');
      const id = ids[index++];
      const record = localSounds.get(id);
      selectedSound = id;
      localStorage.setItem(SELECTED_KEY, String(id));
      document.getElementById('selectedSound').textContent = `PlayAlertSound ${id} 300`;
      setStatus(`Sound ${id}: ${record.name}`);
      stopLocalAudio();
      currentUrl = URL.createObjectURL(record.blob);
      currentAudio = new Audio(currentUrl);
      currentAudio.addEventListener('ended', () => { stopLocalAudio(); setTimeout(next, 250); }, { once:true });
      currentAudio.addEventListener('error', () => { stopLocalAudio(); setTimeout(next, 250); }, { once:true });
      currentAudio.play().catch(() => setStatus(`Не удалось воспроизвести ${record.name}.`, true));
      renderSounds();
    };
    next();
  }

  function decorateSoundCards() {
    const grid = document.getElementById('soundGrid');
    if (!grid) return;
    [...grid.children].forEach((card, index) => {
      const id = index + 1;
      const record = localSounds.get(id);
      const small = card.querySelector('small');
      if (record && small && !small.querySelector('.local-badge')) {
        small.insertAdjacentHTML('afterbegin', '<span class="local-badge">LOCAL</span><br>');
      }

      const row = document.createElement('div');
      row.className = 'local-file-row';
      const fileName = document.createElement('div');
      fileName.className = `local-file-name${record ? '' : ' empty'}`;
      fileName.title = record?.name || '';
      fileName.textContent = record ? record.name : 'local файл не назначен';
      row.appendChild(fileName);

      const actions = document.createElement('div');
      actions.className = 'local-card-actions';
      const load = document.createElement('button');
      load.className = 'btn small';
      load.type = 'button';
      load.textContent = record ? 'Заменить' : '+ файл';
      load.addEventListener('click', () => {
        assignTarget = id;
        const input = document.getElementById('singleSoundInput');
        input.value = '';
        input.click();
      });
      actions.appendChild(load);

      if (record) {
        const real = document.createElement('button');
        real.className = 'btn small';
        real.type = 'button';
        real.textContent = '▶ REAL';
        real.addEventListener('click', () => {
          selectedSound = id;
          localStorage.setItem(SELECTED_KEY, String(id));
          document.getElementById('selectedSound').textContent = `PlayAlertSound ${id} 300`;
          playBlob(record);
          renderSounds();
        });
        actions.appendChild(real);

        const del = document.createElement('button');
        del.className = 'btn small';
        del.type = 'button';
        del.textContent = '×';
        del.title = 'Удалить локальный файл';
        del.addEventListener('click', () => removeLocal(id));
        actions.appendChild(del);
      }
      row.appendChild(actions);
      card.appendChild(row);
    });
  }

  function updateSummary() {
    const summary = document.getElementById('localSoundSummary');
    if (summary) summary.textContent = `${localSounds.size} / 16 local`;
    const selected = document.getElementById('selectedSound');
    if (selected) selected.textContent = `PlayAlertSound ${selectedSound} 300${localSounds.has(selectedSound) ? ' · LOCAL READY' : ''}`;
  }

  renderSounds = function() {
    originalRenderSounds();
    localStorage.setItem(SELECTED_KEY, String(selectedSound));
    decorateSoundCards();
    updateSummary();
  };

  async function init() {
    injectStyles();
    createPanel();
    try {
      const records = await dbGetAll();
      records.forEach(record => localSounds.set(record.id, record));
      setStatus(records.length ? `Восстановлено из браузера: ${records.length} локальных звуков.` : 'Локальная библиотека пока пустая.');
    } catch (err) {
      setStatus(`IndexedDB недоступен: ${err?.message || err}`, true);
    }
    renderSounds();
  }

  init();
})();
