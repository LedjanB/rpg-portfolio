// ─── WATER REGIONS ───────────────────────────────────────────────
export const WATER_ZONES = [
  { x: 5,  y: 22, w: 5, h: 4 },   // Lake (main body)
  { x: 6,  y: 21, w: 4, h: 1 },   // Lake (wider top — organic shape)
  { x: 6,  y: 26, w: 3, h: 1 },   // Lake (extension south)
  { x: 31, y: 4,  w: 2, h: 18 },  // River (north-south)
  { x: 31, y: 14, w: 6, h: 2 },   // River (eastern branch)
];

// ─── BRIDGES ─────────────────────────────────────────────────────
export const BRIDGE_POSITIONS = [
  [31,9],[32,9],[31,10],[32,10],    // North bridge (main road)
  [31,20],[32,20],[31,21],[32,21],  // South bridge (southern road)
];

// ─── DOCK ────────────────────────────────────────────────────────
export const DOCK_POSITIONS = [[4,24],[4,25]];

// ─── COINS ───────────────────────────────────────────────────────
export const COIN_POSITIONS = [
  [4,8],[39,8],[5,21],[39,25],[14,14],
  [30,7],[21,16],[37,14],[10,27],[28,27],
];

// ─── INTERACTIVE SIGNS ──────────────────────────────────────────
// Readable signposts — press SPACE near them to read.
// Must have a matching signpost prop at the same position.
export const SIGNS = [
  { x: 18, y: 9,  text: "Welcome to Portfolio\nVillage! Explore buildings\nto discover my work!" },
  { x: 8,  y: 9,  text: "← TAVERN\nCome in for stories\nabout the developer!" },
  { x: 30, y: 9,  text: "LIBRARY →\nDiscover projects and\ntechnical work inside!" },
  { x: 4,  y: 21, text: "CRYSTAL LAKE\nA peaceful spot to\nthink about code." },
  { x: 8,  y: 20, text: "← FORGE\nSkills crafted with\nprecision and care." },
  { x: 30, y: 20, text: "POST OFFICE →\nReach out and get\nin touch anytime!" },
];

// ─── PROPS ───────────────────────────────────────────────────────
export const PROPS = [
  // TAVERN area
  { type: "barrel", x: 3,  y: 7 },  { type: "barrel", x: 9,  y: 6 },
  { type: "crate",  x: 9,  y: 7 },  { type: "bench",  x: 11, y: 8 },
  // LIBRARY area
  { type: "bench",  x: 32, y: 8 },  { type: "barrel", x: 38, y: 6 },
  { type: "crate",  x: 38, y: 7 },
  // TOWN HALL area
  { type: "well",   x: 19, y: 8 },  { type: "bench",  x: 25, y: 8 },
  // Town square — market
  { type: "stall",  x: 19, y: 13 }, { type: "stall",  x: 23, y: 13 },
  { type: "bench",  x: 15, y: 10 }, { type: "bench",  x: 29, y: 10 },
  // FORGE area
  { type: "barrel", x: 3,  y: 19 }, { type: "crate",  x: 3,  y: 18 },
  { type: "barrel", x: 10, y: 18 }, { type: "haystack",x: 11, y: 17 },
  // POST OFFICE area
  { type: "crate",  x: 38, y: 18 }, { type: "barrel", x: 38, y: 19 },
  { type: "bench",  x: 32, y: 20 },
  // Lakeside
  { type: "bench",  x: 3,  y: 22 },
  // Signposts (interactive — matched by SIGNS array above)
  { type: "signpost", x: 18, y: 9 },  { type: "signpost", x: 8,  y: 9 },
  { type: "signpost", x: 30, y: 9 },  { type: "signpost", x: 4,  y: 21 },
  { type: "signpost", x: 8,  y: 20 }, { type: "signpost", x: 30, y: 20 },
  // Extra along roads
  { type: "bench",  x: 14, y: 10 }, { type: "bench",  x: 30, y: 10 },
  { type: "haystack",x: 14, y: 20 }, { type: "crate",  x: 29, y: 20 },
];

