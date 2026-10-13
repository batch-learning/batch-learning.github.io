// Alignment Results: grid of robot segments; hovering one shows the BATCH-retrieved human video in each human scene.
(() => {
  // ================= Config =================
  // File layout (per task), matching retrievals.json in the task folder:
  //   videos/alignment/<task>/robot/<robotPrefix>_<ep>__w<window><robotSuffix>.mp4
  //   videos/alignment/<task>/human/<scene dir>/<robotPrefix>_<ep>__w<window>__dtw_image_l2__to__<scene prefix>_<h>.mp4
  // windows[i] = { ep: robot episode, w: robot frame window, human[k]: human episode retrieved in scenes[k] }.
  // robotSuffix (optional): extra text at the end of the robot filename, computed from the window.
  // show (optional): 1-based indices into windows to display, in order; all windows are shown when omitted.
  // cols (optional): robot thumbnail grid columns (default COLS).
  // zoom (optional): how much a robot thumbnail grows on hover, e.g. 3 for 3x.
  // robotSrc / humans (optional): functions building the robot path and the [{ src, name }] human list
  //   for a window, for tasks whose files don't follow the layout above.
  // humanCols (optional): human video grid columns (default: one row).
  // humanZoom (optional): how much a human demonstration in the comparison-mode strip grows on hover.
  // humanStripCols (optional): columns of that strip, fixed so tiles are the same size for every robot clip.
  // side (optional): put the robot grid and the human videos side by side.
  // unit / robotHead / humanHead / humanHint (optional): wording for the caption and the headings.
  // methods + methodSrc (optional): comparison mode. The selected robot clip's human demonstrations, aligned by
  //   the `ours` method, are shown as a strip; hovering one shows that demonstration aligned by each of the other
  //   methods, side by side with the robot. methodSrc(w, method, h) builds the path of human episode h aligned by
  //   `method`. failures (optional): failures[ep][method suffix][h] explains a misaligned video of any method.
  //   failureSpans (optional, same keys): [[start, end], ...] seconds; the red border is shown only during them.
  //   compareCaption (optional): caption text after the task description in comparison mode.
  // humanSets (optional, comparison mode): [{ key, name, human: [...] }] — the human demonstrations come from several
  //   scenes; a switch above the strip picks the scene, and methodSrc(w, method, h, set) also receives that set.
  //   A window may instead carry best: { <set key>: h } to show only that one demonstration per scene; it is then
  //   shown in the same row as the baselines, with no strip.

  const pad = (ep) => String(ep).padStart(6, '0');

  const TASKS = [
    {
      key: 'object_in_container',
      name: 'Object in Container',
      desc: 'The robot picks up a toy, puts it in the bowl, flips the bowl to dump the toy, places the bowl on the table, and repeats the cycle.',
      // One full cycle of each robot episode is aligned to every human demonstration of the four human scenes, once
      // per method (folder suffix):
      //   videos/alignment/object_in_container/cycles/robot_ep<ep>_cycle<suffix>/robot/robot_episode_<ep>__cycle_w<window>.mp4
      //   videos/alignment/object_in_container/cycles/robot_ep<ep>_cycle<suffix>/human/<scene>/human_episode_<h>.mp4
      robotSrc: (w) => `videos/alignment/object_in_container/cycles/robot_ep${w.ep}_cycle/robot/robot_episode_${pad(w.ep)}__cycle_w${w.w}.mp4`,
      methods: [
        { suffix: '', name: 'BATCH (GTCC + DTW)', ours: true },
        { suffix: '_dinov3', name: 'DINOv3 + DTW' },
        // these files are named human_episode_<h>#c0.mp4; '#' must be URL-encoded or the browser drops the rest
        { suffix: '_rel_actions', name: 'Action DTW', file: '%23c0' },
        { suffix: '_no_alignment', name: 'Proportional mapping' },
      ],
      methodSrc: (w, m, h, set) =>
        `videos/alignment/object_in_container/cycles/robot_ep${w.ep}_cycle${m.suffix}/human/${set.key}/human_episode_${pad(h)}${m.file || ''}.mp4`,
      humanSets: [
        { key: 't1', name: 'Scene 1' },
        { key: 't2', name: 'Scene 2' },
        { key: 't3', name: 'Scene 3' },
        { key: 't4', name: 'Scene 4' },
      ],
      // Generated in assets/js/alignment-oic-failures.js; keyed by '<scene>/<human episode>'
      failures: window.OIC_ALIGNMENT_FAILURES || {},
      compareCaption: 'For each human scene we show the demonstration BATCH aligns ' +
        'best to the robot (lowest alignment cost), next to the same demonstration aligned by the baselines: ' +
        'DINOv3 + DTW uses pretrained DINOv3 image features, Action DTW uses relative end-effector actions, and ' +
        'Proportional mapping stretches the human video uniformly. All videos play in sync with the robot.',
      unit: 'robot episode',
      robotHead: 'Robot episodes',
      humanHead: 'Most aligned human demonstration per scene',
      humanHint: 'red border: misaligned with the robot',
      cols: 4,
      zoom: 2,
      humanZoom: 2,
      humanStripCols: 6,
      windows: [
        // best: the human episode with the lowest BATCH DTW cost per scene (robot_ep<ep>_cycle/alignments.csv)
        { ep: 0, w: '775-1202', best: { t1: 0, t2: 3, t3: 3, t4: 2 } },
        { ep: 1, w: '960-1314', best: { t1: 0, t2: 1, t3: 4, t4: 1 } },
        { ep: 2, w: '836-1119', best: { t1: 2, t2: 2, t3: 0, t4: 3 } },
        { ep: 3, w: '1530-1909', best: { t1: 1, t2: 0, t3: 6, t4: 3 } },
      ],
    },
    {
      key: 'cup_on_saucer',
      name: 'Cup on Saucer',
      desc: 'The robot picks up the cup by the handle, hands it over from one arm to the other, and places it on the saucer.',
      // Each full robot episode is aligned to every out-of-domain human episode in which the cup starts on the
      // same side of the saucer, once per method (folder suffix):
      //   videos/alignment/cup_on_saucer/robot_ep<ep>_vs_all<suffix>/robot/cuprobot_episode_<ep>__full.mp4
      //   videos/alignment/cup_on_saucer/robot_ep<ep>_vs_all<suffix>/human/cuphnew_episode_<h>.mp4
      robotSrc: (w) => `videos/alignment/cup_on_saucer/robot_ep${w.ep}_vs_all/robot/cuprobot_episode_${pad(w.ep)}__full.mp4`,
      methods: [
        { suffix: '', name: 'BATCH (GTCC + abs. actions + DTW)', ours: true },
        { suffix: '_dinov3', name: 'DINOv3 + DTW' },
        { suffix: '_abs_actions', name: 'Action DTW' },
        { suffix: '_no_alignment', name: 'Proportional mapping' },
      ],
      methodSrc: (w, m, h) => `videos/alignment/cup_on_saucer/robot_ep${w.ep}_vs_all${m.suffix}/human/cuphnew_episode_${pad(h)}.mp4`,
      // Generated in assets/js/alignment-cup-failures.js
      failures: window.CUP_ALIGNMENT_FAILURES || {},
      compareCaption: 'The demonstrations above are aligned to the robot by BATCH. Below we show the aligned demonstrations selected by the baselines: ' +
        'DINOv3 + DTW uses pretrained DINOv3 image features, Action DTW uses absolute end-effector poses, and ' +
        'Proportional mapping stretches the human video uniformly. All videos play in sync with the robot.',
      unit: 'robot episode',
      robotHead: 'Robot episodes',
      humanHead: 'BATCH-retrieved human demonstrations',
      humanHint: 'hover to compare',
      cols: 6,
      zoom: 2,
      humanZoom: 2,
      humanStripCols: 5,
      windows: [
        { ep: 0, human: [1, 5, 9, 13, 17, 19, 21, 22, 23] },
        { ep: 30, human: [0, 4, 8, 12, 16, 18, 20] },
        { ep: 62, human: [1, 5, 9, 13, 17, 19, 21, 22, 23] },
        { ep: 63, human: [1, 5, 9, 13, 17, 19, 21, 22, 23] },
        { ep: 114, human: [0, 4, 8, 12, 16, 18, 20] },
        { ep: 124, human: [0, 4, 8, 12, 16, 18, 20] },
      ],
    },
  ];

  // Default paths, built from robotPrefix / scenes (used when a task doesn't define robotSrc / humans)
  const robotClip = (task, w) => `${task.robotPrefix}_${pad(w.ep)}__w${w.w}`;
  const robotSrc = (task, w) => (task.robotSrc
    ? task.robotSrc(w)
    : `videos/alignment/${task.key}/robot/${robotClip(task, w)}${task.robotSuffix ? task.robotSuffix(w) : ''}.mp4`);
  const humanList = (task, w) => (task.humans
    ? task.humans(w)
    : task.scenes.map((scene, k) => ({
      src: `videos/alignment/${task.key}/human/${scene.dir}/${robotClip(task, w)}__dtw_image_l2__to__${scene.prefix}_${pad(w.human[k])}.mp4`,
      name: scene.name,
    })));
  const shown = (task) => (task.show ? task.show.map((n) => task.windows[n - 1]) : task.windows);

  // Default robot thumbnail grid columns
  const COLS = 5;
  // ==========================================

  const root = document.getElementById('alignment');
  if (!root) return;

  const $ = (sel) => root.querySelector(sel);
  const state = { task: 0, sel: 0, human: 0, set: 0, paused: false };
  // Comparison mode: the human demonstrations of the selected robot clip (from the selected scene, if any)
  const compareSet = (task) => (task.humanSets ? task.humanSets[state.set] : null);
  const compareHumans = (task, win) => {
    if (!task.humanSets) return win.human;
    const set = compareSet(task);
    return win.best ? [win.best[set.key]] : set.human;
  };

  // ---- Build static markup once ----
  $('[data-role=tasks]').innerHTML = TASKS
    .map((t, i) => `<button data-task="${i}">${t.name}</button>`)
    .join('');
  // Hide the task switch while there is only one task
  $('[data-role=tasks]').style.display = TASKS.length > 1 ? '' : 'none';

  const frame = (who, extra = '') =>
    `<div class="ar-frame" data-label="${who} video"><video data-who="${who}" muted loop playsinline preload="auto"></video>${extra}</div>`;

  let robots = [];
  let humans = [];

  const watchMissing = (v) => v.addEventListener('error', () => v.parentElement.classList.add('missing'));
  const release = (v) => { v.pause(); v.removeAttribute('src'); v.load(); };

  // Grow or shrink the human grid to n cells, reusing existing video elements
  function humanCells(n) {
    const box = $('[data-role=humans]');
    let cells = [...box.querySelectorAll('[data-scene]')];
    cells.slice(n).forEach((cell) => { release(cell.querySelector('video')); cell.remove(); });
    for (let k = cells.length; k < n; k++) {
      box.insertAdjacentHTML('beforeend', `
        <div class="ar-cell" data-scene="${k}">
          <div class="ar-name"><span data-role="scene-name"></span></div>
          ${frame(`human ${k + 1}`)}
        </div>`);
      watchMissing(box.lastElementChild.querySelector('video'));
    }
    cells = [...box.querySelectorAll('[data-scene]')];
    humans = cells.map((cell) => cell.querySelector('video'));
    return cells;
  }

  // ---- Comparison mode: one human demonstration aligned by every method, next to the robot ----
  function renderCompare(task, win) {
    const box = $('[data-role=humans]');
    humans.forEach(release);
    box.style.gridTemplateColumns = '';
    box.classList.add('compare');
    const ours = task.methods.find((m) => m.ours) || task.methods[0];
    const list = compareHumans(task, win), set = compareSet(task);
    // A single demonstration: show ours in the same row as the baselines instead of a strip above them
    const inline = !!win.best;
    const baselines = task.methods.map((m, k) => [m, k]).filter(([m]) => inline || !m.ours);
    const cols = task.humanStripCols || Math.ceil(list.length / 2);
    const rows = Math.ceil(list.length / cols);
    box.innerHTML = `
      ${task.humanSets ? `<div class="ar-seg ar-sets">${task.humanSets.map((s, k) =>
        `<button data-set="${k}" class="${k === state.set ? 'on' : ''}">${s.name}${s.human ? ` <span class="ar-count">${s.human.length}</span>` : ''}</button>`).join('')}</div>` : ''}
      ${inline ? '' : `<div class="ar-hstrip${task.humanZoom ? ' zoom' : ''}" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr)); --zoom: ${task.humanZoom || 1}">
        ${list.map((h, j) => {
          // Grow each tile from a point proportional to its grid position so the enlarged tile stays inside the strip
          const c = j % cols, r = Math.floor(j / cols);
          const origin = `${cols > 1 ? (c / (cols - 1)) * 100 : 50}% ${rows > 1 ? (r / (rows - 1)) * 100 : 50}%`;
          return `<div class="ar-htile" data-human="${j}" style="transform-origin: ${origin}">${frame(`human ${j + 1}`)}</div>`;
        }).join('')}
      </div>
      <div class="ar-head ar-subhead">Baselines on the selected demonstration ${task.failures ? '<span class="ar-hint">red border: misaligned with the robot</span>' : ''}</div>`}
      <div class="ar-compare" style="grid-template-columns: repeat(${baselines.length + 1}, minmax(0, 1fr))">
        <div class="ar-cell" data-ref><div class="ar-name">Robot</div>${frame('robot')}</div>
        ${baselines.map(([m, k]) => `
          <div class="ar-cell${m.ours ? ' ours' : ''}" data-method="${k}">
            <div class="ar-name">${m.name}</div>${frame(m.name)}
            <p class="ar-fail-note"></p>
          </div>`).join('')}
      </div>
      <div class="ar-ctrl">
        <button class="ar-play" data-act="ar-play" title="Play / pause all videos"></button>
        <div class="ar-seek" title="Drag to scrub all videos"><div class="ar-seek-fill"></div></div>
        <span class="ar-time"></span>
      </div>`;
    humans = [...box.querySelectorAll('video')];
    humans.forEach(watchMissing);
    // Strip thumbnails use our (BATCH) alignment
    box.querySelectorAll('[data-human] video').forEach((v, j) => { v.src = task.methodSrc(win, ours, list[j], set); });
    box.querySelector('[data-ref] video').src = robotSrc(task, win);
    selectHuman(0);
  }

  function selectHuman(j) {
    const task = TASKS[state.task];
    const win = shown(task)[state.sel];
    const box = $('[data-role=humans]');
    const list = compareHumans(task, win), set = compareSet(task);
    state.human = j;
    box.querySelectorAll('[data-human]').forEach((el) => el.classList.toggle('on', +el.dataset.human === j));
    box.querySelectorAll('[data-method]').forEach((cell) => {
      const m = task.methods[+cell.dataset.method];
      const v = cell.querySelector('video');
      v.parentElement.classList.remove('missing');
      v.src = task.methodSrc(win, m, list[j], set);
      // Red border + explanation when this method misaligns the demonstration. Notes with `when` (e.g. the human
      // resetting the cup) are only shown while that part of the video plays; see tick().
      const key = set ? `${set.key}/${list[j]}` : list[j];
      const notes = task.failures?.[win.ep]?.[m.suffix]?.[key] || [];
      // With time ranges, the border follows playback (see updateNotes); otherwise it stays on for the whole video
      const spans = notes.length ? task.failureSpans?.[win.ep]?.[m.suffix]?.[key] : null;
      if (spans) cell.dataset.spans = JSON.stringify(spans); else delete cell.dataset.spans;
      cell.classList.toggle('fail', notes.length > 0 && !spans);
      cell.querySelector('.ar-fail-note').innerHTML = task.failureNotes === false ? '' : notes.map((n) => {
        // Bold the failure type at the start of the sentence
        const html = n.text.replace(/^(Phase mismatch|Contains irrelevant segments):/, '<strong>$1:</strong>');
        return n.when
          ? `<span class="ar-fail-line" data-from="${n.when[0]}" data-to="${n.when[1]}" hidden>${html}</span>`
          : `<span class="ar-fail-line">${html}</span>`;
      }).join(' ');
    });
    // Restart from the beginning so every video starts in step with the robot
    robots[state.sel].currentTime = 0;
    humans.forEach((v) => { if (v.src) { v.currentTime = 0; v.play().catch(() => {}); } });
    setPaused(false);
  }

  // ---- Shared playback: one play/pause + scrubber drives the selected robot clip and every video aligned to it ----
  const synced = () => [robots[state.sel], ...humans].filter((v) => v && v.src);
  function setPaused(p) {
    state.paused = p;
    synced().forEach((v) => (p ? v.pause() : v.play().catch(() => {})));
    const btn = root.querySelector('[data-act=ar-play]');
    if (btn) btn.innerHTML = p ? '&#9654;' : '&#10074;&#10074;';
  }
  function scrub(e) {
    const q = robots[state.sel], bar = e.currentTarget;
    if (!q || !q.duration) return;
    const r = bar.getBoundingClientRect();
    const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * q.duration;
    synced().forEach((v) => { v.currentTime = t; });
  }

  // Show time-bound failure notes (e.g. the human resetting the cup) only while their part of the video plays
  function updateNotes(time) {
    root.querySelectorAll('.ar-fail-line[data-from]').forEach((el) => {
      el.hidden = !(time >= +el.dataset.from && time <= +el.dataset.to);
    });
    // Red border only while the baseline is out of sync with the robot
    root.querySelectorAll('.ar-compare [data-spans]').forEach((cell) => {
      cell.classList.toggle('fail', JSON.parse(cell.dataset.spans).some(([a, b]) => time >= a && time <= b));
    });
  }

  // Keep the human videos locked to the selected robot clip
  (function tick() {
    const q = robots[state.sel];
    if (q && q.duration) {
      // While paused, follow the robot closely so a scrubbed frame lines up exactly
      const tol = state.paused ? 0.03 : 0.15;
      humans.forEach((v) => {
        if (v.src && Math.abs(v.currentTime - q.currentTime) > tol) v.currentTime = q.currentTime;
      });
      updateNotes(q.currentTime);
      const fill = root.querySelector('.ar-seek-fill'), time = root.querySelector('.ar-time');
      if (fill) fill.style.width = `${(q.currentTime / q.duration) * 100}%`;
      if (time) time.textContent = `${q.currentTime.toFixed(1)} s / ${q.duration.toFixed(1)} s`;
    }
    requestAnimationFrame(tick);
  })();

  // ---- Select a robot segment: load its matching human videos ----
  function select(i) {
    const task = TASKS[state.task];
    const wins = shown(task);
    const win = wins[i];
    state.sel = i;

    root.querySelectorAll('[data-robot]').forEach((el) => el.classList.toggle('on', +el.dataset.robot === i));
    // Restart the selected robot clip so it and the human videos start together
    robots[i].currentTime = 0;
    robots[i].play().catch(() => {});

    if (task.methods) {
      renderCompare(task, win);
      $('[data-role=caption]').innerHTML =
        `<strong>${task.name}, ${task.unit || 'segment'} ${i + 1} of ${wins.length}.</strong> ${task.desc} ${task.compareCaption || ''}`;
      return;
    }

    const list = humanList(task, win);
    $('[data-role=humans]').style.gridTemplateColumns = `repeat(${task.humanCols || list.length}, minmax(0, 1fr))`;
    humanCells(list.length).forEach((cell, k) => {
      const v = cell.querySelector('video');
      v.parentElement.classList.remove('missing');
      cell.querySelector('[data-role=scene-name]').textContent = list[k].name;
      // Hide the label row when a video has no name
      cell.querySelector('.ar-name').style.display = list[k].name ? '' : 'none';
      v.src = list[k].src;
      v.play().catch(() => {});
    });

    $('[data-role=caption]').innerHTML =
      `<strong>${task.name}, ${task.unit || 'segment'} ${i + 1} of ${wins.length}.</strong> ${task.desc}`;
  }

  // ---- Render the robot grid for the current task ----
  function render() {
    const task = TASKS[state.task];
    root.querySelectorAll('[data-task]').forEach((b) => b.classList.toggle('on', +b.dataset.task === state.task));
    // Tasks with a single human video put the robot grid and the human video side by side
    $('.ar-body').classList.toggle('side', !!task.side);
    $('[data-role=robot-head]').textContent = task.robotHead || 'Robot segments';
    $('[data-role=human-head]').textContent = task.humanHead || 'BATCH-retrieved human video';
    $('[data-role=human-hint]').textContent = task.humanHint || '';
    // Clear the previous task's human videos (the two modes use different markup)
    humans.forEach(release);
    humans = [];
    $('[data-role=humans]').innerHTML = '';
    $('[data-role=humans]').classList.remove('compare');

    const wins = shown(task);
    // Release the previous task's videos first; browsers cap how many media players a page can hold
    robots.forEach(release);
    $('[data-role=robots]').innerHTML = wins.map((w, i) => `
      <div class="ar-robot" data-robot="${i}">
        ${frame(`segment ${i + 1}`, `<span class="ar-num">${i + 1}</span>`)}
      </div>`).join('');
    const cols = task.cols || COLS;
    const grid = $('[data-role=robots]');
    grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    grid.classList.toggle('zoom', !!task.zoom);
    grid.style.setProperty('--zoom', task.zoom || 1);
    if (task.zoom) {
      // Grow each tile from a point proportional to its grid position so the enlarged tile stays inside the grid
      const rows = Math.ceil(wins.length / cols);
      grid.querySelectorAll('[data-robot]').forEach((el, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        el.style.transformOrigin = `${cols > 1 ? (c / (cols - 1)) * 100 : 50}% ${rows > 1 ? (r / (rows - 1)) * 100 : 50}%`;
      });
    }
    robots = [...root.querySelectorAll('[data-robot] video')];
    robots.forEach((v, i) => {
      watchMissing(v);
      v.addEventListener('timeupdate', () => { if (i === state.sel) updateNotes(v.currentTime); });
      v.src = robotSrc(task, wins[i]);
      v.play().catch(() => {});
    });

    select(0);
  }

  // ---- Events ----
  // Hover selects on desktop; tap/click selects on touch screens
  $('[data-role=robots]').addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-robot]');
    if (el && +el.dataset.robot !== state.sel) select(+el.dataset.robot);
  });

  $('[data-role=humans]').addEventListener('mouseover', (e) => {
    const el = e.target.closest('[data-human]');
    if (el && +el.dataset.human !== state.human) selectHuman(+el.dataset.human);
  });

  root.addEventListener('click', (e) => {
    if (e.target.closest('[data-act=ar-play]')) { setPaused(!state.paused); return; }
    const el = e.target.closest('[data-robot], [data-task], [data-human], [data-set]');
    if (!el) return;
    if (el.dataset.set !== undefined) {
      if (+el.dataset.set !== state.set) {
        state.set = +el.dataset.set;
        const task = TASKS[state.task];
        renderCompare(task, shown(task)[state.sel]);
      }
    }
    else if (el.dataset.task) { state.task = +el.dataset.task; state.set = 0; render(); }
    else if (el.dataset.human !== undefined) { if (+el.dataset.human !== state.human) selectHuman(+el.dataset.human); }
    else if (+el.dataset.robot !== state.sel) select(+el.dataset.robot);
  });

  root.addEventListener('pointerdown', (e) => {
    const bar = e.target.closest('.ar-seek');
    if (!bar) return;
    bar.setPointerCapture(e.pointerId);
    if (!state.paused) setPaused(true);   // hold the frame while scrubbing; press play to continue
    scrub({ currentTarget: bar, clientX: e.clientX });
  });
  root.addEventListener('pointermove', (e) => {
    const bar = e.target.closest('.ar-seek');
    if (bar && bar.hasPointerCapture(e.pointerId)) scrub({ currentTarget: bar, clientX: e.clientX });
  });

  // Only play the thumbnails while the section is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const held = state.paused ? synced() : [];
      [...robots, ...humans].forEach((v) => {
        if (!v.src) return;
        if (entry.isIntersecting && !held.includes(v)) v.play().catch(() => {}); else if (!entry.isIntersecting) v.pause();
      });
    }).observe(root);
  }

  render();
})();
