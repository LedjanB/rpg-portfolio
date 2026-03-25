import React from "react";

// ─── SHARED STYLES ───────────────────────────────────────────────
export const FONT_PIXEL = { fontFamily: "'Press Start 2P',monospace" };
export const FONT_MONO = { fontFamily: "'VT323',monospace" };

// Backwards-compatible aliases
export const f1 = FONT_PIXEL;
export const f2 = FONT_MONO;

export const KEYFRAMES = `
@keyframes rpg-blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes rpg-tw{0%,100%{opacity:0.2}50%{opacity:1}}
@keyframes rpg-p{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}
}
button:focus-visible{outline:2px solid #FFD93D;outline-offset:2px}
`;

// Reusable corner decoration dots for panels/dialogs
export function CornerDots({ color, size = 8 }) {
  return [[0,0],[1,0],[0,1],[1,1]].map(([a,b],i) =>
    React.createElement("div", { key: i, style: { position:"absolute", width:size, height:size, background:color, [a?"right":"left"]:-1, [b?"bottom":"top"]:-1, borderRadius:2 }})
  );
}
