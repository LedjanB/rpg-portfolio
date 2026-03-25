import { useState, useEffect, useRef, useCallback } from "react";
import { WORLD, ZOOM_LEVELS, DEFAULT_ZOOM } from "../config/player.js";
import { NPCS, CAT } from "../config/npcs.js";
import { createHorse } from "../engine/horse.js";
import { isNearHorse } from "../engine/proximity.js";
import { COIN_POSITIONS } from "../config/world.js";
import { T, CW, CH, COLS, ROWS, C } from "../engine/constants.js";
import { sfx, startMusic, stopMusic } from "../engine/sound.js";
import { createFishingState, findNearFishingSpot, startFishing, reelIn } from "../engine/fishing.js";
import { createBreakableState, findNearBreakable, breakProp } from "../engine/breakables.js";
import { createQuestState, recordBuildingVisit, getQuestProgress } from "../engine/quests.js";
import { createGardenState, findNearPlot, plantSeed } from "../engine/garden.js";
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

  // Start background music when game starts
  useEffect(() => {
    if (started) startMusic();
    return () => stopMusic();
  }, [started]);

  // ── Interaction Handler ──
  const handleInteract = useCallback(() => {
    const g = gameRef.current;
    const fs = fishingRef.current;

    // If fishing, handle reel-in
    if (fs.state === "bite" || fs.state === "waiting") {
      const caught = reelIn(fs);
      if (caught) {
        sfx.fishCatch();
        setFishCount(fc => fc + 1);
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
      setDialogue({ speaker: "CAT", lines: CAT.lines, idx: 0 });
      return;
    }

    // Talk to NPC
    if (g.nearNPC) {
      sfx.talk();
      const npc = NPCS.find(n => n.id === g.nearNPC);
      if (npc) setDialogue({ speaker: npc.label, lines: npc.lines, idx: 0 });
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
        return;
      }
    }

    // Plant in garden
    if (g.nearGardenPlot >= 0) {
      if (plantSeed(gardenRef.current, g.nearGardenPlot)) {
        sfx.plant();
        return;
      }
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
  }, []);

  const keysRef = useInput(handleInteract, zoomIn, zoomOut, setPanel, setDialogue, dialogueRef, panelRef, handleMount);
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

      {/* Canvas — only this zooms */}
      <div ref={zoomWrapperRef} style={{ position:"relative", transform:`scale(${zoom})`, transition:"transform 0.2s ease-out", zIndex:1 }}>
        <canvas ref={canvasRef} width={CW} height={CH} role="img" aria-label="RPG Portfolio game — use arrow keys or WASD to move, Space to interact" style={{ width:CW, height:CH, imageRendering:"pixelated", borderRadius:4, boxShadow:"0 0 40px rgba(0,0,0,0.8)", display:"block" }}/>
      </div>

      {/* UI overlay — fixed to viewport, never zooms */}
      {dialogue && <DialogueBox speaker={dialogue.speaker} text={dialogue.lines[dialogue.idx]} hasMore={dialogue.idx < dialogue.lines.length - 1} onNext={handleInteract}/>}
      {panel && <PortfolioPanel sectionId={panel} onClose={() => { setPanel(null); horseRef.current.waiting = false; }}/>}
      {isMobile && !dialogue && !panel && <MobileControls keysRef={keysRef} onAction={handleInteract}/>}

      {!panel && !dialogue && <HUD coinCount={coinCount} easterEgg={easterEgg} zoom={zoom} zoomIn={zoomIn} zoomOut={zoomOut} questProgress={questProgress} fishCount={fishCount}/>}
      {!panel && !dialogue && <Minimap gameRef={gameRef} zoom={zoom}/>}
    </div>
  );
}
