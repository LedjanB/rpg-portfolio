import { T, CW, CH, C } from "../engine/constants.js";

// Helper to darken/lighten a hex color
function shade(hex, amt) {
  if (hex.startsWith("rgb")) {
    const m = hex.match(/(\d+)/g);
    if (!m) return hex;
    return `rgb(${Math.max(0,Math.min(255,+m[0]+amt))},${Math.max(0,Math.min(255,+m[1]+amt))},${Math.max(0,Math.min(255,+m[2]+amt))})`;
  }
  let r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), bl = parseInt(hex.slice(5,7),16);
  return `rgb(${Math.max(0,Math.min(255,r+amt))},${Math.max(0,Math.min(255,g+amt))},${Math.max(0,Math.min(255,bl+amt))})`;
}

// ── Draw brick/stone texture on walls ──
function drawWallTexture(ctx, x, y, w, h, baseColor, style) {
  ctx.fillStyle = baseColor;
  ctx.fillRect(x, y, w, h);

  if (style === "brick") {
    const bw = 10, bh = 5;
    for (let row = 0; row < Math.ceil(h / bh); row++) {
      const offset = (row % 2) * (bw / 2);
      for (let col = -1; col < Math.ceil(w / bw) + 1; col++) {
        const bx = x + col * bw + offset;
        const by = y + row * bh;
        if (bx + bw < x || bx > x + w || by + bh < y || by > y + h) continue;
        // Mortar lines
        ctx.fillStyle = shade(baseColor, -18);
        ctx.fillRect(Math.max(bx, x), by, Math.min(bw, x + w - bx), 1);
        ctx.fillRect(bx, Math.max(by, y), 1, Math.min(bh, y + h - by));
        // Brick face variation
        const v = ((col * 7 + row * 13) % 5) * 4 - 8;
        ctx.fillStyle = shade(baseColor, v);
        ctx.fillRect(Math.max(bx + 1, x), Math.max(by + 1, y),
          Math.min(bw - 2, x + w - bx - 1), Math.min(bh - 2, y + h - by - 1));
      }
    }
  } else if (style === "stone") {
    // Irregular stone blocks
    const stones = [];
    for (let sy = 0; sy < h; sy += 8 + (sy % 3) * 2) {
      for (let sx = 0; sx < w; sx += 10 + ((sx + sy) % 4) * 3) {
        stones.push({ x: sx, y: sy, w: 8 + ((sx * 3 + sy * 7) % 5), h: 6 + ((sx + sy * 3) % 3) });
      }
    }
    stones.forEach(s => {
      const v = ((s.x * 3 + s.y * 7) % 7) * 3 - 9;
      ctx.fillStyle = shade(baseColor, v);
      ctx.fillRect(x + s.x + 1, y + s.y + 1,
        Math.min(s.w - 1, w - s.x - 1), Math.min(s.h - 1, h - s.y - 1));
      ctx.fillStyle = shade(baseColor, -20);
      ctx.fillRect(x + s.x, y + s.y, Math.min(s.w, w - s.x), 1);
      ctx.fillRect(x + s.x, y + s.y, 1, Math.min(s.h, h - s.y));
    });
  } else if (style === "plaster") {
    // Smooth plaster with subtle variation
    for (let py2 = 0; py2 < h; py2 += 4) {
      for (let px2 = 0; px2 < w; px2 += 4) {
        const v = ((px2 * 5 + py2 * 11) % 7) - 3;
        if (v !== 0) {
          ctx.fillStyle = shade(baseColor, v);
          ctx.fillRect(x + px2, y + py2, 4, 4);
        }
      }
    }
  }
}

