import { useEffect } from "react";
import { WORLD } from "../config/player.js";
import { BUILDINGS } from "../config/buildings.js";
import { NPCS } from "../config/npcs.js";
import { COIN_POSITIONS, FLOWER_POSITIONS, LAMPPOST_POSITIONS, PROPS } from "../config/world.js";
import { T, CW, CH, C } from "../engine/constants.js";
import { MAP } from "../engine/map.js";
import { Particles } from "../engine/particles.js";
import { createCat, updateCat } from "../engine/cat.js";
import { updateHorse } from "../engine/horse.js";
import { HORSE } from "../config/npcs.js";
import { createClouds } from "../engine/clouds.js";
import { sfx, playRainAmbient, setAmbientNight } from "../engine/sound.js";
import { moveWithCollision } from "../engine/collision.js";
import { findNearDoor, findNearNPC, isNearCat, isNearHorse, findNearSign } from "../engine/proximity.js";
import { findNearFishingSpot, updateFishing } from "../engine/fishing.js";
import { getBreakableState, findNearBreakable, updateBreakables } from "../engine/breakables.js";
import { updateGarden, findNearPlot } from "../engine/garden.js";
import { onRapidKeys, onStep, onCoinCollect } from "../engine/easterEggs.js";
import { Render } from "../render/index.js";
// New systems
import { getNightAmount, updateFireflies, drawFireflies, drawStars, drawDayNightOverlay, drawBuildingGlow, triggerLightning, drawLightningFlash, getShadowAngle } from "../engine/daynight.js";
import { createWeatherState, updateWeather, drawRain, getWindMultiplier } from "../engine/weather.js";
import { updateButterflies, drawButterflies, updateBirds, drawBirds, updatePollen, drawPollen } from "../engine/wildlife.js";
import { updateNPCs, getBreathingOffset, getEmoteState } from "../engine/npcBehavior.js";
import { grassTufts, waterShimmer, emoteBubble, getScreenShake, triggerScreenShake, addFootprint, updateFootprints, drawFootprints, doorTooltip, getSeasonalFlowerColors, updateTransition, drawTransition, updateIdleState, getIdleState, getIdleTimer, waterReflections, getTerrainParticle, updateToasts, drawToasts } from "../render/atmosphere.js";

