import { useState, useEffect } from "react";
import { COIN_POSITIONS } from "../config/world.js";
import { C } from "../engine/constants.js";
import { isMuted, toggleMute } from "../engine/sound.js";
import { f1 } from "../styles.js";

export default function HUD({ coinCount, easterEgg, zoom, zoomIn, zoomOut, questProgress, fishCount, gameRef }) {
  const [muted, setMuted] = useState(isMuted());
  const [playTime, setPlayTime] = useState("0:00");
  const handleToggleMute = () => setMuted(toggleMute());

  // Update play timer every second
  useEffect(() => {
    const iv = setInterval(() => {
      if (gameRef?.current) {
        const secs = Math.floor(gameRef.current.tick / 60);
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        setPlayTime(`${m}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [gameRef]);

  return (
    <>
      <div style={{ position:"absolute", top:8, left:8, zIndex:10, display:"flex", flexDirection:"column", gap:6, pointerEvents:"none" }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ ...f1, fontSize:7, color:"rgba(255,255,255,0.5)", background:"rgba(0,0,0,0.4)", padding:"6px 10px", borderRadius:4 }}>WASD: MOVE &nbsp; SPACE: INTERACT &nbsp; M: MOUNT &nbsp; +/-: ZOOM</div>
          <div style={{ ...f1, fontSize:8, color:C.uiGold, background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:4, display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ display:"inline-block", width:10, height:10, borderRadius:"50%", background:C.coin, boxShadow:`0 0 4px ${C.coin}` }}/>{coinCount}/{COIN_POSITIONS.length}{easterEgg && <span style={{ color:C.easterGreen, marginLeft:4 }}>★ SECRET UNLOCKED!</span>}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {questProgress && (
            <div style={{ ...f1, fontSize:7, color: questProgress.visited >= questProgress.total ? "#6BFFB8" : "#aaa", background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:4, display:"flex", alignItems:"center", gap:6 }}>
              🏠 TOUR: {questProgress.visited}/{questProgress.total}{questProgress.visited >= questProgress.total && <span style={{ color:"#6BFFB8", marginLeft:4 }}>✓ DONE!</span>}
            </div>
          )}
          {fishCount > 0 && (
            <div style={{ ...f1, fontSize:7, color:"#6BC5FF", background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:4 }}>
              🐟 {fishCount}
            </div>
          )}
          <div style={{ ...f1, fontSize:6, color:"#888", background:"rgba(0,0,0,0.4)", padding:"5px 10px", borderRadius:4 }}>
            {playTime}
          </div>
        </div>
      </div>
      <div style={{ position:"absolute", bottom:12, right:12, zIndex:10, display:"flex", gap:4 }}>
        <button onClick={handleToggleMute} aria-label={muted ? "Unmute sound" : "Mute sound"} style={{ width:32, height:32, background:"rgba(0,0,0,0.6)", border:`1px solid ${C.uiBorder}`, borderRadius:6, color: muted ? "#666" : C.uiGold, fontSize:14, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"auto" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.uiGold}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.uiBorder}}>{muted ? "🔇" : "🔊"}</button>
        {[["−",zoomOut,"Zoom out"],[null,null,null],["+",zoomIn,"Zoom in"]].map(([label,fn,ariaLabel],i) => i===1 ?
          <div key={i} aria-label={`Zoom level ${Math.round(zoom*100)}%`} style={{ width:44, height:32, background:"rgba(0,0,0,0.6)", border:`1px solid ${C.uiBorder}`, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", ...f1, fontSize:7, color:"#aaa" }}>{Math.round(zoom*100)}%</div> :
          <button key={i} onClick={fn} aria-label={ariaLabel} style={{ width:32, height:32, background:"rgba(0,0,0,0.6)", border:`1px solid ${C.uiBorder}`, borderRadius:6, color:"#ccc", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", lineHeight:1 }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.uiGold;e.currentTarget.style.color=C.uiGold}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.uiBorder;e.currentTarget.style.color="#ccc"}}>{label}</button>
        )}
      </div>
    </>
  );
}
