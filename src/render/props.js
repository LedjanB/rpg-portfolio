import { T, CW, CH, C } from "../engine/constants.js";

export function prop(ctx, p, cx, cy) {
  const px=p.x*T-cx,py=p.y*T-cy; if(px<-T||px>CW+T||py<-T||py>CH+T)return;
  const draw = {
    barrel(){ctx.fillStyle=C.barrelD;ctx.fillRect(px+8,py+8,16,20);ctx.fillStyle=C.barrel;ctx.fillRect(px+10,py+10,12,16);ctx.fillStyle=C.barrelH;ctx.fillRect(px+8,py+14,16,3);ctx.fillRect(px+8,py+22,16,3);},
    crate(){ctx.fillStyle=C.crateD;ctx.fillRect(px+6,py+8,20,20);ctx.fillStyle=C.crate;ctx.fillRect(px+8,py+10,16,16);ctx.fillStyle=C.crateD;ctx.fillRect(px+8,py+10,16,2);ctx.fillRect(px+15,py+10,2,16);},
    bench(){ctx.fillStyle="#5a3a1a";ctx.fillRect(px+4,py+20,4,8);ctx.fillRect(px+24,py+20,4,8);ctx.fillStyle=C.fence;ctx.fillRect(px+2,py+18,28,4);ctx.fillStyle=C.fenceD;ctx.fillRect(px+2,py+12,28,3);},
    well(){ctx.fillStyle=C.stone3;ctx.fillRect(px+6,py+10,20,16);ctx.fillStyle=C.stone1;ctx.fillRect(px+8,py+12,16,12);ctx.fillStyle="#2868b8";ctx.fillRect(px+10,py+14,12,8);ctx.fillStyle=C.stone2;ctx.fillRect(px+4,py+6,24,4);ctx.fillRect(px+14,py+2,4,8);},
    stall(){ctx.fillStyle="#5a3a1a";ctx.fillRect(px+2,py+16,28,12);ctx.fillStyle=C.awning;ctx.fillRect(px,py+8,32,10);ctx.fillStyle=C.awningS;ctx.fillRect(px,py+16,32,2);ctx.fillStyle=C.flower2;ctx.fillRect(px+6,py+18,4,4);ctx.fillRect(px+14,py+18,4,4);ctx.fillStyle="#e86040";ctx.fillRect(px+22,py+18,4,4);},
    haystack(){ctx.fillStyle="#c8a830";ctx.beginPath();ctx.moveTo(px+4,py+26);ctx.lineTo(px+16,py+8);ctx.lineTo(px+28,py+26);ctx.closePath();ctx.fill();ctx.fillStyle="#b89820";ctx.fillRect(px+8,py+20,16,6);},
    signpost(){ctx.fillStyle="#5a3a1a";ctx.fillRect(px+14,py+12,4,18);ctx.fillStyle=C.signFace;ctx.fillRect(px+4,py+8,24,10);ctx.fillStyle=C.sign;ctx.fillRect(px+4,py+8,24,2);},
  };
  if (draw[p.type]) draw[p.type]();
}

export function flower(ctx, c, r, t, cx, cy, tick) {
  const px=c*T-cx+16,py=r*T-cy+20; if(px<-T||px>CW+T)return;
  const cols=[C.flower1,C.flower2,C.flower3,C.flower4],sw=Math.sin(tick*0.04+c+r*3)*1.5;
  ctx.fillStyle="#3A6A2A";ctx.fillRect(px,py+2,2,6);ctx.fillStyle=cols[t];ctx.fillRect(px-2+sw,py-1,6,5);ctx.fillStyle=C.flower2;ctx.fillRect(px+sw,py+1,2,2);
}

export function torch(ctx, tc, tr, cx, cy, tick) {
  const px=tc*T-cx+16,py=tr*T-cy+8; if(px<-40||px>CW+40)return;
  const f=Math.sin(tick*0.15+tc*5)*2+Math.sin(tick*0.23+tr*3);
  ctx.fillStyle="#5a3a1a";ctx.fillRect(px-2,py+8,4,20);ctx.fillStyle="#FF4400";ctx.fillRect(px-3,py+2+f,6,6);ctx.fillStyle=C.torch;ctx.fillRect(px-2,py+f,4,5);ctx.fillStyle="#FFE060";ctx.fillRect(px-1,py+1+f,2,3);
  const r=24+f*2;const grd=ctx.createRadialGradient(px,py+4,0,px,py+4,r);grd.addColorStop(0,C.torchGlow+"0.15)");grd.addColorStop(1,C.torchGlow+"0)");ctx.fillStyle=grd;ctx.fillRect(px-r,py+4-r,r*2,r*2);
}
