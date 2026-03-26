// ─── NPC BEHAVIOR ENGINE ────────────────────────────────────────
// Makes NPCs feel alive: breathing, facing player, patrol routes, emotes

import { T } from "./constants.js";

// ─── PATROL ROUTES ──────────────────────────────────────────────
// NPCs with patrol waypoints [id, [[x,y], [x,y], ...], speed]
const PATROL_ROUTES = {
  merchant: { waypoints: [[24, 14], [26, 14], [28, 14], [26, 14]], speed: 0.3 },
  guard:    { waypoints: [[26, 34], [26, 33], [26, 34], [26, 35]], speed: 0.2 },
  gardener: { waypoints: [[23, 36], [25, 36], [27, 36], [25, 36]], speed: 0.25 },
  bard:     { waypoints: [[26, 27], [25, 27], [27, 27], [26, 27]], speed: 0.2 },
};

// ─── NPC STATE (initialized once) ──────────────────────────────
const _npcStates = new Map();

export function initNPCState(npcs) {
  for (const n of npcs) {
    if (_npcStates.has(n.id)) continue;
    const patrol = PATROL_ROUTES[n.id];
    _npcStates.set(n.id, {
      baseX: n.x,
      baseY: n.y,
      baseDir: n.dir,
      // Patrol
      patrolIdx: 0,
      patrolProgress: 0,
      hasPatrol: !!patrol,
      // Emote
      emoteTimer: 60 + Math.floor(Math.random() * 300),
      emoteType: null,
      emoteAlpha: 0,
      // Facing
      facingPlayer: false,
    });
  }
}

// ─── EMOTE TYPES ────────────────────────────────────────────────
const EMOTE_MAP = {
  bard: "♪",
  fisher: "~",
  scholar: "?",
  merchant: "$",
  smith: "!",
  gardener: "*",
  astronomer: "☆",
  guide: "!",
  guard: "...",
  traveler: "?",
};

// ─── UPDATE ─────────────────────────────────────────────────────
export function updateNPCs(npcs, playerX, playerY, tick) {
  initNPCState(npcs);

  for (const n of npcs) {
    const s = _npcStates.get(n.id);
    if (!s) continue;

    // ── Face player when nearby ──
    const dx = playerX - n.x * T;
    const dy = playerY - n.y * T;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < T * 3) {
      s.facingPlayer = true;
      // Determine facing direction
      if (Math.abs(dx) > Math.abs(dy)) {
        n.dir = dx < 0 ? 2 : 3;
      } else {
        n.dir = dy < 0 ? 1 : 0;
      }
    } else {
      if (s.facingPlayer) {
        n.dir = s.baseDir; // restore original direction
        s.facingPlayer = false;
      }
    }

    // ── Patrol routes ──
    if (s.hasPatrol && !s.facingPlayer) {
      const route = PATROL_ROUTES[n.id];
      const wp = route.waypoints;
      const from = wp[s.patrolIdx];
      const to = wp[(s.patrolIdx + 1) % wp.length];

      s.patrolProgress += route.speed / T;
      if (s.patrolProgress >= 1) {
        s.patrolProgress = 0;
        s.patrolIdx = (s.patrolIdx + 1) % wp.length;
      }

      const t = s.patrolProgress;
      n.x = from[0] + (to[0] - from[0]) * t;
      n.y = from[1] + (to[1] - from[1]) * t;

      // Update facing based on movement
      const mdx = to[0] - from[0];
      const mdy = to[1] - from[1];
      if (Math.abs(mdx) > Math.abs(mdy)) n.dir = mdx > 0 ? 3 : 2;
      else if (mdy !== 0) n.dir = mdy > 0 ? 0 : 1;
    }

    // ── Emote bubbles ──
    s.emoteTimer--;
    if (s.emoteTimer <= 0 && !s.emoteType) {
      s.emoteType = EMOTE_MAP[n.id] || "!";
      s.emoteAlpha = 1;
      s.emoteTimer = 90; // show for 90 frames
    }
    if (s.emoteType) {
      s.emoteTimer--;
      if (s.emoteTimer < 20) s.emoteAlpha = s.emoteTimer / 20;
      if (s.emoteTimer <= 0) {
        s.emoteType = null;
        s.emoteTimer = 200 + Math.floor(Math.random() * 400);
      }
    }
  }
}

// ─── GET BREATHING OFFSET ───────────────────────────────────────
export function getBreathingOffset(npcId, tick) {
  return Math.sin(tick * 0.05 + (npcId.charCodeAt(0) || 0) * 0.7) * 1;
}

// ─── GET EMOTE STATE ────────────────────────────────────────────
export function getEmoteState(npcId) {
  const s = _npcStates.get(npcId);
  if (!s || !s.emoteType) return null;
  return { text: s.emoteType, alpha: s.emoteAlpha };
}
