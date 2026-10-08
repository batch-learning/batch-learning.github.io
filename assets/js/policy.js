// Policy Results: real-world rollout scores (paper Fig. 4) + rollout videos.
(() => {
  // ================= Config =================
  // ours: highlighted bar; key: the "w/o alignment" ablation, compared against ours in the gain line
  const METHODS = [
    { key: 'ours',     name: 'OURS', ours: true },
    { key: 'ot',       name: 'OURS w/ OT' },
    { key: 'noalign',  name: 'OURS w/o alignment', key2: true },
    { key: 'egoverse', name: 'EgoVerse' },
    { key: 'robot',    name: 'Robot Only' },
  ];

  const TASKS = [
    {
      key: 'object_in_container',
      name: 'Object in Container',
      metric: 'Avg. normalized score, 4 unseen configurations, 20 rollouts',
      scores: { ours: 0.63, ot: 0.50, noalign: 0.42, egoverse: 0.40, robot: 0.28 },
      max: 1, fmt: (v) => v.toFixed(2),
      settings: ['T1', 'T2', 'T3', 'T4'],
    },
    {
      key: 'cup_on_saucer',
      name: 'Cup on Saucer',
      metric: 'Avg. success rate (%), unseen objects & environments, 30 rollouts',
      scores: { ours: 83.3, ot: 63.3, noalign: 50.0, egoverse: 63.3, robot: 33.3 },
      max: 100, fmt: (v) => `${v.toFixed(1)}%`,
      settings: ['Cup right', 'Cup left', 'Seen obj.', 'Unseen obj.', 'Unseen env 1', 'Unseen env 2'],
    },
  ];

  // Rollout videos shown side by side
  const ROLLOUT_METHODS = METHODS.map((x) => x.key);
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  // File layout: videos/policy/<task>/<setting>/<method>.mp4  e.g. videos/policy/cup_on_saucer/unseen_obj/ours.mp4
  const videoSrc = (task, setting, method) => `videos/policy/${task}/${slug(setting)}/${method}.mp4`;
  const PLAYBACK = '2×';  // label only; set playbackRate below to match
  const PLAYBACK_RATE = 2;
  // ==========================================

  const root = document.getElementById('policy');
  if (!root) return;
  const $ = (sel) => root.querySelector(sel);
  const byKey = Object.fromEntries(METHODS.map((m) => [m.key, m]));

  // ---- Charts ----
  $('[data-role=charts]').innerHTML = TASKS.map((t) => {
    const rows = METHODS.map((m) => `
      <div class="pr-row ${m.ours ? 'ours' : ''} ${m.key2 ? 'key' : ''}">
        <div class="pr-name">${m.name}</div>
        <div class="pr-track">
          <div class="pr-bar" data-w="${(t.scores[m.key] / t.max) * 100}"></div>
          <span class="pr-val" data-w="${(t.scores[m.key] / t.max) * 100}" style="left:0">${t.fmt(t.scores[m.key])}</span>
        </div>
      </div>`).join('');
    return `
      <div class="pr-chart">
        <h4>${t.name}</h4>
        <p class="pr-metric">${t.metric}</p>
        ${rows}
      </div>`;
  }).join('');

  // Grow bars when the charts scroll into view
  const grow = () => root.querySelectorAll('[data-w]').forEach((el) => {
    if (el.classList.contains('pr-bar')) el.style.width = `${el.dataset.w}%`;
    else el.style.left = `${el.dataset.w}%`;
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { grow(); io.disconnect(); } }, { threshold: 0.3 });
    io.observe($('[data-role=charts]'));
  } else grow();

  // ---- Rollouts ----
  const state = { task: 0, setting: 0 };

  $('[data-role=r-tasks]').innerHTML = TASKS.map((t, i) => `<button data-task="${i}">${t.name}</button>`).join('');
  $('[data-role=r-grid]').innerHTML = ROLLOUT_METHODS.map((k) => `
    <div class="pr-cell ${byKey[k].ours ? 'ours' : ''}">
      <div class="pr-cell-name">${byKey[k].name}</div>
      <div class="pr-frame" data-label="${byKey[k].name} rollout">
        <video data-method="${k}" muted loop playsinline autoplay preload="auto"></video>
        <div class="pr-speed">${PLAYBACK}</div>
      </div>
    </div>`).join('');

  const vids = [...root.querySelectorAll('video[data-method]')];
  vids.forEach((v) => {
    v.addEventListener('error', () => v.parentElement.classList.add('missing'));
    v.addEventListener('loadedmetadata', () => { v.playbackRate = PLAYBACK_RATE; });
  });

  function render() {
    const t = TASKS[state.task];
    root.querySelectorAll('[data-task]').forEach((b) => b.classList.toggle('on', +b.dataset.task === state.task));
    $('[data-role=r-settings]').innerHTML = t.settings
      .map((s, i) => `<button data-setting="${i}" class="${i === state.setting ? 'on' : ''}">${s}</button>`).join('');
    vids.forEach((v) => {
      v.parentElement.classList.remove('missing');
      v.src = videoSrc(t.key, t.settings[state.setting], v.dataset.method);
      v.play().catch(() => {});
    });
  }

  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-task], [data-setting]');
    if (!el) return;
    if (el.dataset.task) { state.task = +el.dataset.task; state.setting = 0; }
    else state.setting = +el.dataset.setting;
    render();
  });

  render();
})();
