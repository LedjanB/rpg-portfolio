// ─── WATER REGIONS ───────────────────────────────────────────────
// Symmetric lakes — one on each side of the southern area
export const WATER_ZONES = [
  // West lake
  { x: 10, y: 23, w: 4, h: 3 },
  { x: 11, y: 22, w: 3, h: 1 },
  // East lake (mirror)
  { x: 40, y: 23, w: 4, h: 3 },
  { x: 40, y: 22, w: 3, h: 1 },
];

// ─── BRIDGES ─────────────────────────────────────────────────────
export const BRIDGE_POSITIONS = [];

// ─── DOCK ────────────────────────────────────────────────────────
export const DOCK_POSITIONS = [
  [9, 24], [9, 25],   // West dock
  [44, 24], [44, 25], // East dock (mirror)
];

// ─── FISHING SPOTS ──────────────────────────────────────────────
// Dock tiles where the player can fish
export const FISHING_SPOTS = [
  { x: 9, y: 24 }, { x: 9, y: 25 },
  { x: 44, y: 24 }, { x: 44, y: 25 },
];

// ─── COINS ───────────────────────────────────────────────────────
export const COIN_POSITIONS = [
  [11, 8],  [42, 8],   // Near Tavern / Library
  [11, 20], [42, 20],  // Near Forge / Post Office
  [19, 14], [34, 14],  // In the groves
  [15, 26], [38, 26],  // Southern exploration path
  [26, 6],  [27, 36],  // Center top / center south
  [15, 33], [38, 33],  // Near Gallery / Arcade
];

// ─── INTERACTIVE SIGNS ──────────────────────────────────────────
export const SIGNS = [
  { x: 26, y: 7,  text: "Welcome to Portfolio\nVillage! Explore buildings\nto discover my work!" },
  { x: 15, y: 9,  text: "\u2190 TAVERN\nCome in for stories\nabout the developer!" },
  { x: 38, y: 9,  text: "LIBRARY \u2192\nDiscover projects and\ntechnical work inside!" },
  { x: 15, y: 20, text: "\u2190 FORGE\nSkills crafted with\nprecision and care." },
  { x: 38, y: 20, text: "POST OFFICE \u2192\nReach out and get\nin touch anytime!" },
  { x: 12, y: 24, text: "CRYSTAL LAKE\nA peaceful spot to\nthink about code." },
  { x: 41, y: 24, text: "MOONLIGHT POND\nWhere ideas flow\nlike water." },
  // New south quarter
  { x: 26, y: 27, text: "SOUTH QUARTER\nExplore the Observatory,\nGallery, and Arcade!" },
  { x: 15, y: 32, text: "\u2190 GALLERY\nDiscover designs and\ncreative work inside!" },
  { x: 38, y: 32, text: "ARCADE \u2192\nPlay mini-games or\ndiscover fun projects!" },
];

// ─── BREAKABLE PROPS ────────────────────────────────────────────
// Crates and pots that break when interacted with. Respawn after a delay.
export const BREAKABLE_PROPS = [
  // Near Gallery (left)
  { type: "pot", x: 8, y: 31 }, { type: "crate", x: 14, y: 31 },
  // Near Arcade (right, mirror)
  { type: "pot", x: 45, y: 31 }, { type: "crate", x: 39, y: 31 },
  // Southern path
  { type: "pot", x: 19, y: 27 }, { type: "pot", x: 34, y: 27 },
  // Near Observatory
  { type: "crate", x: 22, y: 34 }, { type: "crate", x: 31, y: 34 },
];

// ─── GARDEN PLOTS ───────────────────────────────────────────────
// Plantable garden tiles near the Observatory
export const GARDEN_PLOTS = [
  { x: 24, y: 35 }, { x: 25, y: 35 }, { x: 26, y: 35 },
  { x: 27, y: 35 }, { x: 28, y: 35 }, { x: 29, y: 35 },
  { x: 24, y: 36 }, { x: 25, y: 36 }, { x: 26, y: 36 },
  { x: 27, y: 36 }, { x: 28, y: 36 }, { x: 29, y: 36 },
];

