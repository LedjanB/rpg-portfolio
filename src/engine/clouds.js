import { COLS, T } from "./constants.js";

// ─── CLOUD SYSTEM ────────────────────────────────────────────────
export function createClouds(count = 8) {
  return Array.from({length:count}, () => ({
    x: Math.random()*COLS*T, y: 4+Math.random()*24,
    w: 60+Math.random()*100, h: 12+Math.random()*12,
    speed: 0.12+Math.random()*0.2, opacity: 0.12+Math.random()*0.12,
  }));
}