// ─── FLOWERS ─────────────────────────────────────────────────────
// [x, y, colorIndex] — 0=pink, 1=yellow, 2=blue, 3=purple
export const FLOWER_POSITIONS = [
  // TAVERN garden
  [5,9,0],[8,4,1],[9,4,2],[5,4,3],
  // LIBRARY garden
  [34,9,1],[37,9,2],[34,4,3],[38,4,0],
  // Town square gardens
  [18,11,0],[19,14,1],[23,11,2],[24,14,3],[18,14,0],[25,11,3],
  [20,15,1],[23,15,2],
  // Lake shore
  [3,21,2],[3,26,0],[10,22,3],[10,25,1],
  // FORGE area
  [5,20,1],[9,20,2],[3,17,3],
  // POST OFFICE area
  [34,20,0],[38,20,1],[39,17,2],
  // Roads & paths
  [14,9,0],[29,9,2],[14,20,1],[29,20,3],
  // Southern meadow
  [14,25,0],[16,26,1],[27,25,2],[29,26,3],
];

// ─── TORCHES ─────────────────────────────────────────────────────
export const TORCH_POSITIONS = [
  // Northern road (row 9)
  [6,8],[10,8],[14,8],[25,8],[29,8],[35,8],[39,8],
  // Southern road (row 20)
  [6,19],[10,19],[14,19],[25,19],[29,19],[35,19],[39,19],
  // Vertical road
  [21,6],[22,6],[21,15],[22,15],[21,18],[22,18],
  // Bridge approaches
  [30,9],[33,9],[30,20],[33,20],
  // Town square corners
  [17,11],[26,11],[17,14],[26,14],
];

// ─── EXTRA TREE CLUSTERS ─────────────────────────────────────────
export const EXTRA_TREES = [
  // Near TAVERN
  [11,4],[12,4],[11,5],[12,5],[14,4],[15,4],[14,5],[15,5],
  // Near LIBRARY
  [28,4],[29,4],[28,5],[29,5],
  // Road edges — visual boundaries
  [13,11],[13,12],[30,11],[30,12],
  [13,17],[13,18],[30,17],[30,18],
  // Near lake
  [10,23],[10,24],[11,22],[11,23],
  // Center path
  [19,16],[19,17],[24,16],[24,17],
];

// ─── FOREST PATCHES ──────────────────────────────────────────────
export const FOREST_ZONES = [
  { x: 14, y: 15, w: 3, h: 3 },   // West-central grove
  { x: 26, y: 15, w: 3, h: 3 },   // East-central grove
  { x: 13, y: 24, w: 3, h: 3 },   // Southwest woods
  { x: 27, y: 24, w: 3, h: 3 },   // Southeast woods
];

// ─── COBBLESTONE ZONE (town square) ──────────────────────────────
export const COBBLE_ZONE = { x: 17, y: 11, w: 10, h: 4 };

// ─── FOUNTAIN ────────────────────────────────────────────────────
export const FOUNTAIN_POS = { x: 21, y: 12 };

// ─── EASTER EGG (appears after all coins collected) ──────────────
export const EASTER_EGG_POS = { x: 21, y: 16 };

// ─── PATH DEFINITIONS ────────────────────────────────────────────
export const ROAD_SEGMENTS = [
  // Main horizontal roads
  { axis: "h", fixed: 9,  from: 3, to: 41 },
  { axis: "h", fixed: 10, from: 3, to: 41 },
  { axis: "h", fixed: 20, from: 3, to: 41 },
  { axis: "h", fixed: 21, from: 3, to: 41 },
  // Main vertical road
  { axis: "v", fixed: 21, from: 6, to: 29 },
  { axis: "v", fixed: 22, from: 6, to: 29 },
  // TAVERN connection
  { axis: "v", fixed: 6,  from: 8,  to: 9 }, { axis: "v", fixed: 7,  from: 8,  to: 9 },
  // LIBRARY connection
  { axis: "v", fixed: 35, from: 8,  to: 9 }, { axis: "v", fixed: 36, from: 8,  to: 9 },
  // Bridge approaches
  { axis: "v", fixed: 30, from: 9,  to: 12 }, { axis: "v", fixed: 33, from: 9,  to: 12 },
  { axis: "v", fixed: 30, from: 19, to: 21 }, { axis: "v", fixed: 33, from: 19, to: 21 },
  // Lakeside path
  { axis: "h", fixed: 21, from: 3,  to: 6 },
  // Garden cross-path
  { axis: "h", fixed: 16, from: 18, to: 24 },
  // Southern exploration path
  { axis: "h", fixed: 26, from: 5,  to: 39 },
  { axis: "h", fixed: 27, from: 5,  to: 39 },
];
