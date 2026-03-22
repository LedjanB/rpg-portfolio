// ─── SOUND ENGINE (8-bit Web Audio) ──────────────────────────────
let _audioCtx = null;
function getAudio() { if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return _audioCtx; }

export function playTone(freq, dur, type = "square", vol = 0.08) {
  try { const a = getAudio(), o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(freq, a.currentTime); g.gain.setValueAtTime(vol, a.currentTime); g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur); o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur); } catch (_) { /* Audio may be blocked by browser autoplay policy */ }
}

export const sfx = {
  coin:   () => { playTone(880,0.08); setTimeout(()=>playTone(1174,0.08),60); setTimeout(()=>playTone(1480,0.12),120); },
  talk:   () => playTone(440 + Math.random() * 200, 0.06, "square", 0.05),
  door:   () => { playTone(220,0.15,"triangle",0.1); playTone(165,0.2,"triangle",0.06); },
  step:   () => playTone(100 + Math.random() * 60, 0.04, "triangle", 0.03),
  secret: () => [523,659,784,1047].forEach((f,i) => setTimeout(() => playTone(f,0.15,"square",0.07), i*120)),
};
