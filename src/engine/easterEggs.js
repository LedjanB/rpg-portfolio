import { T } from "./constants.js";
import { FOUNTAIN_POS } from "../config/world.js";
import { sfx } from "./sound.js";

// ─── EASTER EGG STATE ──────────────────────────────────────────
const state = {
  // Konami code tracker
  konamiSeq: [],
  konamiDone: false,

  // Cat pet counter
  catPets: 0,
  catObsessedDone: false,

  // Fish milestones
  fishSecretAt5: false,
  fishSecretAt10: false,

  // Fountain wish
  fountainWished: false,

  // Well wish
  wellWished: false,

  // All NPCs talked to
  talkedNPCs: new Set(),
  socialButterfly: false,

  // Night walker — walk 500 tiles total
  totalSteps: 0,
  marathonDone: false,

  // Crate destroyer — break all crates/pots
  brokenProps: new Set(),
  destroyerDone: false,

  // Secret word tracker
  typedChars: [],
  secretWordDone: false,

  // Coin magnet — collect 3 coins within 5 seconds
  coinTimes: [],
  coinMagnetDone: false,

  // Horse dismount spam
  mountToggles: 0,
  lastMountTick: 0,
  rodeoClownDone: false,

  // Completionist — enter all 8 buildings
  visitedBuildings: new Set(),
  completionistDone: false,

  // Dance party (rapid key changes)
  danceKeyTimes: [],
  danceDone: false,

  // Garden completion
  gardenDone: false,
};

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

// ─── FORTUNES for fountain ──
const FORTUNES = [
  "The code you seek is already\nwithin you... also try\nStack Overflow.",
  "A great PR awaits you\nin the near future.\nMay the merge be clean.",
  "Beware of undefined.\nIt lurks in the shadows\nof your variables.",
  "The stars say... you will\nfind a bug today. But\nyou will also fix it.",
  "Your next commit message\nwill be legendary.\nOr at least grammatical.",
  "A wise developer once said:\n'It works on my machine.'\nAnd it was true.",
  "Fortune favors the bold.\nAlso those who write tests.\nMostly those who write tests.",
  "The fountain whispers:\n'Have you tried turning\nit off and on again?'",
];

// ─── SECRET MESSAGES for wells ──
const WELL_WISHES = [
  "You toss a coin into the\nwell... *plink* ...\n'Hello down there!'",
  "The well echoes back:\n'404: Wish Not Found'\n...weird well.",
  "You make a wish.\nThe well grants you +1\nto debugging skills!",
];

// ─── SECRET WORD: typing "hello" anytime ──
const SECRET_WORDS = {
  hello: { speaker: "THE GAME", lines: [
    "Oh! Hello there!\nYou typed 'hello' and\nthe game noticed!",
    "Not many people try\ntyping words in a game\nwith no text input...\nRespect.",
  ]},
  debug: { speaker: "DEV MODE", lines: [
    "Sorry, debug mode is\nnot available.\n...or IS it?",
    "Just kidding. There's\nno debug mode. But\nthere ARE 12 coins\nto find!",
  ]},
  hire: { speaker: "RECRUITER", lines: [
    "Did someone say 'hire'?!\nYou should definitely\ncheck out the TOWN HALL!",
    "Full resume inside.\nJust saying... this\nvillage didn't build\nitself. 😏",
  ]},
};

