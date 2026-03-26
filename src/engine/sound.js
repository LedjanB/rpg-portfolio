// ─── SOUND ENGINE (8-bit Web Audio) ──────────────────────────────
let _audioCtx = null;
let _muted = localStorage.getItem("rpg-portfolio-muted") === "true";
let _musicOff = localStorage.getItem("rpg-portfolio-music-off") === "true";
function getAudio() { if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return _audioCtx; }

export function isMuted() { return _muted; }
export function toggleMute() {
  _muted = !_muted;
  try { localStorage.setItem("rpg-portfolio-muted", _muted); } catch (_) { /* */ }
  if (_muted) { stopMusic(); stopAmbient(); }
  else if (!_musicOff) startMusic();
  return _muted;
}

export function isMusicOff() { return _musicOff; }
export function toggleMusic() {
  _musicOff = !_musicOff;
  try { localStorage.setItem("rpg-portfolio-music-off", _musicOff); } catch (_) { /* */ }
  if (_musicOff) stopMusic(); else startMusic();
  return _musicOff;
}

export function playTone(freq, dur, type = "square", vol = 0.08) {
  if (_muted) return;
  try { const a = getAudio(), o = a.createOscillator(), g = a.createGain(); o.type = type; o.frequency.setValueAtTime(freq, a.currentTime); g.gain.setValueAtTime(vol, a.currentTime); g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur); o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur); } catch (_) { /* Audio may be blocked by browser autoplay policy */ }
}

// ─── CONTEXTUAL FOOTSTEP SOUNDS ─────────────────────────────────
export const sfx = {
  coin:   () => { playTone(880,0.08); setTimeout(()=>playTone(1174,0.08),60); setTimeout(()=>playTone(1480,0.12),120); },
  talk:   () => playTone(440 + Math.random() * 200, 0.06, "square", 0.05),
  // Per-NPC voice pitch (Animal Crossing style)
  talkNPC: (npcId) => {
    const pitches = { guide: 380, scholar: 500, fisher: 320, traveler: 420, merchant: 360, smith: 280, bard: 550, guard: 260, gardener: 400, astronomer: 480 };
    const base = pitches[npcId] || 440;
    playTone(base + Math.random() * 80, 0.06, "square", 0.05);
  },
  talkCat: () => playTone(800 + Math.random() * 200, 0.04, "sine", 0.04),
  door:   () => { playTone(220,0.15,"triangle",0.1); playTone(165,0.2,"triangle",0.06); },
  // Contextual footsteps — terrain type changes the sound
  step:       () => playTone(100 + Math.random() * 60, 0.04, "triangle", 0.03),
  stepDirt:   () => playTone(80 + Math.random() * 40, 0.05, "triangle", 0.03),
  stepCobble: () => playTone(140 + Math.random() * 40, 0.03, "square", 0.02),
  stepGrass:  () => playTone(60 + Math.random() * 30, 0.05, "sine", 0.02),
  stepHorse:  () => { playTone(80, 0.06, "triangle", 0.04); setTimeout(() => playTone(100, 0.06, "triangle", 0.03), 40); },
  secret: () => [523,659,784,1047].forEach((f,i) => setTimeout(() => playTone(f,0.15,"square",0.07), i*120)),
  splash: () => { playTone(200,0.12,"sine",0.06); playTone(300,0.08,"sine",0.04); },
  fishBite: () => { playTone(880,0.05); setTimeout(()=>playTone(1100,0.05),50); },
  fishCatch: () => { playTone(523,0.1); setTimeout(()=>playTone(659,0.1),80); setTimeout(()=>playTone(784,0.12),160); },
  breakProp: () => { playTone(150,0.08,"sawtooth",0.06); playTone(100,0.1,"sawtooth",0.04); },
  plant:  () => playTone(520 + Math.random() * 100, 0.08, "sine", 0.05),
  quest:  () => [523,659,784,1047,1318].forEach((f,i) => setTimeout(() => playTone(f,0.18,"square",0.06), i*100)),
  uiClick: () => playTone(600, 0.03, "square", 0.03),
  thunder: () => { playTone(40, 0.6, "sawtooth", 0.04); playTone(55, 0.4, "triangle", 0.03); },
  bell: () => [523, 440, 392].forEach((f, i) => setTimeout(() => playTone(f, 0.5, "sine", 0.04), i * 300)),
  sit: () => playTone(330, 0.1, "sine", 0.04),
};

// ─── BACKGROUND MUSIC (procedural chiptune) ─────────────────────
let _musicTimer = null;
let _musicGain = null;
let _musicOscs = [];

// RPG overworld melody — pentatonic-friendly, loops every 32 notes
const MELODY = [
  262,294,330,392,  440,392,330,294,  262,330,392,440,  524,440,392,330,
  392,440,524,588,  524,440,392,440,  330,294,262,294,  330,392,440,392,
];
// Bass line — root notes, half the tempo
const BASS = [131,131,165,165, 196,196,220,220, 196,196,165,165, 131,131,196,196];
// Arpeggiated chords (played as rapid 3-note arps)
const CHORDS = [
  [262,330,392],[262,330,392],[330,392,494],[330,392,494],
  [392,494,588],[392,494,588],[440,524,660],[440,524,660],
  [392,494,588],[392,494,588],[330,392,494],[330,392,494],
  [262,330,392],[262,330,392],[392,494,588],[392,494,588],
];

const BPM = 120;
const NOTE_DUR = 60 / BPM; // seconds per beat

function playMusicNote(freq, dur, type, vol, dest) {
  try {
    const a = getAudio();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, a.currentTime);
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    o.connect(g);
    g.connect(dest);
    o.start();
    o.stop(a.currentTime + dur);
  } catch (_) { /* */ }
}

