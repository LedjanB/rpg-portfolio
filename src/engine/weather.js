// ─── WEATHER SYSTEM ─────────────────────────────────────────────
// Rain, wind gusts, and atmospheric effects

const MAX_RAIN_DROPS = 150;
const RAIN_DURATION = 900;   // 15 seconds at 60fps
const RAIN_COOLDOWN = 3600;  // 60 seconds between rain

export function createWeatherState() {
  return {
    raining: false,
    rainTimer: 0,
    cooldown: 600 + Math.random() * 1800, // start first rain sooner
    rainDrops: [],
    rainIntensity: 0, // 0-1, ramps up and down
    // Wind gust
    windActive: false,
    windTimer: 0,
    windCooldown: 200 + Math.random() * 400,
    windDir: 1, // 1 or -1
    windStrength: 0,
    // Puddles
    puddles: [],
  };
}

export function updateWeather(w, tick) {
  // ── Rain ──
  if (w.raining) {
    w.rainTimer--;
    // Ramp intensity
    const elapsed = RAIN_DURATION - w.rainTimer;
    if (elapsed < 120) w.rainIntensity = elapsed / 120;
    else if (w.rainTimer < 120) w.rainIntensity = w.rainTimer / 120;
    else w.rainIntensity = 1;

    if (w.rainTimer <= 0) {
      w.raining = false;
      w.cooldown = RAIN_COOLDOWN + Math.random() * 1800;
      w.rainIntensity = 0;
    }

    // Spawn rain drops
    const count = Math.floor(MAX_RAIN_DROPS * w.rainIntensity);
    while (w.rainDrops.length < count) {
      w.rainDrops.push({
        x: Math.random() * 720 - 40,
        y: -10 - Math.random() * 100,
        speed: 4 + Math.random() * 3,
        len: 4 + Math.random() * 6,
        drift: w.windActive ? w.windDir * (0.5 + Math.random()) : Math.random() * 0.4 - 0.2,
      });
    }

    // Update drops
    for (let i = w.rainDrops.length - 1; i >= 0; i--) {
      const d = w.rainDrops[i];
      d.y += d.speed;
      d.x += d.drift;
      if (d.y > 500) {
        // Create splash ripple occasionally
        if (Math.random() < 0.05 && w.puddles.length < 30) {
          w.puddles.push({ x: d.x, y: 490 + Math.random() * 10, life: 20, maxLife: 20 });
        }
        w.rainDrops.splice(i, 1);
      }
    }
  } else {
    w.cooldown--;
    if (w.cooldown <= 0) {
      w.raining = true;
      w.rainTimer = RAIN_DURATION;
    }
    // Clear lingering drops
    if (w.rainDrops.length > 0) {
      for (let i = w.rainDrops.length - 1; i >= 0; i--) {
        w.rainDrops[i].y += w.rainDrops[i].speed;
        if (w.rainDrops[i].y > 500) w.rainDrops.splice(i, 1);
      }
    }
  }

  // ── Wind gusts ──
  if (w.windActive) {
    w.windTimer--;
    const elapsed = 60 - w.windTimer;
    if (elapsed < 15) w.windStrength = elapsed / 15;
    else if (w.windTimer < 15) w.windStrength = w.windTimer / 15;
    else w.windStrength = 0.6 + Math.random() * 0.4;

    if (w.windTimer <= 0) {
      w.windActive = false;
      w.windCooldown = 200 + Math.random() * 400;
      w.windStrength = 0;
    }
  } else {
    w.windCooldown--;
    if (w.windCooldown <= 0) {
      w.windActive = true;
      w.windTimer = 60;
      w.windDir = Math.random() < 0.5 ? -1 : 1;
    }
  }

  // ── Puddles fade ──
  for (let i = w.puddles.length - 1; i >= 0; i--) {
    w.puddles[i].life--;
    if (w.puddles[i].life <= 0) w.puddles.splice(i, 1);
  }
}

export function drawRain(ctx, weather) {
  if (weather.rainDrops.length === 0) return;

  ctx.strokeStyle = `rgba(150,180,255,${0.4 * weather.rainIntensity})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (const d of weather.rainDrops) {
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x + d.drift * 2, d.y + d.len);
  }
  ctx.stroke();

  // Puddle ripples
  for (const p of weather.puddles) {
    const progress = 1 - p.life / p.maxLife;
    const r = 3 + progress * 6;
    ctx.globalAlpha = (1 - progress) * 0.3 * weather.rainIntensity;
    ctx.strokeStyle = "#8ab4f8";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, r, r * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// Returns wind multiplier for tree sway, cloud speed, etc.
export function getWindMultiplier(weather) {
  if (!weather.windActive) return 1;
  return 1 + weather.windStrength * 2 * weather.windDir;
}
