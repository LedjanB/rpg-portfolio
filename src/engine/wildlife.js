// ─── AMBIENT WILDLIFE ───────────────────────────────────────────
// Butterflies near flowers, birds flying across the sky

import { FLOWER_POSITIONS } from "../config/world.js";

// ─── BUTTERFLIES ────────────────────────────────────────────────
const MAX_BUTTERFLIES = 4;
let _butterflies = [];

export function updateButterflies(tick) {
  // Spawn
  while (_butterflies.length < MAX_BUTTERFLIES) {
    const flower = FLOWER_POSITIONS[Math.floor(Math.random() * FLOWER_POSITIONS.length)];
    const targetFlower = FLOWER_POSITIONS[Math.floor(Math.random() * FLOWER_POSITIONS.length)];
    _butterflies.push({
      x: flower[0] * 32 + 16,
      y: flower[1] * 32 + 16,
      targetX: targetFlower[0] * 32 + 16,
      targetY: targetFlower[1] * 32 + 16,
      color: ["#FF88AA", "#FFDD66", "#88CCFF", "#CC88FF"][Math.floor(Math.random() * 4)],
      wingPhase: Math.random() * Math.PI * 2,
      seed: Math.random() * 100,
      life: 300 + Math.random() * 300,
    });
  }

  for (let i = _butterflies.length - 1; i >= 0; i--) {
    const b = _butterflies[i];
    // Move toward target with bezier-like wobble
    const dx = b.targetX - b.x;
    const dy = b.targetY - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 10) {
      // Pick new target flower
      const f = FLOWER_POSITIONS[Math.floor(Math.random() * FLOWER_POSITIONS.length)];
      b.targetX = f[0] * 32 + 16;
      b.targetY = f[1] * 32 + 16;
    } else {
      b.x += (dx / dist) * 0.5 + Math.sin(tick * 0.05 + b.seed) * 0.8;
      b.y += (dy / dist) * 0.5 + Math.cos(tick * 0.04 + b.seed) * 0.6 - 0.1;
    }

    b.wingPhase += 0.25;
    b.life--;
    if (b.life <= 0) _butterflies.splice(i, 1);
  }
}

export function drawButterflies(ctx, camX, camY, tick) {
  for (const b of _butterflies) {
    const px = b.x - camX, py = b.y - camY;
    if (px < -20 || px > 680 || py < -20 || py > 500) continue;

    const wing = Math.sin(b.wingPhase) * 3;
    const alpha = Math.min(1, b.life / 30);
    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = b.color;
    // Left wing
    ctx.fillRect(px - 3 - Math.abs(wing), py - 1, 3 + Math.abs(wing), 2);
    // Right wing
    ctx.fillRect(px + 1, py - 1, 3 + Math.abs(wing), 2);
    // Body
    ctx.fillStyle = "#333";
    ctx.fillRect(px - 0.5, py - 1, 1, 3);
  }
  ctx.globalAlpha = 1;
}

// ─── BIRDS ──────────────────────────────────────────────────────
let _birds = [];

export function updateBirds(tick) {
  // Spawn a bird occasionally
  if (tick % 400 === 0 && _birds.length < 2) {
    const fromLeft = Math.random() < 0.5;
    _birds.push({
      x: fromLeft ? -20 : 680,
      y: 20 + Math.random() * 60,
      speed: (fromLeft ? 1 : -1) * (1.5 + Math.random()),
      wingPhase: Math.random() * Math.PI * 2,
    });
  }

  for (let i = _birds.length - 1; i >= 0; i--) {
    const bird = _birds[i];
    bird.x += bird.speed;
    bird.wingPhase += 0.15;
    bird.y += Math.sin(bird.wingPhase * 0.5) * 0.3;
    if (bird.x < -40 || bird.x > 720) _birds.splice(i, 1);
  }
}

export function drawBirds(ctx) {
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1.5;
  for (const bird of _birds) {
    const wing = Math.sin(bird.wingPhase) * 4;
    ctx.beginPath();
    // V-shape bird
    ctx.moveTo(bird.x - 5, bird.y + wing);
    ctx.lineTo(bird.x, bird.y);
    ctx.lineTo(bird.x + 5, bird.y + wing);
    ctx.stroke();
  }
}

// ─── POLLEN / DANDELION SEEDS ───────────────────────────────────
let _pollen = [];

export function updatePollen(tick, windDir) {
  if (tick % 80 === 0 && _pollen.length < 8) {
    _pollen.push({
      x: windDir >= 0 ? -10 : 680,
      y: 50 + Math.random() * 350,
      seed: Math.random() * Math.PI * 2,
      life: 400 + Math.random() * 200,
    });
  }

  for (let i = _pollen.length - 1; i >= 0; i--) {
    const p = _pollen[i];
    p.x += 0.2 * (windDir >= 0 ? 1 : -1);
    p.y += Math.sin(tick * 0.02 + p.seed) * 0.3;
    p.life--;
    if (p.life <= 0 || p.x > 700 || p.x < -20) _pollen.splice(i, 1);
  }
}

export function drawPollen(ctx) {
  for (const p of _pollen) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = "#fff";
    ctx.fillRect(p.x, p.y, 1.5, 1.5);
  }
  ctx.globalAlpha = 1;
}
