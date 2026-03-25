import { useEffect, useRef } from "react";
import { BUILDINGS } from "../config/buildings.js";
import { NPCS } from "../config/npcs.js";
import { T, COLS, ROWS, CW, CH, C } from "../engine/constants.js";
import { MAP } from "../engine/map.js";
import { f1 } from "../styles.js";

const MW = 130, MH = Math.round(MW * ROWS / COLS);
const SX = MW / COLS, SY = MH / ROWS;
const ceilSX = Math.ceil(SX), ceilSY = Math.ceil(SY);

// Pre-parse string keys into numeric arrays (avoids split/map every frame)
const waterTiles = [...MAP.water].map(k => { const [x, y] = k.split(",").map(Number); return [x, y]; });
const pathTiles = [...MAP.paths].map(k => { const [x, y] = k.split(",").map(Number); return [x, y]; });

export default function Minimap({ gameRef, zoom }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    let raf;

    const draw = () => {
      const g = gameRef.current;
      ctx.clearRect(0, 0, MW, MH);

      // Background
      ctx.fillStyle = C.minimapBg;
      ctx.fillRect(0, 0, MW, MH);

      // Water
      ctx.fillStyle = C.minimapWater;
      waterTiles.forEach(([wx, wy]) => {
        ctx.fillRect(wx * SX, wy * SY, ceilSX, ceilSY);
      });

      // Paths
      ctx.fillStyle = "rgba(160,144,64,0.35)";
      pathTiles.forEach(([px, py]) => {
        ctx.fillRect(px * SX, py * SY, ceilSX, ceilSY);
      });

      // Trees (subtle)
      ctx.fillStyle = "rgba(30,96,20,0.45)";
      MAP.trees.forEach(([tx, ty]) => {
        ctx.fillRect(tx * SX, ty * SY, ceilSX, ceilSY);
      });

      // Buildings
      BUILDINGS.forEach(b => {
        ctx.fillStyle = C.minimapBuilding;
        ctx.fillRect(b.x * SX, b.y * SY, b.w * SX, b.h * SY);
        // Door indicator
        if (b.doorX !== undefined) {
          ctx.fillStyle = C.minimapDoor;
          ctx.fillRect(b.doorX * SX, b.doorY * SY, ceilSX, ceilSY);
        }
      });

      // NPCs
      NPCS.forEach(n => {
        ctx.fillStyle = C.minimapNPC;
        ctx.fillRect(n.x * SX - 1, n.y * SY - 1, 3, 3);
      });

      // Viewport indicator
      const vpW = (CW / T) * SX / zoom;
      const vpH = (CH / T) * SY / zoom;
      const vpX = (g.px / T) * SX - vpW / 2;
      const vpY = (g.py / T) * SY - vpH / 2;
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        Math.max(0, vpX), Math.max(0, vpY),
        Math.min(vpW, MW - Math.max(0, vpX)),
        Math.min(vpH, MH - Math.max(0, vpY))
      );

      // Player — pulsing dot
      const pulse = 2 + Math.sin(Date.now() * 0.005) * 1;
      const playerMX = (g.px / T) * SX;
      const playerMY = (g.py / T) * SY;
      ctx.beginPath();
      ctx.arc(playerMX, playerMY, pulse + 1, 0, Math.PI * 2);
      ctx.fillStyle = C.minimapPlayerGlow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(playerMX, playerMY, pulse, 0, Math.PI * 2);
      ctx.fillStyle = C.minimapPlayer;
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [gameRef, zoom]);

  return (
    <div style={{
      position: "absolute", top: 10, right: 10, zIndex: 10,
      background: "rgba(0,0,0,0.65)",
      border: `1px solid ${C.uiBorder}`,
      borderRadius: 4,
      padding: 3,
      pointerEvents: "none",
    }}>
      <canvas
        ref={canvasRef}
        width={MW}
        height={MH}
        role="img"
        aria-label="Game minimap showing player position and landmarks"
        style={{
          width: MW, height: MH,
          display: "block",
          imageRendering: "pixelated",
          borderRadius: 2,
        }}
      />
      <div aria-hidden="true" style={{
        ...f1, fontSize: 6,
        color: "rgba(255,255,255,0.35)",
        textAlign: "center",
        marginTop: 2,
      }}>MAP</div>
    </div>
  );
}
