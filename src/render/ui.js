import { C } from "../engine/constants.js";

export function hint(ctx, x, y, cx, cy, tick, label="SPACE") {
  const px=x-cx+16,py=y-cy-12,bob=Math.sin(tick*0.08)*3,tw=label.length*5+10;
  ctx.fillStyle="rgba(0,0,0,0.6)";ctx.fillRect(px-tw/2,py+bob-4,tw,16);
  ctx.fillStyle=C.uiGold;ctx.font="bold 8px 'Press Start 2P',monospace";ctx.textAlign="center";ctx.fillText(label,px,py+bob+7);ctx.textAlign="left";
}
