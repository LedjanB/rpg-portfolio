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

export function tree(ctx, c, r, cx, cy, tick, windMul = 1) {
  const px=c*T-cx,py=r*T-cy; if(px<-T*2||px>CW+T||py<-T*2||py>CH+T)return;
  const sw=Math.sin(tick*0.02+c*2+r) * windMul;
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
  const fx = FOUNTAIN_POS.x * T - cx + T / 2;
  const fy = FOUNTAIN_POS.y * T - cy + T / 2;
  if (fx < -120 || fx > CW + 120) return;

  // ── Grand base pool (tier 1) ──
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath(); ctx.ellipse(fx, fy + 22, 52, 22, 0, 0, Math.PI * 2); ctx.fill();
  // Outer stone rim
  ctx.fillStyle = "#6a6a6a";
  ctx.beginPath(); ctx.ellipse(fx, fy + 16, 50, 20, 0, 0, Math.PI * 2); ctx.fill();
  // Inner stone
  ctx.fillStyle = "#808080";
  ctx.beginPath(); ctx.ellipse(fx, fy + 14, 46, 18, 0, 0, Math.PI * 2); ctx.fill();
  // Water surface (animated)
  const waveOff = Math.sin(tick * 0.04) * 2;
  ctx.fillStyle = "#2868b8CC";
  ctx.beginPath(); ctx.ellipse(fx, fy + 12 + waveOff * 0.3, 42, 16, 0, 0, Math.PI * 2); ctx.fill();
  // Water shine
  ctx.fillStyle = "#3888d8AA";
  ctx.beginPath(); ctx.ellipse(fx - 8, fy + 8 + waveOff * 0.3, 18, 7, -0.2, 0, Math.PI * 2); ctx.fill();
  // Water sparkles on the pool
  for (let i = 0; i < 6; i++) {
    const sa = tick * 0.02 + i * 1.05;
    const sr = 28 + Math.sin(tick * 0.01 + i) * 8;
    const sx = fx + Math.cos(sa) * sr;
    const sy = fy + 12 + Math.sin(sa) * sr * 0.38;
    if (Math.sin(tick * 0.08 + i * 2.5) > 0.5) {
      ctx.fillStyle = "rgba(180,220,255,0.7)";
      ctx.fillRect(sx - 1, sy - 1, 3, 2);
    }
  }

  // ── Middle tier (tier 2) ──
  ctx.fillStyle = "#7a7a7a";
  ctx.beginPath(); ctx.ellipse(fx, fy + 4, 24, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#8a8a8a";
  ctx.beginPath(); ctx.ellipse(fx, fy + 2, 20, 8, 0, 0, Math.PI * 2); ctx.fill();
  // Middle basin water
  ctx.fillStyle = "#3080d0BB";
  ctx.beginPath(); ctx.ellipse(fx, fy, 16, 6, 0, 0, Math.PI * 2); ctx.fill();

  // ── Top tier pillar and cap ──
  ctx.fillStyle = "#777";
  ctx.fillRect(fx - 4, fy - 20, 8, 22);
  ctx.fillStyle = "#888";
  ctx.fillRect(fx - 3, fy - 20, 6, 22);
  // Decorative rings on pillar
  ctx.fillStyle = "#999";
  ctx.fillRect(fx - 5, fy - 6, 10, 3);
  ctx.fillRect(fx - 5, fy - 14, 10, 3);
  // Top cap
  ctx.fillStyle = "#9a9a9a";
  ctx.beginPath(); ctx.ellipse(fx, fy - 22, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "#aaa";
  ctx.beginPath(); ctx.ellipse(fx, fy - 24, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
  // Top ornament
  ctx.fillStyle = C.uiGold;
  ctx.fillRect(fx - 2, fy - 30, 4, 7);
  ctx.fillStyle = "#FFE066";
  ctx.fillRect(fx - 4, fy - 32, 8, 3);

  // ── Water jets (8 streams cascading down) ──
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + tick * 0.015;
    // Top jets spraying outward
    const jx = fx + Math.cos(angle) * 6;
    const jy = fy - 20 + Math.sin(angle) * 2;
    const endX = fx + Math.cos(angle) * 22;
    const endY = fy + 2 + Math.abs(Math.sin(angle)) * 4;
    ctx.strokeStyle = "rgba(100,180,255,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(jx, jy);
    ctx.quadraticCurveTo(jx + (endX - jx) * 0.5, jy - 8 + Math.sin(tick * 0.06 + i) * 2, endX, endY);
    ctx.stroke();
  }

  // ── Cascading water from middle to base ──
  for (let i = 0; i < 12; i++) {
    const ca = (i / 12) * Math.PI * 2;
    const cPhase = tick * 0.06 + i * 0.5;
    const drop = (cPhase % 1);
    const cx2 = fx + Math.cos(ca) * (18 + drop * 20);
    const cy2 = fy + 2 + drop * 12 + Math.sin(ca) * (8 + drop * 6);
    ctx.globalAlpha = 0.5 * (1 - drop);
    ctx.fillStyle = "#80b8ff";
    ctx.fillRect(cx2 - 1, cy2 - 1, 2, 3);
  }
  ctx.globalAlpha = 1;

  // ── Spray mist particles ──
  for (let i = 0; i < 5; i++) {
    const mPhase = (tick * 0.04 + i * 0.7) % 1;
    const mx = fx + Math.sin(tick * 0.02 + i * 1.3) * 14;
    const my = fy - 28 - mPhase * 12;
    ctx.globalAlpha = 0.3 * (1 - mPhase);
    ctx.fillStyle = "#b0d8ff";
    ctx.beginPath(); ctx.ellipse(mx, my, 3 + mPhase * 2, 2 + mPhase, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // ── Light glow on water ──
  const glowR = 48 + Math.sin(tick * 0.03) * 4;
  const grd = ctx.createRadialGradient(fx, fy + 10, 0, fx, fy + 10, glowR);
  grd.addColorStop(0, "rgba(100,160,255,0.08)");
  grd.addColorStop(0.6, "rgba(80,140,240,0.04)");
  grd.addColorStop(1, "rgba(60,120,220,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(fx - glowR, fy + 10 - glowR, glowR * 2, glowR * 2);
}

export function smoke(ctx, cx, cy, tick, nightAmount = 0) {
  BUILDINGS.filter(b=>b.hasChimney).forEach(b=>{const bx=b.x*T+b.w*T-20,by=b.y*T-10;for(let i=0;i<5;i++){const age=(tick*0.8+i*30)%150;const sx=bx+Math.sin(age*0.05+i)*8-cx,sy=by-age*0.5-cy,a=Math.max(0,1-age/150)*(0.3+nightAmount*0.15),sz=3+age*0.06;ctx.globalAlpha=a;const smokeColor=nightAmount>0.3?"rgba(200,160,120,0.9)":"#aaa";ctx.fillStyle=smokeColor;ctx.beginPath();ctx.ellipse(sx,sy,sz,sz*0.7,0,0,Math.PI*2);ctx.fill();}});ctx.globalAlpha=1;
}

export function clouds(ctx, cloudList, cx, windMul = 1) {
  cloudList.forEach(c=>{c.x+=c.speed*windMul;if(c.x>COLS*T+120)c.x=-c.w-60;if(c.x<-c.w-120)c.x=COLS*T+60;const px=c.x-cx,py=c.y;if(px>CW+120||px+c.w<-120)return;ctx.globalAlpha=c.opacity;ctx.fillStyle="#fff";ctx.beginPath();ctx.ellipse(px+c.w/2,py+c.h/2,c.w/2,c.h/2,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(px+c.w*0.3,py+c.h*0.6,c.w*0.3,c.h*0.4,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;});
}
