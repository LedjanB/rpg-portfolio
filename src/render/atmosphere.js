// ─── ATMOSPHERE RENDERER ────────────────────────────────────────
// Grass tufts, water shimmer, emote bubbles, screen effects

import { T, CW, CH, C } from "../engine/constants.js";
import { MAP } from "../engine/map.js";
import { WORLD } from "../config/player.js";

// ─── GRASS TUFTS (swaying on grass tiles) ───────────────────────
export function grassTufts(ctx, camX, camY, tick, windMul) {
  const sc = Math.max(0, Math.floor(camX / T));
  const sr = Math.max(0, Math.floor(camY / T));
  const ec = Math.min(sc + WORLD.viewportW + 2, WORLD.cols);
  const er = Math.min(sr + WORLD.viewportH + 2, WORLD.rows);

  ctx.fillStyle = "#5a9a4a";
  for (let r = sr; r < er; r++) {
    for (let c = sc; c < ec; c++) {
      const k = `${c},${r}`;
      // Only on plain grass, not paths/water/cobble
      if (MAP.water.has(k) || MAP.paths.has(k) || MAP.cobble.has(k) || MAP.sand.has(k) || MAP.gardenSoil.has(k)) continue;
      // Sparse — only some tiles
      if ((c * 7 + r * 13) % 4 !== 0) continue;

      const px = c * T - camX;
      const py = r * T - camY;
      const sway = Math.sin(tick * 0.04 * windMul + c + r * 3) * 2 * windMul;

      ctx.fillRect(px + 8 + sway, py + 22, 2, 5);
      ctx.fillRect(px + 14 + sway * 0.8, py + 20, 2, 6);
      if ((c + r) % 3 === 0) {
        ctx.fillRect(px + 20 + sway * 1.2, py + 21, 2, 5);
      }
    }
  }
}

// ─── WATER SHIMMER ──────────────────────────────────────────────
export function waterShimmer(ctx, camX, camY, tick) {
  const sc = Math.max(0, Math.floor(camX / T));
  const sr = Math.max(0, Math.floor(camY / T));
  const ec = Math.min(sc + WORLD.viewportW + 2, WORLD.cols);
  const er = Math.min(sr + WORLD.viewportH + 2, WORLD.rows);

  // Batch all shimmer lines into a single path — one draw call
  ctx.strokeStyle = "rgba(120,180,255,0.15)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let r = sr; r < er; r++) {
    for (let c = sc; c < ec; c++) {
      if (!MAP.water.has(`${c},${r}`)) continue;
      const px = c * T - camX;
      const py = r * T - camY;
      const offset = (tick * 0.5 + c * 8 + r * 4) % T;

      ctx.moveTo(px + offset, py);
      ctx.lineTo(px + offset + 8, py + T);

      if ((c + r) % 2 === 0) {
        const offset2 = (tick * 0.3 + c * 12) % T;
        ctx.moveTo(px + offset2, py + T);
        ctx.lineTo(px + offset2 + 6, py);
      }
    }
  }
  ctx.stroke();
}

// ─── NPC EMOTE BUBBLES ─────────────────────────────────────────
export function emoteBubble(ctx, x, y, camX, camY, emote, tick) {
  const px = x - camX + 16;
  const py = y - camY - 16;
  if (px < -20 || px > CW + 20) return;

  const bob = Math.sin(tick * 0.06) * 2;

  ctx.globalAlpha = emote.alpha;
  // Bubble background
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.ellipse(px, py + bob - 4, 10, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // Bubble tail
  ctx.beginPath();
  ctx.moveTo(px - 3, py + bob + 3);
  ctx.lineTo(px, py + bob + 8);
  ctx.lineTo(px + 3, py + bob + 3);
  ctx.fill();
  // Text
  ctx.fillStyle = "#333";
  ctx.font = "bold 8px 'Press Start 2P',monospace";
  ctx.textAlign = "center";
  ctx.fillText(emote.text, px, py + bob - 1);
  ctx.textAlign = "left";
  ctx.globalAlpha = 1;
}

// ─── SCREEN SHAKE ───────────────────────────────────────────────
let _shakeFrames = 0;
let _shakeIntensity = 0;

export function triggerScreenShake(frames = 6, intensity = 3) {
  _shakeFrames = frames;
  _shakeIntensity = intensity;
}

export function getScreenShake() {
  if (_shakeFrames <= 0) return { x: 0, y: 0 };
  _shakeFrames--;
  return {
    x: (Math.random() * 2 - 1) * _shakeIntensity,
    y: (Math.random() * 2 - 1) * _shakeIntensity,
  };
}

// ─── SEASONAL FLOWER COLORS ─────────────────────────────────────
// Shifts flower palette based on real-world month
export function getSeasonalFlowerColors() {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) {
    // Spring: pinks and pastels
    return ["#FF88AA", "#FFB8CC", "#88DDFF", "#CC88FF"];
  } else if (month >= 5 && month <= 7) {
    // Summer: bright and warm
    return ["#FF4466", "#FFD700", "#FF8800", "#44DD44"];
  } else if (month >= 8 && month <= 10) {
    // Autumn: warm oranges and reds
    return ["#FF6633", "#DD8800", "#CC4400", "#886622"];
  } else {
    // Winter: cool and muted
    return ["#88AACC", "#AACCDD", "#CCDDEE", "#667788"];
  }
}

