import { useState, useEffect, useRef, useCallback } from "react";
import { WORLD, ZOOM_LEVELS, DEFAULT_ZOOM } from "../config/player.js";
import { NPCS, CAT } from "../config/npcs.js";
import { createHorse } from "../engine/horse.js";
import { isNearHorse } from "../engine/proximity.js";
import { COIN_POSITIONS, PROPS } from "../config/world.js";
import { T, CW, CH, COLS, ROWS, C } from "../engine/constants.js";
import { sfx, startMusic, stopMusic, startAmbient, stopAmbient, duckMusic } from "../engine/sound.js";
import { createFishingState, findNearFishingSpot, startFishing, reelIn } from "../engine/fishing.js";
import { createBreakableState, findNearBreakable, breakProp } from "../engine/breakables.js";
import { createQuestState, recordBuildingVisit, getQuestProgress } from "../engine/quests.js";
import { createGardenState, findNearPlot, plantSeed } from "../engine/garden.js";
import { onCatPet, onFountainInteract, onWellInteract, onNPCTalk, onFishCaught, onGardenCheck, onPropBreak, onMountToggle, onBuildingEnter } from "../engine/easterEggs.js";
import { useInput } from "../hooks/useInput.js";
import { useGameLoop } from "../hooks/useGameLoop.js";
import { KEYFRAMES } from "../styles.js";
import DialogueBox from "./DialogueBox.jsx";
import PortfolioPanel from "./PortfolioPanel.jsx";
import MobileControls from "./MobileControls.jsx";
import IntroScreen from "./IntroScreen.jsx";
import HUD from "./HUD.jsx";
import Minimap from "./Minimap.jsx";

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const gameRef = useRef({
    px: WORLD.playerStart.x * T,
    py: WORLD.playerStart.y * T,
    dir: 0, frame: 0, moving: false, tick: 0,
    nearDoor: null, nearNPC: null, nearCat: false, nearHorse: false, nearSign: null, stepCd: 0,
    nearFishingSpot: null, nearBreakable: -1, nearGardenPlot: -1,
  });

  const [dialogue, setDialogue] = useState(null);
  const [panel, setPanel] = useState(null);
  const [started, setStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [coinCount, setCoinCount] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [questProgress, setQuestProgress] = useState({ visited: 0, total: 8 });
  const [fishCount, setFishCount] = useState(0);

  const dialogueRef = useRef(null);
  const panelRef = useRef(null);
  const zoomWrapperRef = useRef(null);

  // Load saved progress from localStorage
  const savedProgress = useRef((() => {
    try {
      const saved = JSON.parse(localStorage.getItem("rpg-portfolio-progress"));
      if (saved && Array.isArray(saved.coins) && saved.coins.length === COIN_POSITIONS.length) return saved;
    } catch (_) { /* ignore */ }
    return { coins: COIN_POSITIONS.map(() => false), coinCount: 0, easterEgg: false, quest: null, fishCount: 0, garden: null };
  })());

  const coinsRef = useRef(savedProgress.current.coins);
  const coinCountRef = useRef(savedProgress.current.coinCount);
  const horseRef = useRef(createHorse());
  const fishingRef = useRef(createFishingState());
  const breakablesRef = useRef(createBreakableState());
  const questRef = useRef((() => {
    if (savedProgress.current.quest) return savedProgress.current.quest;
    return createQuestState();
  })());
  const gardenRef = useRef((() => {
    if (savedProgress.current.garden) return savedProgress.current.garden;
    return createGardenState();
  })());

  // Sync initial saved state into React state
  useEffect(() => {
    if (savedProgress.current.coinCount > 0) setCoinCount(savedProgress.current.coinCount);
    if (savedProgress.current.easterEgg) setEasterEgg(true);
    if (savedProgress.current.fishCount > 0) setFishCount(savedProgress.current.fishCount);
    if (savedProgress.current.quest) setQuestProgress(getQuestProgress(savedProgress.current.quest));
  }, []);

  // Persist progress to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("rpg-portfolio-progress", JSON.stringify({
        coins: coinsRef.current,
        coinCount,
        easterEgg,
        quest: questRef.current,
        fishCount,
        garden: gardenRef.current,
      }));
    } catch (_) { /* storage full or unavailable */ }
  }, [coinCount, easterEgg, fishCount, questProgress]);

  const [autoScale, setAutoScale] = useState(1);

  // Compute auto-scale to completely fill viewport — no black bars ever
  useEffect(() => {
    const update = () => {
      const scaleX = window.innerWidth / CW;
      const scaleY = window.innerHeight / CH;
      // Use max to cover the entire viewport, plus tiny buffer to prevent sub-pixel gaps
      setAutoScale(Math.max(scaleX, scaleY) + 0.01);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const zoomIn = useCallback(() => setZoom(z => { const i = ZOOM_LEVELS.indexOf(z); return i < ZOOM_LEVELS.length-1 ? ZOOM_LEVELS[i+1] : z; }), []);
  const zoomOut = useCallback(() => setZoom(z => { const i = ZOOM_LEVELS.indexOf(z); return i > 0 ? ZOOM_LEVELS[i-1] : z; }), []);

  useEffect(() => { dialogueRef.current = dialogue; }, [dialogue]);
  useEffect(() => {
    if (!dialogue?.autoClose) return;
    const timer = setTimeout(() => setDialogue(null), dialogue.autoClose);
    return () => clearTimeout(timer);
  }, [dialogue]);
  useEffect(() => { panelRef.current = panel; }, [panel]);
  useEffect(() => { setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0); }, []);

  // Start background music and ambient sounds when game starts
  useEffect(() => {
    if (started) { startMusic(); startAmbient(); }
    return () => { stopMusic(); stopAmbient(); };
  }, [started]);

  // Duck music during dialogue
  useEffect(() => {
    duckMusic(!!dialogue);
  }, [dialogue]);

  // ── Interaction Handler ──
  const handleInteract = useCallback(() => {
    const g = gameRef.current;
    const fs = fishingRef.current;

    // If fishing, handle reel-in
    if (fs.state === "bite" || fs.state === "waiting") {
      const caught = reelIn(fs);
      if (caught) {
        sfx.fishCatch();
        setFishCount(fc => {
          const newCount = fc + 1;
          // Easter egg: fish milestones
          setTimeout(() => {
            const fishEE = onFishCaught(newCount);
            if (fishEE) setDialogue({ speaker: fishEE.speaker, lines: fishEE.lines, idx: 0 });
          }, 1500);
          return newCount;
        });
      }
      return;
    }

    // Advance or close dialogue
    if (dialogueRef.current) {
      const d = dialogueRef.current;
      if (d.idx < d.lines.length - 1) setDialogue({ ...d, idx: d.idx + 1 });
      else setDialogue(null);
      return;
    }
    if (panelRef.current) { setPanel(null); return; }

    // Open building panel — auto-dismount and make horse wait
    if (g.nearDoor) {
      const h = horseRef.current;
      if (h.mounted) { h.mounted = false; h.waiting = true; }
      sfx.door();
      setPanel(g.nearDoor);
      // Easter egg: building visit tracker
      const buildEE = onBuildingEnter(g.nearDoor);
      if (buildEE) setTimeout(() => setDialogue({ speaker: buildEE.speaker, lines: buildEE.lines, idx: 0 }), 1000);
      // Record building visit for quest
      const justCompleted = recordBuildingVisit(questRef.current, g.nearDoor);
      setQuestProgress(getQuestProgress(questRef.current));
      if (justCompleted) {
        setTimeout(() => {
          sfx.quest();
          setDialogue({
            speaker: "QUEST COMPLETE!",
            lines: [
              "You've visited every\nbuilding in the village! 🎉",
              "The Grand Tour is done!\nYou truly explored it all!",
            ],
            idx: 0, autoClose: 8000,
          });
        }, 500);
      }
      return;
    }

    // Pet the cat
    if (g.nearCat) {
      sfx.talk();
      const catEE = onCatPet();
      if (catEE) {
        setDialogue({ speaker: catEE.speaker, lines: catEE.lines, idx: 0 });
      } else {
        setDialogue({ speaker: "CAT", lines: CAT.lines, idx: 0 });
      }
      return;
    }

    // Talk to NPC
    if (g.nearNPC) {
      sfx.talk();
      const npc = NPCS.find(n => n.id === g.nearNPC);
      if (npc) {
        setDialogue({ speaker: npc.label, lines: npc.lines, idx: 0 });
        // Easter egg: social butterfly (track talked NPCs)
        setTimeout(() => {
          const npcEE = onNPCTalk(g.nearNPC);
          if (npcEE) setDialogue({ speaker: npcEE.speaker, lines: npcEE.lines, idx: 0 });
        }, 3000);
      }
      return;
    }

    // Read sign
    if (g.nearSign) {
      sfx.talk();
      setDialogue({ speaker: "SIGNPOST", lines: [g.nearSign.text], idx: 0 });
      return;
    }

    // Start fishing
    if (g.nearFishingSpot && fs.state === "idle") {
      const spot = findNearFishingSpot(g.px, g.py);
      if (spot && startFishing(fs, spot)) {
        sfx.splash();
        return;
      }
    }

    // Break nearby prop
    if (g.nearBreakable >= 0) {
      if (breakProp(g.nearBreakable)) {
        sfx.breakProp();
        // Screen shake on break!
        if (g._triggerShake) g._triggerShake(6, 3);
        // Break effect particles
        if (g._breakEffects) {
          const bState2 = createBreakableState();
          const bp = bState2[g.nearBreakable];
          if (bp) g._breakEffects.push({ x: bp.x, y: bp.y, timer: 20 });
        }
        // Easter egg: property damage tracker
        const breakEE = onPropBreak(g.nearBreakable);
        if (breakEE) setTimeout(() => setDialogue({ speaker: breakEE.speaker, lines: breakEE.lines, idx: 0 }), 500);
        return;
      }
    }

    // Plant in garden
    if (g.nearGardenPlot >= 0) {
      if (plantSeed(gardenRef.current, g.nearGardenPlot)) {
        sfx.plant();
        // Easter egg: garden completion check
        setTimeout(() => {
          const gardenEE = onGardenCheck(gardenRef.current);
          if (gardenEE) setDialogue({ speaker: gardenEE.speaker, lines: gardenEE.lines, idx: 0 });
        }, 2000);
        return;
      }
    }

    // Easter egg: fountain wish (interact near fountain with nothing else around)
    const fountainEE = onFountainInteract(g.px, g.py);
    if (fountainEE) {
      setDialogue({ speaker: fountainEE.speaker, lines: fountainEE.lines, idx: 0 });
      return;
    }

    // Easter egg: well wish
    const wellEE = onWellInteract(g.px, g.py, PROPS);
    if (wellEE) {
      setDialogue({ speaker: wellEE.speaker, lines: wellEE.lines, idx: 0 });
      return;
    }
  }, []);

  // ── Mount / Dismount Horse ──
  const handleMount = useCallback(() => {
    const g = gameRef.current;
    const h = horseRef.current;
    if (dialogueRef.current || panelRef.current) return;

    if (h.mounted) {
      h.mounted = false;
      h.waiting = false;
      h.x = g.px;
      h.y = g.py;
      sfx.step();
    } else if (isNearHorse(g.px, g.py, h.x, h.y)) {
      h.mounted = true;
      h.waiting = false;
      h.x = g.px;
      h.y = g.py;
      h.dir = g.dir;
      sfx.step();
    }
    // Easter egg: rodeo clown (mount/dismount spam)
    const rodeoEE = onMountToggle(g.tick);
    if (rodeoEE) setDialogue({ speaker: rodeoEE.speaker, lines: rodeoEE.lines, idx: 0 });
  }, []);

  // Help overlay toggle
  const [showHelp, setShowHelp] = useState(false);
  const toggleHelp = useCallback(() => setShowHelp(h => !h), []);

  const keysRef = useInput(handleInteract, zoomIn, zoomOut, setPanel, setDialogue, dialogueRef, panelRef, handleMount, toggleHelp);
  useGameLoop(canvasRef, keysRef, gameRef, horseRef, coinsRef, coinCountRef, dialogueRef, panelRef, started, setCoinCount, setEasterEgg, setDialogue, fishingRef, breakablesRef, gardenRef);

  // ── Keep zoom centered on the player ──
  useEffect(() => {
    if (!started) return;
    let raf;
    const update = () => {
      const g = gameRef.current;
      const camX = Math.max(0, Math.min(g.px - CW/2 + T/2, COLS*T - CW));
      const camY = Math.max(0, Math.min(g.py - CH/2 + T/2, ROWS*T - CH));
      const pCX = g.px - camX + T/2;
      const pCY = g.py - camY + T/2;
      if (zoomWrapperRef.current) {
        zoomWrapperRef.current.style.transformOrigin = `${pCX}px ${pCY}px`;
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  // ── Intro Screen ──
  if (!started) return <IntroScreen onStart={() => setStarted(true)} />;

  // ── Game Screen ──
  return (
    <div style={{ width:"100%", height:"100vh", background:C.pageBg, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <style>{KEYFRAMES}</style>

      {/* Canvas — auto-scales to completely fill viewport, no black frame */}
      <div ref={zoomWrapperRef} style={{ position:"absolute", left:"50%", top:"50%", transform:`translate(-50%,-50%) scale(${autoScale * zoom})`, zIndex:1 }}>
        <canvas ref={canvasRef} width={CW} height={CH} role="img" aria-label="RPG Portfolio game — use arrow keys or WASD to move, Space to interact" style={{ width:CW, height:CH, imageRendering:"pixelated", display:"block" }}/>
      </div>

      {/* UI overlay — fixed to viewport, never zooms */}
      {dialogue && <DialogueBox speaker={dialogue.speaker} text={dialogue.lines[dialogue.idx]} hasMore={dialogue.idx < dialogue.lines.length - 1} onNext={handleInteract}/>}
      {panel && <PortfolioPanel sectionId={panel} onClose={() => { setPanel(null); horseRef.current.waiting = false; }}/>}
      {isMobile && !dialogue && !panel && <MobileControls keysRef={keysRef} onAction={handleInteract}/>}

      {!panel && !dialogue && <HUD coinCount={coinCount} easterEgg={easterEgg} zoom={zoom} zoomIn={zoomIn} zoomOut={zoomOut} questProgress={questProgress} fishCount={fishCount} gameRef={gameRef}/>}
      {!panel && !dialogue && <Minimap gameRef={gameRef} zoom={zoom}/>}

      {/* Help Overlay */}
      {showHelp && (
        <div onClick={toggleHelp} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:C.uiBg, border:`3px solid ${C.uiBorder}`, borderRadius:12, padding:"24px 32px", maxWidth:420, fontFamily:"'Press Start 2P',monospace" }}>
            <div style={{ color:C.uiGold, fontSize:12, marginBottom:16, textAlign:"center" }}>CONTROLS</div>
            <div style={{ color:C.uiText, fontSize:7, lineHeight:2.4 }}>
              {"WASD / Arrows .... Move\n" +
               "SPACE / Enter .... Interact\n" +
               "M ................ Mount Horse\n" +
               "SHIFT ............ Sprint\n" +
               "+/- or Scroll .... Zoom\n" +
               "H / ? ............ This Help\n" +
               "ESC .............. Close Panel\n\n" +
               "Explore buildings, talk to NPCs,\ncollect coins, fish, plant gardens,\nand discover easter eggs!"}
            </div>
            <div style={{ color:"#666", fontSize:6, marginTop:12, textAlign:"center" }}>Press any key to close</div>
          </div>
        </div>
      )}
    </div>
  );
}
