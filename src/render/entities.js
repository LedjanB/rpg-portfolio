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

export function horse(ctx, horseObj, cx, cy) {
  const px=horseObj.x-cx,py=horseObj.y-cy; if(px<-T*2||px>CW+T*2||py<-T*2||py>CH+T*2)return;
  const bob=horseObj.mounted?Math.sin(horseObj.frame*0.25)*2:Math.sin(horseObj.frame*0.15)*0.8;
  const legSwing=horseObj.mounted?Math.sin(horseObj.frame*0.3)*4:Math.sin(horseObj.frame*0.2)*2;
  const d=horseObj.dir; // 0=down,1=up,2=left,3=right
  const facing=(d===2||d===3); // side view shows full body

  // Shadow
  ctx.fillStyle=C.shadow;ctx.beginPath();ctx.ellipse(px+16,py+32,facing?14:10,4,0,0,Math.PI*2);ctx.fill();

  if (facing) {
    const flip=d===2?-1:1;
    ctx.save();
    if(flip===-1){ctx.translate(px+32,0);ctx.scale(-1,1);ctx.translate(-px,0);}
    // Back legs
    ctx.fillStyle="#5a3a20";
    ctx.fillRect(px+6,py+22+bob,4,10+legSwing*0.5);
    ctx.fillRect(px+10,py+22+bob,4,10-legSwing*0.5);
    // Body
    ctx.fillStyle="#8B6842";ctx.fillRect(px+4,py+12+bob,24,12);
    // Body highlight
    ctx.fillStyle="#9C7A52";ctx.fillRect(px+6,py+13+bob,20,4);
    // Front legs
    ctx.fillStyle="#7A5832";
    ctx.fillRect(px+20,py+22+bob,4,10-legSwing*0.5);
    ctx.fillRect(px+24,py+22+bob,4,10+legSwing*0.5);
    // Hooves
    ctx.fillStyle="#3a2a14";
    ctx.fillRect(px+6,py+30+bob+legSwing*0.5,4,3);
    ctx.fillRect(px+10,py+30+bob-legSwing*0.5,4,3);
    ctx.fillRect(px+20,py+30+bob-legSwing*0.5,4,3);
    ctx.fillRect(px+24,py+30+bob+legSwing*0.5,4,3);
    // Neck
    ctx.fillStyle="#8B6842";ctx.fillRect(px+24,py+6+bob,6,10);
    // Head
    ctx.fillStyle="#9C7A52";ctx.fillRect(px+26,py+4+bob,8,8);
    ctx.fillStyle="#8B6842";ctx.fillRect(px+26,py+4+bob,8,3);
    // Eye
    ctx.fillStyle="#222";ctx.fillRect(px+31,py+6+bob,2,2);
    // Ear
    ctx.fillStyle="#7A5832";ctx.fillRect(px+28,py+2+bob,3,3);
    // Nostril
    ctx.fillStyle="#5a3a20";ctx.fillRect(px+33,py+9+bob,1,1);
    // Mane
    ctx.fillStyle="#3a2818";
    ctx.fillRect(px+24,py+4+bob,3,8);
    ctx.fillRect(px+22,py+6+bob,3,4);
    // Tail
    const tw=Math.sin(horseObj.frame*0.1)*3;
    ctx.fillStyle="#3a2818";ctx.fillRect(px+2+tw,py+12+bob,4,8);ctx.fillRect(px+tw,py+14+bob,3,6);
    ctx.restore();
  } else {
    // Front/back view
    // Body
    ctx.fillStyle="#8B6842";ctx.fillRect(px+6,py+12+bob,20,12);
    ctx.fillStyle="#9C7A52";ctx.fillRect(px+8,py+14+bob,16,4);
    // Legs
    ctx.fillStyle="#7A5832";
    ctx.fillRect(px+8,py+22+bob,4,10+legSwing*0.3);
    ctx.fillRect(px+20,py+22+bob,4,10-legSwing*0.3);
    // Hooves
    ctx.fillStyle="#3a2a14";
    ctx.fillRect(px+8,py+30+bob+legSwing*0.3,4,3);
    ctx.fillRect(px+20,py+30+bob-legSwing*0.3,4,3);
    // Neck & head
    ctx.fillStyle="#8B6842";ctx.fillRect(px+12,py+6+bob,8,8);
    ctx.fillStyle="#9C7A52";ctx.fillRect(px+10,py+2+bob,12,7);
    // Ears
    ctx.fillStyle="#7A5832";ctx.fillRect(px+10,py+bob,3,3);ctx.fillRect(px+19,py+bob,3,3);
    // Mane
    ctx.fillStyle="#3a2818";ctx.fillRect(px+13,py+2+bob,6,6);
    if(d===0){
      // Eyes (facing down)
      ctx.fillStyle="#222";ctx.fillRect(px+12,py+5+bob,2,2);ctx.fillRect(px+18,py+5+bob,2,2);
      // Nostrils
      ctx.fillStyle="#5a3a20";ctx.fillRect(px+14,py+7+bob,1,1);ctx.fillRect(px+17,py+7+bob,1,1);
    }
  }
}

export function coin(ctx, cx2, cy2, cx, cy, tick, collected, anim) {
  if(collected && !anim)return; const px=cx2*T-cx+16,py=cy2*T-cy+16; if(px<-T||px>CW+T)return;

  // Squash-stretch on collection
  if (anim) {
    const t = anim.frame / 10;
    const scaleX = 1 + Math.sin(t * Math.PI) * 0.5;
    const scaleY = 1 - Math.sin(t * Math.PI) * 0.3;
    const alpha = 1 - t;
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(scaleX, scaleY);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = C.coin;
    ctx.beginPath(); ctx.ellipse(0, 0, 6, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
    return;
  }

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