// ─── BUILDING DOOR TOOLTIPS ─────────────────────────────────────
const BUILDING_LABELS = {
  resume: "Resume & Achievements",
  about: "About Me",
  projects: "Projects & Code",
  skills: "Skills & Tools",
  contact: "Get In Touch",
  observatory: "Certifications",
  gallery: "Design Work",
  arcade: "Fun Projects",
};

export function doorTooltip(ctx, building, camX, camY, tick) {
  const px = building.doorX * T - camX + 16;
  const py = building.doorY * T - camY - 24;
  if (px < -60 || px > CW + 60) return;

  const bob = Math.sin(tick * 0.08) * 2;
  const label = BUILDING_LABELS[building.id] || building.name;
  const nameW = building.name.length * 5.5 + 12;
  const labelW = label.length * 4 + 12;
  const w = Math.max(nameW, labelW);

  // Background
  ctx.fillStyle = "rgba(0,0,0,0.75)";
  ctx.fillRect(px - w / 2, py + bob - 8, w, 24);
  ctx.strokeStyle = C.uiGold;
  ctx.lineWidth = 1;
  ctx.strokeRect(px - w / 2, py + bob - 8, w, 24);

  // Building name
  ctx.fillStyle = C.uiGold;
  ctx.font = "bold 7px 'Press Start 2P',monospace";
  ctx.textAlign = "center";
  ctx.fillText(building.name, px, py + bob + 1);

  // Description
  ctx.fillStyle = "#bbb";
  ctx.font = "5px 'Press Start 2P',monospace";
  ctx.fillText(label, px, py + bob + 11);
  ctx.textAlign = "left";
}

// ─── FOOTPRINT TRAIL ────────────────────────────────────────────
const MAX_FOOTPRINTS = 20;
let _footprints = [];

export function addFootprint(x, y) {
  _footprints.push({ x, y, alpha: 0.4 });
  if (_footprints.length > MAX_FOOTPRINTS) _footprints.shift();
}

export function updateFootprints() {
  for (let i = _footprints.length - 1; i >= 0; i--) {
    _footprints[i].alpha -= 0.003;
    if (_footprints[i].alpha <= 0) _footprints.splice(i, 1);
  }
}

export function drawFootprints(ctx, camX, camY) {
  for (const f of _footprints) {
    const px = f.x - camX;
    const py = f.y - camY;
    if (px < -T || px > CW + T) continue;
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = "#5a4a30";
    ctx.fillRect(px + 10, py + 28, 3, 2);
    ctx.fillRect(px + 18, py + 28, 3, 2);
  }
  ctx.globalAlpha = 1;
}

// ─── SCREEN TRANSITION (fade to/from black) ────────────────────
let _transitionAlpha = 0;
let _transitionDir = 0; // 1 = fading out, -1 = fading in, 0 = none
let _transitionCallback = null;

export function startTransition(direction, callback) {
  _transitionDir = direction; // 1 = fade to black, -1 = fade from black
  if (direction === 1) _transitionAlpha = 0;
  else _transitionAlpha = 1;
  _transitionCallback = callback || null;
}

export function updateTransition() {
  if (_transitionDir === 0) return false;
  _transitionAlpha += _transitionDir * 0.06;
  if (_transitionDir === 1 && _transitionAlpha >= 1) {
    _transitionAlpha = 1;
    _transitionDir = 0;
    if (_transitionCallback) { _transitionCallback(); _transitionCallback = null; }
    return true;
  }
  if (_transitionDir === -1 && _transitionAlpha <= 0) {
    _transitionAlpha = 0;
    _transitionDir = 0;
    return true;
  }
  return false;
}

