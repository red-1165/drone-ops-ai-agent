export interface Conflict {
  type: string;
  message: string;
}

export interface ReassignmentOption {
  pilotId: string;
  missionId: string;
  reason: string;
  conflictsResolved: string[];
}
