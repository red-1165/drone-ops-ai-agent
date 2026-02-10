export function detectConflicts(
  pilot: any,
  drone: any,
  mission: any
): string | null {
  if (!pilot || !drone || !mission) return "Missing data";

  if (pilot.status !== "available") return "Pilot unavailable";

  if (drone.status === "maintenance") return "Drone in maintenance";

  if (pilot.location !== mission.location)
    return "Location mismatch";

  return null;
}
