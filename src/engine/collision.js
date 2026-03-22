import { T, COLS, ROWS } from "./constants.js";
import { MAP } from "./map.js";

// ─── COLLISION UTILITIES ─────────────────────────────────────────

export function isBlocked(x, y) {
  const c = Math.floor(x / T), r = Math.floor(y / T);
  if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return true;
  return MAP.col[r][c] !== 0;
}

export function moveWithCollision(px, py, dx, dy, pad = 6) {
  const nx = px + dx, ny = py + dy;
  let oX = true, oY = true;
  if (dx !== 0) { const tx = dx > 0 ? nx + T - pad : nx + pad; if (isBlocked(tx, py + pad + 16) || isBlocked(tx, py + T - pad)) oX = false; }
  if (dy !== 0) { const ty = dy > 0 ? ny + T - pad : ny + pad + 16; if (isBlocked(px + pad, ty) || isBlocked(px + T - pad, ty)) oY = false; }
  const finalX = oX ? Math.max(0, Math.min(nx, (COLS - 1) * T)) : px;
  const finalY = oY ? Math.max(0, Math.min(ny, (ROWS - 1) * T)) : py;
  return { x: finalX, y: finalY };
}
