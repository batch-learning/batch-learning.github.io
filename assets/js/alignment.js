// Alignment Results: robot query video -> retrieved human video per method.
(() => {
  // ================= Config =================
  const METHODS = [
    { key: 'batch', name: 'BATCH (Ours)', good: true },
    { key: 'clip',  name: 'CLIP' },
    { key: 'xclip', name: 'X-CLIP' },
    { key: 'tcn',   name: 'TCN' },
  ];

  const TASKS = [
    { key: 'object_in_container', name: 'Object in Container', count: 4, desc: 'The robot picks up an object and places it in a container.' },
    { key: 'cup_on_saucer',       name: 'Cup on Saucer',       count: 6, desc: 'The robot places a cup on a saucer.' },
  ];

  // File layout: videos/<task>/<n>/<query|batch|clip|xclip|tcn>.mp4
  const videoSrc = (task, n, who) => `videos/${task}/${n}/${who}.mp4`;

  // Pre-composited videos with side-by-side panels (one file instead of one per method).
  // panels: which cell each panel fills, left to right (null = panel not shown).
  const COMPOSITES = {
    object_in_container: {
      1: { src: 'videos/object_in_container/1/composite.mp4', panels: ['query', 'batch', null] },
    },
  };

  // Optional per-example notes: NOTES[taskKey][n - 1] = [batch, clip, xclip, tcn]
  const NOTES = {};
  const DEFAULT_NOTES = [
    'Same behavior, aligned in time.',
    'Matched scene appearance, wrong behavior.',
    'Right task, misaligned in time.',
    'Matched arm motion, wrong behavior.',
  ];
  // ==========================================

  const root = document.getElementById('alignment');
  if (!root) return;

  const $ = (sel) => root.querySelector(sel);
  const state = { task: 0, n: 1, playing: true };

  // ---- Build static markup once ----
  $('[data-role=tasks]').innerHTML = TASKS
    .map((t, i) => `<button data-task="${i}">${t.name}</button>`)
    .join('');


  const frame = (who, extra = '') =>
    `<div class="ar-frame" data-label="${who} video"><video data-who="${who}" muted loop playsinline preload="auto"></video><canvas class="ar-canvas" data-who="${who}"></canvas>${extra}</div>`;

  $('.ar-grid').innerHTML = `
    <div class="ar-head">Query robot video</div>
    <div class="ar-head results">Top-1 retrieved human video</div>
    <div class="ar-cell query">
      <div class="ar-name">Robot</div>
      ${frame('query', `
        <div class="ar-ctrl">
          <button data-act="play" title="Play / pause all"></button>
          <button data-act="restart" title="Restart all">&#8635;</button>
          <div class="ar-seek" data-act="seek"><div class="ar-track"><div class="ar-fill"></div></div></div>
        </div>`)}
    </div>
    ${METHODS.map((m, k) => `
      <div class="ar-cell ${m.good ? 'good' : 'bad'}">
        <div class="ar-name"><span class="ar-mark">${m.good ? '&#10003;' : '&#10005;'}</span>${m.name}</div>
        ${frame(m.key)}
        <p class="ar-note" data-note="${k}"></p>
      </div>`).join('')}
  `;

  const videos = [...root.querySelectorAll('video')];
  const query = videos[0];

  // Hidden player for composite videos; its panels are drawn into the cells' canvases
  const comp = document.createElement('video');
  Object.assign(comp, { muted: true, loop: true, playsInline: true, preload: 'auto' });
  comp.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;';
  root.appendChild(comp);
  let active = null; // current composite config, or null
  const master = () => (active ? comp : query);
  const fill = $('.ar-fill');
  const playBtn = $('[data-act=play]');

  videos.forEach((v) => v.addEventListener('error', () => v.parentElement.classList.add('missing')));

  // ---- Playback ----
  const playAll = () => {
    playBtn.innerHTML = state.playing ? '&#10074;&#10074;' : '&#9654;';
    [...videos, comp].forEach((v) => (v.src && state.playing ? v.play().catch(() => {}) : v.pause()));
  };

  const seekAll = (t) => [...videos, comp].forEach((v) => { if (v.src) v.currentTime = t; });

  const drawPanels = () => {
    if (!active || comp.readyState < 2) return;
    const pw = comp.videoWidth / active.panels.length, ph = comp.videoHeight;
    active.panels.forEach((who, i) => {
      const cv = who && root.querySelector(`canvas[data-who=${who}]`);
      if (!cv) return;
      if (cv.width !== pw) { cv.width = pw; cv.height = ph; }
      cv.getContext('2d').drawImage(comp, i * pw, 0, pw, ph, 0, 0, pw, ph);
    });
  };

  // Keep followers locked to the master video (query, or the composite) and update the progress bar
  (function tick() {
    const q = master();
    if (q.duration) {
      fill.style.width = `${(q.currentTime / q.duration) * 100}%`;
      videos.forEach((v) => {
        if (v !== q && v.src && Math.abs(v.currentTime - q.currentTime) > 0.15) v.currentTime = q.currentTime;
      });
    }
    drawPanels();
    requestAnimationFrame(tick);
  })();

  // ---- Render the selected example ----
  function render() {
    const task = TASKS[state.task];
    const notes = NOTES[task.key]?.[state.n - 1] ?? DEFAULT_NOTES;

    root.querySelectorAll('[data-task]').forEach((b) => b.classList.toggle('on', +b.dataset.task === state.task));
    $('[data-role=examples]').innerHTML = Array.from({ length: task.count }, (_, i) =>
      `<button data-n="${i + 1}">${i + 1}</button>`).join('');
    root.querySelectorAll('[data-n]').forEach((b) => b.classList.toggle('on', +b.dataset.n === state.n));

    active = COMPOSITES[task.key]?.[state.n] ?? null;
    if (active) comp.src = active.src; else { comp.pause(); comp.removeAttribute('src'); comp.load(); }
    videos.forEach((v) => {
      const fromComposite = !!active && active.panels.includes(v.dataset.who);
      v.parentElement.classList.remove('missing');
      v.parentElement.classList.toggle('comp', fromComposite);
      if (fromComposite) { v.pause(); v.removeAttribute('src'); v.load(); }
      else v.src = videoSrc(task.key, state.n, v.dataset.who);
    });
    root.querySelectorAll('[data-note]').forEach((p) => { p.textContent = notes[p.dataset.note]; });

    $('[data-role=caption]').innerHTML =
      `<strong>${task.name}, example ${state.n}.</strong> ${task.desc} ` +
      `Given the robot query, each method retrieves its nearest human video. ` +
      `<span style="color:var(--good)">Green</span> marks the correct behavior; <span style="color:var(--bad)">red</span> marks a wrong retrieval. ` +
      `All videos play in sync with the query.`;

    playAll();
  }

  // ---- Events ----
  root.addEventListener('click', (e) => {
    const el = e.target.closest('button, [data-act]');
    if (!el) return;

    if (el.dataset.task) { state.task = +el.dataset.task; state.n = 1; render(); }
    else if (el.dataset.n) { state.n = +el.dataset.n; render(); }
    else if (el.dataset.act === 'prev' || el.dataset.act === 'next') {
      const count = TASKS[state.task].count;
      state.n = ((state.n - 1 + (el.dataset.act === 'next' ? 1 : -1) + count) % count) + 1;
      render();
    }
    else if (el.dataset.act === 'play') { state.playing = !state.playing; playAll(); }
    else if (el.dataset.act === 'restart') { seekAll(0); }
    else if (el.dataset.act === 'seek' && master().duration) {
      const r = el.getBoundingClientRect();
      seekAll(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * master().duration);
    }
  });

  render();
})();
