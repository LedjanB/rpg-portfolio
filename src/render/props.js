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
    pot(){ctx.fillStyle="#8B6242";ctx.fillRect(px+10,py+12,12,14);ctx.fillStyle="#7A5232";ctx.fillRect(px+12,py+10,8,4);ctx.fillStyle="#6A4222";ctx.fillRect(px+8,py+24,16,4);ctx.fillStyle="#9B7252";ctx.fillRect(px+12,py+14,4,8);},
  };
  if (draw[p.type]) draw[p.type]();
}

export function breakEffect(ctx, x, y, cx, cy, timer) {
  const px = x * T - cx + 16, py = y * T - cy + 16;
  if (px < -T || px > CW + T) return;
  const progress = 1 - timer / 20;
  ctx.globalAlpha = 1 - progress;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const dist = progress * 20;
    ctx.fillStyle = i % 2 === 0 ? C.crate : C.crateD;
    ctx.fillRect(px + Math.cos(angle) * dist - 2, py + Math.sin(angle) * dist - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
}

export function flower(ctx, c, r, t, cx, cy, tick, seasonalColors) {
  const px=c*T-cx+16,py=r*T-cy+20; if(px<-T||px>CW+T)return;
  const cols=seasonalColors||[C.flower1,C.flower2,C.flower3,C.flower4],sw=Math.sin(tick*0.04+c+r*3)*1.5;
  ctx.fillStyle="#3A6A2A";ctx.fillRect(px,py+2,2,6);ctx.fillStyle=cols[t%cols.length];ctx.fillRect(px-2+sw,py-1,6,5);ctx.fillStyle=C.flower2;ctx.fillRect(px+sw,py+1,2,2);
}

export function gardenPlot(ctx, plot, cx, cy, tick) {
  const px = plot.x * T - cx, py = plot.y * T - cy;
  if (px < -T || px > CW + T || py < -T || py > CH + T) return;
  // Soil base
  ctx.fillStyle = "#5a4020";
  ctx.fillRect(px, py, T, T);
  ctx.fillStyle = "#4a3418";
  ctx.fillRect(px + 4, py + 6, 24, 2);
  ctx.fillRect(px + 4, py + 14, 24, 2);
  ctx.fillRect(px + 4, py + 22, 24, 2);

  const cols = [C.flower1, C.flower2, C.flower3, C.flower4];
  const sw = Math.sin(tick * 0.04 + plot.x + plot.y * 3) * 1.5;
  const color = cols[plot.plantColor || 0];

  if (plot.stage === 1) {
    // Seed — small dot
    ctx.fillStyle = "#8a7a40";
    ctx.fillRect(px + 14, py + 18, 4, 4);
  } else if (plot.stage === 2) {
    // Sprout — tiny green stem
    ctx.fillStyle = "#3A8A2A";
    ctx.fillRect(px + 15, py + 14, 2, 10);
    ctx.fillStyle = "#4A9A3A";
    ctx.fillRect(px + 13, py + 14, 6, 3);
  } else if (plot.stage === 3) {
    // Growing — small plant with leaves
    ctx.fillStyle = "#3A6A2A";
    ctx.fillRect(px + 15, py + 10, 2, 14);
    ctx.fillStyle = "#4A9A3A";
    ctx.fillRect(px + 10 + sw, py + 10, 12, 5);
    ctx.fillRect(px + 12 + sw, py + 8, 8, 4);
  } else if (plot.stage === 4) {
    // Bloom — full flower
    ctx.fillStyle = "#3A6A2A";
    ctx.fillRect(px + 15, py + 10, 2, 14);
    ctx.fillStyle = color;
    ctx.fillRect(px + 10 + sw, py + 4, 12, 8);
    ctx.fillStyle = "#fff";
    ctx.fillRect(px + 14 + sw, py + 6, 4, 4);
  }
}

export function lamppost(ctx, tc, tr, cx, cy, tick, nightAmount = 0) {
  const px=tc*T-cx+16,py=tr*T-cy; if(px<-60||px>CW+60)return;
  const flicker=Math.sin(tick*0.1+tc*3)*0.4+Math.sin(tick*0.17+tr*5)*0.3+Math.cos(tick*0.23+tc*7)*0.2;
  const nightBoost = 1 + nightAmount * 1.5; // glow expands at night

  // ── Ornate iron base (wider, decorative) ──
  ctx.fillStyle="#1a1a1a";
  ctx.fillRect(px-6,py+28,12,4); // flat base plate
  ctx.fillStyle="#222";
  ctx.fillRect(px-4,py+27,8,2); // base trim
  // Decorative scroll feet
  ctx.fillStyle="#1a1a1a";
  ctx.fillRect(px-8,py+30,4,2); ctx.fillRect(px+4,py+30,4,2);
  ctx.fillRect(px-7,py+29,2,2); ctx.fillRect(px+5,py+29,2,2);

  // ── Main pole (tall, slender black iron) ──
  ctx.fillStyle="#111";
  ctx.fillRect(px-1,py+8,3,20);
  // Subtle highlight on pole
  ctx.fillStyle="#2a2a2a";
  ctx.fillRect(px,py+8,1,20);

  // ── Decorative ring details on pole ──
  ctx.fillStyle="#1a1a1a";
  ctx.fillRect(px-2,py+24,5,2); // lower ring
  ctx.fillRect(px-2,py+16,5,2); // middle ring
  ctx.fillRect(px-2,py+10,5,2); // upper ring

  // ── Ornate bracket / crossbar ──
  ctx.fillStyle="#111";
  ctx.fillRect(px-1,py+6,3,3);
  // Curved arm holding lantern
  ctx.fillRect(px-6,py+4,12,2);
  ctx.fillStyle="#1a1a1a";
  ctx.fillRect(px-7,py+5,2,3); ctx.fillRect(px+5,py+5,2,3); // scroll ends
  // Top finial
  ctx.fillStyle="#111";
  ctx.fillRect(px,py+2,1,3);
  ctx.fillRect(px-1,py+1,3,2);

  // ── Glass lantern housing ──
  ctx.fillStyle="#111";
  ctx.fillRect(px-5,py-4,10,2); // lantern top cap
  ctx.fillRect(px-4,py-2,8,1);  // top frame
  ctx.fillRect(px-4,py+3,8,1);  // bottom frame
  ctx.fillRect(px-4,py-2,1,6);  // left frame
  ctx.fillRect(px+3,py-2,1,6);  // right frame

  // ── Fire flame (animated) ──
  const fireH = 4 + flicker * 1.5;
  const fireW = 3 + flicker * 0.5;
  // Outer flame (orange-red)
  ctx.fillStyle=`rgba(255,120,20,${0.7+flicker*0.15})`;
  ctx.beginPath();
  ctx.moveTo(px - fireW, py + 2);
  ctx.quadraticCurveTo(px - fireW - 0.5, py - fireH * 0.4, px, py - fireH);
  ctx.quadraticCurveTo(px + fireW + 0.5, py - fireH * 0.4, px + fireW, py + 2);
  ctx.closePath();
  ctx.fill();
  // Inner flame (bright yellow)
  ctx.fillStyle=`rgba(255,200,50,${0.8+flicker*0.1})`;
  ctx.beginPath();
  ctx.moveTo(px - fireW * 0.5, py + 1);
  ctx.quadraticCurveTo(px - fireW * 0.3, py - fireH * 0.3, px, py - fireH * 0.6);
  ctx.quadraticCurveTo(px + fireW * 0.3, py - fireH * 0.3, px + fireW * 0.5, py + 1);
  ctx.closePath();
  ctx.fill();
  // Core (white-hot)
  ctx.fillStyle=`rgba(255,240,200,${0.6+flicker*0.2})`;
  ctx.fillRect(px-1, py-1, 2, 2);

  // ── Warm fire glow on ground (boosted at night) ──
  const r=( 32+flicker*4)*nightBoost;
  const glowAlpha1 = 0.12 + nightAmount * 0.15;
  const grd=ctx.createRadialGradient(px,py+28,0,px,py+28,r);
  grd.addColorStop(0,`rgba(255,160,60,${glowAlpha1})`);
  grd.addColorStop(0.4,`rgba(255,120,40,${glowAlpha1*0.5})`);
  grd.addColorStop(1,"rgba(255,80,20,0)");
  ctx.fillStyle=grd;ctx.fillRect(px-r,py+28-r,r*2,r*2);

  // ── Lantern glow (close warm light, boosted at night) ──
  const r2=(16+flicker*2)*nightBoost;
  const glowAlpha2 = 0.3 + nightAmount * 0.3;
  const grd2=ctx.createRadialGradient(px,py,0,px,py,r2);
  grd2.addColorStop(0,`rgba(255,180,80,${glowAlpha2})`);
  grd2.addColorStop(0.5,`rgba(255,140,50,${glowAlpha2*0.4})`);
  grd2.addColorStop(1,"rgba(255,100,30,0)");
  ctx.fillStyle=grd2;ctx.fillRect(px-r2,py-r2,r2*2,r2*2);
}