// ─── Check Konami code & secret word input ──
export function onKeyForEasterEggs(key) {
  // Konami code
  if (!state.konamiDone) {
    state.konamiSeq.push(key);
    if (state.konamiSeq.length > KONAMI.length) state.konamiSeq.shift();
    if (state.konamiSeq.length === KONAMI.length && state.konamiSeq.every((k, i) => k === KONAMI[i])) {
      state.konamiDone = true;
      return { type: "dialogue", speaker: "??? SYSTEM ???", lines: [
        "↑↑↓↓←→←→BA\nKONAMI CODE ACTIVATED!",
        "You are a person of\nculture. +30 lives!\n(just kidding, this isn't\nthat kind of game)",
        "But seriously, nice work\nfinding this. You must\nbe a real gamer.",
      ]};
    }
  }

  // Secret word detection (only single lowercase letters)
  if (!state.secretWordDone && key.length === 1 && key.match(/[a-z]/)) {
    state.typedChars.push(key);
    if (state.typedChars.length > 10) state.typedChars.shift();
    const typed = state.typedChars.join("");
    for (const [word, result] of Object.entries(SECRET_WORDS)) {
      if (typed.endsWith(word)) {
        state.secretWordDone = true;
        state.typedChars = [];
        return { type: "dialogue", speaker: result.speaker, lines: result.lines };
      }
    }
  }

  return null;
}

// ─── Cat pet tracking ──
export function onCatPet() {
  state.catPets++;
  if (state.catPets >= 5 && !state.catObsessedDone) {
    state.catObsessedDone = true;
    return { type: "dialogue", speaker: "CAT", lines: [
      "*The cat looks concerned*\nYou've pet me 5 times.\nDon't you have buildings\nto explore?",
      "I'm flattered, really.\nBut the LIBRARY won't\nread itself...",
      "Fine, one more secret:\nTry typing 'hello'\non your keyboard...",
    ]};
  }
  return null;
}

// ─── Fish milestone ──
export function onFishCaught(totalFish) {
  if (totalFish === 5 && !state.fishSecretAt5) {
    state.fishSecretAt5 = true;
    return { type: "dialogue", speaker: "ACHIEVEMENT", lines: [
      "🐟 MASTER ANGLER! 🐟\nYou've caught 5 fish!",
      "The fish tell tales of\na developer who codes\nby day and fishes by\nnight...",
    ]};
  }
  if (totalFish === 10 && !state.fishSecretAt10) {
    state.fishSecretAt10 = true;
    return { type: "dialogue", speaker: "LEGENDARY FISHER", lines: [
      "🐟🐟🐟 10 FISH! 🐟🐟🐟\nYou're a fishing legend!",
      "At this point you could\nopen a fish restaurant\ninstead of a portfolio...",
      "Just kidding. But\nseriously, impressive\ndedication!",
    ]};
  }
  return null;
}

// ─── Fountain wish ──
export function onFountainInteract(px, py) {
  const fx = FOUNTAIN_POS.x * T, fy = FOUNTAIN_POS.y * T;
  if (Math.abs(px - fx) < T * 2.5 && Math.abs(py - fy) < T * 2.5) {
    sfx.splash();
    const fortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    const wasFirst = !state.fountainWished;
    state.fountainWished = true;
    const lines = wasFirst
      ? ["*You toss a coin into\nthe fountain*\n*splash*", "The fountain glows\nbriefly and whispers:", fortune]
      : ["*splash* Another coin\nin the fountain...", fortune];
    return { type: "dialogue", speaker: "WISHING FOUNTAIN", lines };
  }
  return null;
}

// ─── Well interaction ──
export function onWellInteract(px, py, props) {
  const well = props.find(p => p.type === "well" && Math.abs(px - p.x * T) < T * 1.5 && Math.abs(py - p.y * T) < T * 1.5);
  if (well) {
    const msg = WELL_WISHES[Math.floor(Math.random() * WELL_WISHES.length)];
    return { type: "dialogue", speaker: "WISHING WELL", lines: [msg] };
  }
  return null;
}

// ─── NPC social tracker ──
export function onNPCTalk(npcId) {
  if (state.socialButterfly) return null;
  state.talkedNPCs.add(npcId);
  if (state.talkedNPCs.size >= 8) {
    state.socialButterfly = true;
    return { type: "dialogue", speaker: "ACHIEVEMENT", lines: [
      "🦋 SOCIAL BUTTERFLY! 🦋\nYou've talked to every\nNPC in the village!",
      "You're officially the\nmost popular person\nin Portfolio Village!",
      "If only networking IRL\nwas this easy...",
    ]};
  }
  return null;
}

