import { COLORS } from "./theme.js";
import { YOUR_NAME } from "./player.js";

// ─── NPCs ────────────────────────────────────────────────────────
export const NPCS = [
  { id: "guide", label: "VILLAGE GUIDE", x: 20, y: 12, dir: 0, hairC: COLORS.uiGold, shirtC: "#CC4444",
    lines: [
      `Welcome to ${YOUR_NAME}'s\nportfolio village!`,
      "Each building tells a part\nof my story — walk to\nany door and press SPACE!",
      "Read the signposts around\ntown for directions.\nAnd find all 10 coins!",
    ]},
  { id: "scholar", label: "SCHOLAR", x: 28, y: 12, dir: 2, hairC: "#8844AA", shirtC: "#44AA66",
    lines: [
      "The LIBRARY to the east\nhas an amazing collection\nof projects!",
      "Each project was built with\npassion and purpose.\nGo check them out!",
    ]},
  { id: "fisher", label: "FISHER", x: 4, y: 23, dir: 3, hairC: "#CC6600", shirtC: "#3388CC",
    lines: [
      "Beautiful lake, isn't it?\nGreat spot for thinking\nabout code architecture.",
      "I hear there's a hidden\ncoin near the water...\nKeep your eyes peeled!",
    ]},
  { id: "traveler", label: "TRAVELER", x: 38, y: 12, dir: 2, hairC: "#333", shirtC: "#AA3366",
    lines: [
      "I crossed the river from\nthe eastern lands. This\nvillage is impressive!",
      "The POST OFFICE down south\nis where you can reach\nthe developer directly.",
    ]},
  { id: "merchant", label: "MERCHANT", x: 19, y: 13, dir: 3, hairC: "#AA6622", shirtC: "#228844",
    lines: [
      "Welcome to the market!\nBrowse the stalls and\nexplore the square!",
      "The TOWN HALL up north\nhas the full resume.\nDon't miss it!",
      "Have you found all the\nhidden coins yet? There\nare 10 scattered around!",
    ]},
  { id: "smith", label: "BLACKSMITH", x: 10, y: 18, dir: 0, hairC: "#222", shirtC: "#886644",
    lines: [
      "The FORGE is where skills\nare shaped and refined.",
      "Every tool, every language\nmastered through practice\nand dedication.",
    ]},
];

// ─── HORSE ──────────────────────────────────────────────────────
export const HORSE = {
  startX: 23, startY: 10,     // Starts near the crossroads
  speed: 1.0,                  // Wander speed when idle
  rideSpeedMultiplier: 2.5,    // 2.5x player walking speed when mounted
};

// ─── CAT ─────────────────────────────────────────────────────────
export const CAT = {
  startX: 20, startY: 14,
  speed: 1.2,
  lines: [
    "Meow! Purrrr... 🐱",
    "*The cat rubs against\nyour leg affectionately*",
    "*It seems to want you to\nexplore more of the town*",
  ],
};
