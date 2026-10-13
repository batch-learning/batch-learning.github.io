// Animated walkthrough of Method (B): Cross-Embodiment Video Action Model.
(() => {
  const root = document.getElementById('vam-anim');
  if (!root) return;

  // ================= Config =================
  const C = { h: '#e0892c', hFill: '#fbe7cf', r: '#2f9a6a', rFill: '#d8efe3', ink: '#333', slate: '#45536a',
              co: '#3a6fc4', st: '#e07a2c', mask: '#ececec', muted: '#888' };
  const STEPS = [
    { name: 'Inputs',             start: 0,    text: 'Each aligned human–robot pair becomes two token streams. A video VAE encodes head-camera frames into a context latent z₀ and future latents z₁, z₂; embodiment-specific encoders embed the action chunk a and state s.' },
    { name: 'Shared transformer', start: 4,    text: 'Both streams are concatenated into one sequence for a video-action diffusion transformer. They share all transformer weights; rotary positions and CLIP cross-attention are reset per stream.' },
    { name: 'Joint co-training',  start: 7.5,  text: 'Joint co-training keeps the streams attention-isolated: each predicts its own future video and actions with a block-causal mask, so human data influences the robot only through shared weights.' },
    { name: 'Style transfer',     start: 11.5, text: 'Human-to-robot style transfer: the robot’s future frames z₁ᴿ, z₂ᴿ are predicted from the clean frames z₀ᴴ, z₁ᴴ, z₂ᴴ of the aligned human clip. The robot’s own context latent and action/state tokens are masked, leaving only its CLIP scene embedding, and only the robot video is supervised. The map overlays both objectives.' },
    { name: 'Deployment',         start: 15.5, text: 'At deployment only the robot stream runs. The policy predicts 16-step action chunks and executes the first 8 before replanning. Policy is tested on scenes seen only in human data.' },
  ];
  const END = 19.5, LOOP = 22;
  // Input clips: the same behavior phase from each demo (Cup on Saucer "Grasp"), looped in sync
  const CLIP = { name: 'Grasp cup handle', color: 'oklch(0.62 0.12 250)', dur: 2.4,
    h: { src: 'videos/human_demo.mp4', a: 0, b: 2.1 }, r: { src: 'videos/robot_demo.mp4', a: 0, b: 4.8 } };
  // ==========================================

  // ---- Geometry ----
  const TOK = [{ k: 'z₀', x: 272 }, { k: 'z₁', x: 320 }, { k: 'z₂', x: 350 }, { k: 'a', x: 398 }, { k: 's', x: 428 }];
  const TW = 26;
  const STREAMS = [
    { id: 'h', name: 'Human stream', color: C.h, fill: C.hFill, y: 0, img: 'human', sup: 'ᴴ' },
    { id: 'r', name: 'Robot stream', color: C.r, fill: C.rFill, y: 205, img: 'robot', sup: 'ᴿ' },
  ];
  // Attention map exactly as in the method figure (b). Rows = query, cols = key.
  // Token order: context [z₀ᴴ z₁ᴴ z₂ᴴ z₀ᴿ] | pred frames [z₁ᴴ z₂ᴴ z₁ᴿ z₂ᴿ] | a·s [aᴴ aᴿ sᴴ sᴿ]
  const MX = 735, MY = 92, MC = 25, N = 12;
  const MTOK = [['z₀', 'h'], ['z₁', 'h'], ['z₂', 'h'], ['z₀', 'r'], ['z₁', 'h'], ['z₂', 'h'], ['z₁', 'r'], ['z₂', 'r'], ['a', 'h'], ['a', 'r'], ['s', 'h'], ['s', 'r']];
  const CO = { 0: [0], 3: [3], 4: [0, 4, 5], 5: [0, 4, 5], 6: [3, 6, 7], 7: [3, 6, 7], 8: [0, 4, 5, 8, 10], 9: [3, 6, 7, 9, 11], 10: [10], 11: [11] };
  const ST = { 6: [0, 1, 2], 7: [0, 1, 2] };   // robot pred frames <- clean human frames
  const coMask = (r, c) => (CO[r]?.includes(c) ? C.co : null);
  const stMask = (r, c) => (ST[r]?.includes(c) ? C.st : null);

  // ---- SVG helpers ----
  const txt = (x, y, s, o = '') =>
    `<text x="${x}" y="${y}" font-size="16" stroke="#fff" stroke-width="5" paint-order="stroke" stroke-linejoin="round" ${o}>${s}</text>`;
  const marker = (color) =>
    `<marker id="vam-ah-${color.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker>`;
  const arrow = (g, d, color, w = 2) =>
    `<path data-g="${g}" d="${d}" pathLength="1" fill="none" stroke="${color}" stroke-width="${w}" marker-end="url(#vam-ah-${color.slice(1)})"/>`;
  const photo = (x, y, w, h, href, color, id) => `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/></clipPath>
    <image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="${color}" stroke-width="3"/>`;
  const trap = (x, y, w, h, label, color) =>
    `<polygon points="${x},${y} ${x + w},${y + h * 0.18} ${x + w},${y + h * 0.82} ${x},${y + h}" fill="${color}"/>
     <text x="${x + w / 2}" y="${y + h / 2 + 4}" font-size="11" fill="#fff" text-anchor="middle">${label}</text>`;

  const stream = (s) => {
    const y = s.y;
    const tokens = TOK.map((t, i) => `
      <g data-g="${s.id}tok${i}">
        <rect x="${t.x}" y="${y + 88}" width="${TW}" height="${TW}" rx="3" fill="${s.fill}" stroke="${s.color}" stroke-width="1.5"/>
        <text x="${t.x + TW / 2}" y="${y + 106}" font-size="13" fill="${C.ink}" text-anchor="middle">${t.k}</text>
      </g>`).join('');
    return `
      <g data-g="${s.id}stream">
        <g data-g="${s.id}in">
          ${txt(24, y + 34, s.name, `fill="${s.color}"`)}
          ${[2, 1].map((i) => `<rect x="${24 + i * 6}" y="${y + 58 - i * 6}" width="128" height="84" rx="3" fill="#fff" stroke="${s.color}" stroke-width="2" opacity="${1 - i * 0.3}"/>`).join('')}
          <foreignObject x="24" y="${y + 58}" width="128" height="84"><video xmlns="http://www.w3.org/1999/xhtml" data-in-vid="${s.id}" src="${CLIP[s.id].src}" muted playsinline preload="auto" style="display:block;width:100%;height:100%;object-fit:cover;border-radius:3px;background:#111"></video></foreignObject>
          <rect x="24" y="${y + 58}" width="128" height="84" rx="3" fill="none" stroke="${s.color}" stroke-width="3"/>
          <rect x="28" y="${y + 62}" width="${CLIP.name.length * 6.2 + 10}" height="16" rx="3" fill="${CLIP.color}"/>
          <text x="33" y="${y + 73}" font-size="11" fill="#fff">${CLIP.name}</text>
        </g>
        ${arrow(`${s.id}a1`, `M170,${y + 92} L184,${y + 92}`, s.color)}
        ${arrow(`${s.id}a2`, `M170,${y + 138} L184,${y + 138}`, s.color)}
        <g data-g="${s.id}enc">
          ${trap(188, y + 60, 56, 62, 'video VAE', C.slate)}
          ${trap(188, y + 126, 56, 26, 'act. enc.', C.slate)}
        </g>
        ${arrow(`${s.id}a3`, `M248,${y + 101} L266,${y + 101}`, s.color)}
        ${tokens}
        <g data-g="${s.id}toklab">
          ${txt(285, y + 136, 'ctx', `text-anchor="middle" fill="${C.muted}" font-size="13"`)}
          ${txt(352, y + 136, 'pred frames', `text-anchor="middle" fill="${C.muted}" font-size="13"`)}
          ${txt(426, y + 136, 'a · s', `text-anchor="middle" fill="${C.muted}" font-size="13"`)}
        </g>
      </g>`;
  };

  let cells = '';
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const x = MX + c * MC, y = MY + r * MC, co = coMask(r, c), st = stMask(r, c);
    cells += `<rect x="${x}" y="${y}" width="${MC - 2}" height="${MC - 2}" rx="2" fill="${C.mask}"/>`;
    if (co) cells += `<rect data-co="${r + c}" x="${x}" y="${y}" width="${MC - 2}" height="${MC - 2}" rx="2" fill="${co}" opacity="0"/>`;
    if (st) cells += `<rect data-st="${r + c}" x="${x}" y="${y}" width="${MC - 2}" height="${MC - 2}" rx="2" fill="${st}" opacity="0"/>`;
  }
  const axis = Array.from({ length: N }, (_, i) => {
    const s = MTOK[i][1] === 'h' ? STREAMS[0] : STREAMS[1], n = MTOK[i][0] + s.sup;
    return txt(MX + i * MC + (MC - 2) / 2, MY - 8, n, `text-anchor="middle" font-size="12" fill="${s.color}"`) +
           txt(MX - 8, MY + i * MC + MC / 2 + 3, n, `text-anchor="end" font-size="12" fill="${s.color}"`);
  }).join('');

  root.innerHTML = `
    <div class="ba-stage">
      <svg viewBox="0 0 1200 440" role="img" aria-label="Animated cross-embodiment video action model">
        <defs>${[C.ink, C.h, C.r].map(marker).join('')}</defs>

        ${STREAMS.map(stream).join('')}

        ${arrow('todith', 'M458,101 L480,150', C.h)}${arrow('todit', 'M458,306 L480,262', C.r)}
        <g data-g="dit">
          <rect x="482" y="96" width="176" height="220" rx="8" fill="#fff" stroke="${C.slate}" stroke-width="2"/>
          <text x="570" y="196" font-size="18" fill="${C.ink}" text-anchor="middle">Diffusion</text>
          <text x="570" y="220" font-size="18" fill="${C.ink}" text-anchor="middle">Transformer</text>
        </g>
        <g data-g="shared">${txt(570, 340, 'shared weights', `text-anchor="middle" fill="${C.slate}" font-size="15"`)}</g>
        ${arrow('tomap', 'M662,206 L712,206', C.ink)}

        <g data-g="map">
          ${[['context', 2], ['pred frames', 6], ['a · s', 10]].map(([l, c]) => txt(MX + c * MC, MY - 30, l, `text-anchor="middle" font-size="13" fill="${C.muted}"`)).join('')}
          ${axis}
          ${cells}
          ${[4, 8].map((g) => `<line x1="${MX + g * MC - 1}" y1="${MY - 2}" x2="${MX + g * MC - 1}" y2="${MY + N * MC}" stroke="#fff" stroke-width="3"/>
          <line x1="${MX - 2}" y1="${MY + g * MC - 1}" x2="${MX + N * MC}" y2="${MY + g * MC - 1}" stroke="#fff" stroke-width="3"/>`).join('')}
          <g data-g="legend">
            ${[[C.co, 'co-train'], [C.st, 'style transfer'], [C.mask, 'masked']].map(([c, l], i) =>
              `<rect x="${MX + [0, 90, 220][i]}" y="${MY + N * MC + 16}" width="14" height="14" rx="2" fill="${c}"/>${txt(MX + 20 + [0, 90, 220][i], MY + N * MC + 28, l, 'font-size="14" fill="#555"')}`).join('')}
          </g>
        </g>

        <g data-g="ctlab">
          ${txt(1050, 150, 'Joint co-training', `fill="${C.co}" font-size="17"`)}
          ${['each stream predicts', 'its own video + actions;'].map((l, i) => txt(1050, 176 + i * 21, l, 'fill="#555" font-size="14"')).join('')}
        </g>
        <g data-g="stlab">
          ${txt(1050, 150, 'Style transfer', `fill="${C.st}" font-size="17"`)}
          ${['robot predicted future', 'frames z₁ᴿ, z₂ᴿ attend', 'to the clean frames of', 'aligned human clip'].map((l, i) => txt(1050, 176 + i * 21, l, 'fill="#555" font-size="14"')).join('')}
        </g>

        ${arrow('toact', 'M662,262 L742,262', C.r)}
        <g data-g="deploy">
          <foreignObject x="752" y="112" width="280" height="210">
            <video xmlns="http://www.w3.org/1999/xhtml" data-deploy-vid src="videos/cup-on-saucer-demo.mp4" muted loop playsinline preload="auto" style="display:block;width:100%;height:100%;object-fit:cover;border-radius:3px;background:#111"></video>
          </foreignObject>
          <rect x="752" y="112" width="280" height="210" rx="3" fill="none" stroke="${C.r}" stroke-width="3"/>
          <rect x="752" y="292" width="280" height="30" fill="rgba(0,0,0,0.55)"/>
          <text x="892" y="312" font-size="14" fill="#fff" text-anchor="middle">Scenes seen only in human data</text>
          ${txt(892, 346, 'robot execution', `fill="${C.r}" font-size="16" text-anchor="middle"`)}
        </g>
      </svg>
    </div>
    <div class="ba-ctrl">
      <button class="ba-play" data-act="play" title="Play / pause"></button>
      <div class="ba-steps">${STEPS.map((s, i) => `<button class="ba-step" data-step="${i}"><b>${i + 1}</b>${s.name}<i></i></button>`).join('')}</div>
    </div>
    <p class="ba-text"></p>
  `;

  // ---- Animation ----
  const groups = {};
  root.querySelectorAll('[data-g]').forEach((el) => (groups[el.dataset.g] ||= []).push(el));
  const coCells = [...root.querySelectorAll('[data-co]')];
  const stCells = [...root.querySelectorAll('[data-st]')];
  const inVids = [...root.querySelectorAll('[data-in-vid]')];
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const ramp = (t, a, b) => ease((t - a) / (b - a));
  const op = (g, v) => (groups[g] || []).forEach((el) => el.setAttribute('opacity', v.toFixed(3)));
  const draw = (g, p, o = 1) => (groups[g] || []).forEach((el) => {
    el.style.strokeDasharray = 1;
    el.style.strokeDashoffset = 1 - p;
    el.setAttribute('opacity', (Math.min(1, p * 5) * o).toFixed(3));
  });

  function frame(t) {
    const dep = ramp(t, 15.5, 16.1);
    STREAMS.forEach((s, si) => {
      const d = si * 0.3;
      op(`${s.id}in`, ramp(t, d, d + 0.5));
      draw(`${s.id}a1`, ramp(t, d + 0.5, d + 0.8));
      draw(`${s.id}a2`, ramp(t, d + 0.5, d + 0.8));
      op(`${s.id}enc`, ramp(t, d + 0.7, d + 1.1));
      draw(`${s.id}a3`, ramp(t, d + 1.1, d + 1.4));
      TOK.forEach((_, i) => op(`${s.id}tok${i}`, ramp(t, d + 1.4 + i * 0.15, d + 1.7 + i * 0.15)));
      op(`${s.id}toklab`, ramp(t, d + 2.2, d + 2.6));
      op(`${s.id}stream`, s.id === 'h' ? 1 - 0.85 * dep : 1);
    });

    draw('todit', ramp(t, 4, 4.5));
    draw('todith', ramp(t, 4, 4.5), 1 - dep);   // human input is unused at deployment
    op('dit', ramp(t, 4.2, 4.8));
    op('shared', ramp(t, 5, 5.5));

    const mapOn = ramp(t, 7.5, 8) * (1 - dep);
    draw('tomap', ramp(t, 7.5, 7.9) * (1 - dep));
    op('map', mapOn);
    coCells.forEach((el) => {
      const d = +el.dataset.co * 0.05;
      el.setAttribute('opacity', ramp(t, 8 + d, 8.3 + d).toFixed(3));
    });
    stCells.forEach((el) => {
      const d = +el.dataset.st * 0.12;
      el.setAttribute('opacity', ramp(t, 11.9 + d, 12.2 + d).toFixed(3));
    });
    op('legend', ramp(t, 8.2, 8.6));
    op('ctlab', ramp(t, 8.4, 8.8) * (1 - ramp(t, 11.5, 11.8)));
    op('stlab', ramp(t, 12, 12.4) * (1 - dep));

    draw('toact', ramp(t, 15.8, 16.3));
    op('deploy', ramp(t, 16, 16.6));
    // aligned input clips: shared clock, each video mapped onto its own segment of the phase
    const f = (performance.now() / 1000 % CLIP.dur) / CLIP.dur;
    const inOn = t < 15.5;
    inVids.forEach((v) => {
      const c = CLIP[v.dataset.inVid], tt = c.a + f * (c.b - c.a);
      if (!inOn) { if (!v.paused) v.pause(); return; }
      if (v.readyState >= 1 && Math.abs(v.currentTime - tt) > 0.2) v.currentTime = tt;
      v.playbackRate = (c.b - c.a) / CLIP.dur;
      if (v.paused) v.play().catch(() => {});
    });
    const dv = root.querySelector('[data-deploy-vid]');
    if (dv) {
      const on = t >= 16 && t < LOOP - 0.5;
      if (on && dv.paused) dv.play().catch(() => {});
      else if (!on && !dv.paused) { dv.pause(); dv.currentTime = 0; }
    }

    root.querySelector('svg').style.opacity = 1 - ramp(t, LOOP - 0.5, LOOP);
  }

  // ---- Playback + controls ----
  const state = { t: 0, playing: true, last: performance.now(), step: -1 };
  const stepBtns = [...root.querySelectorAll('.ba-step')];
  const playBtn = root.querySelector('[data-act=play]');
  const textEl = root.querySelector('.ba-text');
  const setPlayIcon = () => { playBtn.innerHTML = state.playing ? '&#10074;&#10074;' : '&#9654;'; };

  function ui() {
    const t = Math.min(state.t, END);
    const i = STEPS.findLastIndex((s) => t >= s.start);
    stepBtns.forEach((b, k) => {
      const s = STEPS[k], e = STEPS[k + 1]?.start ?? END;
      b.classList.toggle('on', k === i);
      b.querySelector('i').style.width = `${Math.max(0, Math.min(1, (t - s.start) / (e - s.start))) * 100}%`;
    });
    if (i !== state.step) { state.step = i; textEl.textContent = STEPS[i].text; }
  }

  (function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - state.last) / 1000));
    state.last = now;
    if (state.playing) state.t = (state.t + dt) % LOOP;
    frame(state.t);
    ui();
    requestAnimationFrame(tick);
  })(performance.now());

  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-step], [data-act]');
    if (!el) return;
    if (el.dataset.step) state.t = STEPS[+el.dataset.step].start + 0.001;
    else { state.playing = !state.playing; setPlayIcon(); }
    frame(state.t); ui();
  });

  setPlayIcon();
})();
