import { useEffect, useRef } from "react";

export function useInput(handleInteract, zoomIn, zoomOut, setPanel, setDialogue, dialogueRef, panelRef, handleMount) {
  const keysRef = useRef({});

  useEffect(() => {
    const onDown = e => {
      keysRef.current[e.key] = true;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); handleInteract(); }
      if (e.key === "Escape") { if (panelRef.current) setPanel(null); else if (dialogueRef.current) setDialogue(null); }
      if (e.key === "=" || e.key === "+") zoomIn();
      if (e.key === "-" || e.key === "_") zoomOut();
      if (e.key === "m" || e.key === "M") handleMount();
    };
    const onUp = e => { keysRef.current[e.key] = false; };
    const onWheel = e => { e.preventDefault(); if (e.deltaY < 0) zoomIn(); else zoomOut(); };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); window.removeEventListener("wheel", onWheel); };
  }, [handleInteract, zoomIn, zoomOut, setPanel, setDialogue, dialogueRef, panelRef, handleMount]);

  return keysRef;
}