// ─── PROPS ───────────────────────────────────────────────────────
export const PROPS = [
  // Tavern area (left)
  { type: "barrel", x: 8,  y: 7 },  { type: "barrel", x: 14, y: 6 },
  { type: "crate",  x: 14, y: 7 },  { type: "bench",  x: 16, y: 8 },
  // Library area (right, mirror)
  { type: "barrel", x: 45, y: 7 },  { type: "barrel", x: 39, y: 6 },
  { type: "crate",  x: 39, y: 7 },  { type: "bench",  x: 37, y: 8 },
  // Town Hall area (symmetric)
  { type: "well",   x: 24, y: 7 },  { type: "well",   x: 29, y: 7 },
  // ── Grand Town Square ──
  // Outer benches (sit and enjoy the view)
  { type: "bench", x: 20, y: 11 }, { type: "bench", x: 33, y: 11 },
  { type: "bench", x: 20, y: 18 }, { type: "bench", x: 33, y: 18 },
  { type: "bench", x: 23, y: 11 }, { type: "bench", x: 30, y: 11 },
  { type: "bench", x: 23, y: 18 }, { type: "bench", x: 30, y: 18 },
  // Market stalls (4 corners of the square)
  { type: "stall", x: 20, y: 12 }, { type: "stall", x: 33, y: 12 },
  { type: "stall", x: 20, y: 17 }, { type: "stall", x: 33, y: 17 },
  // Inner stalls (flanking the center path)
  { type: "stall", x: 23, y: 13 }, { type: "stall", x: 30, y: 13 },
  { type: "stall", x: 23, y: 16 }, { type: "stall", x: 30, y: 16 },
  // Wells at the entrances
  { type: "well", x: 22, y: 14 }, { type: "well", x: 31, y: 14 },
  // Barrels near stalls
  { type: "barrel", x: 21, y: 13 }, { type: "barrel", x: 32, y: 13 },
  { type: "barrel", x: 21, y: 16 }, { type: "barrel", x: 32, y: 16 },
  // Forge area (left)
  { type: "barrel", x: 8,  y: 19 }, { type: "crate",  x: 8,  y: 18 },
  { type: "barrel", x: 15, y: 18 }, { type: "haystack", x: 16, y: 17 },
  // Post Office area (right, mirror)
  { type: "barrel", x: 45, y: 19 }, { type: "crate",  x: 45, y: 18 },
  { type: "barrel", x: 38, y: 18 }, { type: "haystack", x: 37, y: 17 },
  // Lakeside (symmetric)
  { type: "bench",  x: 8,  y: 22 }, { type: "bench",  x: 45, y: 22 },
  // Signposts
  { type: "signpost", x: 26, y: 7 },
  { type: "signpost", x: 15, y: 9 },  { type: "signpost", x: 38, y: 9 },
  { type: "signpost", x: 15, y: 20 }, { type: "signpost", x: 38, y: 20 },
  { type: "signpost", x: 12, y: 24 }, { type: "signpost", x: 41, y: 24 },
  { type: "signpost", x: 26, y: 27 },
  { type: "signpost", x: 15, y: 32 }, { type: "signpost", x: 38, y: 32 },
  // Road decorations (symmetric)
  { type: "haystack", x: 19, y: 20 }, { type: "haystack", x: 34, y: 20 },
  // Southern area — Gallery props
  { type: "barrel", x: 8,  y: 31 }, { type: "bench", x: 16, y: 32 },
  // Southern area — Arcade props (mirror)
  { type: "barrel", x: 45, y: 31 }, { type: "bench", x: 37, y: 32 },
  // Observatory area
  { type: "bench",  x: 22, y: 33 }, { type: "bench", x: 31, y: 33 },
];

// ─── FLOWERS ─────────────────────────────────────────────────────
// [x, y, colorIndex] — 0=pink, 1=yellow, 2=blue, 3=purple
export const FLOWER_POSITIONS = [
  // Tavern garden (left)
  [10, 9, 0], [13, 4, 1], [14, 4, 2], [10, 4, 3],
  // Library garden (right, mirror)
  [43, 9, 0], [40, 4, 1], [39, 4, 2], [43, 4, 3],
  // West lake shore
  [8, 22, 2], [8, 26, 0], [15, 22, 3], [15, 25, 1],
  // East lake shore (mirror)
  [45, 22, 2], [45, 26, 0], [38, 22, 3], [38, 25, 1],
  // Forge area (left)
  [10, 20, 1], [14, 20, 2], [8, 17, 3],
  // Post Office area (right, mirror)
  [43, 20, 1], [39, 20, 2], [45, 17, 3],
  // Roads (symmetric)
  [19, 9, 0], [34, 9, 2], [19, 20, 1], [34, 20, 3],
  // Southern meadow (symmetric)
  [19, 25, 0], [21, 26, 1], [32, 25, 2], [34, 26, 3],
  // New south area
  [10, 32, 0], [14, 32, 1], [43, 32, 0], [39, 32, 1],
  [24, 37, 2], [29, 37, 3], [25, 37, 0], [28, 37, 1],
];

