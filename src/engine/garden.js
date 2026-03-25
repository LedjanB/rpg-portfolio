// ─── PLANTABLE GARDEN ───────────────────────────────────────────
// Stages: 0=empty, 1=seed, 2=sprout, 3=growing, 4=bloom
import { GARDEN_PLOTS } from "../config/world.js";
import { T } from "./constants.js";

export function createGardenState() {
  return GARDEN_PLOTS.map(p => ({
    x: p.x, y: p.y, stage: 0, growTimer: 0, plantColor: 0,
  }));
}

export function findNearPlot(px, py, garden) {
  for (let i = 0; i < garden.length; i++) {
    const p = garden[i];
    if (p.stage === 0 && Math.abs(px - p.x * T) < T * 0.9 && Math.abs(py - p.y * T) < T * 0.9) return i;
  }
  return -1;
}

export function plantSeed(garden, index) {
  const p = garden[index];
  if (!p || p.stage !== 0) return false;
  p.stage = 1;
  p.growTimer = 300; // ~5 seconds per stage at 60fps
  p.plantColor = Math.floor(Math.random() * 4);
  return true;
}

export function updateGarden(garden) {
  for (const p of garden) {
    if (p.stage > 0 && p.stage < 4) {
      p.growTimer--;
      if (p.growTimer <= 0) {
        p.stage++;
        p.growTimer = 300;
      }
    }
  }
}
