import { COIN_POSITIONS } from "../config/world.js";
import { C } from "../engine/constants.js";
import { f1 } from "../styles.js";

export default function HUD({ coinCount, easterEgg, zoom, zoomIn, zoomOut }) {
  return (
    <>
      <div style={{ position:"absolute", top:8, left:8, zIndex:10, display:"flex", gap:12, alignItems:"center", pointerEvents:"none" }}>
        <div style={{ ...f1, fontSize:7, color:"rgba(255,255,255,0.4)", background:"rgba(0,0,0,0.4)", padding:"6px 10px", borderRadius:4 }}>WASD: MOVE &nbsp; SPACE: INTERACT &nbsp; M: MOUNT &nbsp; +/-: ZOOM</div>
        <div style={{ ...f1, fontSize:8, color:C.uiGold, background:"rgba(0,0,0,0.5)", padding:"5px 10px", borderRadius:4, display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ display:"inline-block", width:10, height:10, borderRadius:"50%", background:C.coin, boxShadow:`0 0 4px ${C.coin}` }}/>{coinCount}/{COIN_POSITIONS.length}{easterEgg && <span style={{ color:"#0f0", marginLeft:4 }}>★ SECRET UNLOCKED!</span>}
        </div>
      </div>
      <div style={{ position:"absolute", bottom:12, right:12, zIndex:10, display:"flex", gap:4 }}>
        {[["−",zoomOut],[null,null],["+",zoomIn]].map(([label,fn],i) => i===1 ?
          <div key={i} style={{ width:44, height:32, background:"rgba(0,0,0,0.6)", border:"1px solid #555", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", ...f1, fontSize:7, color:"#aaa" }}>{Math.round(zoom*100)}%</div> :
          <button key={i} onClick={fn} style={{ width:32, height:32, background:"rgba(0,0,0,0.6)", border:"1px solid #555", borderRadius:6, color:"#ccc", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"monospace", lineHeight:1 }} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.uiGold;e.currentTarget.style.color=C.uiGold}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#555";e.currentTarget.style.color="#ccc"}}>{label}</button>
        )}
      </div>
    </>
  );
}