// ─── Marathon walker (500 steps) ──
export function onStep() {
  if (state.marathonDone) return null;
  state.totalSteps++;
  if (state.totalSteps === 500) {
    state.marathonDone = true;
    return { type: "dialogue", speaker: "ACHIEVEMENT", lines: [
      "🏃 MARATHON RUNNER! 🏃\n500 steps taken!",
      "Your pixel character\nis in peak physical\ncondition!",
      "Fun fact: that's about\n0.0003 real miles.\nBut who's counting?",
    ]};
  }
  return null;
}

// ─── Crate/pot destroyer tracker ──
export function onPropBreak(propIndex) {
  if (state.destroyerDone) return null;
  state.brokenProps.add(propIndex);
  if (state.brokenProps.size >= 8) {
    state.destroyerDone = true;
    return { type: "dialogue", speaker: "ACHIEVEMENT", lines: [
      "💥 PROPERTY DAMAGE! 💥\nYou broke every crate\nand pot in the village!",
      "The village maintenance\ncrew is NOT happy.\nBut hey, it was fun.",
      "Legend says there's\nnothing inside them.\nYou checked anyway.\nRespect.",
    ]};
  }
  return null;
}

// ─── Coin magnet — collect 3 coins within 5 seconds ──
export function onCoinCollect(tick) {
  if (state.coinMagnetDone) return null;
  state.coinTimes.push(tick);
  // Keep only recent
  state.coinTimes = state.coinTimes.filter(t => tick - t < 300); // ~5 seconds
  if (state.coinTimes.length >= 3) {
    state.coinMagnetDone = true;
    return { type: "dialogue", speaker: "ACHIEVEMENT", lines: [
      "🧲 COIN MAGNET! 🧲\n3 coins in rapid\nsuccession!",
      "Are you speedrunning\nthis portfolio? Because\nthat was impressive.",
    ]};
  }
  return null;
}

// ─── Horse mount/dismount spam (rodeo clown) ──
export function onMountToggle(tick) {
  if (state.rodeoClownDone) return null;
  if (tick - state.lastMountTick < 60) {
    state.mountToggles++;
  } else {
    state.mountToggles = 1;
  }
  state.lastMountTick = tick;
  if (state.mountToggles >= 6) {
    state.rodeoClownDone = true;
    return { type: "dialogue", speaker: "HORSE", lines: [
      "*The horse looks annoyed*\nStop mounting and\ndismounting me!",
      "Make up your mind!\nAre we riding or not?!",
      "Achievement unlocked:\n'Rodeo Clown'\n🤡🐴",
    ]};
  }
  return null;
}

// ─── Building visit tracker for completionist ──
export function onBuildingEnter(buildingId) {
  if (state.completionistDone) return null;
  state.visitedBuildings.add(buildingId);
  // Show progress hints at milestones
  if (state.visitedBuildings.size === 4) {
    return { type: "dialogue", speaker: "EXPLORER", lines: [
      "Halfway there! You've\nvisited 4 out of 8\nbuildings!",
      "Keep exploring — each\nbuilding has something\nunique inside!",
    ]};
  }
  if (state.visitedBuildings.size === 7) {
    return { type: "dialogue", speaker: "EXPLORER", lines: [
      "Just ONE more building\nto visit! You're so\nclose to seeing it all!",
    ]};
  }
  return null;
}

// ─── Dance party (removed — too easy to trigger accidentally) ──
export function onRapidKeys() {
  return null;
}

// ─── Garden completion ──
export function onGardenCheck(garden) {
  if (state.gardenDone) return null;
  const allPlanted = garden.length > 0 && garden.every(p => p.stage >= 4);
  if (allPlanted) {
    state.gardenDone = true;
    return { type: "dialogue", speaker: "GREEN THUMB", lines: [
      "🌸 MASTER GARDENER! 🌸\nAll your flowers are\nin full bloom!",
      "The garden is gorgeous!\nYou clearly have a\ngreen thumb...\nand green pixels.",
    ]};
  }
  return null;
}

export function getEasterEggState() { return state; }
