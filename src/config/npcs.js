import { COLORS } from "./theme.js";
import { YOUR_NAME } from "./player.js";

// ─── NPCs ────────────────────────────────────────────────────────
export const NPCS = [
  { id: "guide", label: "VILLAGE GUIDE", x: 26, y: 12, dir: 0, hairC: COLORS.uiGold, shirtC: "#CC4444",
    lines: [
      `Welcome to ${YOUR_NAME}'s\nportfolio village!`,
      "Each building tells a part\nof my story — walk to\nany door and press SPACE!",
      "Read the signposts around\ntown for directions.\nAnd find all the coins!",
    ]},
  { id: "scholar", label: "SCHOLAR", x: 33, y: 12, dir: 2, hairC: "#8844AA", shirtC: "#44AA66",
    lines: [
      "The LIBRARY to the east\nhas an amazing collection\nof projects!",
      "Each project was built with\npassion and purpose.\nGo check them out!",
    ]},
  { id: "fisher", label: "FISHER", x: 10, y: 24, dir: 3, hairC: "#CC6600", shirtC: "#3388CC",
    lines: [
      "Beautiful lake, isn't it?\nTry standing on the dock\nand pressing SPACE to fish!",
      "I hear there's hidden\ncoins near the water...\nKeep your eyes peeled!",
    ]},
  { id: "traveler", label: "TRAVELER", x: 43, y: 24, dir: 2, hairC: "#333", shirtC: "#AA3366",
    lines: [
      "I traveled from the east\nto see this village.\nIt's quite impressive!",
      "The POST OFFICE up the\nroad is where you can\nreach the developer.",
    ]},
  { id: "merchant", label: "MERCHANT", x: 24, y: 14, dir: 3, hairC: "#AA6622", shirtC: "#228844",
    lines: [
      "Welcome to the market!\nBrowse the stalls and\nexplore the square!",
      "The TOWN HALL up north\nhas the full resume.\nDon't miss it!",
      "Have you found all the\nhidden coins yet? They're\nscattered everywhere!",
    ]},
  { id: "smith", label: "BLACKSMITH", x: 15, y: 18, dir: 0, hairC: "#222", shirtC: "#886644",
    lines: [
      "The FORGE is where skills\nare shaped and refined.",
      "Every tool, every language\nmastered through practice\nand dedication.",
    ]},
  // ── New NPCs ──
  { id: "bard", label: "BARD", x: 26, y: 27, dir: 0, hairC: "#AA5533", shirtC: "#CC3366",
    lines: [
      "♪ La la la... Oh hello!\nI'm the village bard!",
      "Head south to find the\nObservatory, Gallery,\nand Arcade!",
      "There's a garden down by\nthe Observatory where you\ncan plant flowers! ♪",
    ]},
  { id: "guard", label: "GUARD", x: 26, y: 34, dir: 1, hairC: "#333", shirtC: "#556688",
    lines: [
      "Halt! ...Just kidding.\nWelcome to the south\nquarter!",
      "The OBSERVATORY has\nachievements and certs.\nPretty impressive stuff.",
      "Try smashing some crates\naround here. You might\nfind something fun!",
    ]},
  { id: "gardener", label: "GARDENER", x: 23, y: 36, dir: 3, hairC: "#558833", shirtC: "#336622",
    lines: [
      "Welcome to my garden!\nWalk onto a soil plot and\npress SPACE to plant!",
      "Each flower grows through\nfour stages. Watch them\nbloom over time!",
    ]},
  { id: "astronomer", label: "ASTRONOMER", x: 32, y: 31, dir: 2, hairC: "#666", shirtC: "#334466",
    lines: [
      "The OBSERVATORY houses\nall certifications and\nachievements.",
      "Have you visited every\nbuilding in the village?\nThere are 8 in total!",
    ]},
];

// ─── HORSE ──────────────────────────────────────────────────────
export const HORSE = {
  startX: 28, startY: 10,
  speed: 1.0,
  rideSpeedMultiplier: 2.5,
};

// ─── CAT ─────────────────────────────────────────────────────────
export const CAT = {
  startX: 20, startY: 11,
  speed: 1.2,
  lines: [
    "Meow! Purrrr... 🐱",
    "*The cat rubs against\nyour leg affectionately*",
    "*It seems to want you to\nexplore more of the town*",
  ],
};
