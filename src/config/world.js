// ─── WATER REGIONS ───────────────────────────────────────────────
// Define rectangular water zones as { x, y, w, h }.
// Sand shores auto-generate around them. Reeds and lilypads spawn randomly on edges.
export const WATER_ZONES = [
  { x: 7,  y: 16, w: 5, h: 6 },   // Lake
  { x: 8,  y: 17, w: 4, h: 1 },   // Lake extra top
  { x: 31, y: 10, w: 2, h: 19 },  // River (vertical)
  { x: 31, y: 14, w: 8, h: 2 },   // River (horizontal branch)
];

// ─── BRIDGES ─────────────────────────────────────────────────────
// Tiles that are walkable over water. Add [x,y] pairs.
export const BRIDGE_POSITIONS = [[31,12],[32,12],[31,22],[32,22]];

// ─── DOCK ────────────────────────────────────────────────────────
export const DOCK_POSITIONS = [[6,18],[6,19]];

// ─── COINS ───────────────────────────────────────────────────────
// Hidden collectibles. Add/remove [x,y] pairs to change them.
export const COIN_POSITIONS = [
  [4,9],[38,9],[5,16],[38,28],[12,14],
  [30,8],[21,16],[35,15],[10,25],[28,25],
];

// ─── PROPS ───────────────────────────────────────────────────────
// Decorative objects. Types: barrel, crate, bench, well, stall, haystack, signpost
// All except signpost block movement. To add more: push to array.
export const PROPS = [
  { type: "barrel", x: 3,  y: 7 },  { type: "barrel", x: 9,  y: 5 },
  { type: "crate",  x: 9,  y: 6 },  { type: "bench",  x: 33, y: 8 },
  { type: "barrel", x: 39, y: 5 },  { type: "well",   x: 19, y: 9 },
  { type: "bench",  x: 24, y: 9 },  { type: "signpost",x: 18, y: 10 },
  { type: "stall",  x: 19, y: 13 }, { type: "stall",  x: 23, y: 13 },
  { type: "barrel", x: 3,  y: 25 }, { type: "crate",  x: 3,  y: 26 },
  { type: "barrel", x: 9,  y: 25 }, { type: "haystack",x: 10, y: 24 },
  { type: "crate",  x: 39, y: 25 }, { type: "barrel", x: 39, y: 26 },
  { type: "bench",  x: 12, y: 11 }, { type: "bench",  x: 29, y: 11 },
  { type: "signpost",x: 30, y: 12 },{ type: "haystack",x: 12, y: 22 },
  { type: "crate",  x: 29, y: 22 }, { type: "barrel", x: 18, y: 22 },
  { type: "bench",  x: 5,  y: 16 }, { type: "signpost",x: 8,  y: 15 },
];

// ─── FLOWERS ─────────────────────────────────────────────────────
// [x, y, colorIndex] — colorIndex: 0=pink, 1=yellow, 2=blue, 3=purple
export const FLOWER_POSITIONS = [
  [5,9,0],[8,9,1],[13,9,2],[18,9,3],[25,9,0],[28,9,1],[35,9,2],[38,9,3],
  [5,13,1],[8,14,2],[13,13,3],[25,13,1],[28,14,2],[35,13,3],[38,14,0],
  [5,21,2],[8,21,3],[13,21,0],[35,21,0],[38,21,1],
  [5,25,3],[8,25,0],[13,25,1],[35,25,2],[38,25,3],
  [19,12,0],[20,13,1],[23,12,2],[24,13,3],[19,15,0],[24,15,3],
];

// ─── TORCHES ─────────────────────────────────────────────────────
// [x, y] positions along paths. They flicker and glow.
export const TORCH_POSITIONS = [
  [6,10],[10,10],[14,10],[18,10],[25,10],[29,10],[34,10],[38,10],
  [6,22],[10,22],[14,22],[18,22],[25,22],[29,22],[34,22],[38,22],
  [21,8],[22,8],[21,14],[22,14],[21,20],[22,20],[21,25],[22,25],
  [30,12],[33,12],[30,22],[33,22],
];

// ─── EXTRA TREE CLUSTERS ─────────────────────────────────────────
// Beyond the auto-generated border trees, add decorative clusters as [x,y].
export const EXTRA_TREES = [
  [10,4],[11,4],[10,5],[11,5],[14,4],[15,4],[14,5],[15,5],
  [26,4],[27,4],[26,5],[27,5],[30,4],[30,5],
  [6,14],[8,13],[12,10],[13,10],[30,10],[30,11],[33,10],[33,11],
  [10,26],[11,26],[10,27],[33,26],[33,27],
  [20,14],[20,15],[23,14],[23,15],[20,26],[23,26],[20,27],[23,27],
];

// ─── FOREST PATCHES ──────────────────────────────────────────────
// Dense tree zones defined as { x, y, w, h }.
export const FOREST_ZONES = [
  { x: 14, y: 16, w: 4, h: 5 },
  { x: 25, y: 17, w: 4, h: 4 },
  { x: 14, y: 26, w: 4, h: 4 },
  { x: 25, y: 26, w: 4, h: 4 },
];

// ─── COBBLESTONE ZONE (town square) ──────────────────────────────
export const COBBLE_ZONE = { x: 18, y: 11, w: 8, h: 3 };

// ─── FOUNTAIN ────────────────────────────────────────────────────
export const FOUNTAIN_POS = { x: 21, y: 12 };

// ─── EASTER EGG (appears after all coins collected) ──────────────
export const EASTER_EGG_POS = { x: 21, y: 18 };

// ─── PATH DEFINITIONS ────────────────────────────────────────────
// Roads defined as line segments { axis:"h"|"v", fixed, from, to }.
// h = horizontal (fixed=row), v = vertical (fixed=col).
export const ROAD_SEGMENTS = [
  // Main horizontal roads
  { axis: "h", fixed: 10, from: 3, to: 41 },
  { axis: "h", fixed: 11, from: 3, to: 41 },
  { axis: "h", fixed: 22, from: 3, to: 41 },
  { axis: "h", fixed: 23, from: 3, to: 41 },
  // Main vertical road
  { axis: "v", fixed: 21, from: 3, to: 31 },
  { axis: "v", fixed: 22, from: 3, to: 31 },
  // Building connections
  { axis: "v", fixed: 6,  from: 7,  to: 10 }, { axis: "v", fixed: 7,  from: 7,  to: 10 },
  { axis: "v", fixed: 36, from: 7,  to: 10 }, { axis: "v", fixed: 37, from: 7,  to: 10 },
  { axis: "v", fixed: 6,  from: 22, to: 24 }, { axis: "v", fixed: 7,  from: 22, to: 24 },
  { axis: "v", fixed: 36, from: 22, to: 24 }, { axis: "v", fixed: 37, from: 22, to: 24 },
  // Bridge approaches
  { axis: "v", fixed: 30, from: 10, to: 13 }, { axis: "v", fixed: 33, from: 10, to: 13 },
  { axis: "v", fixed: 30, from: 21, to: 23 }, { axis: "v", fixed: 33, from: 21, to: 23 },
  // Lake-side path
  { axis: "h", fixed: 15, from: 5,  to: 8 },  { axis: "h", fixed: 22, from: 5,  to: 8 },
];
