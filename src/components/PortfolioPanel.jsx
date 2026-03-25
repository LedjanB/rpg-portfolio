import { useEffect, useRef } from "react";
import { PORTFOLIO_CONTENT } from "../config/portfolio.js";
import { C } from "../engine/constants.js";
import { f1, f2, CornerDots } from "../styles.js";

export default function PortfolioPanel({ sectionId, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => { closeRef.current?.focus(); }, [sectionId]);

  const section = PORTFOLIO_CONTENT[sectionId];
  if (!section) return null;
  const theme = section.theme || { accent: C.uiGold, bg: C.uiBg };
  const accent = theme.accent;

  return (
    <div role="dialog" aria-label={section.title} aria-modal="true" style={{ position:"fixed", inset:0, background:"rgba(5,5,16,0.92)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div style={{ width:"min(620px,90%)", maxHeight:"85vh", overflow:"auto", background:theme.bg, border:`3px solid ${accent}55`, borderRadius:10, padding:"20px 24px", position:"relative", boxShadow:`0 0 40px rgba(0,0,0,0.6), 0 0 20px ${accent}22` }} onClick={e => e.stopPropagation()}>
        <CornerDots color={accent} size={10} />
        <button ref={closeRef} onClick={onClose} aria-label="Close panel (Escape)" style={{ position:"absolute", top:10, right:14, background:"none", border:`1px solid ${accent}44`, ...f1, fontSize:8, color:accent, padding:"6px 10px", borderRadius:4, cursor:"pointer", opacity:0.7 }} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.7"}>✕ ESC</button>
        <h1 style={{ ...f1, fontSize:16, color:accent, marginBottom:20, textShadow:`0 0 10px ${accent}44` }}>{section.title}</h1>

        {sectionId==="about" && <>
          <p style={{ ...f1, fontSize:10, color:`${accent}CC`, marginBottom:16 }}>{section.subtitle}</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
            {section.stats.map(s => <div key={s.label} style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${accent}33`, borderRadius:6, padding:"10px 6px", textAlign:"center" }}><div style={{ ...f1, fontSize:6, color:C.gray2, marginBottom:6 }}>{s.label}</div><div style={{ ...f2, fontSize:20, color:accent }}>{s.value}</div></div>)}
          </div>
          {section.text.split("\n\n").map((p,i) => <p key={i} style={{ ...f2, fontSize:21, color:C.uiText, lineHeight:1.5, marginBottom:12 }}>{p}</p>)}
        </>}

        {sectionId==="projects" && section.items.map((p,i) =>
          <div key={i} style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${accent}33`, borderRadius:8, padding:16, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}><h3 style={{ ...f1, fontSize:11, color:accent }}>{p.name}</h3><span style={{ ...f1, fontSize:7, color:C.gray1 }}>STAGE {p.stage}</span></div>
            <p style={{ ...f2, fontSize:19, color:C.gray5, lineHeight:1.4, marginBottom:10 }}>{p.desc}</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{p.tech.map(t => <span key={t} style={{ ...f1, fontSize:7, color:"#000", background:accent, padding:"3px 7px", borderRadius:3 }}>{t}</span>)}</div>
          </div>
        )}

        {sectionId==="skills" && section.categories.map(cat =>
          <div key={cat.name} style={{ marginBottom:20 }}>
            <h3 style={{ ...f1, fontSize:10, color:accent, marginBottom:10 }}>▸ {cat.name}</h3>
            {cat.skills.map(sk => <div key={sk.n} style={{ marginBottom:8 }}><div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}><span style={{ ...f2, fontSize:19, color:C.gray6 }}>{sk.n}</span><span style={{ ...f1, fontSize:8, color:accent }}>{sk.v}%</span></div><div style={{ height:8, background:"rgba(0,0,0,0.3)", borderRadius:4, overflow:"hidden", border:`1px solid ${accent}22` }}><div style={{ height:"100%", borderRadius:4, background:`linear-gradient(90deg,${accent},${accent}88)`, width:`${sk.v}%`, transition:"width 1s", boxShadow:`0 0 8px ${accent}66` }}/></div></div>)}
          </div>
        )}

        {sectionId==="resume" && <>
          {section.jobs.map((j,i) =>
            <div key={i} style={{ borderLeft:`3px solid ${accent}`, paddingLeft:16, marginBottom:16, position:"relative" }}>
              <div style={{ position:"absolute", left:-7, top:4, width:12, height:12, background:accent, borderRadius:"50%", boxShadow:`0 0 6px ${accent}` }}/>
              <h3 style={{ ...f1, fontSize:10, color:accent, marginBottom:4 }}>{j.role}</h3>
              <div style={{ ...f1, fontSize:7, color:C.gray3, marginBottom:8 }}>{j.co} | {j.period}</div>
              <p style={{ ...f2, fontSize:19, color:C.gray5, lineHeight:1.4 }}>{j.desc}</p>
            </div>
          )}
          <div style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${accent}33`, borderRadius:8, padding:14, marginTop:8 }}>
            <div style={{ ...f1, fontSize:7, color:C.gray2, marginBottom:6 }}>🎓 EDUCATION</div>
            <div style={{ ...f2, fontSize:20, color:C.gray6 }}>{section.edu.degree}</div>
            <div style={{ ...f2, fontSize:17, color:C.gray3 }}>{section.edu.school} • {section.edu.year}</div>
          </div>
        </>}

        {sectionId==="contact" && <>
          <p style={{ ...f2, fontSize:22, color:C.uiText, marginBottom:20, lineHeight:1.4 }}>{section.text}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {section.links.map(l =>
              <div key={l.label} style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${accent}33`, borderRadius:8, padding:14, cursor:"pointer", transition:"all 0.2s" }} onMouseEnter={e=>{e.currentTarget.style.borderColor=accent;e.currentTarget.style.boxShadow=`0 0 14px ${accent}22`}} onMouseLeave={e=>{e.currentTarget.style.borderColor=`${accent}33`;e.currentTarget.style.boxShadow="none"}}>
                <div style={{ fontSize:20, marginBottom:6 }}>{l.icon}</div>
                <div style={{ ...f1, fontSize:7, color:C.gray3, marginBottom:4 }}>{l.label}</div>
                <div style={{ ...f2, fontSize:17, color:accent }}>{l.value}</div>
              </div>
            )}
          </div>
        </>}

        {sectionId==="observatory" && <>
          <p style={{ ...f1, fontSize:10, color:`${accent}CC`, marginBottom:16 }}>{section.subtitle}</p>
          {section.achievements.map((a,i) =>
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, background:"rgba(0,0,0,0.3)", border:`1px solid ${accent}33`, borderRadius:8, padding:14, marginBottom:10 }}>
              <div style={{ fontSize:28, width:40, textAlign:"center", flexShrink:0 }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <h3 style={{ ...f1, fontSize:10, color:accent, marginBottom:4 }}>{a.name}</h3>
                <div style={{ ...f2, fontSize:17, color:C.gray4 }}>{a.org}</div>
              </div>
              <div style={{ ...f1, fontSize:7, color:C.gray2, flexShrink:0 }}>{a.year}</div>
            </div>
          )}
        </>}

        {sectionId==="gallery" && section.items.map((p,i) =>
          <div key={i} style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${accent}33`, borderRadius:8, padding:16, marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}><h3 style={{ ...f1, fontSize:11, color:accent }}>{p.name}</h3><span style={{ ...f1, fontSize:7, color:C.gray1 }}>STAGE {p.stage}</span></div>
            <p style={{ ...f2, fontSize:19, color:C.gray5, lineHeight:1.4, marginBottom:10 }}>{p.desc}</p>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>{p.tech.map(t => <span key={t} style={{ ...f1, fontSize:7, color:"#000", background:accent, padding:"3px 7px", borderRadius:3 }}>{t}</span>)}</div>
          </div>
        )}

        {sectionId==="arcade" && <>
          <p style={{ ...f2, fontSize:22, color:C.uiText, marginBottom:20, lineHeight:1.4 }}>{section.text}</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {section.interests.map(int =>
              <div key={int.name} style={{ background:"rgba(0,0,0,0.3)", border:`1px solid ${accent}33`, borderRadius:8, padding:14 }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{int.icon}</div>
                <div style={{ ...f1, fontSize:8, color:accent, marginBottom:6 }}>{int.name}</div>
                <div style={{ ...f2, fontSize:17, color:C.gray4, lineHeight:1.3 }}>{int.desc}</div>
              </div>
            )}
          </div>
        </>}
      </div>
    </div>
  );
}
