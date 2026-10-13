// Motivation: a fast human demo with irrelevant parts vs. a slower robot demo.
(() => {
  // ================= Config =================
  const VIDEOS = {
    human: 'videos/human_demo.mp4',
    robot: 'videos/robot_demo.mp4',
  };

  const PHASES = {
    // name: full label (video badge + legend); short: label inside the timeline bar
    grasp:   { name: 'Grasp cup handle',         short: 'Grasp',     color: 'oklch(0.62 0.12 250)' },
    lift:    { name: 'Lift cup upward',          short: 'Lift',      color: 'oklch(0.62 0.12 190)' },
    handover:{ name: 'Hand over cup from one arm to the other',  short: 'Hand over', color: 'oklch(0.62 0.12 130)' },
    place:   { name: 'Place cup on saucer',      short: 'Place',     color: 'oklch(0.62 0.12 60)' },
  };

  // Segment times in seconds within each video. phase: null = irrelevant to the task.
  const HUMAN = [
    // human_demo.mp4 is 8.97 s long; the last segment must end at the video length
    { phase: 'grasp',    start: 0.0,  end: 2.1 },
    { phase: 'lift',     start: 2.1,  end: 2.7 },
    { phase: 'handover', start: 2.7,  end: 3.7 },
    { phase: 'place',    start: 3.7,  end: 5.8 },
    { phase: null,       start: 5.8,  end: 8.97, label: 'resets cup' },
  ];

  const ROBOT = [
    // robot_demo.mp4 is 18.5 s long
    { phase: 'grasp',    start: 0.0,  end: 4.8 },
    { phase: 'lift',     start: 4.8,  end: 6.4 },
    { phase: 'handover', start: 6.4,  end: 11.2 },
    { phase: 'place',    start: 11.2, end: 18.5 },
  ];
  // Segment-pair sampling (modes "random" and "aligned")
  const SAMPLE = 3.0;   // seconds each sampled pair is shown
  const ROBOT_WIN = 3.0; // robot segment length (s)
  // Prior-work random sampling: a clip of SAMPLE seconds is drawn independently from each video and both play
  // at normal speed (the human is not slowed down). Start times (s) of the examples, shown in turn:
  const RANDOM_EXAMPLES = [
    { human: 0.5, robot: 12.0 },
    { human: 6.5, robot: 3.0 },
    { human: 3.2, robot: 7.5 },
  ];
  // ==========================================

  const root = document.getElementById('motivation');
  if (!root) return;
  const $ = (sel) => root.querySelector(sel);

  const H = HUMAN[HUMAN.length - 1].end;
  const R = ROBOT[ROBOT.length - 1].end;
  const T = Math.max(H, R);
  const taskEnd = Math.max(...HUMAN.filter((s) => s.phase).map((s) => s.end));
  const robotTaskEnd = Math.max(...ROBOT.filter((s) => s.phase).map((s) => s.end));
  const rawNote = `${(robotTaskEnd / taskEnd).toFixed(1)}× faster, then irrelevant motion`;
  const robotOf = (phase) => ROBOT.find((s) => s.phase === phase);
  const phaseAt = (segs, t) => segs.find((s) => t >= s.start && t < s.end) ?? segs[segs.length - 1];
  const lerp = (a, b, k) => a + (b - a) * k;
  const fmt = (t) => `${t.toFixed(1)} s`;

  // ---- Layout of each human segment on the shared time axis ----
  // raw: its own timing; aligned: stretched onto the matching robot phase (irrelevant parts collapse).
  const rawPos = (s) => ({ a: s.start / T, b: s.end / T });
  const alignedPos = (s, i) => {
    if (s.phase) { const r = robotOf(s.phase); return { a: r.start / T, b: r.end / T }; }
    const prev = HUMAN.slice(0, i).reverse().find((x) => x.phase);
    const x = prev ? robotOf(prev.phase).end / T : 0;
    return { a: x, b: x };
  };
  const humanPos = (s, i, k) => {
    const p = rawPos(s), q = alignedPos(s, i);
    return { a: lerp(p.a, q.a, k), b: lerp(p.b, q.b, k) };
  };

  // Robot time -> human time through matching phases (skips irrelevant parts)
  const robotToHuman = (rt) => {
    const r = ROBOT.find((s) => rt >= s.start && rt < s.end) ?? ROBOT[ROBOT.length - 1];
    if (!r.phase) return Math.max(...HUMAN.filter((s) => s.phase).map((s) => s.end)) - 0.01; // hold on last task frame
    const h = HUMAN.find((s) => s.phase === r.phase);
    return h.start + ((rt - r.start) / (r.end - r.start)) * (h.end - h.start);
  };

  // ---- Build markup ----
  const segHTML = (s) => s.phase
    ? `<div class="mv-s" style="background:${PHASES[s.phase].color};--c:${PHASES[s.phase].color}"><span>${PHASES[s.phase].short}</span></div>`
    : `<div class="mv-s irrelevant" style="--c:#888"><span>${s.label ?? 'irrelevant'}</span></div>`;

  const winHTML = [0, 1, 2].map((i) => `<div class="mv-win" data-i="${i}" data-n="${i + 1}"></div>`).join('');
  $('[data-role=human-track]').innerHTML = HUMAN.map(segHTML).join('') + winHTML + '<div class="mv-head"></div>';
  $('[data-role=robot-track]').innerHTML = ROBOT.map(segHTML).join('') + winHTML + '<div class="mv-head"></div>';
  $('[data-role=links]').innerHTML = HUMAN.map((s) => s.phase
    ? `<polygon data-phase-link fill="${PHASES[s.phase].color}" fill-opacity="0.22"></polygon>` : '').join('') +
    [0, 1, 2].map((i) => `<polygon data-win-link="${i}" fill-opacity="0.18"></polygon>`).join('');

  const ticks = [];
  for (let t = 0; t <= T + 1e-6; t += 2) ticks.push(`<span style="left:${(t / T) * 100}%">${t}s</span>`);
  $('[data-role=axis]').innerHTML = ticks.join('');

  $('[data-role=legend]').innerHTML =
    Object.values(PHASES).map((p) => `<span><i style="background:${p.color}"></i>${p.name}</span>`).join('') +
    `<span><i style="background:repeating-linear-gradient(135deg,#d9d9d9 0 3px,#cbcbcb 3px 6px)"></i>Irrelevant to the task</span>`;

  ROBOT.forEach((s, i) => {
    const el = $('[data-role=robot-track]').children[i];
    el.style.left = `${(s.start / T) * 100}%`;
    el.style.width = `${((s.end - s.start) / T) * 100}%`;
  });

  const humanEls = [...$('[data-role=human-track]').querySelectorAll('.mv-s')];
  HUMAN.forEach((s, i) => {
    humanEls[i].style.left = `${(s.start / T) * 100}%`;
    humanEls[i].style.width = `${((s.end - s.start) / T) * 100}%`;
  });
  // Labels that don't fit inside a segment move above the bar
  const fitLabels = () => root.querySelectorAll('.mv-s').forEach((el) => {
    el.classList.remove('tight');
    const span = el.firstElementChild;
    if (span && span.offsetWidth > el.clientWidth - 6) el.classList.add('tight');
  });
  fitLabels();
  window.addEventListener('resize', fitLabels);
  document.fonts?.ready.then(fitLabels);

  const polys = [...$('[data-role=links]').querySelectorAll('[data-phase-link]')];
  const winLinks = [...root.querySelectorAll('[data-win-link]')];
  const wins = { human: [...$('[data-role=human-track]').querySelectorAll('.mv-win')], robot: [...$('[data-role=robot-track]').querySelectorAll('.mv-win')] };
  const heads = root.querySelectorAll('.mv-head');
  const vids = { human: $('video[data-who=human]'), robot: $('video[data-who=robot]') };

  Object.entries(vids).forEach(([who, v]) => {
    v.src = VIDEOS[who];
    v.addEventListener('error', () => v.parentElement.classList.add('missing'));
  });

  // ---- State + loop ----
  const state = { mode: 'raw', playing: true, t: 0, k: 0, last: performance.now(), pair: null, pairIdx: -1 };
  const GOOD = '#2e9e5b', BAD = '#d0453b';

  // Draw a new pair of segments: random (prior work) or behavior-aligned (BATCH)
  const samplePair = (idx) => {
    if (state.mode === 'random') {
      const ex = RANDOM_EXAMPLES[idx % RANDOM_EXAMPLES.length];
      return { rA: ex.robot, rB: ex.robot + SAMPLE, hA: ex.human, hB: Math.min(H - 0.1, ex.human + SAMPLE), warp: false, n: (idx % RANDOM_EXAMPLES.length) + 1 };
    }
    const rA = Math.random() * (R - ROBOT_WIN), rB = rA + ROBOT_WIN;
    return { rA, rB, hA: robotToHuman(rA), hB: robotToHuman(rB - 0.01), warp: true };
  };
  const phaseName = (seg) => (seg.phase ? PHASES[seg.phase].short : 'Irrelevant');
  const pct = (x) => `${(x / T) * 100}%`;
  const placeWindow = (i, w, color) => {
    [[wins.human[i], w.hA, w.hB], [wins.robot[i], w.rA, w.rB]].forEach(([el, a, b]) => {
      el.style.left = pct(a); el.style.width = pct(b - a); el.style.borderColor = color;
    });
    winLinks[i].setAttribute('points', `${(w.hA / T) * 100},0 ${(w.hB / T) * 100},0 ${(w.rB / T) * 100},10 ${(w.rA / T) * 100},10`);
    winLinks[i].setAttribute('fill', color);
  };
  const judge = (w) => {
    const h = phaseAt(HUMAN, (w.hA + w.hB) / 2), r = phaseAt(ROBOT, (w.rA + w.rB) / 2);
    const match = !!h.phase && h.phase === r.phase;
    return { match, color: match ? GOOD : BAD,
      text: match ? `✓ Matched: both clips show “${phaseName(r)}”` : `✗ Mismatched: human “${phaseName(h)}” vs. robot “${phaseName(r)}”` };
  };


  const setBadge = (who, seg) => {
    const el = $(`[data-phase=${who}]`);
    el.textContent = seg.phase ? PHASES[seg.phase].name : (seg.label ? `Irrelevant: ${seg.label}` : 'Irrelevant');
    el.style.background = seg.phase ? PHASES[seg.phase].color : '#888';
  };
  const follow = (v, t, play) => {
    if (!v.duration) return;
    if (Math.abs(v.currentTime - t) > (play ? 0.25 : 0.04)) v.currentTime = t;
    if (play && v.paused) v.play().catch(() => {});
    if (!play && !v.paused) v.pause();
  };

  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - state.last) / 1000));
    state.last = now;
    if (state.playing) state.t += dt;
    let rt, ht, humanPlays;
    if (state.mode === 'raw') {
      rt = state.t % R;
      // human holds on its last frame until the robot finishes, then both restart
      ht = Math.min(rt, H - 0.05);
      humanPlays = rt < H - 0.05;
    } else {
      const idx = Math.floor(state.t / SAMPLE), p = (state.t % SAMPLE) / SAMPLE;
      if (idx !== state.pairIdx) { state.pairIdx = idx; state.pair = samplePair(idx); }
      const w = state.pair;
      rt = w.rA + p * (w.rB - w.rA);
      ht = w.warp ? robotToHuman(rt) : Math.min(w.hB, w.hA + p * SAMPLE);
      // random clips play at normal speed (holding on the last frame if the video ends); aligned human is time-warped frame by frame
      humanPlays = !w.warp && ht < w.hB - 0.05;

      const j = judge(w);
      placeWindow(0, w, j.color);
      // one-liner between the two timelines, next to the sampled pair
      const lt = $('[data-role=linktext]');
      // sit beside the shaded band (right of it, or left if there's no room)
      const rightEdge = (w.hB + w.rB) / 2 / T, leftEdge = (w.hA + w.rA) / 2 / T;
      const onRight = rightEdge < 0.62;
      lt.style.left = `calc(${(onRight ? rightEdge : leftEdge) * 100}% ${onRight ? '+' : '-'} 0.6em)`;
      lt.style.transform = onRight ? 'translate(0, -50%)' : 'translate(-100%, -50%)';
      lt.style.color = j.color;
      lt.textContent = w.warp ? '✓ Same task phase, aligned behavior' : '✗ Different task phases, different behaviors';
    }

    // human segments + connectors
    let hx = 0;
    HUMAN.forEach((s, i) => {
      const p = humanPos(s, i, state.k);
      humanEls[i].style.left = `${p.a * 100}%`;
      humanEls[i].style.width = `${(p.b - p.a) * 100}%`;
      if (ht >= s.start && ht < s.end) hx = lerp(p.a, p.b, (ht - s.start) / (s.end - s.start));
    });
    HUMAN.filter((s) => s.phase).forEach((s, j) => {
      const p = humanPos(s, HUMAN.indexOf(s), state.k), r = robotOf(s.phase);
      polys[j].setAttribute('points', `${p.a * 100},0 ${p.b * 100},0 ${(r.end / T) * 100},10 ${(r.start / T) * 100},10`);
    });

    heads[0].style.left = `${hx * 100}%`;
    heads[1].style.left = `${(rt / T) * 100}%`;
    $('[data-time=human]').textContent = `${fmt(ht)} / ${fmt(H)}`;
    $('[data-time=robot]').textContent = `${fmt(rt)} / ${fmt(R)}`;
    setBadge('human', phaseAt(HUMAN, ht));
    setBadge('robot', phaseAt(ROBOT, rt));

    follow(vids.robot, rt, state.playing);
    follow(vids.human, ht, state.playing && humanPlays);

    requestAnimationFrame(tick);
  }

  // ---- Events ----
  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-mode], [data-act]');
    if (!el) return;
    if (el.dataset.mode) {
      state.mode = el.dataset.mode;
      state.t = 0;
      state.pairIdx = -1;
      root.classList.toggle('mv-pairs', state.mode !== 'raw');
      root.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b === el));
      $('[data-role=human-note]').textContent = state.mode === 'raw' ? rawNote : '';
      $('[data-role=mode-note]').textContent = MODE_NOTES[state.mode];
    } else if (el.dataset.act === 'play') {
      state.playing = !state.playing;
    } else if (el.dataset.act === 'restart') {
      state.t = 0;
    }
  });

  const MODE_NOTES = {
    raw: '',
    random: 'In prior works (e.g., EgoVerse), human and robot segments are sampled independently. Differences in execution speed mean the segments usually come from different phases of the task.',
    aligned: 'BATCH learns self-supervised temporal features with cycle consistency, then uses DTW in that feature space to pair each robot segment with the human segment of the same phase, accounting for speed differences and irrelevant segments.',
  };
  $('[data-role=human-note]').textContent = rawNote;
  $('[data-role=mode-note]').textContent = MODE_NOTES.raw;
  requestAnimationFrame(tick);
})();