// ─── LAMP POSTS ─────────────────────────────────────────────────
export const LAMPPOST_POSITIONS = [
  // ── North horizontal road (y=9) — evenly spaced ──
  [6, 8],  [16, 8],  [22, 8],  [31, 8],  [37, 8],  [47, 8],
  // ── Middle horizontal road (y=20) — evenly spaced ──
  [6, 21], [16, 21], [22, 21], [31, 21], [37, 21], [47, 21],
  // ── South horizontal road (y=32) — evenly spaced ──
  [6, 33], [16, 33], [22, 33], [31, 33], [37, 33], [47, 33],
  // ── Center vertical road (x=26/27) ──
  [25, 7],  [28, 7],
  [25, 23], [28, 23],
  [25, 29], [28, 29],
  [25, 35], [28, 35],
  // ── Left vertical road (x=11/12) ──
  [10, 24], [10, 28],
  // ── Right vertical road (x=41/42) ──
  [43, 24], [43, 28],
  // ── Southern exploration path (y=26/27) ──
  [14, 26], [20, 26], [33, 26], [39, 26],
];

// ─── EXTRA TREE CLUSTERS ─────────────────────────────────────────
export const EXTRA_TREES = [
  // Near Tavern (left)
  [16, 4], [17, 4], [16, 5], [17, 5], [19, 4], [20, 4], [19, 5], [20, 5],
  // Near Library (right, mirror)
  [37, 4], [36, 4], [37, 5], [36, 5], [34, 4], [33, 4], [34, 5], [33, 5],
  // Near west lake
  [15, 23], [15, 24], [16, 22], [16, 23],
  // Near east lake (mirror)
  [38, 23], [38, 24], [37, 22], [37, 23],
  // New south area tree borders
  [18, 28], [18, 29], [35, 28], [35, 29],
  [18, 35], [18, 36], [35, 35], [35, 36],
];

// ─── FOREST PATCHES ──────────────────────────────────────────────
export const FOREST_ZONES = [
  { x: 18, y: 24, w: 3, h: 3 },  // Southwest woods
  { x: 33, y: 24, w: 3, h: 3 },  // Southeast woods (mirror)
  // New south forests
  { x: 5,  y: 34, w: 3, h: 3 },  // Far southwest
  { x: 46, y: 34, w: 3, h: 3 },  // Far southeast (mirror)
];

// ─── COBBLESTONE ZONE (grand town square) ────────────────────────
export const COBBLE_ZONE = { x: 19, y: 11, w: 16, h: 8 };

// ─── FOUNTAIN ────────────────────────────────────────────────────
// Grand multi-tier fountain at the heart of the square
export const FOUNTAIN_POS = { x: 26, y: 14 };
// Tiles blocked by the fountain (3x3 area)
export const FOUNTAIN_TILES = [
  [25, 13], [26, 13], [27, 13],
  [25, 14], [26, 14], [27, 14],
  [25, 15], [26, 15], [27, 15],
];

// ─── EASTER EGG (appears after all coins collected) ──────────────
export const EASTER_EGG_POS = { x: 26, y: 16 };

// ─── PATH DEFINITIONS ────────────────────────────────────────────
export const ROAD_SEGMENTS = [
  // Main horizontal roads
  { axis: "h", fixed: 9,  from: 3, to: 50 },
  { axis: "h", fixed: 10, from: 3, to: 50 },
  { axis: "h", fixed: 20, from: 3, to: 50 },
  { axis: "h", fixed: 21, from: 3, to: 50 },
  // New south horizontal road
  { axis: "h", fixed: 32, from: 3, to: 50 },
  { axis: "h", fixed: 33, from: 3, to: 50 },
  // Main vertical road (center — extended south)
  { axis: "v", fixed: 26, from: 6, to: 37 },
  { axis: "v", fixed: 27, from: 6, to: 37 },
  // Tavern connection (left)
  { axis: "v", fixed: 11, from: 8, to: 9 },
  { axis: "v", fixed: 12, from: 8, to: 9 },
  // Library connection (right, mirror)
  { axis: "v", fixed: 42, from: 8, to: 9 },
  { axis: "v", fixed: 41, from: 8, to: 9 },
  // Left side road (connects Forge to Gallery)
  { axis: "v", fixed: 11, from: 20, to: 32 },
  { axis: "v", fixed: 12, from: 20, to: 32 },
  // Right side road (connects Post Office to Arcade, mirror)
  { axis: "v", fixed: 42, from: 20, to: 32 },
  { axis: "v", fixed: 41, from: 20, to: 32 },
  // (garden cross-path absorbed into expanded cobblestone square)
  // Southern exploration path
  { axis: "h", fixed: 26, from: 10, to: 43 },
  { axis: "h", fixed: 27, from: 10, to: 43 },
  // Garden path
  { axis: "h", fixed: 37, from: 23, to: 30 },
];
