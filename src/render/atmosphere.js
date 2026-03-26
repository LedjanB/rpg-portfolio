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

  ctx.strokeStyle = "rgba(120,180,255,0.15)";
  ctx.lineWidth = 1;
  for (let r = sr; r < er; r++) {
    for (let c = sc; c < ec; c++) {
      if (!MAP.water.has(`${c},${r}`)) continue;
      const px = c * T - camX;
      const py = r * T - camY;
      const offset = (tick * 0.5 + c * 8 + r * 4) % T;

      ctx.beginPath();
      ctx.moveTo(px + offset, py);
      ctx.lineTo(px + offset + 8, py + T);
      ctx.stroke();

      if ((c + r) % 2 === 0) {
        const offset2 = (tick * 0.3 + c * 12) % T;
        ctx.beginPath();
        ctx.moveTo(px + offset2, py + T);
        ctx.lineTo(px + offset2 + 6, py);
        ctx.stroke();
      }
    }
  }
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

// ─── PARALLAX MOUNTAIN BACKGROUND ───────────────────────────────
export function parallaxBg(ctx, camX, camY, cw, ch) {
  const parallaxX = camX * 0.15;
  ctx.fillStyle = "#1a2a1a";

  // Distant mountain silhouettes
  ctx.beginPath();
  ctx.moveTo(-parallaxX, ch);
  const peaks = [
    [0, 0.7], [60, 0.4], [120, 0.6], [200, 0.3], [280, 0.55],
    [360, 0.35], [440, 0.5], [520, 0.38], [600, 0.6], [680, 0.45], [740, 0.65],
  ];
  for (const [x, h] of peaks) {
    ctx.lineTo(x - parallaxX % 200, ch - ch * h * 0.15);
  }
  ctx.lineTo(740 - parallaxX, ch);
  ctx.closePath();
  ctx.globalAlpha = 0.15;
  ctx.fill();
  ctx.globalAlpha = 1;
}
