import { useState, useEffect, useRef, useCallback } from "react";
import { WORLD, ZOOM_LEVELS, DEFAULT_ZOOM } from "../config/player.js";
import { NPCS, CAT } from "../config/npcs.js";
import { COIN_POSITIONS } from "../config/world.js";
import { T, CW, CH, COLS, ROWS } from "../engine/constants.js";
import { sfx } from "../engine/sound.js";
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
    nearDoor: null, nearNPC: null, nearCat: false, nearSign: null, stepCd: 0,
  });

  const [dialogue, setDialogue] = useState(null);
  const [panel, setPanel] = useState(null);
  const [started, setStarted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [coinCount, setCoinCount] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const dialogueRef = useRef(null);
  const panelRef = useRef(null);
  const zoomWrapperRef = useRef(null);
  const coinsRef = useRef(COIN_POSITIONS.map(() => false));
  const coinCountRef = useRef(0);

  const zoomIn = useCallback(() => setZoom(z => { const i = ZOOM_LEVELS.indexOf(z); return i < ZOOM_LEVELS.length-1 ? ZOOM_LEVELS[i+1] : z; }), []);
  const zoomOut = useCallback(() => setZoom(z => { const i = ZOOM_LEVELS.indexOf(z); return i > 0 ? ZOOM_LEVELS[i-1] : z; }), []);

  useEffect(() => { dialogueRef.current = dialogue; }, [dialogue]);
  useEffect(() => { panelRef.current = panel; }, [panel]);
  useEffect(() => { setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0); }, []);

  // ── Interaction Handler ──
  const handleInteract = useCallback(() => {
    const g = gameRef.current;

    // Advance or close dialogue
    if (dialogueRef.current) {
      const d = dialogueRef.current;
      if (d.idx < d.lines.length - 1) setDialogue({ ...d, idx: d.idx + 1 });
      else setDialogue(null);
      return;
    }
    if (panelRef.current) { setPanel(null); return; }

    // Open building panel
    if (g.nearDoor) { sfx.door(); setPanel(g.nearDoor); return; }

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
    }
  }, []);

  const keysRef = useInput(handleInteract, zoomIn, zoomOut, setPanel, setDialogue, dialogueRef, panelRef);
  useGameLoop(canvasRef, keysRef, gameRef, coinsRef, coinCountRef, dialogueRef, panelRef, started, setCoinCount, setEasterEgg);

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
    <div style={{ width:"100%", height:"100vh", background:"#050808", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
      <style>{KEYFRAMES}</style>

      {/* Canvas — only this zooms */}
      <div ref={zoomWrapperRef} style={{ position:"relative", transform:`scale(${zoom})`, transition:"transform 0.2s ease-out", zIndex:1 }}>
        <canvas ref={canvasRef} width={CW} height={CH} role="img" aria-label="RPG Portfolio game — use arrow keys or WASD to move, Space to interact" style={{ width:CW, height:CH, imageRendering:"pixelated", borderRadius:4, boxShadow:"0 0 40px rgba(0,0,0,0.8)", display:"block" }}/>
      </div>

      {/* UI overlay — fixed to viewport, never zooms */}
      {dialogue && <DialogueBox speaker={dialogue.speaker} text={dialogue.lines[dialogue.idx]} hasMore={dialogue.idx < dialogue.lines.length - 1} onNext={handleInteract}/>}
      {panel && <PortfolioPanel sectionId={panel} onClose={() => setPanel(null)}/>}
      {isMobile && !dialogue && !panel && <MobileControls keysRef={keysRef} onAction={handleInteract}/>}

      {!panel && !dialogue && <HUD coinCount={coinCount} easterEgg={easterEgg} zoom={zoom} zoomIn={zoomIn} zoomOut={zoomOut}/>}
      {!panel && !dialogue && <Minimap gameRef={gameRef} zoom={zoom}/>}
    </div>
  );
}
