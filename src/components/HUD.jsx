import { useState } from "react";
import { COIN_POSITIONS } from "../config/world.js";
import { C } from "../engine/constants.js";
import { isMuted, toggleMute } from "../engine/sound.js";
import { f1 } from "../styles.js";

export default function HUD({ coinCount, easterEgg, zoom, zoomIn, zoomOut }) {
  const [muted, setMuted] = useState(isMuted());
  const handleToggleMute = () => setMuted(toggleMute());

  return (
    <>
      <div style={{ position:"absolute", top:8, left:8, zIndex:10, display:"flex", gap:12, alignItems:"center", pointerEvents:"none" }}>
        <div style={{ ...f1, fontSize:7, color:"rgba(255,255,255,0.5)", background:"rgba(0,0,0,0.4)", padding:"6px 10px", borderRadius:4 }}>WASD: MOVE &nbsp; SPACE: INTERACT &nbsp; M: MOUNT &nbsp; +/-: ZOOM</div>
        <div style={{ ...f1, fontSize:8, color:C.uiGold, background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:4, display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ display:"inline-block", width:10, height:10, borderRadius:"50%", background:C.coin, boxShadow:`0 0 4px ${C.coin}` }}/>{coinCount}/{COIN_POSITIONS.length}{easterEgg && <span style={{ color:C.easterGreen, marginLeft:4 }}>★ SECRET UNLOCKED!</span>}
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
