// ─── QUEST SYSTEM ───────────────────────────────────────────────
import { BUILDINGS } from "../config/buildings.js";

const ALL_BUILDING_IDS = BUILDINGS.map(b => b.id);

export function createQuestState() {
  return { visitedBuildings: [], completed: false };
}

export function recordBuildingVisit(qs, buildingId) {
  if (qs.completed) return false;
  if (qs.visitedBuildings.includes(buildingId)) return false;
  qs.visitedBuildings.push(buildingId);
  if (qs.visitedBuildings.length >= ALL_BUILDING_IDS.length) {
    qs.completed = true;
    return true; // quest just completed!
  }
  return false;
}

export function getQuestProgress(qs) {
  return { visited: qs.visitedBuildings.length, total: ALL_BUILDING_IDS.length };
}
