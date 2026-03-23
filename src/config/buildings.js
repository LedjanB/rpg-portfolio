// ─── BUILDINGS ───────────────────────────────────────────────────
// All doors face DOWN toward the nearest road for easy access.
//
// Fields:
//   id       — must match a key in PORTFOLIO_CONTENT
//   name     — displayed on the sign above the building
//   x, y     — top-left tile of the building
//   w, h     — size in tiles
//   doorX, doorY — the walkable tile in front of the door (OUTSIDE the building)
//   walls    — [main, dark, light] wall colors
//   roof     — [main, dark, highlight] roof colors
//   hasChimney — shows animated smoke
export const BUILDINGS = [
  { id: "resume",   name: "TOWN HALL",   x: 17, y: 2,  w: 8, h: 4, doorX: 21, doorY: 6,  walls: ["#4A6A4A","#3A5A3A","#5A7A5A"], roof: ["#B8860B","#A07008","#C89620"] },
  { id: "about",    name: "TAVERN",      x: 4,  y: 5,  w: 5, h: 3, doorX: 6,  doorY: 8,  walls: ["#8B7355","#7A6348","#9C8466"], roof: ["#B83030","#982020","#D04040"], hasChimney: true },
  { id: "projects", name: "LIBRARY",     x: 33, y: 5,  w: 5, h: 3, doorX: 35, doorY: 8,  walls: ["#4A5A7A","#3A4A6A","#5A6A8A"], roof: ["#3050A0","#204088","#4060B0"] },
  { id: "skills",   name: "FORGE",       x: 4,  y: 17, w: 5, h: 3, doorX: 6,  doorY: 20, walls: ["#8A6A3A","#7A5A2A","#9A7A4A"], roof: ["#555","#444","#666"], hasChimney: true },
  { id: "contact",  name: "POST OFFICE", x: 33, y: 17, w: 5, h: 3, doorX: 35, doorY: 20, walls: ["#6A4A6A","#5A3A5A","#7A5A7A"], roof: ["#6A3A3A","#5A2A2A","#7A4A4A"] },
];
