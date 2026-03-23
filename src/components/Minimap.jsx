import { useEffect, useRef } from "react";
import { BUILDINGS } from "../config/buildings.js";
import { NPCS } from "../config/npcs.js";
import { T, COLS, ROWS, CW, CH, C } from "../engine/constants.js";
import { MAP } from "../engine/map.js";
import { f1 } from "../styles.js";

const MW = 130, MH = Math.round(MW * ROWS / COLS);
const SX = MW / COLS, SY = MH / ROWS;

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
      ctx.fillStyle = "#1a2a1a";
      ctx.fillRect(0, 0, MW, MH);

      // Water
      MAP.water.forEach(k => {
        const [wx, wy] = k.split(",").map(Number);
        ctx.fillStyle = "#2060a0";
        ctx.fillRect(wx * SX, wy * SY, Math.ceil(SX), Math.ceil(SY));
      });

      // Paths
      ctx.fillStyle = "rgba(160,144,64,0.35)";
      MAP.paths.forEach(k => {
        const [px, py] = k.split(",").map(Number);
        ctx.fillRect(px * SX, py * SY, Math.ceil(SX), Math.ceil(SY));
      });

      // Trees (subtle)
      ctx.fillStyle = "rgba(30,96,20,0.45)";
      MAP.trees.forEach(([tx, ty]) => {
        ctx.fillRect(tx * SX, ty * SY, Math.ceil(SX), Math.ceil(SY));
      });

      // Buildings
      BUILDINGS.forEach(b => {
        ctx.fillStyle = "#aa8855";
        ctx.fillRect(b.x * SX, b.y * SY, b.w * SX, b.h * SY);
        // Door indicator
        if (b.doorX !== undefined) {
          ctx.fillStyle = "#ffcc44";
          ctx.fillRect(b.doorX * SX, b.doorY * SY, Math.ceil(SX), Math.ceil(SY));
        }
      });

      // NPCs
      NPCS.forEach(n => {
        ctx.fillStyle = "#ff6688";
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
      ctx.fillStyle = "rgba(68,136,255,0.3)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(playerMX, playerMY, pulse, 0, Math.PI * 2);
      ctx.fillStyle = "#4488ff";
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
        style={{
          width: MW, height: MH,
          display: "block",
          imageRendering: "pixelated",
          borderRadius: 2,
        }}
      />
      <div style={{
        ...f1, fontSize: 6,
        color: "rgba(255,255,255,0.35)",
        textAlign: "center",
        marginTop: 2,
      }}>MAP</div>
    </div>
  );
}
