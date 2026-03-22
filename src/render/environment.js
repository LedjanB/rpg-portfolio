import { DOCK_POSITIONS, FOUNTAIN_POS } from "../config/world.js";
import { BUILDINGS } from "../config/buildings.js";
import { T, CW, CH, C, COLS } from "../engine/constants.js";
import { MAP } from "../engine/map.js";

export function dock(ctx, cx, cy) {
  DOCK_POSITIONS.forEach(([dx,dy]) => { const px=dx*T-cx,py=dy*T-cy; if(px<-T||px>CW+T)return; ctx.fillStyle=C.dock;ctx.fillRect(px,py,T,T);ctx.fillStyle=C.dockLight;ctx.fillRect(px+2,py+2,8,28);ctx.fillRect(px+14,py+2,8,28);ctx.fillRect(px+26,py+2,4,28);ctx.fillStyle=C.dock;ctx.fillRect(px,py+8,T,3);ctx.fillRect(px,py+20,T,3); });
}

export function reeds(ctx, cx, cy, tick) {
  MAP.reeds.forEach(([rx,ry]) => { const px=rx*T-cx+12,py=ry*T-cy+10; if(px<-T||px>CW+T)return; const sw=Math.sin(tick*0.03+rx+ry*2)*2; ctx.fillStyle=C.reed;ctx.fillRect(px+sw,py,2,14);ctx.fillRect(px+6+sw*0.7,py+3,2,11);ctx.fillRect(px+11+sw*1.2,py+1,2,13); });
}

export function lilypads(ctx, cx, cy, tick) {
  MAP.lilypads.forEach(([lx,ly]) => { const px=lx*T-cx+16,py=ly*T-cy+16; if(px<-T||px>CW+T)return; const bob=Math.sin(tick*0.02+lx*3+ly)*2; ctx.fillStyle=C.lilypad;ctx.beginPath();ctx.ellipse(px,py+bob,8,5,0,0.3,Math.PI*1.8);ctx.fill(); if((lx+ly)%3===0){ctx.fillStyle=C.lilyFlower;ctx.fillRect(px-2,py-3+bob,4,4);} });
}

export function tree(ctx, c, r, cx, cy, tick) {
  const px=c*T-cx,py=r*T-cy; if(px<-T*2||px>CW+T||py<-T*2||py>CH+T)return;
  const sw=Math.sin(tick*0.02+c*2+r);
  ctx.fillStyle=C.shadow;ctx.beginPath();ctx.ellipse(px+16,py+30,12,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=C.trunk;ctx.fillRect(px+13,py+14,6,18);ctx.fillStyle=C.trunk2;ctx.fillRect(px+13,py+14,2,18);
  ctx.fillStyle=C.leaf3;ctx.fillRect(px+4+sw,py+2,24,16);ctx.fillStyle=C.leaf1;ctx.fillRect(px+6+sw,py,20,14);ctx.fillStyle=C.leaf2;ctx.fillRect(px+10+sw,py+2,10,8);
}

export function fence(ctx, fx, fy, cx, cy) {
  const px=fx*T-cx,py=fy*T-cy; if(px<-T||px>CW+T||py<-T||py>CH+T)return;
  ctx.fillStyle=C.fenceD;ctx.fillRect(px+4,py+10,3,18);ctx.fillRect(px+25,py+10,3,18);
  ctx.fillStyle=C.fence;ctx.fillRect(px+2,py+12,28,3);ctx.fillRect(px+2,py+20,28,3);
}

export function fountain(ctx, cx, cy, tick) {
  const fx=FOUNTAIN_POS.x*T-cx+T/2,fy=FOUNTAIN_POS.y*T-cy+T/2; if(fx<-60||fx>CW+60)return;
  ctx.fillStyle=C.stone2;ctx.beginPath();ctx.ellipse(fx,fy+8,22,12,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=C.stone1;ctx.beginPath();ctx.ellipse(fx,fy+5,18,9,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#3878c8BB";ctx.beginPath();ctx.ellipse(fx,fy+5,14,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle=C.stone3;ctx.fillRect(fx-2,fy-6,4,14);ctx.fillStyle=C.stone2;ctx.fillRect(fx-4,fy-8,8,3);
  for(let i=0;i<4;i++){const a=tick*0.03+i*Math.PI/2;ctx.fillStyle="rgba(100,180,255,0.6)";ctx.fillRect(fx+Math.cos(a)*8-1,fy+Math.sin(a)*4+1,3,3);}
}

export function smoke(ctx, cx, cy, tick) {
  BUILDINGS.filter(b=>b.hasChimney).forEach(b=>{const bx=b.x*T+b.w*T-20,by=b.y*T-10;for(let i=0;i<5;i++){const age=(tick*0.8+i*30)%150;const sx=bx+Math.sin(age*0.05+i)*8-cx,sy=by-age*0.5-cy,a=Math.max(0,1-age/150)*0.3,sz=3+age*0.06;ctx.globalAlpha=a;ctx.fillStyle="#aaa";ctx.beginPath();ctx.ellipse(sx,sy,sz,sz*0.7,0,0,Math.PI*2);ctx.fill();}});ctx.globalAlpha=1;
}

export function clouds(ctx, cloudList, cx) {
  cloudList.forEach(c=>{c.x+=c.speed;if(c.x>COLS*T+120)c.x=-c.w-60;const px=c.x-cx,py=c.y;if(px>CW+120||px+c.w<-120)return;ctx.globalAlpha=c.opacity;ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(px+c.w/2,py+c.h/2,c.w/2,c.h/2,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(px+c.w*0.3,py+c.h*0.6,c.w*0.3,c.h*0.4,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;});
}
