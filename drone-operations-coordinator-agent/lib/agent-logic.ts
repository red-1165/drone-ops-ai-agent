import { Pilot, Drone, Project, Conflict, ReassignmentOption } from './types';

// Conflict Detection
export function detectConflicts(
  pilots: Pilot[],
  drones: Drone[],
  projects?: Project[],
): Conflict[] {
  const conflicts: Conflict[] = [];

  // Check for double-booking conflicts
  const pilotAssignments: Record<string, Project[]> = {};
  const droneAssignments: Record<string, Project[]> = {};

  if (projects) {
    for (const project of projects) {
      if (project.assignedPilot) {
        if (!pilotAssignments[project.assignedPilot]) {
          pilotAssignments[project.assignedPilot] = [];
        }
        pilotAssignments[project.assignedPilot].push(project);
      }
      if (project.assignedDrone) {
        if (!droneAssignments[project.assignedDrone]) {
          droneAssignments[project.assignedDrone] = [];
        }
        droneAssignments[project.assignedDrone].push(project);
      }
    }

    // Detect pilot double-bookings
    for (const [pilotId, assignedProjects] of Object.entries(
      pilotAssignments,
    )) {
      for (let i = 0; i < assignedProjects.length; i++) {
        for (let j = i + 1; j < assignedProjects.length; j++) {
          const p1 = assignedProjects[i];
          const p2 = assignedProjects[j];
          if (
            new Date(p1.startDate) < new Date(p2.endDate) &&
            new Date(p1.endDate) > new Date(p2.startDate)
          ) {
            conflicts.push({
              type: 'double-booking',
              severity: 'critical',
              description: `Pilot ${pilotId} is double-booked on ${p1.name} and ${p2.name}`,
              affectedItems: [pilotId, p1.id, p2.id],
              suggestedResolution: `Reassign one of the projects to another pilot`,
            });
          }
        }
      }
    }

    // Detect drone double-bookings
    for (const [droneId, assignedProjects] of Object.entries(
      droneAssignments,
    )) {
      for (let i = 0; i < assignedProjects.length; i++) {
        for (let j = i + 1; j < assignedProjects.length; j++) {
          const p1 = assignedProjects[i];
          const p2 = assignedProjects[j];
          if (
            new Date(p1.startDate) < new Date(p2.endDate) &&
            new Date(p1.endDate) > new Date(p2.startDate)
          ) {
            conflicts.push({
              type: 'double-booking',
              severity: 'critical',
              description: `Drone ${droneId} is double-booked on ${p1.name} and ${p2.name}`,
              affectedItems: [droneId, p1.id, p2.id],
              suggestedResolution: `Reassign one of the projects to another drone`,
            });
          }
        }
      }
    }

    // Check for skill mismatches
    for (const project of projects) {
      if (project.assignedPilot) {
        const pilot = pilots.find((p) => p.id === project.assignedPilot);
        if (pilot) {
          if (pilot.skillLevel !== project.requiredSkillLevel) {
            const skillOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
            const pilotSkillIndex = skillOrder.indexOf(pilot.skillLevel);
            const requiredSkillIndex = skillOrder.indexOf(
              project.requiredSkillLevel,
            );
            if (pilotSkillIndex < requiredSkillIndex) {
              conflicts.push({
                type: 'skill-mismatch',
                severity: 'warning',
                description: `Pilot ${pilot.name} (${pilot.skillLevel}) lacks required skill level (${project.requiredSkillLevel}) for ${project.name}`,
                affectedItems: [project.assignedPilot, project.id],
                suggestedResolution: `Assign a pilot with ${project.requiredSkillLevel} skill level`,
              });
            }
          }

          // Check certifications
          const missingCerts = project.requiredCertifications.filter(
            (cert) => !pilot.certifications.includes(cert),
          );
          if (missingCerts.length > 0) {
            conflicts.push({
              type: 'skill-mismatch',
              severity: 'warning',
              description: `Pilot ${pilot.name} is missing certifications for ${project.name}: ${missingCerts.join(', ')}`,
              affectedItems: [project.assignedPilot, project.id],
              suggestedResolution: `Assign a pilot with ${missingCerts.join(', ')} certifications`,
            });
          }
        }
      }

      // Check equipment mismatch
      if (project.assignedDrone) {
        const drone = drones.find((d) => d.id === project.assignedDrone);
        if (drone) {
          const missingCapabilities = project.requiredDroneCapabilities.filter(
            (cap) => !drone.capabilities.includes(cap),
          );
          if (missingCapabilities.length > 0) {
            conflicts.push({
              type: 'equipment-mismatch',
              severity: 'warning',
              description: `Drone ${drone.model} lacks capabilities for ${project.name}: ${missingCapabilities.join(', ')}`,
              affectedItems: [project.assignedDrone, project.id],
              suggestedResolution: `Assign a drone with ${missingCapabilities.join(', ')} capabilities`,
            });
          }
        }
      }

      // Check location mismatch
      if (project.assignedPilot) {
        const pilot = pilots.find((p) => p.id === project.assignedPilot);
        if (pilot && pilot.currentLocation !== project.requiredLocation) {
          conflicts.push({
            type: 'location-mismatch',
            severity: 'info',
            description: `Pilot ${pilot.name} is in ${pilot.currentLocation} but ${project.name} is in ${project.requiredLocation}`,
            affectedItems: [project.assignedPilot, project.id],
            suggestedResolution: `Relocate pilot or assign a local pilot`,
          });
        }
      }

      // Check maintenance status
      if (project.assignedDrone) {
        const drone = drones.find((d) => d.id === project.assignedDrone);
        if (drone && drone.status === 'maintenance') {
          conflicts.push({
            type: 'maintenance-conflict',
            severity: 'critical',
            description: `Drone ${drone.model} is in maintenance but assigned to ${project.name}`,
            affectedItems: [project.assignedDrone, project.id],
            suggestedResolution: `Assign an available drone or reschedule project`,
          });
        }
      }
    }
  }

  return conflicts;
}

