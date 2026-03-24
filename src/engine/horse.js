import { HORSE } from "../config/npcs.js";
import { T, COLS, ROWS } from "./constants.js";
import { MAP } from "./map.js";

// ─── HORSE AI ────────────────────────────────────────────────────
// The horse wanders when free, stays put when waiting for the player.

export function createHorse() {
  return {
    x: HORSE.startX * T,
    y: HORSE.startY * T,
    dir: 3,          // facing right
    frame: 0,
    moveTimer: 0,
    pauseTimer: 80,
    vx: 0,
    vy: 0,
    mounted: false,   // is the player riding?
    waiting: false,   // player dismounted to enter building — stay put
  };
}

export function updateHorse(horse) {
  // When mounted, the game loop moves the horse with the player — skip AI
  if (horse.mounted) { horse.frame++; return; }

  // When waiting (player entered a building), stay in place
  if (horse.waiting) { horse.frame = 0; return; }

  // Free-roaming wander AI (similar to cat but slower pace)
  if (horse.pauseTimer > 0) { horse.pauseTimer--; horse.frame = 0; return; }
  if (horse.moveTimer <= 0) {
    const dirs = [[0,1,0],[0,-1,1],[-1,0,2],[1,0,3]];
    const [dx, dy, d] = dirs[Math.floor(Math.random() * 4)];
    horse.vx = dx * HORSE.speed;
    horse.vy = dy * HORSE.speed;
    horse.dir = d;
    horse.moveTimer = 40 + Math.floor(Math.random() * 60);
    return;
  }
  horse.moveTimer--;
  horse.frame++;
  const nx = horse.x + horse.vx, ny = horse.y + horse.vy;
  const col = Math.floor(nx / T), row = Math.floor(ny / T);
  if (col >= 2 && col < COLS - 2 && row >= 2 && row < ROWS - 2 && MAP.col[row][col] === 0) {
    horse.x = nx;
    horse.y = ny;
  } else {
    horse.moveTimer = 0;
    horse.pauseTimer = 60 + Math.floor(Math.random() * 80);
  }
  if (horse.moveTimer <= 0) horse.pauseTimer = 70 + Math.floor(Math.random() * 100);
}
