import { useState, useEffect } from "react";
import { COIN_POSITIONS } from "../config/world.js";
import { C } from "../engine/constants.js";
import { f1, KEYFRAMES } from "../styles.js";

function IntroTypewriter() {
  const full = "INSERT COIN TO CONTINUE...";
  const [text, setText] = useState("");
  useEffect(() => { let i=0; const iv = setInterval(() => { i++; setText(full.slice(0,i)); if (i>=full.length) clearInterval(iv); }, 80); return () => clearInterval(iv); }, []);
  return <div style={{ ...f1, fontSize:"clamp(8px,1.5vw,11px)", color:C.uiGold, animation:"rpg-blink 1.2s infinite" }}>{text}<span style={{ opacity:0.5 }}>█</span></div>;
}

export default function IntroScreen({ onStart }) {
  return (
    <div onClick={onStart} style={{ width:"100%", height:"100vh", background:`radial-gradient(ellipse at center,${C.introBgInner} 0%,${C.pageBg} 70%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative", overflow:"hidden", ...f1 }}>
      {Array.from({length:30}).map((_,i) => <div key={i} style={{ position:"absolute", width:2, height:2, background:"#fff", borderRadius:"50%", left:`${(i*37)%100}%`, top:`${(i*53)%100}%`, opacity:0.3, animation:`rpg-tw ${2+i%3}s ${i*0.2}s infinite` }}/>)}
      <div style={{ fontSize:"clamp(20px,4vw,36px)", color:C.uiGold, textShadow:`0 0 10px ${C.uiGold}, 0 0 30px ${C.uiGold}66`, marginBottom:8, animation:"rpg-p 2s infinite" }}>⚔ QUEST: PORTFOLIO ⚔</div>
      <div style={{ fontSize:"clamp(8px,1.5vw,12px)", color:C.grass3, marginBottom:40, letterSpacing:2 }}>A Developer's Journey</div>
      <IntroTypewriter />
      <div style={{ position:"absolute", bottom:30, fontSize:8, color:C.gray1, textAlign:"center", lineHeight:2, padding:"0 20px" }}>
        ARROW KEYS / WASD TO MOVE &nbsp;•&nbsp; SPACE / ENTER TO INTERACT &nbsp;•&nbsp; +/- OR SCROLL TO ZOOM &nbsp;•&nbsp; FIND ALL {COIN_POSITIONS.length} COINS!
      </div>
      <style>{KEYFRAMES}</style>
    </div>
  );
}