let _musicStep = 0;

function musicTick() {
  if (_musicOff || _muted || !_musicGain) return;
  const dest = _musicGain;
  const s = _musicStep;

  // Melody — every beat
  playMusicNote(MELODY[s % MELODY.length], NOTE_DUR * 0.8, "square", 0.04, dest);

  // Bass — every 2 beats
  if (s % 2 === 0) {
    playMusicNote(BASS[(s / 2 | 0) % BASS.length], NOTE_DUR * 1.8, "triangle", 0.05, dest);
  }

  // Arpeggio — every 4 beats, play 3 quick notes
  if (s % 4 === 0) {
    const chord = CHORDS[(s / 4 | 0) % CHORDS.length];
    chord.forEach((f, i) => {
      setTimeout(() => playMusicNote(f, NOTE_DUR * 0.3, "sine", 0.02, dest), i * 80);
    });
  }

  _musicStep = (s + 1) % (MELODY.length * 2); // loop after going through melody twice for variety
}

export function startMusic() {
  if (_musicTimer || _musicOff || _muted) return;
  try {
    const a = getAudio();
    _musicGain = a.createGain();
    _musicGain.gain.setValueAtTime(0.6, a.currentTime);
    _musicGain.connect(a.destination);
    _musicStep = 0;
    _musicTimer = setInterval(musicTick, NOTE_DUR * 1000);
  } catch (_) { /* */ }
}

export function stopMusic() {
  if (_musicTimer) { clearInterval(_musicTimer); _musicTimer = null; }
  _musicGain = null;
  _musicOscs = [];
}

// ─── MUSIC VOLUME DUCKING (for dialogue) ────────────────────────
export function duckMusic(duck) {
  if (!_musicGain) return;
  try {
    const a = getAudio();
    _musicGain.gain.cancelScheduledValues(a.currentTime);
    _musicGain.gain.setValueAtTime(_musicGain.gain.value, a.currentTime);
    _musicGain.gain.linearRampToValueAtTime(duck ? 0.15 : 0.6, a.currentTime + 0.3);
  } catch (_) { /* */ }
}

// ─── AMBIENT SOUND LAYER ────────────────────────────────────────
let _ambientTimer = null;
let _ambientActive = false;

function playBirdChirp() {
  if (_muted) return;
  try {
    const a = getAudio();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = "sine";
    const startFreq = 1800 + Math.random() * 600;
    o.frequency.setValueAtTime(startFreq, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(startFreq * 0.6, a.currentTime + 0.12);
    g.gain.setValueAtTime(0.02, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.12);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + 0.12);
    // Second chirp
    if (Math.random() < 0.5) {
      setTimeout(() => {
        if (_muted) return;
        const o2 = a.createOscillator();
        const g2 = a.createGain();
        o2.type = "sine";
        o2.frequency.setValueAtTime(startFreq * 1.2, a.currentTime);
        o2.frequency.exponentialRampToValueAtTime(startFreq * 0.7, a.currentTime + 0.1);
        g2.gain.setValueAtTime(0.015, a.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.1);
        o2.connect(g2); g2.connect(a.destination);
        o2.start(); o2.stop(a.currentTime + 0.1);
      }, 120);
    }
  } catch (_) { /* */ }
}

let _isNight = false;
export function setAmbientNight(night) { _isNight = night; }

function playCricket() {
  if (_muted) return;
  try {
    const a = getAudio();
    const freq = 4000 + Math.random() * 1000;
    // Rapid chirps
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (_muted) return;
        const o = a.createOscillator();
        const g = a.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, a.currentTime);
        g.gain.setValueAtTime(0.01, a.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.03);
        o.connect(g); g.connect(a.destination);
        o.start(); o.stop(a.currentTime + 0.03);
      }, i * 40);
    }
  } catch (_) { /* */ }
}

function playOwlHoot() {
  if (_muted) return;
  try {
    const a = getAudio();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(300, a.currentTime);
    o.frequency.exponentialRampToValueAtTime(250, a.currentTime + 0.4);
    g.gain.setValueAtTime(0.015, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.4);
    o.connect(g); g.connect(a.destination);
    o.start(); o.stop(a.currentTime + 0.4);
  } catch (_) { /* */ }
}

function ambientTick() {
  if (_muted) return;
  if (_isNight) {
    // Night: crickets and rare owl
    if (Math.random() < 0.25) playCricket();
    if (Math.random() < 0.03) playOwlHoot();
  } else {
    // Day: bird chirps
    if (Math.random() < 0.15) playBirdChirp();
  }
}

export function startAmbient() {
  if (_ambientActive || _muted) return;
  _ambientActive = true;
  _ambientTimer = setInterval(ambientTick, 1000);
}

export function stopAmbient() {
  if (_ambientTimer) { clearInterval(_ambientTimer); _ambientTimer = null; }
  _ambientActive = false;
}

// Play rain ambient sound
export function playRainAmbient(intensity) {
  if (_muted || intensity < 0.1) return;
  try {
    const a = getAudio();
    // Filtered noise burst for rain patter
    const bufSize = a.sampleRate * 0.05;
    const buf = a.createBuffer(1, bufSize, a.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3;
    const src = a.createBufferSource();
    src.buffer = buf;
    const filter = a.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, a.currentTime);
    const g = a.createGain();
    g.gain.setValueAtTime(intensity * 0.015, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.05);
    src.connect(filter); filter.connect(g); g.connect(a.destination);
    src.start(); src.stop(a.currentTime + 0.05);
  } catch (_) { /* */ }
}