export function drawTransition(ctx, cw, ch) {
  if (_transitionAlpha <= 0) return;
  ctx.fillStyle = `rgba(0,0,0,${_transitionAlpha})`;
  ctx.fillRect(0, 0, cw, ch);
}

export function isTransitioning() { return _transitionDir !== 0; }

// ─── PLAYER IDLE ANIMATIONS ────────────────────────────────────
let _idleTimer = 0;
let _idleState = "none"; // none, looking, sitting, sleeping

export function updateIdleState(moving) {
  if (moving) {
    _idleTimer = 0;
    _idleState = "none";
    return;
  }
  _idleTimer++;
  if (_idleTimer > 60 * 15 && _idleState === "sitting") _idleState = "sleeping";
  else if (_idleTimer > 60 * 8 && _idleState !== "sleeping") _idleState = "sitting";
  else if (_idleTimer > 60 * 3) _idleState = "looking";
}

export function getIdleState() { return _idleState; }
export function getIdleTimer() { return _idleTimer; }

// ─── WATER REFLECTIONS ─────────────────────────────────────────
export function waterReflections(ctx, camX, camY, tick, trees, buildings) {
  const sc = Math.max(0, Math.floor(camX / T));
  const sr = Math.max(0, Math.floor(camY / T));
  const ec = Math.min(sc + WORLD.viewportW + 2, WORLD.cols);
  const er = Math.min(sr + WORLD.viewportH + 2, WORLD.rows);

  for (let r = sr; r < er; r++) {
    for (let c = sc; c < ec; c++) {
      if (!MAP.water.has(`${c},${r}`)) continue;
      // Check if tile above is land (shore reflection)
      if (r > 0 && !MAP.water.has(`${c},${r-1}`)) {
        const px = c * T - camX;
        const py = r * T - camY;
        const wave = Math.sin(tick * 0.04 + c * 2) * 2;
        ctx.globalAlpha = 0.15;
        // Reflect the ground color above as a wavy stripe
        ctx.fillStyle = MAP.paths.has(`${c},${r-1}`) ? "#8a7a50" :
                       MAP.cobble.has(`${c},${r-1}`) ? "#6a6a60" : "#3a5a2a";
        ctx.fillRect(px, py + wave, T, 6);
      }
    }
  }
  ctx.globalAlpha = 1;
}

// ─── TERRAIN PARTICLES ─────────────────────────────────────────
export function getTerrainParticle(px, py) {
  const col = Math.floor((px + 16) / T);
  const row = Math.floor((py + 24) / T);
  const key = `${col},${row}`;

  if (MAP.cobble.has(key)) {
    return { color: "rgba(160,150,140,0.4)", vy: -0.3, life: 10, size: 1.5 };
  }
  if (MAP.sand.has(key)) {
    return { color: "rgba(200,180,120,0.5)", vy: -0.4, life: 12, size: 2 };
  }
  if (MAP.paths.has(key)) {
    return { color: "rgba(180,160,120,0.5)", vy: -0.3, life: 12, size: 2 };
  }
  // Grass — tiny green leaf
  return { color: "rgba(80,140,60,0.4)", vy: -0.5, life: 15, size: 1.5 };
}

// ─── ACHIEVEMENT TOAST ─────────────────────────────────────────
let _toasts = [];

export function showToast(text) {
  _toasts.push({ text, timer: 180, alpha: 0 }); // 3 seconds
}

export function updateToasts() {
  for (let i = _toasts.length - 1; i >= 0; i--) {
    const t = _toasts[i];
    t.timer--;
    if (t.timer > 160) t.alpha = Math.min(1, t.alpha + 0.1);
    else if (t.timer < 30) t.alpha = Math.max(0, t.alpha - 0.04);
    if (t.timer <= 0) _toasts.splice(i, 1);
  }
}

export function drawToasts(ctx, cw) {
  for (let i = 0; i < _toasts.length; i++) {
    const t = _toasts[i];
    const slideIn = Math.min(1, (180 - t.timer) / 15);
    const x = cw - 10 - (180 * slideIn);
    const y = 80 + i * 30;
    ctx.globalAlpha = t.alpha;
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(x, y, 180, 24);
    ctx.strokeStyle = "#FFD93D";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, 180, 24);
    ctx.fillStyle = "#FFD93D";
    ctx.font = "6px 'Press Start 2P',monospace";
    ctx.fillText(t.text, x + 8, y + 15);
  }
  ctx.globalAlpha = 1;
}
