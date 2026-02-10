import { loadPilots, loadDrones, loadMissions } from "./dataLoader";

export function getSampleData() {
  return {
    pilots: loadPilots(),
    drones: loadDrones(),
    missions: loadMissions(),
  };
}
