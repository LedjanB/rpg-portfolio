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
import { sfx } from "../engine/sound.js";
import { moveWithCollision } from "../engine/collision.js";
import { findNearDoor, findNearNPC, isNearCat, isNearHorse, findNearSign } from "../engine/proximity.js";
import { findNearFishingSpot, updateFishing } from "../engine/fishing.js";
import { getBreakableState, findNearBreakable, updateBreakables } from "../engine/breakables.js";
import { updateGarden, findNearPlot } from "../engine/garden.js";
import { Render } from "../render/index.js";

export function useGameLoop(canvasRef, keysRef, gameRef, horseRef, coinsRef, coinCountRef, dialogueRef, panelRef, started, setCoinCount, setEasterEgg, setDialogue, fishingRef, breakablesRef, gardenRef) {
  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CW * dpr;
    canvas.height = CH * dpr;
    canvas.style.width = CW + "px";
    canvas.style.height = CH + "px";
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;
    let raf;
    const particles = new Particles();
    const cat = createCat();
    const horse = horseRef.current;
    const cloudList = createClouds();
    // Break effect timers
    const breakEffects = [];

    const scanlineCanvas = document.createElement("canvas");
    scanlineCanvas.width = 1;
    scanlineCanvas.height = 4;
    const slCtx = scanlineCanvas.getContext("2d");
    slCtx.fillStyle = "rgba(0,0,0,0.03)";
    slCtx.fillRect(0, 0, 1, 2);
    const scanlinePattern = ctx.createPattern(scanlineCanvas, "repeat");

    const loop = () => {
      const g = gameRef.current;
      const fs = fishingRef.current;
      const garden = gardenRef.current;
      g.tick++;

      // Movement (blocked while fishing)
      if (!dialogueRef.current && !panelRef.current && fs.state === "idle") {
        const k = keysRef.current;
        const speed = horse.mounted ? WORLD.playerSpeed * HORSE.rideSpeedMultiplier : WORLD.playerSpeed;
        let dx = 0, dy = 0;
        if (k.ArrowUp||k.w||k.W) { dy = -speed; g.dir = 1; }
        if (k.ArrowDown||k.s||k.S) { dy = speed; g.dir = 0; }
        if (k.ArrowLeft||k.a||k.A) { dx = -speed; g.dir = 2; }
        if (k.ArrowRight||k.d||k.D) { dx = speed; g.dir = 3; }

        if (dx || dy) {
          g.moving = true; g.frame++;
          if (dx && dy) { dx *= 0.707; dy *= 0.707; }
          const result = moveWithCollision(g.px, g.py, dx, dy);
          g.px = result.x;
          g.py = result.y;

          if (horse.mounted) {
            horse.x = g.px;
            horse.y = g.py;
            horse.dir = g.dir;
            horse.frame = g.frame;
          }

          const pc = Math.floor((g.px+16)/T), pr = Math.floor((g.py+24)/T);
          if (MAP.paths.has(`${pc},${pr}`) && g.tick%4===0)
            particles.add(g.px+12+Math.random()*8, g.py+28, Math.random()*0.6-0.3, -0.3-Math.random()*0.3, 15+Math.random()*10, "rgba(180,160,120,0.6)", 2);

          g.stepCd--; if (g.stepCd <= 0) { sfx.step(); g.stepCd = 12; }
        } else { g.moving = false; g.stepCd = 0; }
      }

      // Coin collection
      COIN_POSITIONS.forEach(([cx2,cy2], i) => {
        if (!coinsRef.current[i] && Math.abs(g.px-cx2*T)<T && Math.abs(g.py-cy2*T)<T) {
          coinsRef.current[i] = true;
          coinCountRef.current++;
          setCoinCount(coinCountRef.current);
          sfx.coin();
          for (let j=0; j<8; j++) particles.add(cx2*T+16, cy2*T+16, Math.random()*3-1.5, -Math.random()*2-1, 20, "#FFD700", 3);
          if (coinCountRef.current === COIN_POSITIONS.length) {
            setEasterEgg(true); sfx.secret();
            setDialogue({ speaker: "QUEST COMPLETE!", lines: [
              `Congratulations, you found\nall ${COIN_POSITIONS.length} hidden coins! 🎉`,
              "You've fully explored the\nvillage... so does this\nmean I'm hired?? 😏",
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

      // Cat AI
      updateCat(cat);

      // Horse AI
      updateHorse(horse);

      // Fishing update
      updateFishing(fs);

      // Breakables update
      updateBreakables();

      // Garden update
      updateGarden(garden);

      // Break effect particles cleanup
      for (let i = breakEffects.length - 1; i >= 0; i--) {
        breakEffects[i].timer--;
        if (breakEffects[i].timer <= 0) breakEffects.splice(i, 1);
      }

      // Leaf particles
      if (g.tick%25===0 && MAP.trees.length>0) {
        const [tx,ty] = MAP.trees[Math.floor(Math.random()*MAP.trees.length)];
        particles.add(tx*T+8+Math.random()*16, ty*T+4, -0.2+Math.random()*0.4, 0.3+Math.random()*0.3, 80+Math.random()*40, C.leaf, 2);
      }
      particles.update();

      // Proximity detection
      g.nearDoor = findNearDoor(g.px, g.py);
      g.nearNPC = findNearNPC(g.px, g.py);
      g.nearCat = isNearCat(g.px, g.py, cat.x, cat.y);
      g.nearHorse = !horse.mounted && isNearHorse(g.px, g.py, horse.x, horse.y);
      g.nearSign = findNearSign(g.px, g.py);
      g.nearFishingSpot = findNearFishingSpot(g.px, g.py);
      g.nearBreakable = findNearBreakable(g.px, g.py);
      g.nearGardenPlot = findNearPlot(g.px, g.py, garden);

      // Camera
      const camX = Math.max(0, Math.min(g.px - CW/2 + T/2, MAP.col[0].length*T - CW));
      const camY = Math.max(0, Math.min(g.py - CH/2 + T/2, MAP.col.length*T - CH));

      // ── Draw everything ──
      ctx.clearRect(0, 0, CW, CH);
      Render.ground(ctx, camX, camY, g.tick);
      Render.clouds(ctx, cloudList, camX);
      Render.dock(ctx, camX, camY);
      Render.reeds(ctx, camX, camY, g.tick);
      Render.lilypads(ctx, camX, camY, g.tick);
      FLOWER_POSITIONS.forEach(([fc,fr,ft]) => Render.flower(ctx, fc, fr, ft, camX, camY, g.tick));

      // Garden plots
      garden.forEach(plot => Render.gardenPlot(ctx, plot, camX, camY, g.tick));

      MAP.filteredFences.forEach(([fx,fy]) => Render.fence(ctx, fx, fy, camX, camY));
      PROPS.forEach(p => Render.prop(ctx, p, camX, camY));

      // Breakable props (only draw intact ones)
      const bState = getBreakableState();
      bState.forEach(p => {
        if (!p.broken) Render.prop(ctx, p, camX, camY);
      });
      // Break effects
      breakEffects.forEach(e => Render.breakEffect(ctx, e.x, e.y, camX, camY, e.timer));

      Render.fountain(ctx, camX, camY, g.tick);
      BUILDINGS.forEach(b => Render.building(ctx, b, camX, camY));
      Render.smoke(ctx, camX, camY, g.tick);
      LAMPPOST_POSITIONS.forEach(([tc,tr]) => Render.lamppost(ctx, tc, tr, camX, camY, g.tick));
      COIN_POSITIONS.forEach(([cx2,cy2], i) => Render.coin(ctx, cx2, cy2, camX, camY, g.tick, coinsRef.current[i]));
      if (coinCountRef.current === COIN_POSITIONS.length) Render.easterEgg(ctx, camX, camY, g.tick);

      // Fishing visuals
      if (fs.state !== "idle") {
        Render.bobber(ctx, fs.spot, camX, camY, g.tick, fs.state);
        if (fs.state === "caught") Render.fishCaughtPopup(ctx, fs.spot, camX, camY, g.tick, fs.fishName);
        if (fs.state === "missed") Render.fishMissedPopup(ctx, fs.spot, camX, camY, g.tick);
      }

      Render.cat(ctx, cat, camX, camY);
      NPCS.forEach(n => Render.character(ctx, n.x*T, n.y*T, n.dir, g.tick, camX, camY, n.hairC, n.shirtC, false));
      if (!horse.mounted) Render.horse(ctx, horse, camX, camY);
      if (horse.mounted) {
        Render.horse(ctx, horse, camX, camY);
        Render.character(ctx, g.px, g.py-10, g.dir, g.moving ? g.frame : 0, camX, camY, C.hair, C.shirt, true);
      } else {
        Render.character(ctx, g.px, g.py, g.dir, g.moving ? g.frame : 0, camX, camY, C.hair, C.shirt, true);
      }
      MAP.trees.forEach(([tc,tr]) => Render.tree(ctx, tc, tr, camX, camY, g.tick));
      particles.draw(ctx, camX, camY);

      // Interaction hints
      if (!dialogueRef.current && !panelRef.current) {
        if (g.nearDoor) { const b = BUILDINGS.find(bb => bb.id === g.nearDoor); if (b) Render.hint(ctx, b.doorX*T, b.doorY*T, camX, camY, g.tick); }
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

      // Scanlines
      if (scanlinePattern) { ctx.fillStyle = scanlinePattern; ctx.fillRect(0, 0, CW, CH); }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, canvasRef, keysRef, gameRef, horseRef, coinsRef, coinCountRef, dialogueRef, panelRef, setCoinCount, setEasterEgg, setDialogue, fishingRef, breakablesRef, gardenRef]);
}
