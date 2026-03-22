import { WORLD } from "../config/player.js";
import { T, CW, CH, C, COLS, ROWS } from "../engine/constants.js";
import { MAP } from "../engine/map.js";

export function ground(ctx, cx, cy, tick) {
  const sc = Math.max(0, Math.floor(cx/T)), sr = Math.max(0, Math.floor(cy/T));
  for (let r=sr; r<=sr+WORLD.viewportH+1 && r<ROWS; r++)
    for (let c=sc; c<=sc+WORLD.viewportW+1 && c<COLS; c++) {
      const px=c*T-cx, py=r*T-cy, k=`${c},${r}`;
      if (px<-T||px>CW||py<-T||py>CH) continue;
      if (MAP.water.has(k)) {
        const w=Math.sin(tick*0.05+c*0.8+r*0.5); ctx.fillStyle=w>0.3?C.water3:w>-0.3?C.water1:C.water2; ctx.fillRect(px,py,T,T);
        if(Math.sin(tick*0.1+c*3+r*7)>0.85){ctx.fillStyle="rgba(255,255,255,0.4)";ctx.fillRect(px+8+(tick%16),py+4,3,2);}
      } else if (MAP.bridges.has(k)) {
        ctx.fillStyle=C.bridge;ctx.fillRect(px,py,T,T);ctx.fillStyle=C.bridgeTop;ctx.fillRect(px,py,T,4);ctx.fillRect(px,py+T-4,T,4);
        ctx.fillStyle="#5a3218";ctx.fillRect(px+6,py,2,T);ctx.fillRect(px+14,py,2,T);ctx.fillRect(px+22,py,2,T);
      } else if (MAP.sand.has(k) && !MAP.paths.has(k)) {
        ctx.fillStyle=C.sand1;ctx.fillRect(px,py,T,T);ctx.fillStyle=C.sand2;ctx.fillRect(px+((c*5+3)%24)+4,py+((r*7+5)%24)+4,3,2);
      } else if (MAP.cobble.has(k)) {
        ctx.fillStyle=C.cobble1;ctx.fillRect(px,py,T,T);ctx.fillStyle=C.cobble2;
        for(let i=0;i<3;i++){ctx.fillRect(px+((c*11+i*13)%26)+2,py+((r*7+i*19)%26)+2,6,4);}
        ctx.fillStyle=C.cobble3;ctx.fillRect(px+((c*3+1)%20)+6,py+((r*5+3)%20)+6,4,3);
      } else if (MAP.paths.has(k)) {
        ctx.fillStyle=C.path1;ctx.fillRect(px,py,T,T);ctx.fillStyle=C.path2;ctx.fillRect(px+((c*7+13)%28)+2,py+((r*11+17)%28)+2,2,2);
      } else {
        ctx.fillStyle=(c+r)%2===0?C.grass1:C.grass2;ctx.fillRect(px,py,T,T);
        if((c*7+r*13)%5===0){ctx.fillStyle=C.grass3;ctx.fillRect(px+10,py+20,2,4);ctx.fillRect(px+14,py+18,2,5);}
      }
    }
}
