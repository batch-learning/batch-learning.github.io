// Animated walkthrough of Method (A): Behavior Alignment.
(() => {
  const root = document.getElementById('ba-anim');
  if (!root) return;

  // ================= Config =================
  const IMG = 'images/method.png', IW = 2000, IH = 1095; // demo thumbnails are cropped from the method figure
  const C = { h: '#e0892c', hFill: '#fbe7cf', r: '#2f9a6a', rFill: '#d8efe3', p: '#8e5bd0', ink: '#333', slate: '#45536a', muted: '#888' };
  const PHASES = [
    { name: 'Grasp',     color: 'oklch(0.62 0.12 250)' },
    { name: 'Lift',      color: 'oklch(0.62 0.12 190)' },
    { name: 'Hand over', color: 'oklch(0.62 0.12 130)' },
    { name: 'Place',     color: 'oklch(0.62 0.12 60)' },
  ];
  // Phase of each frame embedding (null = task-irrelevant). Robot is slower, so it has more frames.
  const HUMAN = [0, 0, 1, 2, 2, 3, 3, null, null, null];
  const ROBOT = [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3];
  // DTW match: robot frame j -> human frame MATCH[j] (monotonic)
  const MATCH = [0, 0, 1, 1, 2, 2, 2, 3, 3, 4, 5, 5, 6, 6];
  const QUERY = 5; // robot frame used to illustrate soft nearest neighbor + cycle back
  const STEPS = [
    { name: 'Encode',                start: 0,    text: 'A shared GTCC encoder φ embeds every frame of an unaligned human demo (v₁:M) and robot demo (u₁:N).' },
    { name: 'Soft nearest neighbors', start: 3.5,  text: 'A robot frame uᵢ attends to all human frames with weights αᵢⱼ. Since a task can revisit similar states, a Gaussian mixture over αᵢ keeps several hypotheses, giving multiple soft nearest neighbors ṽᵢₖ.' },
    { name: 'Cycle consistency',     start: 7,    text: 'Each ṽᵢₖ is mapped back onto the robot sequence, giving a cycle-back distribution with mean μ̂ᵢₖ and spread σ̂ᵢₖ. A hypothesis that lands sharply on frame i has low loss; one that misses, or is uncertain, has high loss. A relevance weight bᵢ down-weights frames with no counterpart.' },
    { name: 'DTW matching',          start: 11,   text: 'Subsequence DTW traces the minimum-cost monotonic path through the frame-to-frame cost matrix in the learned embedding space. Each step of the path links a robot frame to a human frame; irrelevant human frames are discarded.' },
    { name: 'Aligned demos',         start: 15,   text: '' },
  ];
  // Final aligned videos (segment times in seconds, same as the motivation section)
  const VID = { human: 'videos/human_demo.mp4', robot: 'videos/robot_demo.mp4', speed: 2 };
  const VH = [[0, 2.1], [2.1, 2.7], [2.7, 3.7], [3.7, 5.8]], VH_LEN = 8.97;  // per phase; 5.8–8.97 irrelevant
  const VR = [[0, 4.8], [4.8, 6.4], [6.4, 11.2], [11.2, 18.5]], VR_LEN = 18.5;
  const T6 = 19.6, T6E = T6 + VR_LEN / VID.speed;
  const END = T6E + 0.6, LOOP = END + 1.5;
  // ==========================================

  // ---- Geometry ----
  const X0 = 440, P = 50, CW = 44, HY = 100, RY = 300;
  const rx = (j) => X0 + j * P;
  const lastRelevant = HUMAN.reduce((a, ph, k) => (ph === null ? a : k), 0);
  const alignedSpan = (k) => {
    const js = MATCH.map((m, j) => (m === k ? j : -1)).filter((j) => j >= 0);
    return js.length ? { x: rx(js[0]), w: rx(js[js.length - 1]) + CW - rx(js[0]) } : { x: rx(ROBOT.length - 1) + CW, w: 0 };
  };
  // Bimodal attention over human frames -> two Gaussian-mixture components -> two soft nearest neighbors
  const MODES = [{ mu: 1.6, s: 0.7 }, { mu: 4.7, s: 0.6 }];
  const gauss = (k, g) => Math.exp(-((k - g.mu) ** 2) / (2 * g.s * g.s));
  const ALPHA = HUMAN.map((_, k) => (gauss(k, MODES[0]) + 0.8 * gauss(k, MODES[1])) * (HUMAN[k] === null ? 0.1 : 1));
  const BETA = ROBOT.map((_, j) => Math.exp(-((j - QUERY) ** 2) / 1.6));
  const norm = (a) => { const s = a.reduce((x, y) => x + y, 0); return a.map((x) => x / s); };
  const A = norm(ALPHA), B = norm(BETA);
  const VTS = MODES.map((g) => ({ x: rx(0) + CW / 2 + g.mu * P, y: 206 }));
  const VT = VTS[0];
  // Cycle-back distributions over robot frames: hypothesis 1 cycles back to uᵢ, hypothesis 2 misses
  const CYC = [{ off: 0, s: 0.55, hit: true }, { off: 3.3, s: 1.4, hit: false }];
  const S1 = 0.55, CB = RY - 6, CH = 46;           // trained spread, curve baseline, max height
  const rcx = (j) => rx(0) + CW / 2 + j * P;      // robot index (fractional) -> x
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, k) => `rgb(${hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * k)).join(',')})`;
  const cycCurve = (mu, s) => {
    const pts = [], h = CH * Math.min(1, S1 / s) ** 0.6;
    const a = Math.max(-0.5, mu - 3 * s), b = Math.min(ROBOT.length - 0.5, mu + 3 * s);
    for (let j = a; j <= b + 1e-6; j += 0.1) pts.push(`${rcx(j).toFixed(1)},${(CB - h * Math.exp(-((j - mu) ** 2) / (2 * s * s))).toFixed(1)}`);
    return { line: pts.join(' '), area: `${rcx(a)},${CB} ${pts.join(' ')} ${rcx(b)},${CB}` };
  };
  // DTW cost matrix (rows: human frames, cols: robot frames), traced cell by cell
  const DX = 968, DY = 44, DC = 16, T4 = 11.6, DT = 0.25;
  const near = (k, j) => Math.min(...MATCH.map((mk, jj) => (jj - j) ** 2 + (mk - k) ** 2));
  const costOp = (k, j) => (HUMAN[k] === null ? 0.06 : 0.07 + 0.6 * Math.exp(-near(k, j) / 1.4));
  let dtwMatrix = '';
  HUMAN.forEach((_, k) => ROBOT.forEach((_, j) => {
    dtwMatrix += `<rect x="${DX + j * DC}" y="${DY + k * DC}" width="${DC - 1}" height="${DC - 1}" fill="#2457c5" fill-opacity="${costOp(k, j).toFixed(2)}"/>`;
  }));
  const dtwPath = MATCH.map((k, j) =>
    `<rect data-pc="${j}" x="${DX + j * DC}" y="${DY + k * DC}" width="${DC - 1}" height="${DC - 1}" fill="${PHASES[ROBOT[j]].color}" stroke="#fff" stroke-width="1" opacity="0"/>`).join('');
  // GMM curves drawn just under the human row
  const curve = (g) => {
    const pts = [];
    for (let k = -0.5; k <= HUMAN.length - 0.5; k += 0.1) pts.push(`${(rx(0) + CW / 2 + k * P).toFixed(1)},${(HY + CW + 46 - 38 * gauss(k, g)).toFixed(1)}`);
    return pts.join(' ');
  };

  // ---- SVG helpers ----
  const photo = (x, y, w, h, href, color, id) => `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/></clipPath>
      <image href="${href}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="${color}" stroke-width="3"/>`;
  const photoStack = (x, y, who, color) => [3, 2, 1].map((n, i) =>
    photo(x + (2 - i) * 7, y - (2 - i) * 7, 150, 96, `images/method/fig_${who}.jpg`, color, `ba-${who}${n}`)).join('');
  let clipId = 0;
  const thumb = (x, y, w, h, [cx, cy, cw, ch], color) => {
    const s = w / cw, id = `ba-clip-${clipId++}`;
    return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"/></clipPath>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#f2f2f2"/>
      <image href="${IMG}" x="${x - cx * s}" y="${y - cy * s - ((ch * s - h) / 2)}" width="${IW * s}" height="${IH * s}" clip-path="url(#${id})"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="none" stroke="${color}" stroke-width="3"/>`;
  };
  const txt = (x, y, s, o = '') =>
    `<text x="${x}" y="${y}" font-size="17" stroke="#fff" stroke-width="5" paint-order="stroke" stroke-linejoin="round" ${o}>${s}</text>`;
  const marker = (color) =>
    `<marker id="ba-ah-${color.slice(1)}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${color}"/></marker>`;
  const arrow = (g, d, color, w = 2) =>
    `<path data-g="${g}" d="${d}" pathLength="1" fill="none" stroke="${color}" stroke-width="${w}" marker-end="url(#ba-ah-${color.slice(1)})"/>`;
  const cell = (id, x, y, fill, stroke, ph) => `
    <g data-g="${id}">
      <rect data-cell="${id}" x="${x}" y="${y}" width="${CW}" height="${CW}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <rect data-tint="${id}" x="${x}" y="${y}" width="${CW}" height="${CW}" rx="4" opacity="0"
        fill="${ph === null ? 'url(#ba-hatch)' : PHASES[ph].color}"/>
    </g>`;

  const humanCells = HUMAN.map((ph, k) => cell(`h${k}`, rx(k), HY, C.hFill, C.h, ph)).join('');
  const robotCells = ROBOT.map((ph, j) => cell(`r${j}`, rx(j), RY, C.rFill, C.r, ph)).join('');
  const alphaLines = A.map((a, k) =>
    `<path data-g="a${k}" pathLength="1" d="M${rx(QUERY) + CW / 2},${RY} L${rx(k) + CW / 2},${HY + CW}" stroke="${C.p}" stroke-opacity="0.55" stroke-width="${Math.max(0.8, a * 14).toFixed(2)}" stroke-linecap="round" fill="none"/>`).join('');
  const BAD = '#d0453b', GOOD = '#2f9a6a';
  const cycMarkup = `
    <g data-g="itrue">
      <line x1="${rcx(QUERY)}" y1="${CB - CH - 8}" x2="${rcx(QUERY)}" y2="${RY}" stroke="${C.ink}" stroke-width="1.5" stroke-dasharray="4 4"/>
    </g>
    ${CYC.map((_, k) => `
      <polygon data-cyc-curve="${k}" fill-opacity="0.16" stroke="none"/>
      <polyline data-cyc-line="${k}" fill="none" stroke-width="2" stroke-linejoin="round"/>
      <path data-cyc-arrow="${k}" pathLength="1" fill="none" stroke-width="2"/>
      <line data-cyc-mu="${k}" stroke-width="2.5" stroke-linecap="round"/>
      <path data-cyc-err="${k}" fill="none" stroke="${BAD}" stroke-width="2" stroke-linecap="round"/>`).join('')}`;
  const dtwLines = MATCH.map((_, j) =>
    `<path data-g="d${j}" data-dtw="${j}" pathLength="1" stroke="${PHASES[ROBOT[j]].color}" stroke-width="2.5" stroke-linecap="round" fill="none"/>`).join('');
  const irr = HUMAN.map((ph, k) => (ph === null ? k : -1)).filter((k) => k >= 0);
  const bx0 = rx(irr[0]), bx1 = rx(irr[irr.length - 1]) + CW;

  root.innerHTML = `
    <div class="ba-stage" style="position:relative">
      <svg viewBox="0 0 1200 420" role="img" aria-label="Animated behavior alignment pipeline">
        <defs>
          ${[C.ink, C.h, C.r, C.p].map(marker).join('')}
          <marker id="ba-cyc-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker>
          <pattern id="ba-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#e2e2e2"/><rect width="4" height="8" fill="#cfcfcf"/>
          </pattern>
        </defs>

        <g data-g="demos">
          ${txt(40, 50, 'Human demo', `fill="${C.h}"`)}${photoStack(40, 74, 'human', C.h)}
          ${txt(40, 250, 'Robot demo', `fill="${C.r}"`)}${photoStack(40, 274, 'robot', C.r)}
        </g>
        ${arrow('in', 'M196,122 L230,122', C.h)}${arrow('in', 'M196,322 L230,322', C.r)}
        <g data-g="enc">
          <polygon points="236,80 316,130 316,316 236,366" fill="${C.slate}"/>
          <text x="276" y="236" font-size="40" font-style="italic" font-family="Georgia, serif" fill="#fff" text-anchor="middle">φ</text>
          ${txt(276, 396, 'GTCC encoder', 'text-anchor="middle" fill="#555"')}
        </g>
        ${arrow('out', 'M322,122 L432,122', C.h)}${arrow('out', 'M322,322 L432,322', C.r)}

        <g data-g="hlab">${txt(X0, HY - 14, 'Human embeddings v₁:M', `fill="${C.h}"`)}</g>
        <g data-g="hlab2">${txt(X0, HY - 14, '', `fill="${C.ink}"`)}</g>
        <g data-g="rlab">${txt(X0, RY + CW + 26, 'Robot embeddings u₁:N', `fill="${C.r}"`)}</g>

        ${alphaLines}${dtwLines}
        ${humanCells}${robotCells}

        <rect data-g="qbox" x="${rx(QUERY) - 4}" y="${RY - 4}" width="${CW + 8}" height="${CW + 8}" rx="6" fill="none" stroke="${C.ink}" stroke-width="2.5"/>
        <g data-g="gmm">
          ${MODES.map((g) => `<polyline points="${curve(g)}" fill="${C.p}" fill-opacity="0.12" stroke="${C.p}" stroke-width="2"/>`).join('')}
          ${txt(X0 - 10, HY + CW + 40, 'GMM on αᵢ', `text-anchor="end" fill="${C.p}" font-size="15"`)}
        </g>
        <g data-g="vt">
          ${VTS.map((v, k) => `<rect x="${v.x - 10}" y="${v.y - 10}" width="20" height="20" rx="2" fill="${C.p}" transform="rotate(45 ${v.x} ${v.y})"/>
          ${txt(v.x + 20, v.y + 6, `ṽᵢ${['₁', '₂'][k]}`, `fill="${C.p}" font-size="19"`)}`).join('')}
        </g>
        <g data-g="ulab">${txt(rx(QUERY) + CW / 2, RY + CW + 26, 'uᵢ', `text-anchor="middle" fill="${C.ink}"`)}</g>
        ${cycMarkup}
        <g data-g="hitlab">${txt(rcx(QUERY) + 34, RY + CW + 26, '✓ ṽᵢ₁ cycles back to uᵢ: low loss', `fill="${GOOD}" font-size="16"`)}</g>
        <g data-g="misslab">${txt(rcx(QUERY + CYC[1].off) + 14, CB - CH + 14, '✗ ṽᵢ₂ misses uᵢ: high loss', `fill="${BAD}" font-size="16"`)}</g>

        <g data-g="relev">
          <path d="M${bx0},${HY - 8} L${bx0},${HY - 12} L${bx1},${HY - 12} L${bx1},${HY - 8}" fill="none" stroke="${C.muted}" stroke-width="1.5"/>
          ${txt((bx0 + bx1) / 2, HY - 20, 'low relevance bⱼ', `text-anchor="middle" fill="${C.muted}" font-size="15"`)}
        </g>
        <g data-g="loss">
          <rect x="958" y="60" width="232" height="128" rx="8" fill="#fff" stroke="#dcdcdc" stroke-width="1.5"/>
          <text x="974" y="88" font-size="16" fill="${C.ink}">Multi-cycle consistency loss</text>
          <text x="974" y="126" font-size="14" fill="${GOOD}">ṽᵢ₁</text>
          <rect x="1008" y="116" width="166" height="12" rx="6" fill="#f0f0f0"/>
          <rect data-loss-fill="0" x="1008" y="116" width="0" height="12" rx="6" fill="${GOOD}"/>
          <text x="974" y="160" font-size="14" fill="${BAD}">ṽᵢ₂</text>
          <rect x="1008" y="150" width="166" height="12" rx="6" fill="#f0f0f0"/>
          <rect data-loss-fill="1" x="1008" y="150" width="0" height="12" rx="6" fill="${BAD}"/>
        </g>

        <g data-g="dtwmat">
          ${txt(DX, DY - 14, 'DTW cost matrix', `fill="${C.ink}" font-size="15"`)}
          ${dtwMatrix}${dtwPath}
          <rect data-pcur x="0" y="0" width="${DC + 3}" height="${DC + 3}" rx="2" fill="none" stroke="${C.ink}" stroke-width="2" opacity="0"/>
          ${txt(DX + (ROBOT.length * DC) / 2, DY + HUMAN.length * DC + 18, 'robot frames →', `text-anchor="middle" fill="${C.r}" font-size="13"`)}
          <text x="${DX - 8}" y="${DY + (HUMAN.length * DC) / 2}" font-size="13" fill="${C.h}" text-anchor="middle" transform="rotate(-90 ${DX - 8} ${DY + (HUMAN.length * DC) / 2})">human frames →</text>
        </g>
        <rect data-cur="h" width="${CW + 8}" height="${CW + 8}" rx="6" fill="none" stroke="${C.ink}" stroke-width="2.5" opacity="0"/>
        <rect data-cur="r" width="${CW + 8}" height="${CW + 8}" rx="6" fill="none" stroke="${C.ink}" stroke-width="2.5" opacity="0"/>
        <g data-g="legend">
          ${PHASES.map((p, i) => `<rect x="${X0 + 250 + i * 110}" y="${RY + CW + 12}" width="14" height="14" rx="2" fill="${p.color}"/>${txt(X0 + 270 + i * 110, RY + CW + 25, p.name, 'fill="#555" font-size="15"')}`).join('')}
        </g>
      </svg>
    <div class="ba-vid" data-vid>
      <div class="ba-vcol">
        <div class="ba-vlab" style="color:${C.h}">Human demo temporally aligned to robot demo</div>
        <div class="ba-vbox" style="border-color:${C.h}"><video data-v="human" src="${VID.human}" muted playsinline preload="auto"></video><em data-vphase="human"></em></div>
        <div class="ba-vbar"><span style="left:0.00%;width:23.41%;background:${PHASES[0].color}">${PHASES[0].name}</span><span style="left:23.41%;width:6.69%;background:${PHASES[1].color}">${PHASES[1].name}</span><span style="left:30.10%;width:11.15%;background:${PHASES[2].color}">${PHASES[2].name}</span><span style="left:41.25%;width:23.41%;background:${PHASES[3].color}">${PHASES[3].name}</span><span class="irr" style="left:64.66%;width:35.34%">dropped</span><i data-vhead="human"></i></div>
      </div>
      <div class="ba-vcol">
        <div class="ba-vlab" style="color:${C.r}">Robot demo</div>
        <div class="ba-vbox" style="border-color:${C.r}"><video data-v="robot" src="${VID.robot}" muted playsinline preload="auto"></video><em data-vphase="robot"></em></div>
        <div class="ba-vbar"><span style="left:0.00%;width:25.95%;background:${PHASES[0].color}">${PHASES[0].name}</span><span style="left:25.95%;width:8.65%;background:${PHASES[1].color}">${PHASES[1].name}</span><span style="left:34.59%;width:25.95%;background:${PHASES[2].color}">${PHASES[2].name}</span><span style="left:60.54%;width:39.46%;background:${PHASES[3].color}">${PHASES[3].name}</span><i data-vhead="robot"></i></div>
      </div>
    </div>
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
  const q = (sel) => [...root.querySelectorAll(sel)];
  const humanRects = HUMAN.map((_, k) => q(`[data-cell=h${k}], [data-tint=h${k}]`));
  const tints = { h: HUMAN.map((_, k) => root.querySelector(`[data-tint=h${k}]`)), r: ROBOT.map((_, j) => root.querySelector(`[data-tint=r${j}]`)) };
  const dtw = q('[data-dtw]');
  const cyc = CYC.map((_, k) => ({
    curve: root.querySelector(`[data-cyc-curve="${k}"]`), line: root.querySelector(`[data-cyc-line="${k}"]`), arrow: root.querySelector(`[data-cyc-arrow="${k}"]`),
    mu: root.querySelector(`[data-cyc-mu="${k}"]`), err: root.querySelector(`[data-cyc-err="${k}"]`),
  }));
  const lossFills = [...root.querySelectorAll('[data-loss-fill]')];
  const pathCells = q('[data-pc]'), pcur = root.querySelector('[data-pcur]');
  const vidBox = root.querySelector('[data-vid]');
  const vids = { human: root.querySelector('[data-v=human]'), robot: root.querySelector('[data-v=robot]') };
  const vHeads = { human: root.querySelector('[data-vhead=human]'), robot: root.querySelector('[data-vhead=robot]') };
  const vPhase = { human: root.querySelector('[data-vphase=human]'), robot: root.querySelector('[data-vphase=robot]') };
  const curH = root.querySelector('[data-cur=h]'), curR = root.querySelector('[data-cur=r]');

  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const ramp = (t, a, b) => ease((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const op = (g, v) => (groups[g] || []).forEach((el) => el.setAttribute('opacity', v.toFixed(3)));
  const draw = (g, p, o = 1) => (groups[g] || []).forEach((el) => {
    el.style.strokeDasharray = 1;
    el.style.strokeDashoffset = 1 - p;
    el.setAttribute('opacity', (Math.min(1, p * 5) * o).toFixed(3));
  });

  function frame(t) {
    // 1 Encode
    op('demos', ramp(t, 0, 0.5));
    draw('in', ramp(t, 0.5, 0.9));
    op('enc', ramp(t, 0.7, 1.2));
    draw('out', ramp(t, 1.2, 1.6));
    op('hlab', ramp(t, 1.6, 2) * (1 - ramp(t, 15.8, 16.3)));
    ROBOT.forEach((_, j) => op('r' + j, ramp(t, 1.6 + j * 0.07, 1.9 + j * 0.07)));

    // 2 Soft nearest neighbor  (fades out when DTW starts)
    const soft = 1 - ramp(t, 11, 11.4);
    op('qbox', ramp(t, 3.5, 3.9) * soft);
    op('ulab', ramp(t, 3.6, 4) * soft);
    A.forEach((_, k) => draw('a' + k, ramp(t, 3.9 + k * 0.06, 4.4 + k * 0.06), soft));
    op('gmm', ramp(t, 4.9, 5.4) * soft);
    op('vt', ramp(t, 5.6, 6.1) * soft);

    // 3 Cycle consistency: hypothesis 1 cycles back to uᵢ (low loss), hypothesis 2 misses (high loss)
    op('itrue', ramp(t, 7.2, 7.5) * soft);
    CYC.forEach((c, k) => {
      const t0 = c.hit ? 7 : 8.4;                       // show the hit first, then the miss
      const show = ramp(t, t0 + 0.4, t0 + 0.8) * soft;
      const col = c.hit ? GOOD : BAD;
      const mu = QUERY + c.off, mx = rcx(mu), v = VTS[k], e = cyc[k];
      const cv = cycCurve(mu, c.s);
      e.curve.setAttribute('points', cv.area); e.curve.setAttribute('fill', col);
      e.line.setAttribute('points', cv.line); e.line.setAttribute('stroke', col);
      e.curve.setAttribute('opacity', show.toFixed(3)); e.line.setAttribute('opacity', show.toFixed(3));
      e.arrow.setAttribute('d', `M${v.x},${v.y + 12} Q${(v.x + mx) / 2},${v.y + 24} ${mx},${CB - CH - 4}`);
      e.arrow.setAttribute('stroke', col);
      e.arrow.setAttribute('marker-end', 'url(#ba-cyc-head)');
      const pa = ramp(t, t0, t0 + 0.5);
      e.arrow.style.strokeDasharray = 1; e.arrow.style.strokeDashoffset = 1 - pa;
      e.arrow.setAttribute('opacity', (Math.min(1, pa * 5) * soft).toFixed(3));
      e.mu.setAttribute('x1', mx); e.mu.setAttribute('x2', mx);
      e.mu.setAttribute('y1', CB - CH * (c.hit ? 1 : 0.6) - 2); e.mu.setAttribute('y2', CB + 4);
      e.mu.setAttribute('stroke', col); e.mu.setAttribute('opacity', show.toFixed(3));
      const ix = rcx(QUERY), ey = CB - 10;
      e.err.setAttribute('d', `M${mx},${ey} L${ix},${ey} M${ix},${ey - 5} L${ix},${ey + 5} M${mx},${ey - 5} L${mx},${ey + 5}`);
      e.err.setAttribute('opacity', (c.hit ? 0 : ramp(t, t0 + 0.8, t0 + 1.1) * soft).toFixed(3));
      lossFills[k].setAttribute('width', (166 * (c.hit ? 0.14 : 0.9) * ramp(t, t0 + 0.8, t0 + 1.4)).toFixed(1));
    });
    op('hitlab', ramp(t, 7.8, 8.1) * soft);
    op('misslab', ramp(t, 9.2, 9.5) * soft);
    op('relev', ramp(t, 9, 9.5) * (1 - ramp(t, 15, 15.5)));
    op('loss', ramp(t, 7.5, 7.9) * soft);

    // 4 DTW matching + 5 re-timing
    const k5 = ramp(t, 15.2, 16.8);
    const hx = HUMAN.map((ph, k) => {
      const a = alignedSpan(k);
      return { x: lerp(rx(k), a.x, k5), w: lerp(CW, a.w, k5) };
    });
    HUMAN.forEach((ph, k) => {
      const irrelevant = ph === null;
      op('h' + k, ramp(t, 1.6 + k * 0.07, 1.9 + k * 0.07) * (irrelevant ? 1 - k5 : 1));
      humanRects[k].forEach((el) => { el.setAttribute('x', hx[k].x); el.setAttribute('width', Math.max(0, hx[k].w)); });
      const firstMatch = MATCH.indexOf(k);
      tints.h[k].setAttribute('opacity', irrelevant
        ? ramp(t, 9, 9.5).toFixed(3)
        : ramp(t, T4 + firstMatch * DT, T4 + firstMatch * DT + 0.2).toFixed(3));
    });
    MATCH.forEach((m, j) => {
      const x1 = rx(j) + CW / 2, x2 = hx[m].x + hx[m].w / 2;
      dtw[j].setAttribute('d', `M${x1},${RY} L${x2},${HY + CW}`);
      draw('d' + j, ramp(t, T4 + j * DT, T4 + j * DT + 0.3));
      tints.r[j].setAttribute('opacity', ramp(t, T4 + j * DT, T4 + j * DT + 0.2).toFixed(3));
      pathCells[j].setAttribute('opacity', ramp(t, T4 + j * DT, T4 + j * DT + 0.15).toFixed(3));
    });
    // DTW matrix + cursor following the path, mirrored on the two embedding rows
    const matOn = ramp(t, 11.2, 11.6) * (1 - ramp(t, 15, 15.4));
    op('dtwmat', matOn);
    const tracing = t >= T4 && t < T4 + MATCH.length * DT;
    const cj = Math.min(MATCH.length - 1, Math.max(0, Math.floor((t - T4) / DT))), ck = MATCH[cj];
    const curOp = (tracing ? 1 : 0).toFixed(0);
    pcur.setAttribute('x', DX + cj * DC - 2); pcur.setAttribute('y', DY + ck * DC - 2); pcur.setAttribute('opacity', (curOp * matOn).toFixed(3));
    curR.setAttribute('x', rx(cj) - 4); curR.setAttribute('y', RY - 4); curR.setAttribute('opacity', curOp);
    curH.setAttribute('x', hx[ck].x - 4); curH.setAttribute('y', HY - 4); curH.setAttribute('opacity', curOp);
    op('rlab', (ramp(t, 1.6, 2)) * (1 - ramp(t, 13.2, 13.6)));
    op('legend', ramp(t, 13.4, 13.8));
    op('hlab2', ramp(t, 16.4, 16.9));

    root.querySelector('svg').style.opacity = 1 - ramp(t, LOOP - 0.5, LOOP);

    // 6 Aligned videos: robot plays at VID.speed, human time is mapped phase-by-phase onto it
    const vOn = ramp(t, 19, 19.5) * (1 - ramp(t, LOOP - 0.5, LOOP));
    vidBox.style.opacity = vOn.toFixed(3);
    vidBox.style.pointerEvents = vOn > 0.5 ? 'auto' : 'none';
    const rt = Math.max(0, Math.min(VR_LEN - 0.05, (t - T6) * VID.speed));
    const p = Math.max(0, VR.findIndex(([a, b]) => rt < b));
    const f = (rt - VR[p][0]) / (VR[p][1] - VR[p][0]);
    const ht = VH[p][0] + f * (VH[p][1] - VH[p][0]);
    const run = state.playing && t > T6 && t < T6E;
    const rate = { robot: VID.speed, human: VID.speed * (VH[p][1] - VH[p][0]) / (VR[p][1] - VR[p][0]) };
    [['robot', rt], ['human', ht]].forEach(([w, tt]) => {
      const v = vids[w];
      if (vOn > 0) {
        if (v.readyState >= 1 && Math.abs(v.currentTime - tt) > (run ? 0.2 : 0.04)) v.currentTime = tt;
        if (run) { v.playbackRate = Math.max(0.1, rate[w]); if (v.paused) v.play().catch(() => {}); }
        else if (!v.paused) v.pause();
      } else if (!v.paused) v.pause();
    });
    vHeads.human.style.left = `${(ht / VH_LEN) * 100}%`;
    vHeads.robot.style.left = `${(rt / VR_LEN) * 100}%`;
    if (vPhase.robot.dataset.p !== String(p)) {
      ['human', 'robot'].forEach((w) => { vPhase[w].dataset.p = p; vPhase[w].textContent = PHASES[p].name; vPhase[w].style.background = PHASES[p].color; });
    }
  }

  // ---- Playback + controls ----
  const state = { t: 0, playing: true, last: performance.now(), step: -1 };
  const stepBtns = q('.ba-step');
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
