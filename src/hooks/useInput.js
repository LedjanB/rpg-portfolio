import { useEffect, useRef } from "react";
import { onKeyForEasterEggs } from "../engine/easterEggs.js";

export function useInput(handleInteract, zoomIn, zoomOut, setPanel, setDialogue, dialogueRef, panelRef, handleMount, onToggleHelp) {
  const keysRef = useRef({});

  useEffect(() => {
    const onDown = e => {
      keysRef.current[e.key] = true;
      if (e.key === "Shift") keysRef.current.Shift = true;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleInteract(); }
      if (e.key === "Escape") { if (panelRef.current) setPanel(null); else if (dialogueRef.current) setDialogue(null); }
      if (e.key === "=" || e.key === "+") zoomIn();
      if (e.key === "-" || e.key === "_") zoomOut();
      if (e.key === "m" || e.key === "M") handleMount();
      if ((e.key === "?" || e.key === "h" || e.key === "H") && !dialogueRef.current && !panelRef.current) {
        if (onToggleHelp) onToggleHelp();
      }
      // Easter egg: Konami code detection
      const eeResult = onKeyForEasterEggs(e.key);
      if (eeResult && eeResult.type === "dialogue") {
        setDialogue({ speaker: eeResult.speaker, lines: eeResult.lines, idx: 0 });
      }
    };
    const onUp = e => {
      keysRef.current[e.key] = false;
      if (e.key === "Shift") keysRef.current.Shift = false;
    };
    const onWheel = e => { e.preventDefault(); if (e.deltaY < 0) zoomIn(); else zoomOut(); };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); window.removeEventListener("wheel", onWheel); };
  }, [handleInteract, zoomIn, zoomOut, setPanel, setDialogue, dialogueRef, panelRef, handleMount, onToggleHelp]);

  return keysRef;
}
