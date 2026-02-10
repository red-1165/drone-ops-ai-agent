export interface Pilot {
  id: string;
  name: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certifications: string[];
  droneExperience: string[];
  currentLocation: string;
  currentAssignment?: string;
  status: 'available' | 'on-leave' | 'unavailable';
  assignmentStartDate?: string;
  assignmentEndDate?: string;
}

export interface Drone {
  id: string;
  model: string;
  serialNumber: string;
  capabilities: string[];
  currentAssignment?: string;
  status: 'available' | 'deployed' | 'maintenance' | 'reserved';
  location: string;
  maintenanceDueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  requiredSkillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  requiredCertifications: string[];
  requiredDroneCapabilities: string[];
  requiredLocation: string;
  startDate: string;
  endDate: string;
  assignedPilot?: string;
  assignedDrone?: string;
  status: 'pending' | 'active' | 'completed';
}

export interface Conflict {
  type: 'double-booking' | 'skill-mismatch' | 'equipment-mismatch' | 'location-mismatch' | 'maintenance-conflict';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  affectedItems: string[];
  suggestedResolution?: string;
}

export interface ReassignmentOption {
  pilotId: string;
  pilotName: string;
  droneId?: string;
  droneName?: string;
  reason: string;
  conflictsResolved: string[];
  newConflicts?: string[];
}

export interface AgentContext {
  pilots: Pilot[];
  drones: Drone[];
  projects: Project[];
  conflicts: Conflict[];
}
