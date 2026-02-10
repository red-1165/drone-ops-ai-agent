import { detectConflicts } from "./conflictDetector";

export interface ReassignmentOption {
  pilotId: string;
  missionId: string;
  reason: string;
  conflictsResolved: string[];
}

/**
 * Generate immediate reassignment options
 */
export function generateReassignmentOptions(
  mission: any,
  pilots: any[],
  drones: any[]
): ReassignmentOption[] {
  const options: ReassignmentOption[] = [];

  for (const pilot of pilots) {
    if (pilot.status === "available") {
      const conflict = detectConflicts(pilot, drones[0], mission);

      if (!conflict) {
        options.push({
          pilotId: pilot.id,
          missionId: mission.id,
          reason: "Suitable replacement",
          conflictsResolved: ["Availability", "Location"],
        });
      }
    }
  }

  return options;
}

/**
 * Analyze cascade reassignment options
 */
export function analyzeCascadeReassignments(
  mission: any,
  pilots: any[]
): ReassignmentOption[] {
  return pilots
    .filter((p) => p.status === "available")
    .map((p) => ({
      pilotId: p.id,
      missionId: mission.id,
      reason: "Backup pilot",
      conflictsResolved: ["Workload balancing"],
    }));
}
