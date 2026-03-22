import { WORLD } from "../config/player.js";
import { COLORS } from "../config/theme.js";

// ─── DERIVED CONSTANTS ───────────────────────────────────────────
export const T = WORLD.tileSize;
export const COLS = WORLD.cols;
export const ROWS = WORLD.rows;
export const CW = WORLD.viewportW * T;
export const CH = WORLD.viewportH * T;
export const C = COLORS; // shorthand
