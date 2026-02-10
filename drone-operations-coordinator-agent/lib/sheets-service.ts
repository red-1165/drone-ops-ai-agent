import { Pilot, Drone } from './types';

// This service handles Google Sheets integration
// In production, you would use the Google Sheets API with proper authentication

export interface SheetsConfig {
  pilotRosterId: string;
  droneFleetId: string;
  apiKey: string;
}

// Sample data - replace with actual Google Sheets API calls
export const samplePilots: Pilot[] = [
  {
    id: 'P001',
    name: 'Alice Johnson',
    skillLevel: 'expert',
    certifications: ['Commercial', 'FPV', 'LiDAR'],
    droneExperience: ['DJI Matrice 300', 'Freefly Alta X'],
    currentLocation: 'San Francisco, CA',
    status: 'available',
  },
  {
    id: 'P002',
    name: 'Bob Smith',
    skillLevel: 'advanced',
    certifications: ['Commercial', 'Part 107'],
    droneExperience: ['DJI Matrice 300', 'DJI Air 3'],
    currentLocation: 'Los Angeles, CA',
    currentAssignment: 'Project Alpha',
    status: 'unavailable',
    assignmentStartDate: '2025-02-10',
    assignmentEndDate: '2025-02-17',
  },
  {
    id: 'P003',
    name: 'Carol Davis',
    skillLevel: 'intermediate',
    certifications: ['Part 107', 'LiDAR'],
    droneExperience: ['DJI Air 3', 'Auterion Skynode'],
    currentLocation: 'San Diego, CA',
    status: 'on-leave',
  },
  {
    id: 'P004',
    name: 'David Wilson',
    skillLevel: 'advanced',
    certifications: ['Commercial', 'FPV', 'Thermal'],
    droneExperience: ['DJI Matrice 300', 'Freefly Alta X', 'Thermal Drones'],
    currentLocation: 'San Francisco, CA',
    status: 'available',
  },
  {
    id: 'P005',
    name: 'Emma Chen',
    skillLevel: 'beginner',
    certifications: ['Part 107'],
    droneExperience: ['DJI Air 3'],
    currentLocation: 'Berkeley, CA',
    status: 'available',
  },
];

export const sampleDrones: Drone[] = [
  {
    id: 'D001',
    model: 'DJI Matrice 300 RTK',
    serialNumber: 'SN-M300-001',
    capabilities: ['4K Video', 'LiDAR', 'Thermal', '55min Flight'],
    status: 'deployed',
    location: 'Los Angeles, CA',
    currentAssignment: 'Project Alpha',
  },
  {
    id: 'D002',
    model: 'DJI Air 3',
    serialNumber: 'SN-AIR3-002',
    capabilities: ['4K Video', '46min Flight', 'Wide Angle'],
    status: 'available',
    location: 'San Francisco, CA',
  },
  {
    id: 'D003',
    model: 'Freefly Alta X',
    serialNumber: 'SN-ALTAX-003',
    capabilities: ['Heavy Lift', 'Large Payload', 'Professional'],
    status: 'maintenance',
    location: 'San Francisco, CA',
    maintenanceDueDate: '2025-02-15',
  },
  {
    id: 'D004',
    model: 'DJI Matrice 300 RTK',
    serialNumber: 'SN-M300-004',
    capabilities: ['4K Video', 'LiDAR', 'Thermal', '55min Flight'],
    status: 'available',
    location: 'San Francisco, CA',
  },
  {
    id: 'D005',
    model: 'Auterion Skynode',
    serialNumber: 'SN-SKYNODE-005',
    capabilities: ['VTOL', 'Autonomous', 'Extended Range'],
    status: 'reserved',
    location: 'Berkeley, CA',
    currentAssignment: 'Project Beta (Scheduled)',
  },
];

// Simulate fetching data from Google Sheets
export async function getPilotsFromSheets(
  sheetsConfig: SheetsConfig,
): Promise<Pilot[]> {
  // In production, use Google Sheets API
  // const sheets = google.sheets({ version: 'v4', auth });
  // const response = await sheets.spreadsheets.values.get({...});
  return samplePilots;
}

export async function getdronesFromSheets(
  sheetsConfig: SheetsConfig,
): Promise<Drone[]> {
  // In production, use Google Sheets API
  return sampleDrones;
}

// Simulate updating pilot status in Google Sheets
export async function updatePilotStatusInSheets(
  sheetsConfig: SheetsConfig,
  pilotId: string,
  status: Pilot['status'],
): Promise<boolean> {
  // In production, use Google Sheets API
  // const sheets = google.sheets({ version: 'v4', auth });
  // await sheets.spreadsheets.values.update({...});
  console.log(`[v0] Updated pilot ${pilotId} status to ${status} in sheets`);
  return true;
}

// Simulate updating drone status in Google Sheets
export async function updateDroneStatusInSheets(
  sheetsConfig: SheetsConfig,
  droneId: string,
  status: Drone['status'],
  location?: string,
): Promise<boolean> {
  // In production, use Google Sheets API
  console.log(
    `[v0] Updated drone ${droneId} status to ${status} ${location ? `at ${location}` : ''}`,
  );
  return true;
}

// Simulate updating assignment in Google Sheets
export async function updateAssignmentInSheets(
  sheetsConfig: SheetsConfig,
  pilotId: string,
  droneId: string,
  projectId: string,
): Promise<boolean> {
  console.log(
    `[v0] Updated assignment: Pilot ${pilotId}, Drone ${droneId}, Project ${projectId}`,
  );
  return true;
}
