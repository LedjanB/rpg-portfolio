// ─── DAY/NIGHT CYCLE ENGINE ──────────────────────────────────────
// Drives time-of-day visuals: tinting, stars, fireflies, building glow

const CYCLE_LENGTH = 3600; // ticks per full day (60s at 60fps)

// Phase boundaries (fraction of cycle)
const PHASES = {
  dawn:    0.00,  // 0%
  day:     0.15,  // 15%
  sunset:  0.55,  // 55%
  dusk:    0.65,  // 65%
  night:   0.75,  // 75%
  predawn: 0.90,  // 90%
};

// Tint colors for each phase [r, g, b, alpha]
const TINTS = {
  dawn:    [255, 176, 192, 0.10],
  day:     [255, 248, 224, 0.02],
  sunset:  [255, 176, 96,  0.15],
  dusk:    [60,  50,  100, 0.25],
  night:   [20,  20,  60,  0.45],
  predawn: [40,  30,  80,  0.35],
};

function lerpColor(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
    a[3] + (b[3] - a[3]) * t,
  ];
}

export function getDayPhase(tick) {
  const t = (tick % CYCLE_LENGTH) / CYCLE_LENGTH;
  if (t < PHASES.day) return { phase: "dawn", progress: (t - PHASES.dawn) / (PHASES.day - PHASES.dawn) };
  if (t < PHASES.sunset) return { phase: "day", progress: (t - PHASES.day) / (PHASES.sunset - PHASES.day) };
  if (t < PHASES.dusk) return { phase: "sunset", progress: (t - PHASES.sunset) / (PHASES.dusk - PHASES.sunset) };
  if (t < PHASES.night) return { phase: "dusk", progress: (t - PHASES.dusk) / (PHASES.night - PHASES.dusk) };
  if (t < PHASES.predawn) return { phase: "night", progress: (t - PHASES.night) / (PHASES.predawn - PHASES.night) };
  return { phase: "predawn", progress: (t - PHASES.predawn) / (1 - PHASES.predawn) };
}

const PHASE_ORDER = ["dawn", "day", "sunset", "dusk", "night", "predawn"];
const NEXT_PHASE = { dawn: "day", day: "sunset", sunset: "dusk", dusk: "night", night: "predawn", predawn: "dawn" };

export function getTint(tick) {
  const { phase, progress } = getDayPhase(tick);
  const from = TINTS[phase];
  const to = TINTS[NEXT_PHASE[phase]];
  return lerpColor(from, to, progress);
}

export function getNightAmount(tick) {
  const { phase, progress } = getDayPhase(tick);
  if (phase === "night") return 1;
  if (phase === "dusk") return progress;
  if (phase === "predawn") return 1 - progress;
  if (phase === "dawn") return Math.max(0, 0.3 - progress * 0.3);
  return 0;
}

// ─── STARS ───────────────────────────────────────────────────────
const STAR_COUNT = 60;
let _stars = null;

function ensureStars() {
  if (_stars) return _stars;
  _stars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    _stars.push({
      x: Math.random(),
      y: Math.random() * 0.6, // upper 60% of sky
      size: 1 + Math.random(),
      twinkleSpeed: 0.05 + Math.random() * 0.1,
      twinkleOffset: Math.random() * Math.PI * 2,
    });
  }
  return _stars;
}

export function drawStars(ctx, cw, ch, tick, nightAmount) {
  if (nightAmount < 0.1) return;
  const stars = ensureStars();
  for (const s of stars) {
    const alpha = nightAmount * (0.4 + 0.6 * Math.abs(Math.sin(tick * s.twinkleSpeed + s.twinkleOffset)));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#fff";
    ctx.fillRect(s.x * cw, s.y * ch, s.size, s.size);
  }
  ctx.globalAlpha = 1;
}

// ─── FIREFLIES ──────────────────────────────────────────────────
const MAX_FIREFLIES = 12;
let _fireflies = [];

export function updateFireflies(tick, nightAmount, mapW, mapH) {
  // Only active at night
  if (nightAmount < 0.2) { _fireflies.length = 0; return; }

  // Spawn new fireflies
  while (_fireflies.length < MAX_FIREFLIES * nightAmount) {
    _fireflies.push({
      x: 100 + Math.random() * (mapW - 200),
      y: 100 + Math.random() * (mapH - 200),
      seed: Math.random() * Math.PI * 2,
      life: 200 + Math.random() * 300,
      maxLife: 200 + Math.random() * 300,
    });
  }

  // Update
  for (let i = _fireflies.length - 1; i >= 0; i--) {
    const f = _fireflies[i];
    f.x += Math.sin(tick * 0.03 + f.seed) * 0.3;
    f.y += Math.cos(tick * 0.02 + f.seed * 1.5) * 0.2;
    f.life--;
    if (f.life <= 0) _fireflies.splice(i, 1);
  }
}

