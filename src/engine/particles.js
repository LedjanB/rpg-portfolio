// ─── PARTICLE SYSTEM ─────────────────────────────────────────────
export class Particles {
  constructor(maxCount = 200) { this.list = []; this.max = maxCount; }
  add(x, y, vx, vy, life, color, size = 2) { if (this.list.length < this.max) this.list.push({ x, y, vx, vy, life, maxLife: life, color, size }); }
  update() { this.list = this.list.filter(p => { p.x += p.vx; p.y += p.vy; return --p.life > 0; }); }
  draw(ctx, cx, cy) { this.list.forEach(p => { ctx.globalAlpha = p.life / p.maxLife; ctx.fillStyle = p.color; ctx.fillRect(p.x-cx, p.y-cy, p.size, p.size); }); ctx.globalAlpha = 1; }
}
