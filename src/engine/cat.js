import { CAT } from "../config/npcs.js";
import { T, COLS, ROWS } from "./constants.js";
import { MAP } from "./map.js";

// ─── CAT AI ──────────────────────────────────────────────────────
export function createCat() { return { x: CAT.startX*T, y: CAT.startY*T, dir:0, frame:0, moveTimer:0, pauseTimer:60, vx:0, vy:0 }; }

export function updateCat(cat) {
  if (cat.pauseTimer > 0) { cat.pauseTimer--; cat.frame = 0; return; }
  if (cat.moveTimer <= 0) {
    const dirs = [[0,1,0],[0,-1,1],[-1,0,2],[1,0,3]];
    const [dx,dy,d] = dirs[Math.floor(Math.random()*4)];
    cat.vx = dx * CAT.speed; cat.vy = dy * CAT.speed; cat.dir = d;
    cat.moveTimer = 30 + Math.floor(Math.random()*50); return;
  }
  cat.moveTimer--; cat.frame++;
  const nx = cat.x+cat.vx, ny = cat.y+cat.vy;
  const col = Math.floor(nx/T), row = Math.floor(ny/T);
  if (col>=3 && col<COLS-3 && row>=3 && row<ROWS-3 && MAP.col[row][col]===0) { cat.x=nx; cat.y=ny; }
  else { cat.moveTimer=0; cat.pauseTimer = 40+Math.floor(Math.random()*60); }
  if (cat.moveTimer <= 0) cat.pauseTimer = 50+Math.floor(Math.random()*80);
}