export function useGameLoop(canvasRef, keysRef, gameRef, horseRef, coinsRef, coinCountRef, dialogueRef, panelRef, started, setCoinCount, setEasterEgg, setDialogue, fishingRef, breakablesRef, gardenRef) {
  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // Use 1:1 pixel ratio — CSS transform handles scaling to viewport.
    // Avoids DPR sub-pixel artifacts that cause tile seam jitter.
    canvas.width = CW;
    canvas.height = CH;
    canvas.style.width = CW + "px";
    canvas.style.height = CH + "px";
    ctx.imageSmoothingEnabled = false;
    let raf;
    const particles = new Particles();
    const cat = createCat();
    const horse = horseRef.current;
    const cloudList = createClouds();
    const breakEffects = [];
    const weather = createWeatherState();
    const seasonalColors = getSeasonalFlowerColors();

    // Smooth camera state
    let smoothCamX = 0, smoothCamY = 0;
    let camInitialized = false;

    const scanlineCanvas = document.createElement("canvas");
    scanlineCanvas.width = 1;
    scanlineCanvas.height = 4;
    const slCtx = scanlineCanvas.getContext("2d");
    slCtx.fillStyle = "rgba(0,0,0,0.03)";
    slCtx.fillRect(0, 0, 1, 2);
    const scanlinePattern = ctx.createPattern(scanlineCanvas, "repeat");

    // Coin squash-stretch animation state
    const coinAnims = {};

    const loop = () => {
      const g = gameRef.current;
      const fs = fishingRef.current;
      const garden = gardenRef.current;
      g.tick++;

      // ── Movement (blocked while fishing) ──
      if (!dialogueRef.current && !panelRef.current && fs.state === "idle") {
        const k = keysRef.current;
        const sprinting = k.Shift;
        const sprintMul = sprinting ? 1.5 : 1;
        const speed = (horse.mounted ? WORLD.playerSpeed * HORSE.rideSpeedMultiplier : WORLD.playerSpeed) * sprintMul;
        let dx = 0, dy = 0;
        if (k.ArrowUp||k.w||k.W) { dy = -speed; g.dir = 1; }
        if (k.ArrowDown||k.s||k.S) { dy = speed; g.dir = 0; }
        if (k.ArrowLeft||k.a||k.A) { dx = -speed; g.dir = 2; }
        if (k.ArrowRight||k.d||k.D) { dx = speed; g.dir = 3; }

        if (dx || dy) {
          g.moving = true; g.frame++;
          if (dx && dy) { dx *= 0.707; dy *= 0.707; }
          const result = moveWithCollision(g.px, g.py, dx, dy);
          // Round player position to integers for pixel-perfect rendering
          g.px = Math.round(result.x);
          g.py = Math.round(result.y);

          // Easter egg: rapid key mashing
          const rapidEE = onRapidKeys(g.tick);
          if (rapidEE && !dialogueRef.current) setDialogue({ speaker: rapidEE.speaker, lines: rapidEE.lines, idx: 0 });

          // Easter egg: marathon runner (step counter)
          if (g.tick % 8 === 0) {
            const stepEE = onStep();
            if (stepEE && !dialogueRef.current) setDialogue({ speaker: stepEE.speaker, lines: stepEE.lines, idx: 0 });
          }

          if (horse.mounted) {
            horse.x = g.px;
            horse.y = g.py;
            horse.dir = g.dir;
            horse.frame = g.frame;
          }

          // Terrain-specific particles
          const pc = Math.floor((g.px+16)/T), pr = Math.floor((g.py+24)/T);
          const onPath = MAP.paths.has(`${pc},${pr}`);
          const onCobble = MAP.cobble.has(`${pc},${pr}`);

          if (g.tick % 4 === 0) {
            const tp = getTerrainParticle(g.px, g.py);
            particles.add(g.px+12+Math.random()*8, g.py+28, Math.random()*0.6-0.3, tp.vy-Math.random()*0.3, tp.life, tp.color, tp.size);
          }

          // Sprint dust trail
          if (sprinting && g.tick % 3 === 0) {
            particles.add(g.px+12+Math.random()*8, g.py+30, Math.random()*0.4-0.2, -0.2-Math.random()*0.2, 10, "rgba(200,180,140,0.4)", 1.5);
          }

          // Footprint trail on paths
          if (onPath && g.tick % 16 === 0) {
            addFootprint(g.px, g.py);
          }

          // Contextual footstep sounds
          g.stepCd--;
          if (g.stepCd <= 0) {
            const stepInterval = horse.mounted ? 8 : 12;
            if (horse.mounted) sfx.stepHorse();
            else if (onCobble) sfx.stepCobble();
            else if (onPath) sfx.stepDirt();
            else sfx.stepGrass();
            g.stepCd = stepInterval;
          }
        } else { g.moving = false; g.stepCd = 0; }
      }

      // ── Coin collection with squash-stretch ──
      COIN_POSITIONS.forEach(([cx2,cy2], i) => {
        if (!coinsRef.current[i] && Math.abs(g.px-cx2*T)<T && Math.abs(g.py-cy2*T)<T) {
          coinsRef.current[i] = true;
          coinCountRef.current++;
          setCoinCount(coinCountRef.current);
          sfx.coin();
          // Squash-stretch animation
          coinAnims[i] = { frame: 0 };
          for (let j=0; j<8; j++) particles.add(cx2*T+16, cy2*T+16, Math.random()*3-1.5, -Math.random()*2-1, 20, "#FFD700", 3);
          // Easter egg: coin magnet
          const coinEE = onCoinCollect(g.tick);
          if (coinEE && !dialogueRef.current) setDialogue({ speaker: coinEE.speaker, lines: coinEE.lines, idx: 0 });
          if (coinCountRef.current === COIN_POSITIONS.length) {
            setEasterEgg(true); sfx.secret();
            setDialogue({ speaker: "QUEST COMPLETE!", lines: [
              `Congratulations, you found\nall ${COIN_POSITIONS.length} hidden coins!`,
              "You've fully explored the\nvillage... so does this\nmean I'm hired??",
              "Thanks for playing!\nFeel free to reach out\nat the POST OFFICE!",
            ], idx: 0, autoClose: 10000 });
            setTimeout(() => {
              for (let j = 0; j < coinsRef.current.length; j++) coinsRef.current[j] = false;
              coinCountRef.current = 0;
              setCoinCount(0);
              setEasterEgg(false);
            }, 12000);
          }
        }
      });

      // Update coin squash-stretch animations
      for (const key in coinAnims) {
        coinAnims[key].frame++;
        if (coinAnims[key].frame > 10) delete coinAnims[key];
      }

      // ── AI Updates ──
      updateCat(cat);
      updateHorse(horse);
      updateFishing(fs);
      updateBreakables();
      updateGarden(garden);
      updateFootprints();

      // ── New system updates ──
      updateWeather(weather, g.tick);
      const windMul = getWindMultiplier(weather);
      const nightAmount = getNightAmount(g.tick);
      const mapW = WORLD.cols * T;
      const mapH = WORLD.rows * T;
      updateFireflies(g.tick, nightAmount, mapW, mapH);
      updateButterflies(g.tick);
      updateBirds(g.tick);
      updatePollen(g.tick, windMul >= 1 ? 1 : -1);
      updateNPCs(NPCS, g.px, g.py, g.tick);

      // Update idle state, transitions, toasts
      updateIdleState(g.moving);
      updateTransition();
      updateToasts();

      // Night ambient sounds (crickets vs birds)
      setAmbientNight(nightAmount > 0.5);

      // Rain ambient sound
      if (weather.raining && g.tick % 6 === 0) {
        playRainAmbient(weather.rainIntensity);
      }
      // Thunder + lightning during rain
      if (weather.raining && weather.rainIntensity > 0.7 && Math.random() < 0.001) {
        sfx.thunder();
        triggerLightning();
      }

      // Get shadow info for this frame
      const shadow = getShadowAngle(g.tick);

      // Break effect particles cleanup
      for (let i = breakEffects.length - 1; i >= 0; i--) {
        breakEffects[i].timer--;
        if (breakEffects[i].timer <= 0) breakEffects.splice(i, 1);
      }

      // Leaf particles (wind-affected)
      if (g.tick%25===0 && MAP.trees.length>0) {
        const [tx,ty] = MAP.trees[Math.floor(Math.random()*MAP.trees.length)];
        const leafVx = -0.2 + Math.random() * 0.4 + (windMul - 1) * 0.5;
        particles.add(tx*T+8+Math.random()*16, ty*T+4, leafVx, 0.3+Math.random()*0.3, 80+Math.random()*40, C.leaf, 2);
      }
      particles.update();

      // ── Proximity detection ──
      g.nearDoor = findNearDoor(g.px, g.py);
      g.nearNPC = findNearNPC(g.px, g.py);
      g.nearCat = isNearCat(g.px, g.py, cat.x, cat.y);
      g.nearHorse = !horse.mounted && isNearHorse(g.px, g.py, horse.x, horse.y);
      g.nearSign = findNearSign(g.px, g.py);
      g.nearFishingSpot = findNearFishingSpot(g.px, g.py);
      g.nearBreakable = findNearBreakable(g.px, g.py);
      g.nearGardenPlot = findNearPlot(g.px, g.py, garden);

      // ── Pixel-perfect camera ──
      // Direct tracking with integer snap — no lerp means no stutter.
      // Player pos is already integer, so camera stays perfectly aligned.
      const targetCamX = Math.max(0, Math.min(g.px - CW/2 + T/2, MAP.col[0].length*T - CW));
      const targetCamY = Math.max(0, Math.min(g.py - CH/2 + T/2, MAP.col.length*T - CH));

      if (!camInitialized) {
        smoothCamX = targetCamX;
        smoothCamY = targetCamY;
        camInitialized = true;
      } else {
        // Fast catch-up: move most of the way each frame, then snap when close
        const dx = targetCamX - smoothCamX;
        const dy = targetCamY - smoothCamY;
        smoothCamX += Math.abs(dx) < 1 ? dx : dx * 0.25;
        smoothCamY += Math.abs(dy) < 1 ? dy : dy * 0.25;
      }

      const shake = getScreenShake();
      const camX = Math.round(smoothCamX) + Math.round(shake.x);
      const camY = Math.round(smoothCamY) + Math.round(shake.y);

      // Expose screen shake trigger and break effects for interaction handler
      g._triggerShake = triggerScreenShake;
      g._breakEffects = breakEffects;

      // ── Draw everything ──
      ctx.clearRect(0, 0, CW, CH);

      // Stars (behind everything, only at night)
      drawStars(ctx, CW, CH, g.tick, nightAmount);

      Render.ground(ctx, camX, camY, g.tick);
      waterShimmer(ctx, camX, camY, g.tick);
      waterReflections(ctx, camX, camY, g.tick);
      grassTufts(ctx, camX, camY, g.tick, windMul);
      drawFootprints(ctx, camX, camY);
      Render.clouds(ctx, cloudList, camX, windMul);
      drawBirds(ctx);
      Render.dock(ctx, camX, camY);
      Render.reeds(ctx, camX, camY, g.tick);
      Render.lilypads(ctx, camX, camY, g.tick);

      // Seasonal flowers
      FLOWER_POSITIONS.forEach(([fc,fr,ft]) => Render.flower(ctx, fc, fr, ft, camX, camY, g.tick, seasonalColors));

      // Garden plots
      garden.forEach(plot => Render.gardenPlot(ctx, plot, camX, camY, g.tick));

      MAP.filteredFences.forEach(([fx,fy]) => Render.fence(ctx, fx, fy, camX, camY));
      PROPS.forEach(p => Render.prop(ctx, p, camX, camY));

      // Breakable props
      const bState = getBreakableState();
      bState.forEach(p => {
        if (!p.broken) Render.prop(ctx, p, camX, camY);
      });
      breakEffects.forEach(e => Render.breakEffect(ctx, e.x, e.y, camX, camY, e.timer));

      Render.fountain(ctx, camX, camY, g.tick);
      BUILDINGS.forEach(b => Render.building(ctx, b, camX, camY));

      // Building window glow at night
      drawBuildingGlow(ctx, BUILDINGS, camX, camY, g.tick, nightAmount);

      Render.smoke(ctx, camX, camY, g.tick, nightAmount);
      LAMPPOST_POSITIONS.forEach(([tc,tr]) => Render.lamppost(ctx, tc, tr, camX, camY, g.tick, nightAmount));

      // Coins with squash-stretch
      COIN_POSITIONS.forEach(([cx2,cy2], i) => {
        const anim = coinAnims[i];
        Render.coin(ctx, cx2, cy2, camX, camY, g.tick, coinsRef.current[i], anim);
      });
      if (coinCountRef.current === COIN_POSITIONS.length) Render.easterEgg(ctx, camX, camY, g.tick);

      // Fishing visuals
      if (fs.state !== "idle") {
        Render.bobber(ctx, fs.spot, camX, camY, g.tick, fs.state);
        if (fs.state === "caught") Render.fishCaughtPopup(ctx, fs.spot, camX, camY, g.tick, fs.fishName);
        if (fs.state === "missed") Render.fishMissedPopup(ctx, fs.spot, camX, camY, g.tick);
      }

      Render.cat(ctx, cat, camX, camY);

      // NPCs with breathing + emote bubbles
      NPCS.forEach(n => {
        const breathOffset = getBreathingOffset(n.id, g.tick);
        Render.character(ctx, n.x*T, n.y*T + breathOffset, n.dir, g.tick, camX, camY, n.hairC, n.shirtC, false);
        // Emote bubble
        const emote = getEmoteState(n.id);
        if (emote) emoteBubble(ctx, n.x*T, n.y*T + breathOffset, camX, camY, emote, g.tick);
      });

      // Horse and player
      if (!horse.mounted) Render.horse(ctx, horse, camX, camY);
      if (horse.mounted) {
        Render.horse(ctx, horse, camX, camY);
        Render.character(ctx, g.px, g.py-10, g.dir, g.moving ? g.frame : 0, camX, camY, C.hair, C.shirt, true);
      } else {
        Render.character(ctx, g.px, g.py, g.dir, g.moving ? g.frame : 0, camX, camY, C.hair, C.shirt, true);
      }
      MAP.trees.forEach(([tc,tr]) => Render.tree(ctx, tc, tr, camX, camY, g.tick, windMul));
      particles.draw(ctx, camX, camY);

      // Butterflies & pollen
      drawButterflies(ctx, camX, camY, g.tick);
      drawPollen(ctx);

      // Fireflies (above most things)
      drawFireflies(ctx, camX, camY, g.tick);

      // Interaction hints with door tooltips
      if (!dialogueRef.current && !panelRef.current) {
        if (g.nearDoor) {
          const b = BUILDINGS.find(bb => bb.id === g.nearDoor);
          if (b) {
            doorTooltip(ctx, b, camX, camY, g.tick);
            Render.hint(ctx, b.doorX*T, b.doorY*T, camX, camY, g.tick);
          }
        }
        else if (g.nearCat) Render.hint(ctx, cat.x, cat.y, camX, camY, g.tick, "PET");
        else if (g.nearNPC) { const n = NPCS.find(nn => nn.id === g.nearNPC); if (n) Render.hint(ctx, n.x*T, n.y*T, camX, camY, g.tick, "TALK"); }
        else if (g.nearSign) Render.hint(ctx, g.nearSign.x*T, g.nearSign.y*T, camX, camY, g.tick, "READ");
        else if (g.nearFishingSpot && fs.state === "idle") Render.hint(ctx, g.nearFishingSpot.x*T, g.nearFishingSpot.y*T, camX, camY, g.tick, "FISH");
        else if (g.nearBreakable >= 0) { const bp = bState[g.nearBreakable]; if (bp) Render.hint(ctx, bp.x*T, bp.y*T, camX, camY, g.tick, "BREAK"); }
        else if (g.nearGardenPlot >= 0) { const gp = garden[g.nearGardenPlot]; if (gp) Render.hint(ctx, gp.x*T, gp.y*T, camX, camY, g.tick, "PLANT"); }
        if (fs.state === "waiting") Render.hint(ctx, g.px, g.py-16, camX, camY, g.tick, "WAIT...");
        if (fs.state === "bite") Render.hint(ctx, g.px, g.py-16, camX, camY, g.tick, "SPACE!");
        if (g.nearHorse) Render.hint(ctx, horse.x, horse.y, camX, camY, g.tick, "M: RIDE");
        if (horse.mounted) Render.hint(ctx, g.px, g.py-10, camX, camY, g.tick, "M: DISMOUNT");
      }

      // Rain overlay (screen-space)
      drawRain(ctx, weather);

      // Day/night tint overlay (on top of everything)
      drawDayNightOverlay(ctx, CW, CH, g.tick);

      // Lightning flash (during storms)
      drawLightningFlash(ctx, CW, CH);

      // Scanlines
      if (scanlinePattern) { ctx.fillStyle = scanlinePattern; ctx.fillRect(0, 0, CW, CH); }

      // Achievement toasts (on top of scanlines)
      drawToasts(ctx, CW);

      // Screen transition overlay (topmost)
      drawTransition(ctx, CW, CH);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, canvasRef, keysRef, gameRef, horseRef, coinsRef, coinCountRef, dialogueRef, panelRef, setCoinCount, setEasterEgg, setDialogue, fishingRef, breakablesRef, gardenRef]);
}
