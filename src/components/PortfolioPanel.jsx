import { useEffect, useRef } from "react";
import { PORTFOLIO_CONTENT } from "../config/portfolio.js";
import { C } from "../engine/constants.js";
import { f1, f2 } from "../styles.js";

export default function PortfolioPanel({ sectionId, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, [sectionId]);

  const d = PORTFOLIO_CONTENT[sectionId];
  if (!d) return null;
  const theme = d.theme || { accent: C.uiGold, bg: C.uiBg };
  const g = theme.accent;

  return (
    <div role="dialog" aria-label={d.title} aria-modal="true" style={{ position:"fixed", inset:0, background:"rgba(5,5,16,0.92)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div style={{ width:"min(620px,90%)", maxHeight:"85vh", overflow:"auto", background:theme.bg, border:`3px solid ${g}55`, borderRadius:10, padding:"20px 24px", position:"relative", boxShadow:`0 0 40px rgba(0,0,0,0.6), 0 0 20px ${g}22` }} onClick={e => e.stopPropagation()}>
        {[[0,0],[1,0],[0,1],[1,1]].map(([a,b],i) => <div key={i} style={{ position:"absolute", width:10, height:10, background:g, [a?"right":"left"]:-1, [b?"bottom":"top"]:-1, borderRadius:2 }}/>)}
        <button ref={closeRef} onClick={onClose} aria-label="Close panel" style={{ position:"absolute", top:10, right:14, background:"none", border:`1px solid ${g}44`, ...f1, fontSize:8, color:g, padding:"6px 10px", borderRadius:4, cursor:"pointer", opacity:0.7 }} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.7"}>✕ ESC</button>
        <h1 style={{ ...f1, fontSize:16, color:g, marginBottom:20, textShadow:`0 0 10px ${g}44` }}>{d.title}</h1>

        {sectionId==="about" && <>
          <p style={{ ...f1, fontSize:10, color:`${g}CC`, marginBottom:16 }}>{d.subtitle}</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
            {d.stats.map(s => <div key={s.label} style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${g}33`, borderRadius:6, padding:"10px 6px", textAlign:"center" }}><div style={{ ...f1, fontSize:6, color:"#666", marginBottom:6 }}>{s.label}</div><div style={{ ...f2, fontSize:20, color:g }}>{s.value}</div></div>)}
          </div>
          {d.text.split("\n\n").map((p,i) => <p key={i} style={{ ...f2, fontSize:21, color:C.uiText, lineHeight:1.5, marginBottom:12 }}>{p}</p>)}
        </>}

        {sectionId==="projects" && d.items.map((p,i) =>
          <div key={i} style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${g}33`, borderRadius:8, padding:16, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}><h3 style={{ ...f1, fontSize:11, color:g }}>{p.name}</h3><span style={{ ...f1, fontSize:7, color:"#555" }}>STAGE {p.stage}</span></div>
            <p style={{ ...f2, fontSize:19, color:"#bbb", lineHeight:1.4, marginBottom:10 }}>{p.desc}</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{p.tech.map(t => <span key={t} style={{ ...f1, fontSize:7, color:"#000", background:g, padding:"3px 7px", borderRadius:3 }}>{t}</span>)}</div>
          </div>
        )}

        {sectionId==="skills" && d.categories.map(cat =>
          <div key={cat.name} style={{ marginBottom:20 }}>
            <h3 style={{ ...f1, fontSize:10, color:g, marginBottom:10 }}>▸ {cat.name}</h3>
            {cat.skills.map(sk => <div key={sk.n} style={{ marginBottom:8 }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ ...f2, fontSize:19, color:"#ccc" }}>{sk.n}</span><span style={{ ...f1, fontSize:8, color:g }}>{sk.v}%</span></div><div style={{ height:8, background:"rgba(0,0,0,0.3)", borderRadius:4, overflow:"hidden", border:`1px solid ${g}22` }}><div style={{ height:"100%", borderRadius:4, background:`linear-gradient(90deg,${g},${g}88)`, width:`${sk.v}%`, transition:"width 1s", boxShadow:`0 0 8px ${g}66` }}/></div></div>)}
          </div>
        )}

        {sectionId==="resume" && <>
          {d.jobs.map((j,i) =>
            <div key={i} style={{ borderLeft:`3px solid ${g}`, paddingLeft:16, marginBottom:16, position:"relative" }}>
              <div style={{ position:"absolute", left:-7, top:4, width:12, height:12, background:g, borderRadius:"50%", boxShadow:`0 0 6px ${g}` }}/>
              <h3 style={{ ...f1, fontSize:10, color:g, marginBottom:4 }}>{j.role}</h3>
              <div style={{ ...f1, fontSize:7, color:"#888", marginBottom:8 }}>{j.co} | {j.period}</div>
              <p style={{ ...f2, fontSize:19, color:"#bbb", lineHeight:1.4 }}>{j.desc}</p>
            </div>
          )}
          <div style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${g}33`, borderRadius:8, padding:14, marginTop:8 }}>
            <div style={{ ...f1, fontSize:7, color:"#666", marginBottom:6 }}>🎓 EDUCATION</div>
            <div style={{ ...f2, fontSize:20, color:"#ccc" }}>{d.edu.degree}</div>
            <div style={{ ...f2, fontSize:17, color:"#888" }}>{d.edu.school} • {d.edu.year}</div>
          </div>
        </>}

        {sectionId==="contact" && <>
          <p style={{ ...f2, fontSize:22, color:C.uiText, marginBottom:20, lineHeight:1.4 }}>{d.text}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {d.links.map(l =>
              <div key={l.label} style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${g}33`, borderRadius:8, padding:14, cursor:"pointer", transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=g;e.currentTarget.style.boxShadow=`0 0 14px ${g}22`}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`${g}33`;e.currentTarget.style.boxShadow="none"}}>
                <div style={{ fontSize:20, marginBottom:6 }}>{l.icon}</div>
                <div style={{ ...f1, fontSize:7, color:"#888", marginBottom:4 }}>{l.label}</div>
                <div style={{ ...f2, fontSize:17, color:g }}>{l.value}</div>
              </div>
            )}
          </div>
        </>}
      </div>
    </div>
  );
}
