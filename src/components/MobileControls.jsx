import { C } from "../engine/constants.js";
import { f1 } from "../styles.js";

export default function MobileControls({ keysRef, onAction }) {
  const btnStyle = { width:48, height:48, background:"rgba(255,255,255,0.08)", border:"2px solid rgba(255,255,255,0.15)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, color:"rgba(255,255,255,0.5)", userSelect:"none", WebkitTapHighlightColor:"transparent", touchAction:"manipulation" };
  const handlers = k => ({ onTouchStart:e=>{e.preventDefault();keysRef.current[k]=true}, onTouchEnd:e=>{e.preventDefault();keysRef.current[k]=false}, onMouseDown:()=>{keysRef.current[k]=true}, onMouseUp:()=>{keysRef.current[k]=false}, onMouseLeave:()=>{keysRef.current[k]=false} });
  return (
    <div role="group" aria-label="Game controls" style={{ position:"fixed", bottom:16, left:0, right:0, display:"flex", justifyContent:"space-between", padding:"0 20px", zIndex:50 }}>
      <div style={{ display:"grid", gridTemplateColumns:"48px 48px 48px", gridTemplateRows:"48px 48px 48px", gap:2 }}>
        <div/><button aria-label="Move up" style={btnStyle}{...handlers("ArrowUp")}>▲</button><div/>
        <button aria-label="Move left" style={btnStyle}{...handlers("ArrowLeft")}>◀</button><div/><button aria-label="Move right" style={btnStyle}{...handlers("ArrowRight")}>▶</button>
        <div/><button aria-label="Move down" style={btnStyle}{...handlers("ArrowDown")}>▼</button><div/>
      </div>
      <div style={{ display:"flex", alignItems:"center" }}>
        <button aria-label="Interact" style={{ ...btnStyle, width:72, height:72, borderRadius:"50%", border:`2px solid ${C.uiGold}44`, ...f1, fontSize:8, color:C.uiGold }} onTouchStart={e=>{e.preventDefault();onAction()}} onMouseDown={()=>onAction()}>ACTION</button>
      </div>
    </div>
  );
}
