import { COLORS } from "./theme.js";
import { YOUR_NAME } from "./player.js";

// ─── NPCs ────────────────────────────────────────────────────────
// To add an NPC: push a new object. The system auto-blocks their
// tile for collision and makes them interactable.
//
// Fields:
//   id       — unique identifier
//   label    — name shown in dialogue box
//   x, y     — tile position
//   dir      — facing direction (0=down, 1=up, 2=left, 3=right)
//   hairC, shirtC — appearance colors
//   lines    — array of dialogue strings (\n for line breaks)
export const NPCS = [
  { id: "guide", label: "VILLAGE GUIDE", x: 20, y: 12, dir: 0, hairC: COLORS.uiGold, shirtC: "#CC4444",
    lines: [
      `Welcome to ${YOUR_NAME}'s\nportfolio town, traveler!`,
      "Each building holds a piece\nof my story. Walk to any\ndoor and press SPACE!",
      "Explore the whole map!\nThere's a lake, a river,\nforests, and hidden coins!",
    ]},
  { id: "npc2", label: "VILLAGER", x: 24, y: 11, dir: 2, hairC: "#8844AA", shirtC: "#44AA66",
    lines: [
      "This developer is seriously\ntalented. Check out the\nLIBRARY to the east!",
      "Have you found all 10\nhidden coins yet?",
      "Try zooming in with + key\nto see the pixel art\nup close!",
    ]},
  { id: "npc3", label: "FISHER", x: 5, y: 17, dir: 3, hairC: "#CC6600", shirtC: "#3388CC",
    lines: [
      "Beautiful lake, isn't it?\nGreat spot for thinking\nabout code architecture.",
      "Check out the dock! I\ncome here to fish and\nthink about algorithms.",
    ]},
  { id: "npc4", label: "VILLAGER", x: 35, y: 12, dir: 2, hairC: "#333", shirtC: "#AA3366",
    lines: [
      "Cross the bridges to\nexplore east of the river!",
      "The POST OFFICE is south\nif you want to reach out.",
      "This whole town was built\nwith React and Canvas.\nPretty impressive, right?",
    ]},
];

// ─── CAT ─────────────────────────────────────────────────────────
export const CAT = {
  startX: 20, startY: 15,
  speed: 1.2,
  lines: [
    "Meow! Purrrr... 🐱",
    "*The cat rubs against\nyour leg affectionately*",
    "*It seems to want you to\nexplore more of the town*",
  ],
};