// ── Draw roof tiles ──
function drawRoofTiles(ctx, x1, y1, x2, y2, x3, y3, color, darkColor, isRight) {
  // Fill the triangle
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath(); ctx.fill();

  // Draw individual tile rows
  const rows = 6;
  for (let r = 0; r < rows; r++) {
    const t1 = r / rows, t2 = (r + 1) / rows;
    const rowY1 = y2 + (y1 - y2) * t1;
    const rowY2 = y2 + (y1 - y2) * t2;
    const rowLeft1 = x2 + (x1 - x2) * t1;
    const rowLeft2 = x2 + (x1 - x2) * t2;
    const rowRight1 = x2 + (x3 - x2) * t1;
    const rowRight2 = x2 + (x3 - x2) * t2;
    const rowW = rowRight1 - rowLeft1;
    const tileW = Math.max(8, rowW / Math.max(1, Math.floor(rowW / 10)));
    // Tile row separator
    ctx.fillStyle = darkColor;
    ctx.fillRect(rowLeft2, rowY2 - 1, rowRight2 - rowLeft2, 2);
    // Individual tiles with scallop effect
    for (let tx = 0; tx < rowW; tx += tileW) {
      const v = ((r * 5 + Math.floor(tx / tileW) * 7) % 5) * 3 - 6;
      ctx.fillStyle = shade(color, v);
      const tileX = rowLeft1 + tx;
      const tw = Math.min(tileW - 1, rowRight1 - tileX - 1);
      if (tw > 1) {
        ctx.fillRect(tileX + 1, rowY1 + 1, tw, rowY2 - rowY1 - 2);
      }
    }
  }
}

// ── Draw a detailed window ──
function drawWindow(ctx, x, y, w, h, frameColor, style) {
  // Window recess shadow
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  // Glass
  ctx.fillStyle = "#1a2040";
  ctx.fillRect(x, y, w, h);
  // Warm interior light
  ctx.fillStyle = "#FFE088";
  ctx.globalAlpha = 0.45;
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#FFF8D0";
  ctx.fillRect(x + 1, y + 1, w * 0.4, h * 0.4);
  ctx.globalAlpha = 1;

  if (style === "cross") {
    // Cross frame
    ctx.fillStyle = frameColor;
    ctx.fillRect(x + w / 2 - 1, y, 2, h);
    ctx.fillRect(x, y + h / 2 - 1, w, 2);
  } else if (style === "arch") {
    // Arched top
    ctx.fillStyle = frameColor;
    ctx.fillRect(x, y + h / 2 - 1, w, 2);
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 3, w / 2 + 1, Math.PI, 0);
    ctx.lineWidth = 2; ctx.strokeStyle = frameColor; ctx.stroke();
    ctx.fillRect(x + w / 2 - 1, y + 3, 2, h - 3);
  } else if (style === "tall") {
    // Tall window with 3 horizontal bars
    ctx.fillStyle = frameColor;
    ctx.fillRect(x + w / 2 - 1, y, 2, h);
    for (let i = 1; i <= 3; i++) {
      ctx.fillRect(x, y + (h * i / 4) - 1, w, 2);
    }
  } else if (style === "round") {
    // Round/porthole window
    ctx.fillStyle = "#0a0a1a";
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w / 2 + 1, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a2040";
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FFE088";
    ctx.globalAlpha = 0.45;
    ctx.beginPath(); ctx.arc(x + w / 2, y + h / 2, w / 2 - 1, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = frameColor;
    ctx.fillRect(x, y + h / 2 - 1, w, 2);
    ctx.fillRect(x + w / 2 - 1, y, 2, h);
  }

  // Frame border
  ctx.fillStyle = shade(frameColor, -20);
  ctx.fillRect(x - 1, y - 1, w + 2, 1);
  ctx.fillRect(x - 1, y + h, w + 2, 1);
  ctx.fillRect(x - 1, y, 1, h);
  ctx.fillRect(x + w, y, 1, h);
  // Window sill
  ctx.fillStyle = shade(frameColor, 15);
  ctx.fillRect(x - 2, y + h, w + 4, 3);
}

// ── Draw shutters ──
function drawShutters(ctx, x, y, w, h, color) {
  const sw = 5;
  // Left shutter
  ctx.fillStyle = color;
  ctx.fillRect(x - sw - 1, y - 1, sw, h + 2);
  ctx.fillStyle = shade(color, -15);
  for (let sy = y + 2; sy < y + h - 1; sy += 3) {
    ctx.fillRect(x - sw, sy, sw - 2, 1);
  }
  // Right shutter
  ctx.fillStyle = color;
  ctx.fillRect(x + w + 1, y - 1, sw, h + 2);
  ctx.fillStyle = shade(color, -15);
  for (let sy = y + 2; sy < y + h - 1; sy += 3) {
    ctx.fillRect(x + w + 2, sy, sw - 2, 1);
  }
  // Shutter hinges
  ctx.fillStyle = "#333";
  ctx.fillRect(x - 1, y + 3, 1, 2);
  ctx.fillRect(x - 1, y + h - 5, 1, 2);
  ctx.fillRect(x + w, y + 3, 1, 2);
  ctx.fillRect(x + w, y + h - 5, 1, 2);
}

