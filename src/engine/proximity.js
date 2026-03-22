import { BUILDINGS } from "../config/buildings.js";
import { NPCS } from "../config/npcs.js";
import { T } from "./constants.js";

// ─── PROXIMITY DETECTION ─────────────────────────────────────────

export function findNearDoor(px, py) {
  const pcol = Math.round(px / T), prow = Math.round(py / T);
  for (const b of BUILDINGS) {
    if (Math.abs(pcol - b.doorX) <= 1 && Math.abs(prow - b.doorY) <= 1) return b.id;
  }
  return null;
}

export function findNearNPC(px, py) {
  for (const n of NPCS) {
    if (Math.abs(px - n.x * T) < T * 1.5 && Math.abs(py - n.y * T) < T * 1.5) return n.id;
  }
  return null;
}

export function isNearCat(px, py, catX, catY) {
  return Math.abs(px - catX) < T * 1.5 && Math.abs(py - catY) < T * 1.5;
}
