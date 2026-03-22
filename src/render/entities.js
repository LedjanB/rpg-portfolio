import { EASTER_EGG_POS } from "../config/world.js";
import { T, CW, CH, C } from "../engine/constants.js";

export function character(ctx, x, y, dir, frame, cx, cy, hairC, shirtC, isPlayer) {
  const px=x-cx,py=y-cy; if(px<-T||px>CW+T||py<-T||py>CH+T)return;
  const bob=Math.sin(frame*0.3)*(isPlayer?1.5:0.8),lo=Math.sin(frame*0.4)*3;
  ctx.fillStyle=C.shadow;ctx.beginPath();ctx.ellipse(px+16,py+30,10,4,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=C.pants;ctx.fillRect(px+9,py+22+bob,5,8);ctx.fillRect(px+18,py+22+bob,5,8);
  ctx.fillStyle=C.shoe;ctx.fillRect(px+8+(isPlayer?lo:0),py+28+bob,6,3);ctx.fillRect(px+18-(isPlayer?lo:0),py+28+bob,6,3);
  ctx.fillStyle=shirtC;ctx.fillRect(px+8,py+14+bob,16,10);ctx.fillStyle="rgba(0,0,0,0.15)";ctx.fillRect(px+8,py+14+bob,3,10);
  ctx.fillStyle=C.skin;ctx.fillRect(px+9,py+4+bob,14,12);ctx.fillStyle=hairC;ctx.fillRect(px+8,py+2+bob,16,6);
  if(dir===2)ctx.fillRect(px+8,py+2+bob,3,12);else if(dir===3)ctx.fillRect(px+21,py+2+bob,3,12);else{ctx.fillRect(px+8,py+2+bob,3,10);ctx.fillRect(px+21,py+2+bob,3,10);}
  if(dir!==1){ctx.fillStyle=C.black;if(dir===0){ctx.fillRect(px+12,py+10+bob,3,3);ctx.fillRect(px+18,py+10+bob,3,3);ctx.fillStyle=C.white;ctx.fillRect(px+12,py+10+bob,2,2);ctx.fillRect(px+18,py+10+bob,2,2);}else if(dir===2){ctx.fillRect(px+10,py+10+bob,3,3);ctx.fillStyle=C.white;ctx.fillRect(px+10,py+10+bob,2,2);}else{ctx.fillRect(px+19,py+10+bob,3,3);ctx.fillStyle=C.white;ctx.fillRect(px+20,py+10+bob,2,2);}}
}

export function cat(ctx, catObj, cx, cy) {
  const px=catObj.x-cx,py=catObj.y-cy; if(px<-T||px>CW+T)return;
  const bob=Math.sin(catObj.frame*0.4);
  ctx.fillStyle=C.catBody;ctx.fillRect(px+8,py+18+bob,16,8);ctx.fillStyle=C.catDark;ctx.fillRect(px+6,py+14+bob,8,8);ctx.fillStyle=C.catBody;ctx.fillRect(px+7,py+15+bob,6,6);
  ctx.fillStyle=C.catDark;ctx.fillRect(px+6,py+12+bob,3,3);ctx.fillRect(px+11,py+12+bob,3,3);
  const tw=Math.sin(catObj.frame*0.2)*4;ctx.fillRect(px+22+tw,py+16+bob,2,6);ctx.fillRect(px+23+tw,py+14+bob,2,4);
  ctx.fillStyle="#2a2";ctx.fillRect(px+8,py+17+bob,2,2);ctx.fillRect(px+11,py+17+bob,2,2);
  const lo2=Math.sin(catObj.frame*0.5)*2;ctx.fillStyle=C.catDark;ctx.fillRect(px+10+lo2,py+25+bob,3,3);ctx.fillRect(px+18-lo2,py+25+bob,3,3);
}

export function coin(ctx, cx2, cy2, cx, cy, tick, collected) {
  if(collected)return; const px=cx2*T-cx+16,py=cy2*T-cy+16; if(px<-T||px>CW+T)return;
  const bob=Math.sin(tick*0.08+cx2+cy2)*3,w=Math.abs(Math.sin(tick*0.06+cx2*2))*8+4;
  ctx.fillStyle=C.coin;ctx.beginPath();ctx.ellipse(px,py+bob,w/2,6,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=C.coinDark;ctx.beginPath();ctx.ellipse(px,py+bob,w/2-1,4,0,0,Math.PI*2);ctx.fill();
  if(tick%20<10){ctx.fillStyle="rgba(255,255,255,0.7)";ctx.fillRect(px+w/2,py+bob-4,2,2);}
}

export function easterEgg(ctx, cx, cy, tick) {
  const ex=EASTER_EGG_POS.x*T-cx+16,ey=EASTER_EGG_POS.y*T-cy+16; if(ex<-40||ex>CW+40)return;
  const pulse=Math.sin(tick*0.06)*0.3+0.7;ctx.globalAlpha=pulse*0.6;
  const grd=ctx.createRadialGradient(ex,ey,0,ex,ey,24);grd.addColorStop(0,"#FFD700");grd.addColorStop(0.5,"#FF6B00");grd.addColorStop(1,"rgba(255,100,0,0)");
  ctx.fillStyle=grd;ctx.beginPath();ctx.ellipse(ex,ey,24,24,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle="#FFD700";ctx.font="10px 'Press Start 2P',monospace";ctx.textAlign="center";ctx.fillText("★ SECRET ★",ex,ey-28);ctx.textAlign="left";
}
