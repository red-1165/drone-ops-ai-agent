export function checkConflict(pilot, drone, mission) {

  if (pilot.status !== "Available") {
    return "Pilot unavailable";
  }

  if (!pilot.skills.includes(mission.skill)) {
    return "Skill mismatch";
  }

  if (drone.status === "Maintenance") {
    return "Drone in maintenance";
  }

  if (pilot.location !== mission.location) {
    return "Location mismatch";
  }

  return null;
}
