// ─── BUILDINGS ───────────────────────────────────────────────────
// To add a building: push a new object. The system auto-generates
// fences, collision, and door connections.
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
  { id: "about",    name: "TAVERN",      x: 4,  y: 4,  w: 5, h: 3, doorX: 6,  doorY: 7,  walls: ["#8B7355","#7A6348","#9C8466"], roof: ["#B83030","#982020","#D04040"], hasChimney: true },
  { id: "projects", name: "LIBRARY",     x: 34, y: 4,  w: 5, h: 3, doorX: 36, doorY: 7,  walls: ["#4A5A7A","#3A4A6A","#5A6A8A"], roof: ["#3050A0","#204088","#4060B0"] },
  { id: "resume",   name: "TOWN HALL",   x: 18, y: 3,  w: 7, h: 4, doorX: 21, doorY: 7,  walls: ["#4A6A4A","#3A5A3A","#5A7A5A"], roof: ["#B8860B","#A07008","#C89620"] },
  { id: "skills",   name: "FORGE",       x: 4,  y: 24, w: 5, h: 3, doorX: 6,  doorY: 24, walls: ["#8A6A3A","#7A5A2A","#9A7A4A"], roof: ["#555","#444","#666"], hasChimney: true },
  { id: "contact",  name: "POST OFFICE", x: 34, y: 24, w: 5, h: 3, doorX: 36, doorY: 24, walls: ["#6A4A6A","#5A3A5A","#7A5A7A"], roof: ["#6A3A3A","#5A2A2A","#7A4A4A"] },
];
