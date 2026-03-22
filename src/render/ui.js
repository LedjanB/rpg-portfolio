import { BUILDINGS } from "../config/buildings.js";
import { T, CW, C, COLS, ROWS } from "../engine/constants.js";
import { MAP } from "../engine/map.js";

export function hint(ctx, x, y, cx, cy, tick, label="SPACE") {
  const px=x-cx+16,py=y-cy-12,bob=Math.sin(tick*0.08)*3,tw=label.length*5+10;
  ctx.fillStyle="rgba(0,0,0,0.6)";ctx.fillRect(px-tw/2,py+bob-4,tw,16);
  ctx.fillStyle=C.uiGold;ctx.font="bold 8px 'Press Start 2P',monospace";ctx.textAlign="center";ctx.fillText(label,px,py+bob+7);ctx.textAlign="left";
}

export function minimap(ctx, playerX, playerY) {
  const mw=100,mh=70,mx=CW-mw-8,my=8,sx=mw/COLS,sy=mh/ROWS;
  ctx.fillStyle="rgba(0,0,0,0.6)";ctx.fillRect(mx-2,my-2,mw+4,mh+4);ctx.fillStyle="#2a4a2a";ctx.fillRect(mx,my,mw,mh);
  MAP.water.forEach(k=>{const[wx,wy]=k.split(",").map(Number);ctx.fillStyle="#2060a0";ctx.fillRect(mx+wx*sx,my+wy*sy,Math.ceil(sx),Math.ceil(sy));});
  ctx.fillStyle="#a0904088";MAP.paths.forEach(k=>{const[px2,py2]=k.split(",").map(Number);ctx.fillRect(mx+px2*sx,my+py2*sy,Math.ceil(sx),Math.ceil(sy));});
  BUILDINGS.forEach(b=>{ctx.fillStyle="#aa8855";ctx.fillRect(mx+b.x*sx,my+b.y*sy,b.w*sx,b.h*sy);});
  ctx.fillStyle="#4488ff";ctx.fillRect(mx+playerX/T*sx-2,my+playerY/T*sy-2,4,4);
  ctx.strokeStyle=C.uiBorder;ctx.lineWidth=1;ctx.strokeRect(mx-1,my-1,mw+2,mh+2);
  ctx.font="6px 'Press Start 2P',monospace";ctx.fillStyle="rgba(255,255,255,0.4)";ctx.textAlign="center";ctx.fillText("MAP",mx+mw/2,my+mh+10);ctx.textAlign="left";
}
