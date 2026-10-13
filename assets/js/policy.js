// Policy Results: real-world rollout scores (paper Fig. 4) + rollout videos.
(() => {
  // ================= Config =================
  // ours: highlighted bar; key: the "w/o alignment" ablation, compared against ours in the gain line
  const METHODS = [
    { key: 'ours',     name: 'BATCH', ours: true },
    { key: 'ot',       name: 'BATCH w/ OT' },
    { key: 'noalign',  name: 'BATCH w/o alignment', key2: true },
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
      scenes: [
        ['Unseen background 1', 't1'],
        ['Unseen objects & distractor', 't2'],
        ['Unseen objects & background 2', 't3'],
        ['Unseen objects & background 3', 't4'],
      ], cols: 4, speed: '4×',
    },
    {
      key: 'cup_on_saucer',
      name: 'Cup on Saucer',
      metric: 'Avg. success rate (%), unseen objects & environments, 30 rollouts',
      scores: { ours: 83.3, ot: 63.3, noalign: 50.0, egoverse: 63.3, robot: 33.3 },
      max: 100, fmt: (v) => `${v.toFixed(1)}%`,
      scenes: [
        ['White cloth · seen object', 'white_cloth_seen_obj_1'],
        ['White cloth · unseen object 1', 'white_cloth_unseen_obj_1'],
        ['White cloth · unseen object 2', 'white_cloth_unseen_obj_2'],
        ['Gray cloth · seen object', 'gray_cloth_seen_obj_1'],
        ['Gray cloth · unseen object 1', 'gray_cloth_unseen_obj_1'],
        ['Gray cloth · unseen object 2', 'gray_cloth_unseen_obj_2'],
      ], cols: 3, speed: '2×',
      // Baseline failure cases, one column per method
      failures: [
        ['BATCH w/o alignment · case 1', 'baselines/no_alignment_1', 'Did not place the cup upright.', 16.8],
        ['EgoVerse · case 1', 'baselines/egoverse_1', 'Bad handover.', 7.4],
        ['Robot Only · case 1', 'baselines/robot_only_1', 'Failed to grasp: gripper did not close.', 3.4],
        ['BATCH w/o alignment · case 2', 'baselines/no_alignment_2', 'Did not place the cup on the saucer.', 8.6],
        ['EgoVerse · case 2', 'baselines/egoverse_2', 'Bad handover.', 5.7],
        ['Robot Only · case 2', 'baselines/robot_only_2', 'Bad handover.', 12.5],
      ],
    },
  ];

  // Rollout videos: BATCH executing in each of the task's scenes, then optional baseline failure cases
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  // scenes: label, or [label, file name]; cols: videos per row; speed: label only, videos are pre-rendered sped up
  // and play at their native rate. failures (optional): [label, file name, failure note, failure time (s, approximate)] baseline videos; the red border shows from the failure time until the video loops, laid out with the same cols.
  // File layout: videos/policy/<task>/<file>.mp4 for BATCH (file defaults to the slugged label), e.g. .../object_in_container/t1.mp4
  const videoSrc = (task, file) => `videos/policy/${task}/${file}.mp4`;
  // ==========================================

  const root = document.getElementById('policy');
  if (!root) return;
  const $ = (sel) => root.querySelector(sel);

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
  const state = { task: 0 };

  $('[data-role=r-tasks]').innerHTML = TASKS.map((t, i) => `<button data-task="${i}">${t.name}</button>`).join('');

  function render() {
    const t = TASKS[state.task];
    root.querySelectorAll('[data-task]').forEach((b) => b.classList.toggle('on', +b.dataset.task === state.task));
    $('[data-role=r-speed]').textContent = t.speed;
    $('[data-role=r-title]').textContent = t.failures ? 'BATCH rollouts and baseline failure cases' : 'BATCH rollouts';
    const cells = (el, items, cols) => {
      el.style.setProperty('--cols', cols);
      el.innerHTML = items.map((sc, i) => {
        const [s, file, note, failAt] = Array.isArray(sc) ? sc : [sc, slug(sc)];
        const edge = i % cols === 0 ? 'first' : i % cols === cols - 1 ? 'last' : '';
        return `
        <div class="pr-cell ${edge}">
          <div class="pr-cell-name">${s}</div>
          <div class="pr-frame" data-label="${s}"${failAt != null ? ` data-fail-at="${failAt}"` : ''}>
            <video src="${videoSrc(t.key, file)}" muted loop playsinline autoplay preload="auto"></video>
            <div class="pr-speed">${t.speed}</div>
            <div class="pr-seek"><div class="pr-seek-fill"></div></div>
          </div>
          ${note ? `<div class="pr-fail-note">✗ ${note}</div>` : ''}
        </div>`;
      }).join('');
    };
    cells($('[data-role=r-grid]'), t.scenes, t.cols);
    $('[data-role=r-fail]').hidden = !t.failures;
    cells($('[data-role=r-fail-grid]'), t.failures || [], t.cols);
    root.querySelectorAll('.pr-grid video').forEach((v) => {
      v.addEventListener('error', () => v.parentElement.classList.add('missing'));
      // Thin seek bar along the bottom edge: shows progress, click or drag to scrub
      const frame = v.parentElement, seek = frame.querySelector('.pr-seek'), fill = seek.firstElementChild;
      const failAt = frame.dataset.failAt != null ? +frame.dataset.failAt : null;
      const tick = () => {
        if (v.duration) fill.style.width = `${(v.currentTime / v.duration) * 100}%`;
        if (failAt != null) frame.classList.toggle('failing', v.currentTime >= failAt);
        if (v.isConnected) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      const scrub = (e) => {
        const r = seek.getBoundingClientRect();
        if (v.duration) v.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * v.duration;
      };
      seek.addEventListener('pointerdown', (e) => { seek.setPointerCapture(e.pointerId); scrub(e); });
      seek.addEventListener('pointermove', (e) => { if (seek.hasPointerCapture(e.pointerId)) scrub(e); });
      v.play().catch(() => {});
    });
  }

  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-task]');
    if (!el) return;
    state.task = +el.dataset.task;
    render();
  });

  render();
})();
