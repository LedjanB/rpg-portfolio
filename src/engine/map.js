import { BUILDINGS } from "../config/buildings.js";
import { NPCS } from "../config/npcs.js";
import {
  WATER_ZONES, BRIDGE_POSITIONS, DOCK_POSITIONS, PROPS,
  EXTRA_TREES, FOREST_ZONES, COBBLE_ZONE, FOUNTAIN_POS,
  ROAD_SEGMENTS, BREAKABLE_PROPS, GARDEN_PLOTS,
} from "../config/world.js";
import { COLS, ROWS } from "./constants.js";

// ─── MAP BUILDER ─────────────────────────────────────────────────
// Generates all tile sets from config. Run once at module load.

export function buildMap() {
  // Water set
  const water = new Set();
  WATER_ZONES.forEach(z => { for (let x=z.x; x<z.x+z.w; x++) for (let y=z.y; y<z.y+z.h; y++) water.add(`${x},${y}`); });

  // Bridges
  const bridges = new Set(BRIDGE_POSITIONS.map(([x,y]) => `${x},${y}`));
  bridges.forEach(k => water.delete(k));

  // Sand (auto-generated around water)
  const sand = new Set();
  water.forEach(k => {
    const [wx,wy] = k.split(",").map(Number);
    for (let dx=-1; dx<=1; dx++) for (let dy=-1; dy<=1; dy++) {
      const nk = `${wx+dx},${wy+dy}`;
      if (!water.has(nk) && !bridges.has(nk)) sand.add(nk);
    }
  });

  // Reeds & lilypads (random on water edges)
  const reeds = [], lilypads = [];
  water.forEach(k => {
    const [wx,wy] = k.split(",").map(Number);
    let edge = false;
    for (let dx=-1; dx<=1; dx++) for (let dy=-1; dy<=1; dy++) if (!water.has(`${wx+dx},${wy+dy}`)) edge = true;
    if (edge && Math.random() < 0.4) reeds.push([wx,wy]);
    if (!edge && Math.random() < 0.15) lilypads.push([wx,wy]);
  });

  // Garden soil set
  const gardenSoil = new Set();
  GARDEN_PLOTS.forEach(p => gardenSoil.add(`${p.x},${p.y}`));

  // Blocked tile set (buildings, water, sand, dock) — used to filter trees
  const blocked = new Set();
  BUILDINGS.forEach(b => {
    for (let dy=-1; dy<=b.h; dy++) for (let dx=-1; dx<=b.w; dx++) blocked.add(`${b.x+dx},${b.y+dy}`);
    blocked.add(`${b.doorX},${b.doorY}`);
  });
  water.forEach(k => blocked.add(k));
  sand.forEach(k => blocked.add(k));
  DOCK_POSITIONS.forEach(([x,y]) => blocked.add(`${x},${y}`));

  // Trees: borders + extra clusters + forests, filtered against blocked tiles
  const rawTrees = [];
  for (let x=0; x<COLS; x++) { for (let y=0; y<2; y++) rawTrees.push([x,y]); for (let y=ROWS-2; y<ROWS; y++) rawTrees.push([x,y]); }
  for (let y=2; y<ROWS-2; y++) { rawTrees.push([0,y],[1,y],[COLS-1,y],[COLS-2,y]); }
  for (let y=2; y<6; y++) rawTrees.push([2,y],[3,y],[COLS-3,y],[COLS-4,y]);
  for (let y=ROWS-6; y<ROWS-2; y++) rawTrees.push([2,y],[3,y],[COLS-3,y],[COLS-4,y]);
  EXTRA_TREES.forEach(t => rawTrees.push(t));
  FOREST_ZONES.forEach(z => { for (let x=z.x; x<z.x+z.w; x++) for (let y=z.y; y<z.y+z.h; y++) rawTrees.push([x,y]); });
  const trees = rawTrees.filter(([x,y]) => !blocked.has(`${x},${y}`) && !gardenSoil.has(`${x},${y}`) && x>=0 && x<COLS && y>=0 && y<ROWS);

  // Paths
  const paths = new Set();
  ROAD_SEGMENTS.forEach(seg => {
    if (seg.axis === "h") for (let x=seg.from; x<=seg.to; x++) paths.add(`${x},${seg.fixed}`);
    else for (let y=seg.from; y<=seg.to; y++) paths.add(`${seg.fixed},${y}`);
  });
  // Town square paths
  for (let x=COBBLE_ZONE.x; x<COBBLE_ZONE.x+COBBLE_ZONE.w; x++)
    for (let y=COBBLE_ZONE.y; y<COBBLE_ZONE.y+COBBLE_ZONE.h; y++) paths.add(`${x},${y}`);
  bridges.forEach(k => paths.add(k));
  water.forEach(k => paths.delete(k));
  sand.forEach(k => paths.delete(k));

  // Cobblestone
  const cobble = new Set();
  for (let x=COBBLE_ZONE.x; x<COBBLE_ZONE.x+COBBLE_ZONE.w; x++)
    for (let y=COBBLE_ZONE.y; y<COBBLE_ZONE.y+COBBLE_ZONE.h; y++) cobble.add(`${x},${y}`);

  // Fences around buildings (auto-generated, filtered for doors/paths)
  const fences = [];
  BUILDINGS.forEach(b => {
    for (let dx=-1; dx<=b.w; dx++) { fences.push([b.x+dx, b.y-1]); fences.push([b.x+dx, b.y+b.h]); }
    for (let dy=0; dy<b.h; dy++) { fences.push([b.x-1, b.y+dy]); fences.push([b.x+b.w, b.y+dy]); }
  });
  const filteredFences = fences.filter(([fx,fy]) => {
    const k = `${fx},${fy}`;
    if (paths.has(k) || cobble.has(k) || blocked.has(k)) return false;
    if (fx<1 || fy<1 || fx>=COLS-1 || fy>=ROWS-1) return false;
    for (const b of BUILDINGS) if (Math.abs(fx-b.doorX)<=1 && Math.abs(fy-b.doorY)<=1) return false;
    return true;
  });

  // Collision grid
  const col = Array.from({length:ROWS}, () => Array(COLS).fill(0));
  trees.forEach(([x,y]) => { if (y<ROWS && x<COLS) col[y][x] = 1; });
  water.forEach(k => { const [x,y]=k.split(",").map(Number); if (y<ROWS && x<COLS) col[y][x] = 2; });
  BUILDINGS.forEach(b => { for (let dy=0; dy<b.h; dy++) for (let dx=0; dx<b.w; dx++) { const mx=b.x+dx, my=b.y+dy; if (my<ROWS && mx<COLS) col[my][mx] = 1; }});
  col[FOUNTAIN_POS.y][FOUNTAIN_POS.x] = 1;
  bridges.forEach(k => { const [x,y]=k.split(",").map(Number); col[y][x] = 0; });
  BUILDINGS.forEach(b => { if (b.doorY<ROWS && b.doorX<COLS) col[b.doorY][b.doorX] = 0; });
  DOCK_POSITIONS.forEach(([x,y]) => { if (y<ROWS && x<COLS) col[y][x] = 0; });
  PROPS.forEach(p => { if (p.y<ROWS && p.x<COLS && p.type !== "signpost") col[p.y][p.x] = 1; });
  NPCS.forEach(n => { if (n.y<ROWS && n.x<COLS) col[n.y][n.x] = 1; });
  // Note: BREAKABLE_PROPS collision is handled dynamically by breakableBlockers in collision.js

  return { water, bridges, sand, reeds, lilypads, trees, paths, cobble, filteredFences, gardenSoil, col };
}

export const MAP = buildMap();