export function drawFireflies(ctx, camX, camY, tick) {
  for (const f of _fireflies) {
    const px = f.x - camX, py = f.y - camY;
    if (px < -20 || px > 680 || py < -20 || py > 500) continue;
    const pulse = 0.3 + 0.7 * Math.abs(Math.sin(tick * 0.08 + f.seed));
    const lifeAlpha = Math.min(1, f.life / 40, (f.maxLife - f.life) / 40);
    const alpha = pulse * lifeAlpha;

    // Glow
    const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
    grd.addColorStop(0, `rgba(200,255,100,${alpha * 0.4})`);
    grd.addColorStop(1, `rgba(200,255,100,0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(px - 8, py - 8, 16, 16);

    // Core
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#EEFFAA";
    ctx.fillRect(px - 1, py - 1, 2, 2);
  }
  ctx.globalAlpha = 1;
}

// ─── DAY/NIGHT OVERLAY WITH VIGNETTE ────────────────────────────
export function drawDayNightOverlay(ctx, cw, ch, tick) {
  const [r, g, b, a] = getTint(tick);
  const nightAmt = getNightAmount(tick);

  if (a >= 0.01) {
    ctx.fillStyle = `rgba(${r|0},${g|0},${b|0},${a.toFixed(3)})`;
    ctx.fillRect(0, 0, cw, ch);
  }

  // Vignette — darkened edges, stronger at night
  const vignetteAlpha = 0.15 + nightAmt * 0.35;
  if (vignetteAlpha > 0.01) {
    const cx = cw / 2, cy = ch / 2;
    const outerR = Math.sqrt(cx * cx + cy * cy);
    const grd = ctx.createRadialGradient(cx, cy, outerR * 0.4, cx, cy, outerR);
    grd.addColorStop(0, "rgba(0,0,0,0)");
    grd.addColorStop(0.7, `rgba(0,0,0,${vignetteAlpha * 0.3})`);
    grd.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, cw, ch);
  }
}

// ─── LIGHTNING FLASH ────────────────────────────────────────────
let _lightningTimer = 0;
let _lightningIntensity = 0;

export function triggerLightning() {
  _lightningTimer = 12;
  _lightningIntensity = 0.6 + Math.random() * 0.3;
}

export function drawLightningFlash(ctx, cw, ch) {
  if (_lightningTimer <= 0) return;
  _lightningTimer--;
  // Double flash pattern
  const flash = _lightningTimer > 8 ? _lightningIntensity :
                _lightningTimer > 5 ? 0 :
                _lightningTimer > 3 ? _lightningIntensity * 0.5 : 0;
  if (flash > 0) {
    ctx.fillStyle = `rgba(200,210,255,${flash})`;
    ctx.fillRect(0, 0, cw, ch);
  }
}

// ─── DYNAMIC SHADOWS ────────────────────────────────────────────
export function getShadowAngle(tick) {
  const { phase, progress } = getDayPhase(tick);
  // Shadow direction rotates through the day
  if (phase === "night" || phase === "predawn") return { dx: 0, dy: 0, alpha: 0 };
  if (phase === "dawn") return { dx: -8 + progress * 4, dy: 6 - progress * 2, alpha: 0.1 + progress * 0.1 };
  if (phase === "day") return { dx: -4 + progress * 8, dy: 4, alpha: 0.2 };
  if (phase === "sunset") return { dx: 4 + progress * 4, dy: 4 + progress * 2, alpha: 0.2 - progress * 0.1 };
  if (phase === "dusk") return { dx: 8, dy: 6, alpha: 0.1 - progress * 0.1 };
  return { dx: 0, dy: 0, alpha: 0 };
}

// ─── BUILDING WINDOW GLOW AT NIGHT ─────────────────────────────
export function drawBuildingGlow(ctx, buildings, camX, camY, tick, nightAmount) {
  if (nightAmount < 0.15) return;
  const T = 32;
  for (const b of buildings) {
    const doorPx = b.doorX * T - camX + 16;
    const doorPy = b.doorY * T - camY;
    if (doorPx < -60 || doorPx > 700) continue;

    // Warm window glow near door
    const flicker = Math.sin(tick * 0.06 + b.x) * 0.1;
    const alpha = nightAmount * (0.3 + flicker);
    const grd = ctx.createRadialGradient(doorPx, doorPy, 0, doorPx, doorPy, 40);
    grd.addColorStop(0, `rgba(255,180,80,${alpha})`);
    grd.addColorStop(0.5, `rgba(255,140,50,${alpha * 0.4})`);
    grd.addColorStop(1, `rgba(255,100,30,0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(doorPx - 40, doorPy - 40, 80, 80);

    // Window lights on building face
    const bx = b.x * T - camX;
    const by = b.y * T - camY;
    const winAlpha = nightAmount * (0.5 + flicker);
    ctx.fillStyle = `rgba(255,200,100,${winAlpha})`;
    // Two windows per building
    ctx.fillRect(bx + T * 0.5, by + T * 1.2, 8, 6);
    ctx.fillRect(bx + T * (b.w - 1.2), by + T * 1.2, 8, 6);
  }
}
