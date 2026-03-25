// ─── BUILDINGS ───────────────────────────────────────────────────
// Symmetric layout: mirrored around center axis x=26.5 (54-wide map)
// All doors face DOWN toward the nearest road for easy access.
export const BUILDINGS = [
  // ── Northern row ──
  { id: "resume",   name: "TOWN HALL",   x: 23, y: 2,  w: 8, h: 4, doorX: 27, doorY: 6,  walls: ["#4A6A4A","#3A5A3A","#5A7A5A"], roof: ["#B8860B","#A07008","#C89620"] },
  { id: "about",    name: "TAVERN",      x: 9,  y: 5,  w: 5, h: 3, doorX: 11, doorY: 8,  walls: ["#8B7355","#7A6348","#9C8466"], roof: ["#B83030","#982020","#D04040"], hasChimney: true },
  { id: "projects", name: "LIBRARY",     x: 40, y: 5,  w: 5, h: 3, doorX: 42, doorY: 8,  walls: ["#4A5A7A","#3A4A6A","#5A6A8A"], roof: ["#3050A0","#204088","#4060B0"] },
  // ── Middle row ──
  { id: "skills",   name: "FORGE",       x: 9,  y: 17, w: 5, h: 3, doorX: 11, doorY: 20, walls: ["#8A6A3A","#7A5A2A","#9A7A4A"], roof: ["#555","#444","#666"], hasChimney: true },
  { id: "contact",  name: "POST OFFICE", x: 40, y: 17, w: 5, h: 3, doorX: 42, doorY: 20, walls: ["#6A4A6A","#5A3A5A","#7A5A7A"], roof: ["#6A3A3A","#5A2A2A","#7A4A4A"] },
  // ── Southern row (new) ──
  { id: "observatory", name: "OBSERVATORY", x: 23, y: 29, w: 8, h: 4, doorX: 27, doorY: 33, walls: ["#3A4A6A","#2A3A5A","#4A5A7A"], roof: ["#5566AA","#445588","#6677BB"] },
  { id: "gallery",     name: "GALLERY",     x: 9,  y: 29, w: 5, h: 3, doorX: 11, doorY: 32, walls: ["#7A4A4A","#6A3A3A","#8A5A5A"], roof: ["#CC6644","#AA5533","#DD7755"] },
  { id: "arcade",      name: "ARCADE",      x: 40, y: 29, w: 5, h: 3, doorX: 42, doorY: 32, walls: ["#3A6A6A","#2A5A5A","#4A7A7A"], roof: ["#228888","#117777","#339999"] },
];