// ── Draw flower box ──
function drawFlowerBox(ctx, x, y, w) {
  // Box
  ctx.fillStyle = "#5a3a1a";
  ctx.fillRect(x, y, w, 5);
  ctx.fillStyle = "#4a2a10";
  ctx.fillRect(x, y, w, 1);
  // Soil
  ctx.fillStyle = "#3a2a0a";
  ctx.fillRect(x + 1, y + 1, w - 2, 2);
  // Flowers
  const flowerColors = [C.flower1, C.flower3, C.flower4, C.flower2];
  for (let i = 0; i < Math.floor(w / 5); i++) {
    const fx = x + 2 + i * 5;
    ctx.fillStyle = "#3a7a2a";
    ctx.fillRect(fx + 1, y - 2, 1, 3);
    ctx.fillStyle = flowerColors[i % 4];
    ctx.fillRect(fx, y - 4, 3, 3);
  }
}

// ── Per-building unique decorations ──
function drawUniqueFeatures(ctx, b, px, py, w, h) {
  const wallTop = py + T;
  const wallH = h - T - 8;

  if (b.id === "resume") {
    // TOWN HALL — columns, banner, clock
    // Front columns
    const colW = 5, colH = wallH - 4;
    for (const cx2 of [px + 8, px + w - 13]) {
      ctx.fillStyle = "#ccc";
      ctx.fillRect(cx2, wallTop + 2, colW, colH);
      ctx.fillStyle = "#ddd";
      ctx.fillRect(cx2 + 1, wallTop + 2, colW - 2, colH);
      // Column base
      ctx.fillStyle = "#bbb";
      ctx.fillRect(cx2 - 1, wallTop + colH, colW + 2, 3);
      // Column capital
      ctx.fillStyle = "#bbb";
      ctx.fillRect(cx2 - 2, wallTop, colW + 4, 3);
      ctx.fillRect(cx2 - 1, wallTop + 3, colW + 2, 2);
    }
    // Clock on roof peak
    const clockX = px + w / 2, clockY = py + 2;
    ctx.fillStyle = "#ddd";
    ctx.beginPath(); ctx.arc(clockX, clockY, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#222";
    ctx.beginPath(); ctx.arc(clockX, clockY, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#eee";
    ctx.beginPath(); ctx.arc(clockX, clockY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#333";
    ctx.fillRect(clockX - 0.5, clockY - 4, 1, 4);
    ctx.fillRect(clockX, clockY - 0.5, 3, 1);
    // Banner/flag on top
    ctx.fillStyle = C.uiGold;
    ctx.fillRect(px + w / 2 - 1, py - 14, 2, 8);
    ctx.fillStyle = "#cc3333";
    ctx.fillRect(px + w / 2 + 1, py - 14, 8, 5);
    ctx.fillStyle = "#aa2222";
    ctx.fillRect(px + w / 2 + 1, py - 12, 8, 1);
  }

  if (b.id === "about") {
    // TAVERN — hanging tankard sign, warm glow, barrel
    // Hanging sign with tankard icon
    const signX = px + w - 18;
    ctx.fillStyle = "#333";
    ctx.fillRect(signX + 6, wallTop - 2, 2, 8);
    ctx.fillStyle = "#6B4226";
    ctx.fillRect(signX, wallTop + 5, 14, 10);
    ctx.fillStyle = "#D4B46A";
    // Tankard shape
    ctx.fillRect(signX + 4, wallTop + 7, 6, 6);
    ctx.fillRect(signX + 3, wallTop + 8, 2, 4);
    // Warm glow from windows
    ctx.fillStyle = "rgba(255,180,60,0.06)";
    ctx.fillRect(px - 4, wallTop, w + 8, wallH + 4);
  }

  if (b.id === "projects") {
    // LIBRARY — book stacks visible, pillar details
    // Small decorative pilasters
    ctx.fillStyle = shade(b.walls[0], 20);
    ctx.fillRect(px + 6, wallTop + 2, 3, wallH - 4);
    ctx.fillRect(px + w - 9, wallTop + 2, 3, wallH - 4);
    // Books visible on second floor (above beam)
    const shelfY = wallTop + 4;
    const bookColors = ["#8B2020", "#204080", "#206020", "#806020", "#602060"];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = bookColors[i];
      ctx.fillRect(px + 14 + i * 6, shelfY, 4, 8);
      ctx.fillStyle = shade(bookColors[i], 30);
      ctx.fillRect(px + 14 + i * 6, shelfY, 4, 1);
    }
  }

  if (b.id === "skills") {
    // FORGE — anvil silhouette, orange glow, sparks
    // Orange glow from forge fire
    ctx.fillStyle = "rgba(255,100,20,0.08)";
    ctx.fillRect(px - 4, wallTop, w + 8, wallH + 4);
    // Anvil on wall
    const anvilX = px + w / 2 - 6;
    ctx.fillStyle = "#444";
    ctx.fillRect(anvilX, wallTop + wallH - 14, 12, 3);
    ctx.fillRect(anvilX + 2, wallTop + wallH - 18, 8, 4);
    ctx.fillRect(anvilX + 4, wallTop + wallH - 11, 4, 5);
    // Hammer
    ctx.fillStyle = "#555";
    ctx.fillRect(anvilX + 12, wallTop + wallH - 20, 2, 10);
    ctx.fillRect(anvilX + 10, wallTop + wallH - 22, 6, 3);
  }

  if (b.id === "contact") {
    // POST OFFICE — mailbox, letter slot, flag
    // Mail slot on wall
    ctx.fillStyle = "#333";
    ctx.fillRect(px + w / 2 - 8, wallTop + wallH - 10, 16, 2);
    ctx.fillStyle = C.uiGold;
    ctx.fillRect(px + w / 2 - 6, wallTop + wallH - 9, 12, 1);
    // Small flag
    ctx.fillStyle = "#333";
    ctx.fillRect(px + w - 10, wallTop - 4, 2, 18);
    ctx.fillStyle = "#4466aa";
    ctx.fillRect(px + w - 8, wallTop - 4, 7, 5);
    ctx.fillStyle = "#3355aa";
    ctx.fillRect(px + w - 8, wallTop - 2, 7, 1);
  }

  if (b.id === "observatory") {
    // OBSERVATORY — dome on top, telescope, stars
    // Dome
    const domeX = px + w / 2, domeY = py - 6;
    ctx.fillStyle = "#5566AA";
    ctx.beginPath(); ctx.arc(domeX, domeY + 4, 16, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#6677BB";
    ctx.beginPath(); ctx.arc(domeX, domeY + 4, 14, Math.PI, Math.PI * 1.5); ctx.fill();
    // Dome slit
    ctx.fillStyle = "#334466";
    ctx.fillRect(domeX - 2, domeY - 10, 4, 12);
    // Telescope poking out
    ctx.fillStyle = "#888";
    ctx.fillRect(domeX - 1, domeY - 14, 3, 6);
    ctx.fillStyle = "#999";
    ctx.fillRect(domeX - 2, domeY - 14, 5, 2);
    // Stars decoration on wall
    ctx.fillStyle = C.uiGold;
    ctx.globalAlpha = 0.6;
    const starPos = [[12, 8], [w-16, 6], [20, 12], [w-24, 14]];
    starPos.forEach(([sx, sy]) => {
      ctx.fillRect(px + sx, wallTop + sy, 2, 2);
      ctx.fillRect(px + sx - 1, wallTop + sy + 0.5, 4, 1);
      ctx.fillRect(px + sx + 0.5, wallTop + sy - 1, 1, 4);
    });
    ctx.globalAlpha = 1;
  }

  if (b.id === "gallery") {
    // GALLERY — paintings visible, artistic trim
    // Small painting frames on exterior
    const paintings = [
      { x: 8, y: 6, w: 10, h: 8, color: "#cc4444" },
      { x: w - 20, y: 6, w: 10, h: 8, color: "#4444cc" },
    ];
    paintings.forEach(p => {
      ctx.fillStyle = C.uiGold;
      ctx.fillRect(px + p.x - 1, wallTop + p.y - 1, p.w + 2, p.h + 2);
      ctx.fillStyle = p.color;
      ctx.fillRect(px + p.x, wallTop + p.y, p.w, p.h);
      // Simple art in frame
      ctx.fillStyle = shade(p.color, 40);
      ctx.fillRect(px + p.x + 2, wallTop + p.y + 2, p.w - 4, p.h / 2);
      ctx.fillStyle = shade(p.color, -20);
      ctx.fillRect(px + p.x + 1, wallTop + p.y + p.h / 2, p.w - 2, 2);
    });
    // Decorative trim/molding
    ctx.fillStyle = shade(b.walls[0], 30);
    ctx.fillRect(px + 4, wallTop + wallH / 2, w - 8, 2);
  }

  if (b.id === "arcade") {
    // ARCADE — colorful accents, pixel decoration
    // Colorful pixel dots on facade
    const colors = ["#ff4444", "#44ff44", "#4444ff", "#ffff44", "#ff44ff", "#44ffff"];
    for (let i = 0; i < 6; i++) {
      const dotX = px + 10 + (i % 3) * ((w - 20) / 2);
      const dotY = wallTop + 5 + Math.floor(i / 3) * 8;
      ctx.fillStyle = colors[i];
      ctx.globalAlpha = 0.5;
      ctx.fillRect(dotX, dotY, 3, 3);
    }
    ctx.globalAlpha = 1;
    // Arcade marquee above door
    const dx = b.doorX * T - (b.x * T);
    ctx.fillStyle = "#FFD93D";
    ctx.fillRect(px + dx - 6, wallTop + wallH - 4, 44, 3);
    ctx.fillStyle = "#FF6B8A";
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(px + dx - 4 + i * 7, wallTop + wallH - 4, 4, 3);
    }
  }
}

// ── Building pre-render cache ──
// Buildings are completely static — render once to offscreen canvas, then blit.
// Saves hundreds of fillRect/arc calls per building per frame.
const _buildingCache = new Map();
const PADDING = 30; // extra pixels around building for overhangs, shadows, decorations

function getOrCreateBuildingCache(b) {
  if (_buildingCache.has(b.id)) return _buildingCache.get(b.id);

  const w = b.w * T, h = b.h * T;
  // Generous bounds to capture roof overhangs, shadows, chimneys, decorations
  const cw = w + PADDING * 2 + 20;
  const ch = h + PADDING * 2 + 30;
  const offscreen = document.createElement("canvas");
  offscreen.width = cw;
  offscreen.height = ch;
  const octx = offscreen.getContext("2d");
  octx.imageSmoothingEnabled = false;

  // Render the building at a local offset so everything fits
  // localPx/localPy correspond to where px,py would be in the offscreen canvas
  const localPx = PADDING + 10;
  const localPy = PADDING + 20;
  // Door needs special handling — compute local door X
  const localDoorX = (b.doorX - b.x) * T + localPx;

  _renderBuilding(octx, b, localPx, localPy, w, h, localDoorX);

  const entry = { canvas: offscreen, ox: localPx, oy: localPy };
  _buildingCache.set(b.id, entry);
  return entry;
}

export function building(ctx, b, cx, cy) {
  const px = b.x * T - cx, py = b.y * T - cy, w = b.w * T, h = b.h * T;
  if (px + w < -T - PADDING || px > CW + T + PADDING || py + h < -T - PADDING || py > CH + T + PADDING) return;

  const cached = getOrCreateBuildingCache(b);
  // Draw the cached canvas, offsetting so building lines up with world position
  ctx.drawImage(cached.canvas, px - cached.ox, py - cached.oy);
}

// Clear cache (call on cleanup)
export function clearBuildingCache() {
  _buildingCache.clear();
}

function _renderBuilding(ctx, b, px, py, w, h, dx) {

  const wallTop = py + T;
  const wallH = h - T - 8;
  const roofOH = 10; // roof overhang

  // Determine wall texture style per building
  const wallStyle = (b.id === "resume" || b.id === "observatory") ? "stone"
    : (b.id === "skills") ? "brick"
    : (b.id === "about" || b.id === "gallery") ? "brick"
    : "plaster";

  // ── Shadow ──
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(px + 5, py + h - 2, w, 10);

  // ── Stone foundation ──
  ctx.fillStyle = "#555";
  ctx.fillRect(px - 3, py + h - 10, w + 6, 12);
  ctx.fillStyle = "#666";
  ctx.fillRect(px - 2, py + h - 9, w + 4, 10);
  // Foundation stones
  for (let fx = 0; fx < w + 4; fx += 8) {
    const v = (fx % 3) * 3;
    ctx.fillStyle = `rgb(${95 + v},${95 + v},${95 + v})`;
    ctx.fillRect(px - 2 + fx + 1, py + h - 8, 6, 4);
    ctx.fillRect(px - 2 + fx + (fx % 2 ? 3 : 0), py + h - 4, 6, 3);
  }
  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(px - 3, py + h - 10, w + 6, 1);

  // ── Main walls with texture ──
  drawWallTexture(ctx, px, wallTop, w, wallH, b.walls[0], wallStyle);

  // ── Wall shading (depth) ──
  ctx.fillStyle = b.walls[1];
  ctx.globalAlpha = 0.5;
  ctx.fillRect(px, wallTop, 4, wallH);
  ctx.globalAlpha = 1;
  ctx.fillStyle = b.walls[2];
  ctx.globalAlpha = 0.5;
  ctx.fillRect(px + w - 4, wallTop, 4, wallH);
  ctx.globalAlpha = 1;

  // ── Timber frame ──
  const timberC = shade(b.walls[1], -35);
  ctx.fillStyle = timberC;
  // Horizontal beams
  ctx.fillRect(px - 1, wallTop - 1, w + 2, 3);
  ctx.fillRect(px - 1, py + h - 10, w + 2, 3);
  if (wallH > 40) {
    ctx.fillRect(px, wallTop + Math.floor(wallH / 2), w, 2);
  }
  // Vertical beams / posts
  ctx.fillRect(px - 1, wallTop, 4, wallH);
  ctx.fillRect(px + w - 3, wallTop, 4, wallH);
  // Beam highlight
  ctx.fillStyle = shade(timberC, 15);
  ctx.fillRect(px, wallTop, 2, wallH);
  ctx.fillRect(px + w - 2, wallTop, 2, wallH);

  // ── Corner stones (quoins) ──
  for (let qy = wallTop + 2; qy < py + h - 12; qy += 9) {
    const alt = ((qy - wallTop) / 9 | 0) % 2;
    ctx.fillStyle = "#777";
    ctx.fillRect(px - 2, qy, 6 - alt * 2, 5);
    ctx.fillRect(px + w - 4 + alt * 2, qy, 6 - alt * 2, 5);
    ctx.fillStyle = "#888";
    ctx.fillRect(px - 1, qy + 1, 4 - alt * 2, 3);
    ctx.fillRect(px + w - 3 + alt * 2, qy + 1, 4 - alt * 2, 3);
  }

  // ── Roof ──
  const roofPeakY = py - 12;
  const roofBaseY = wallTop + 2;
  // Left face
  drawRoofTiles(ctx,
    px - roofOH, roofBaseY,
    px + w / 2, roofPeakY,
    px + w / 2, roofBaseY,
    b.roof[0], b.roof[1], false);
  // Right face (lighter)
  drawRoofTiles(ctx,
    px + w + roofOH, roofBaseY,
    px + w / 2, roofPeakY,
    px + w / 2, roofBaseY,
    b.roof[2] || shade(b.roof[0], 15), b.roof[1], true);
  // Ridge cap
  ctx.fillStyle = shade(b.roof[0], 35);
  ctx.fillRect(px + w / 2 - 3, roofPeakY - 1, 6, 4);
  ctx.fillStyle = shade(b.roof[0], 50);
  ctx.fillRect(px + w / 2 - 2, roofPeakY, 4, 2);
  // Eave / fascia board
  ctx.fillStyle = shade(b.roof[1], -10);
  ctx.fillRect(px - roofOH - 1, roofBaseY - 1, w + roofOH * 2 + 2, 4);
  ctx.fillStyle = shade(b.roof[0], 20);
  ctx.fillRect(px - roofOH, roofBaseY, w + roofOH * 2, 2);

  // ── Chimney ──
  if (b.hasChimney) {
    const chX = px + w - 24, chY = roofPeakY + 4;
    // Chimney body (brick)
    ctx.fillStyle = "#6a3a3a";
    ctx.fillRect(chX, chY, 14, roofBaseY - chY + 4);
    // Brick lines
    for (let cy2 = chY + 3; cy2 < roofBaseY; cy2 += 4) {
      const off = ((cy2 - chY) / 4 | 0) % 2 ? 4 : 0;
      ctx.fillStyle = "#5a2a2a";
      ctx.fillRect(chX, cy2, 14, 1);
      ctx.fillRect(chX + off + 3, cy2 - 3, 1, 4);
      ctx.fillRect(chX + off + 9, cy2 - 3, 1, 4);
    }
    // Chimney cap
    ctx.fillStyle = "#555";
    ctx.fillRect(chX - 2, chY - 3, 18, 4);
    ctx.fillStyle = "#666";
    ctx.fillRect(chX - 1, chY - 2, 16, 2);
    // Chimney pot
    ctx.fillStyle = "#5a3a3a";
    ctx.fillRect(chX + 3, chY - 6, 8, 4);
  }

  // ── Windows ──
  const winY = wallTop + 8;
  const numWin = Math.min(b.w - 2, b.w >= 8 ? 5 : 3);
  const winW = 14, winH = 12;
  const margin = 16;
  const spacing = (w - margin * 2 - winW) / Math.max(numWin - 1, 1);
  const winStyles = {
    resume: "arch", about: "cross", projects: "tall",
    skills: "cross", contact: "cross", observatory: "round",
    gallery: "arch", arcade: "cross",
  };
  const winStyle = winStyles[b.id] || "cross";
  const shutterColor = shade(b.roof[0], -15);

  for (let i = 0; i < numWin; i++) {
    const wx = px + margin + i * spacing;
    drawWindow(ctx, wx, winY, winW, winH, b.walls[1], winStyle);
    drawShutters(ctx, wx, winY, winW, winH, shutterColor);
    drawFlowerBox(ctx, wx - 2, winY + winH + 3, winW + 4);
  }

  // ── Second row of windows for tall buildings ──
  if (wallH > 50) {
    const win2Y = winY + winH + 20;
    for (let i = 0; i < numWin; i++) {
      const wx = px + margin + i * spacing;
      drawWindow(ctx, wx, win2Y, winW, winH, b.walls[1], winStyle);
    }
  }

  // ── Door ──
  const fY = py + h - T - 6;

  // Door awning (striped)
  ctx.fillStyle = C.awning;
  ctx.fillRect(dx - 6, fY - 6, T + 12, 8);
  ctx.fillStyle = C.awningS;
  ctx.fillRect(dx - 6, fY, T + 12, 2);
  // Awning stripes
  for (let sx = 0; sx < T + 12; sx += 6) {
    ctx.fillStyle = shade(C.awning, -20);
    ctx.fillRect(dx - 6 + sx, fY - 6, 3, 8);
  }
  // Awning edge fringe
  ctx.fillStyle = shade(C.awning, 20);
  ctx.fillRect(dx - 6, fY - 6, T + 12, 2);
  // Support brackets
  ctx.fillStyle = "#333";
  ctx.fillRect(dx - 4, fY - 4, 2, 8);
  ctx.fillRect(dx + T + 2, fY - 4, 2, 8);

  // Door frame
  ctx.fillStyle = "#1a0a00";
  ctx.fillRect(dx + 3, fY + 2, 26, 30);
  // Door body
  ctx.fillStyle = C.door;
  ctx.fillRect(dx + 5, fY + 4, 22, 28);
  // Door panels
  ctx.fillStyle = C.door2;
  ctx.fillRect(dx + 7, fY + 6, 8, 11);
  ctx.fillRect(dx + 17, fY + 6, 8, 11);
  ctx.fillRect(dx + 7, fY + 19, 8, 11);
  ctx.fillRect(dx + 17, fY + 19, 8, 11);
  // Panel highlight
  ctx.fillStyle = shade(C.door2, 12);
  ctx.fillRect(dx + 8, fY + 7, 6, 1);
  ctx.fillRect(dx + 18, fY + 7, 6, 1);
  ctx.fillRect(dx + 8, fY + 20, 6, 1);
  ctx.fillRect(dx + 18, fY + 20, 6, 1);
  // Panel inner shadow
  ctx.fillStyle = shade(C.door, -15);
  ctx.fillRect(dx + 7, fY + 16, 8, 1);
  ctx.fillRect(dx + 17, fY + 16, 8, 1);
  ctx.fillRect(dx + 7, fY + 29, 8, 1);
  ctx.fillRect(dx + 17, fY + 29, 8, 1);
  // Door arch
  ctx.fillStyle = "#1a0a00";
  ctx.beginPath(); ctx.arc(dx + 16, fY + 5, 13, Math.PI, 0); ctx.fill();
  ctx.fillStyle = C.door;
  ctx.beginPath(); ctx.arc(dx + 16, fY + 5, 11, Math.PI, 0); ctx.fill();
  // Arch glass (semi-circle transom)
  ctx.fillStyle = "#FFE088";
  ctx.globalAlpha = 0.35;
  ctx.beginPath(); ctx.arc(dx + 16, fY + 5, 8, Math.PI, 0); ctx.fill();
  ctx.globalAlpha = 1;
  // Arch frame dividers
  ctx.fillStyle = "#1a0a00";
  ctx.fillRect(dx + 15, fY - 3, 2, 8);
  ctx.fillRect(dx + 10, fY + 1, 12, 1);
  // Door knob & plate
  ctx.fillStyle = "#8B7355";
  ctx.fillRect(dx + 22, fY + 18, 4, 8);
  ctx.fillStyle = C.uiGold;
  ctx.fillRect(dx + 23, fY + 20, 2, 2);
  ctx.fillStyle = "#C9A84C";
  ctx.fillRect(dx + 23, fY + 23, 2, 1);
  // Door step
  ctx.fillStyle = "#777";
  ctx.fillRect(dx + 1, fY + 30, 30, 4);
  ctx.fillStyle = "#888";
  ctx.fillRect(dx + 2, fY + 31, 28, 2);

  // ── Small lanterns by door ──
  for (const lx of [dx - 2, dx + T + 1]) {
    ctx.fillStyle = "#333";
    ctx.fillRect(lx, fY - 2, 3, 2);
    ctx.fillRect(lx + 1, fY, 1, 4);
    ctx.fillStyle = "#FFD060";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(lx, fY + 3, 3, 3);
    ctx.globalAlpha = 1;
  }

  // ── Unique building features ──
  drawUniqueFeatures(ctx, b, px, py, w, h);

  // ── Hanging sign ──
  ctx.font = "8px 'Press Start 2P',monospace";
  const sW = Math.max(b.name.length * 7 + 16, 58);
  // Iron bracket
  ctx.fillStyle = "#222";
  ctx.fillRect(px + w / 2 - 1, wallTop - 2, 3, 16);
  // Bracket ornamental top
  ctx.fillStyle = "#333";
  ctx.fillRect(px + w / 2 - 3, wallTop - 2, 7, 3);
  // Chains
  ctx.fillStyle = "#555";
  ctx.fillRect(px + w / 2 - sW / 2 + 4, wallTop + 6, 1, 5);
  ctx.fillRect(px + w / 2 + sW / 2 - 5, wallTop + 6, 1, 5);
  ctx.fillRect(px + w / 2 - sW / 2 + 5, wallTop + 7, 1, 3);
  ctx.fillRect(px + w / 2 + sW / 2 - 6, wallTop + 7, 1, 3);
  // Sign board
  const signY = wallTop + 10;
  ctx.fillStyle = C.signFace;
  ctx.fillRect(px + w / 2 - sW / 2, signY, sW, 16);
  // Ornate border
  ctx.fillStyle = C.sign;
  ctx.fillRect(px + w / 2 - sW / 2, signY, sW, 2);
  ctx.fillRect(px + w / 2 - sW / 2, signY + 14, sW, 2);
  ctx.fillRect(px + w / 2 - sW / 2, signY, 2, 16);
  ctx.fillRect(px + w / 2 + sW / 2 - 2, signY, 2, 16);
  // Inner border
  ctx.fillStyle = shade(C.sign, 20);
  ctx.fillRect(px + w / 2 - sW / 2 + 2, signY + 2, sW - 4, 1);
  ctx.fillRect(px + w / 2 - sW / 2 + 2, signY + 13, sW - 4, 1);
  ctx.fillRect(px + w / 2 - sW / 2 + 2, signY + 2, 1, 12);
  ctx.fillRect(px + w / 2 + sW / 2 - 3, signY + 2, 1, 12);
  // Corner nails
  ctx.fillStyle = C.uiGold;
  ctx.fillRect(px + w / 2 - sW / 2 + 3, signY + 3, 2, 2);
  ctx.fillRect(px + w / 2 + sW / 2 - 5, signY + 3, 2, 2);
  ctx.fillRect(px + w / 2 - sW / 2 + 3, signY + 11, 2, 2);
  ctx.fillRect(px + w / 2 + sW / 2 - 5, signY + 11, 2, 2);
  // Text
  ctx.fillStyle = "#2A1A0A";
  ctx.textAlign = "center";
  ctx.fillText(b.name, px + w / 2, signY + 12);
  ctx.textAlign = "left";
}