// Find available pilots for a project
export function findAvailablePilots(
  pilots: Pilot[],
  projectRequirements: {
    skillLevel: string;
    certifications: string[];
    droneExperience?: string[];
    location?: string;
  },
  excludePilotId?: string,
): Pilot[] {
  const skillOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
  const requiredSkillIndex = skillOrder.indexOf(projectRequirements.skillLevel);

  return pilots.filter((pilot) => {
    if (excludePilotId && pilot.id === excludePilotId) return false;
    if (pilot.status !== 'available') return false;

    // Check skill level
    const pilotSkillIndex = skillOrder.indexOf(pilot.skillLevel);
    if (pilotSkillIndex < requiredSkillIndex) return false;

    // Check certifications
    const hasCertifications = projectRequirements.certifications.every((cert) =>
      pilot.certifications.includes(cert),
    );
    if (!hasCertifications) return false;

    // Check location if specified
    if (
      projectRequirements.location &&
      pilot.currentLocation !== projectRequirements.location
    ) {
      return false;
    }

    return true;
  });
}

// Find available drones for a project
export function findAvailableDrones(
  drones: Drone[],
  projectRequirements: {
    capabilities: string[];
    location?: string;
  },
  excludeDroneId?: string,
): Drone[] {
  return drones.filter((drone) => {
    if (excludeDroneId && drone.id === excludeDroneId) return false;
    if (drone.status !== 'available' && drone.status !== 'reserved') return false;

    // Check capabilities
    const hasCapabilities = projectRequirements.capabilities.every((cap) =>
      drone.capabilities.includes(cap),
    );
    if (!hasCapabilities) return false;

    // Check location if specified
    if (
      projectRequirements.location &&
      drone.location !== projectRequirements.location
    ) {
      return false;
    }

    return true;
  });
}

// Generate reassignment options
export function generateReassignmentOptions(
  pilots: Pilot[],
  drones: Drone[],
  conflicts: Conflict[],
  criticalOnly = false,
): ReassignmentOption[] {
  const options: ReassignmentOption[] = [];

  const relevantConflicts = criticalOnly
    ? conflicts.filter((c) => c.severity === 'critical')
    : conflicts;

  for (const conflict of relevantConflicts) {
    if (conflict.type === 'double-booking' && conflict.affectedItems[0]) {
      const itemId = conflict.affectedItems[0];
      const pilot = pilots.find((p) => p.id === itemId);

      if (pilot) {
        // Find replacement pilots
        const replacements = pilots.filter(
          (p) => p.id !== itemId && p.status === 'available',
        );
        for (const replacement of replacements) {
          options.push({
            pilotId: replacement.id,
            pilotName: replacement.name,
            reason: `Replace ${pilot.name} to resolve double-booking`,
            conflictsResolved: [conflict.description],
          });
        }
      }
    }

    if (conflict.type === 'skill-mismatch' && conflict.affectedItems[0]) {
      const itemId = conflict.affectedItems[0];
      const currentPilot = pilots.find((p) => p.id === itemId);

      if (currentPilot) {
        const replacements = pilots.filter(
          (p) => p.id !== itemId && p.status === 'available',
        );
        for (const replacement of replacements) {
          options.push({
            pilotId: replacement.id,
            pilotName: replacement.name,
            reason: `${replacement.name} has better qualifications`,
            conflictsResolved: [conflict.description],
          });
        }
      }
    }
  }

  // Remove duplicates
  const seen = new Set<string>();
  return options.filter((opt) => {
    const key = opt.pilotId + (opt.droneId || '');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Analyze workload and suggest cascade reassignments
export function analyzeCascadeReassignments(
  pilots: Pilot[],
  drones: Drone[],
  projects: Project[],
): ReassignmentOption[] {
  const cascadeOptions: ReassignmentOption[] = [];

  // Count active assignments
  const pilotWorkload: Record<string, number> = {};
  const droneWorkload: Record<string, number> = {};

  for (const project of projects) {
    if (project.assignedPilot) {
      pilotWorkload[project.assignedPilot] =
        (pilotWorkload[project.assignedPilot] || 0) + 1;
    }
    if (project.assignedDrone) {
      droneWorkload[project.assignedDrone] =
        (droneWorkload[project.assignedDrone] || 0) + 1;
    }
  }

  // Find overloaded pilots
  for (const [pilotId, count] of Object.entries(pilotWorkload)) {
    if (count > 2) {
      // More than 2 concurrent projects
      const pilot = pilots.find((p) => p.id === pilotId);
      if (pilot) {
        // Find less busy pilots to take over one assignment
        const lessBusyPilots = pilots.filter(
          (p) =>
            p.id !== pilotId &&
            p.status === 'available' &&
            (pilotWorkload[p.id] || 0) < count,
        );

        for (const lessBusyPilot of lessBusyPilots.slice(0, 2)) {
          cascadeOptions.push({
            pilotId: lessBusyPilot.id,
            pilotName: lessBusyPilot.name,
            reason: `Redistribute workload: ${lessBusyPilot.name} has lighter schedule`,
            conflictsResolved: [
              `Reduce ${pilot.name}'s workload from ${count} to ${count - 1} projects`,
            ],
          });
        }
      }
    }
  }

  return cascadeOptions;
}
