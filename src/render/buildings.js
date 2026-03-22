import { T, CW, CH, C } from "../engine/constants.js";

export function building(ctx, b, cx, cy) {
  const px=b.x*T-cx,py=b.y*T-cy,w=b.w*T,h=b.h*T; if(px+w<-T||px>CW+T||py+h<-T||py>CH+T)return;
  ctx.fillStyle=C.shadow;ctx.fillRect(px+4,py+h-2,w,8);
  ctx.fillStyle=b.walls[0];ctx.fillRect(px,py+T,w,h-T);ctx.fillStyle=b.walls[1];ctx.fillRect(px,py+T,4,h-T);ctx.fillStyle=b.walls[2];ctx.fillRect(px+w-4,py+T,4,h-T);
  ctx.fillStyle=b.roof[0];ctx.beginPath();ctx.moveTo(px-4,py+T+2);ctx.lineTo(px+w/2,py-4);ctx.lineTo(px+w+4,py+T+2);ctx.closePath();ctx.fill();
  ctx.fillStyle=b.roof[2]||b.roof[0];ctx.beginPath();ctx.moveTo(px+w/2,py-4);ctx.lineTo(px+w/2+2,py+T);ctx.lineTo(px+w+2,py+T);ctx.closePath();ctx.fill();
  if(b.hasChimney){ctx.fillStyle=C.stone3;ctx.fillRect(px+w-20,py-2,10,T+4);ctx.fillStyle=C.stone1;ctx.fillRect(px+w-18,py-4,6,4);}
  const dx=b.doorX*T-cx;ctx.fillStyle=C.awning;ctx.fillRect(dx-2,py+h-T-2,T+4,6);ctx.fillStyle=C.awningS;ctx.fillRect(dx-2,py+h-T+2,T+4,2);
  const wY=py+T+8;
  for(let i=0;i<Math.min(b.w-2,4);i++){const wx=px+12+i*(T+2);ctx.fillStyle="#1a1a3a";ctx.fillRect(wx,wY,14,12);ctx.fillStyle="#FFE88844";ctx.fillRect(wx+2,wY+2,10,8);ctx.fillStyle=b.walls[1];ctx.fillRect(wx+6,wY,2,12);ctx.fillRect(wx,wY+5,14,2);ctx.fillStyle="#5a3a1a";ctx.fillRect(wx,wY+12,14,4);ctx.fillStyle=C.flower1;ctx.fillRect(wx+2,wY+10,3,3);ctx.fillStyle=C.flower3;ctx.fillRect(wx+6,wY+9,3,4);ctx.fillStyle=C.flower4;ctx.fillRect(wx+10,wY+10,3,3);}
  const fY=py+h-T;ctx.fillStyle=C.door;ctx.fillRect(dx+6,fY+2,20,30);ctx.fillStyle=C.door2;ctx.fillRect(dx+8,fY+4,16,26);ctx.fillStyle=C.uiGold;ctx.fillRect(dx+20,fY+16,3,3);
  ctx.font="8px 'Press Start 2P',monospace";const sW=Math.max(b.name.length*7+10,50);ctx.fillStyle=C.sign;ctx.fillRect(px+w/2-2,py+T-4,4,12);ctx.fillStyle=C.signFace;ctx.fillRect(px+w/2-sW/2,py+T-16,sW,14);ctx.fillStyle=C.sign;ctx.fillRect(px+w/2-sW/2,py+T-16,sW,2);ctx.fillRect(px+w/2-sW/2,py+T-4,sW,2);ctx.fillStyle="#3A2A14";ctx.textAlign="center";ctx.fillText(b.name,px+w/2,py+T-6);ctx.textAlign="left";
}
