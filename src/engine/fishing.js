// ─── FISHING MINI-GAME ──────────────────────────────────────────
// States: idle → casting → waiting → bite → caught/missed → idle
import { FISHING_SPOTS } from "../config/world.js";
import { T } from "./constants.js";

const FISH_TYPES = [
  "Code Carp", "Bug Bass", "Pixel Perch", "Data Trout",
  "Syntax Salmon", "Binary Barracuda", "Loop Lobster", "Async Anchovy",
];

export function createFishingState() {
  return { state: "idle", timer: 0, spot: null, fishName: null, totalCaught: 0 };
}

export function findNearFishingSpot(px, py) {
  for (const s of FISHING_SPOTS) {
    if (Math.abs(px - s.x * T) < T * 1.2 && Math.abs(py - s.y * T) < T * 1.2) return s;
  }
  return null;
}

export function startFishing(fs, spot) {
  if (fs.state !== "idle") return false;
  fs.state = "casting";
  fs.timer = 20; // brief cast animation
  fs.spot = spot;
  fs.fishName = null;
  return true;
}

export function reelIn(fs) {
  if (fs.state === "bite") {
    fs.state = "caught";
    fs.fishName = FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)];
    fs.totalCaught++;
    fs.timer = 90; // show caught message
    return true;
  }
  if (fs.state === "waiting") {
    fs.state = "missed";
    fs.fishName = null;
    fs.timer = 40;
    return false;
  }
  return false;
}

export function updateFishing(fs) {
  if (fs.state === "idle") return;

  fs.timer--;

  if (fs.state === "casting" && fs.timer <= 0) {
    fs.state = "waiting";
    fs.timer = 90 + Math.floor(Math.random() * 120); // random wait
  }

  if (fs.state === "waiting" && fs.timer <= 0) {
    fs.state = "bite";
    fs.timer = 40; // bite window — press SPACE now!
  }

  if (fs.state === "bite" && fs.timer <= 0) {
    fs.state = "missed";
    fs.fishName = null;
    fs.timer = 40;
  }

  if ((fs.state === "caught" || fs.state === "missed") && fs.timer <= 0) {
    fs.state = "idle";
    fs.spot = null;
  }
}
