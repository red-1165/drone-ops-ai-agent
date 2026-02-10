import { checkConflict } from "./conflictDetector";

export function assign(pilot, drone, mission) {

  const conflict = checkConflict(pilot, drone, mission);

  if (conflict) {
    return { success: false, reason: conflict };
  }

  pilot.status = "Busy";
  drone.status = "Deployed";

  return { success: true };
}
export function findBackup(mission, pilots) {
  return pilots.filter(p =>
    p.status === "Available" &&
    p.skills.includes(mission.skill)
  );
}
