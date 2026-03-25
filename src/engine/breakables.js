// ─── BREAKABLE PROPS ────────────────────────────────────────────
import { BREAKABLE_PROPS } from "../config/world.js";
import { T } from "./constants.js";

// Dynamic collision blockers — checked by collision.js
export const breakableBlockers = new Set();

let _state = [];

export function createBreakableState() {
  _state = BREAKABLE_PROPS.map(p => ({ ...p, broken: false, respawnTimer: 0 }));
  breakableBlockers.clear();
  _state.forEach(p => breakableBlockers.add(`${p.x},${p.y}`));
  return _state;
}

export function getBreakableState() { return _state; }

export function findNearBreakable(px, py) {
  for (let i = 0; i < _state.length; i++) {
    const p = _state[i];
    if (!p.broken && Math.abs(px - p.x * T) < T * 1.3 && Math.abs(py - p.y * T) < T * 1.3) return i;
  }
  return -1;
}

export function breakProp(index) {
  const p = _state[index];
  if (!p || p.broken) return false;
  p.broken = true;
  p.respawnTimer = 600; // ~10 seconds at 60fps
  breakableBlockers.delete(`${p.x},${p.y}`);
  return true;
}

export function updateBreakables() {
  for (const p of _state) {
    if (p.broken && p.respawnTimer > 0) {
      p.respawnTimer--;
      if (p.respawnTimer <= 0) {
        p.broken = false;
        breakableBlockers.add(`${p.x},${p.y}`);
      }
    }
  }
}
