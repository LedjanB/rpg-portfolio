import { useState, useEffect, useRef } from "react";
import { C } from "../engine/constants.js";
import { sfx } from "../engine/sound.js";
import { f1, f2 } from "../styles.js";

export default function DialogueBox({ speaker, text, onNext, hasMore }) {
  const [disp, setDisp] = useState("");
  const [done, setDone] = useState(false);
  const ci = useRef(0);

  useEffect(() => {
    ci.current = 0; setDisp(""); setDone(false);
    const iv = setInterval(() => {
      ci.current++;
      setDisp(text.slice(0, ci.current));
      if (ci.current >= text.length) { setDone(true); clearInterval(iv); } else { sfx.talk(); }
    }, 25);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <div role="dialog" aria-label={speaker ? `${speaker} says` : "Dialogue"} aria-live="polite" style={{ position:"fixed", bottom:16, left:"50%", transform:"translateX(-50%)", width:"min(580px,92%)", background:C.uiBg, border:`3px solid ${C.uiBorder}`, borderRadius:8, padding:"14px 18px", zIndex:100, backdropFilter:"blur(4px)", boxShadow:"0 0 20px rgba(0,0,0,0.5)" }}>
      {[[0,0],[1,0],[0,1],[1,1]].map(([a,b],i) => <div key={i} style={{ position:"absolute", width:8, height:8, background:C.uiGold, [a?"right":"left"]:-1, [b?"bottom":"top"]:-1, borderRadius:2 }}/>)}
      {speaker && <div style={{ ...f1, fontSize:10, color:C.uiGold, marginBottom:8 }}>{speaker}</div>}
      <div style={{ ...f2, fontSize:22, color:C.uiText, lineHeight:1.5, whiteSpace:"pre-wrap", minHeight:55 }}>
        {disp}{!done && <span aria-hidden="true" style={{ animation:"rpg-blink 0.6s infinite" }}>▊</span>}
      </div>
      {done && <button onClick={e => { e.stopPropagation(); onNext(); }} aria-label={hasMore ? "Next dialogue" : "Close dialogue"} style={{ position:"absolute", bottom:8, right:14, ...f1, fontSize:8, color:C.uiGold, cursor:"pointer", animation:"rpg-blink 1.2s infinite", background:"none", border:"none", padding:4 }}>{hasMore ? "▶ NEXT" : "▶ CLOSE"}</button>}
    </div>
  );
}
