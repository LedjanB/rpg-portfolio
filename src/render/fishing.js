import { T, CW, C } from "../engine/constants.js";

export function bobber(ctx, spot, cx, cy, tick, state) {
  if (!spot) return;
  const px = spot.x * T - cx + 16, py = spot.y * T - cy - 8;
  if (px < -T || px > CW + T) return;
  const bob = Math.sin(tick * 0.08) * 3;

  if (state === "casting") {
    // Line being cast
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py + 20);
    ctx.lineTo(px, py + bob + 10);
    ctx.stroke();
  }

  if (state === "waiting" || state === "bite") {
    // Bobber
    ctx.fillStyle = "#FF4444";
    ctx.fillRect(px - 3, py + bob, 6, 6);
    ctx.fillStyle = "#fff";
    ctx.fillRect(px - 2, py + bob, 4, 2);
    // Line
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, py + bob + 6);
    ctx.lineTo(px, py + bob + 16);
    ctx.stroke();
    // Ripple
    ctx.strokeStyle = "rgba(150,200,255,0.4)";
    ctx.lineWidth = 1;
    const ripple = (tick * 2) % 30;
    ctx.beginPath();
    ctx.ellipse(px, py + bob + 8, ripple * 0.6, ripple * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (state === "bite") {
    // Exclamation mark
    const flash = Math.sin(tick * 0.3) > 0;
    if (flash) {
      ctx.fillStyle = "#FFD700";
      ctx.font = "bold 14px 'Press Start 2P',monospace";
      ctx.textAlign = "center";
      ctx.fillText("!", px, py - 8);
      ctx.textAlign = "left";
    }
  }
}

export function fishCaughtPopup(ctx, spot, cx, cy, tick, fishName) {
  if (!spot || !fishName) return;
  const px = spot.x * T - cx + 16, py = spot.y * T - cy - 30;
  if (px < -T || px > CW + T) return;
  const bob = Math.sin(tick * 0.1) * 2;
  const tw = fishName.length * 5 + 20;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(px - tw / 2, py + bob - 4, tw, 20);
  ctx.fillStyle = C.uiGold;
  ctx.font = "8px 'Press Start 2P',monospace";
  ctx.textAlign = "center";
  ctx.fillText(`🐟 ${fishName}`, px, py + bob + 8);
  ctx.textAlign = "left";
}

export function fishMissedPopup(ctx, spot, cx, cy, tick) {
  if (!spot) return;
  const px = spot.x * T - cx + 16, py = spot.y * T - cy - 20;
  if (px < -T || px > CW + T) return;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(px - 40, py, 80, 16);
  ctx.fillStyle = "#FF6B6B";
  ctx.font = "7px 'Press Start 2P',monospace";
  ctx.textAlign = "center";
  ctx.fillText("Got away...", px, py + 11);
  ctx.textAlign = "left";
}
