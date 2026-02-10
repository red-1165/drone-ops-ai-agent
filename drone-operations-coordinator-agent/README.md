# Skylark Drones - Operations Coordinator AI Agent

An AI-powered coordination platform for managing drone pilots, fleet inventory, project assignments, and operational conflicts in real-time.

## Features

### 1. **Roster Management**
- Query pilot availability by skill, certification, location
- View current assignments and project status
- Update pilot status (Available / On Leave / Unavailable) with automatic Google Sheets sync
- Track certifications and drone experience

### 2. **Assignment Tracking**
- Match pilots to projects based on requirements
- Track active assignments with date ranges
- Automatic conflict detection
- Visual assignment timeline

### 3. **Drone Inventory**
- Query fleet by capability, availability, location
- Track deployment status across projects
- Flag maintenance issues
- Monitor maintenance schedules
- Automatic Google Sheets sync

### 4. **Conflict Detection & Resolution**
Real-time detection of 5 conflict types:
- **Double-booking**: Pilot or drone assigned to overlapping projects
- **Skill Mismatch**: Pilot lacks required certifications or skill level
- **Equipment Mismatch**: Drone lacking required capabilities
- **Location Mismatch**: Pilot and project in different locations
- **Maintenance Conflict**: Drone in maintenance but assigned to project

### 5. **Urgent Reassignment**
Two-strategy approach for conflict resolution:

**Strategy A - Immediate Replacement:**
- Detects critical conflicts instantly
- Finds qualified replacement pilots
- Direct substitution for emergency situations
- Example: Pilot double-booked → swap with available backup

**Strategy B - Cascade Reassignment:**
- Analyzes workload distribution
- Identifies overloaded pilots
- Suggests proactive rebalancing
- Example: Redistribute work to prevent future bottlenecks

### 6. **AI Agent Interface**
- Natural language conversational interface
- Context-aware responses with current fleet data
- Quick action buttons for common tasks
- Real-time data integration

## Architecture

```
Skylark Drones Agent
├── Frontend (React 19 + Next.js 16)
│   ├── Agent Chat - Conversational AI interface
│   ├── Conflict Dashboard - Visual conflict overview
│   ├── Reassignment Panel - Recommended reassignments
│   ├── Pilot Roster - Team management
│   └── Drone Fleet - Inventory tracking
│
├── Backend (Next.js API Routes)
│   └── /api/agent - Main agent endpoint
│       ├── Receives user queries
│       ├── Runs conflict detection
│       ├── Generates reassignment options
│       └── Returns AI-powered response
│
└── Core Logic
    ├── Conflict Detection (5 types)
    ├── Reassignment Generation
    ├── Availability Matching
    └── Google Sheets Integration (2-way sync)
```

## Technology Stack

- **Frontend:** React 19, Next.js 16, Tailwind CSS, shadcn/ui
- **AI:** Vercel AI SDK 6, OpenAI GPT-4 Turbo (via Vercel AI Gateway)
- **Backend:** Next.js API Routes, TypeScript
- **Integration:** Google Sheets API (service layer ready)
- **Data Storage:** In-memory (demo) / Google Sheets (production)

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- No API keys needed (uses Vercel AI Gateway)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/skylark-drones.git
cd skylark-drones
```

2. Install dependencies
```bash
pnpm install
```

3. Run the development server
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Agent Chat Tab
Interact naturally with the AI coordinator:
- "Who is available for a project in San Francisco?"
- "Detect all conflicts in our assignments"
- "Suggest urgent reassignments for Bob"
- "What drones have LiDAR capability?"

### Conflicts Tab
View all detected conflicts:
- See severity levels (Critical, Warning, Info)
- Read detailed descriptions
- View suggested resolutions
- Identify affected pilots/drones

### Reassignments Tab
Get recommended reassignment options:
- **Immediate Replacements:** Instant solutions for critical conflicts
- **Cascade Options:** Proactive workload rebalancing

### Roster Tab
Manage pilot assignments:
- View all pilots with skills and certifications
- See current assignments and status
- Update pilot availability
- Filter by location and skill level

### Fleet Tab
Manage drone inventory:
- View all drones with capabilities
- Track current deployments
- Monitor maintenance status
- See availability and location

## Data Models

### Pilot
```typescript
{
  id: string;
  name: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certifications: string[]; // e.g., ['Commercial', 'FPV', 'LiDAR']
  droneExperience: string[]; // e.g., ['DJI Matrice 300', 'Freefly Alta X']
  currentLocation: string;
  currentAssignment?: string;
  status: 'available' | 'on-leave' | 'unavailable';
  assignmentStartDate?: string;
  assignmentEndDate?: string;
}
```

### Drone
```typescript
{
  id: string;
  model: string;
  serialNumber: string;
  capabilities: string[]; // e.g., ['4K Video', 'LiDAR', 'Thermal']
  currentAssignment?: string;
  status: 'available' | 'deployed' | 'maintenance' | 'reserved';
  location: string;
  maintenanceDueDate?: string;
}
```

### Conflict
```typescript
{
  type: 'double-booking' | 'skill-mismatch' | 'equipment-mismatch' 
        | 'location-mismatch' | 'maintenance-conflict';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  affectedItems: string[]; // Pilot/Drone/Project IDs
  suggestedResolution?: string;
}
```

## Google Sheets Integration

The system includes a service layer for 2-way sync with Google Sheets:

### Read Operations
- `getPilotsFromSheets()` - Fetch pilot roster
- `getdronesFromSheets()` - Fetch drone fleet

### Write Operations
- `updatePilotStatusInSheets()` - Sync pilot status changes
- `updateDroneStatusInSheets()` - Sync drone status changes
- `updateAssignmentInSheets()` - Sync assignment changes

**Demo Setup:** Currently uses sample data. To integrate real Google Sheets:
1. Add Google Sheets API credentials
2. Set `GOOGLE_SHEETS_API_KEY` environment variable
3. Update sheet IDs in configuration
4. API calls will automatically use real data

## API Reference

### POST /api/agent

Process natural language queries with AI agent.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Who is available for a project?" }
  ],
  "action": "optional-action-string"
}
```

**Response:**
```json
{
  "response": "AI-generated response with analysis",
  "data": {
    "pilots": [...],
    "drones": [...],
    "projects": [...],
    "conflicts": [...]
  }
}
```

**Optional Actions:**
- `detect-conflicts` - Run full conflict detection
- `find-pilot` - Find available pilots
- `reassignment-options` - Generate reassignment options

## Conflict Detection Examples

### Example 1: Double-Booking
**Scenario:** Bob Smith assigned to:
- Project Alpha: Feb 10-17
- Project Gamma: Feb 15-22 (overlapping!)

**Detection:** Critical - `double-booking`
**Resolution:** Reassign one project to another available pilot

### Example 2: Skill Mismatch
**Scenario:** Carol Davis (Intermediate) assigned to:
- Project requiring "Advanced" skill level + "Commercial" certification
- Carol only has "Part 107"

**Detection:** Warning - `skill-mismatch`
**Resolution:** Find pilot with required certifications or upgrade pilot training

### Example 3: Maintenance Conflict
**Scenario:** Freefly Alta X assigned to project but:
- Status: `maintenance` until Feb 15
- Project starts: Feb 10

**Detection:** Critical - `maintenance-conflict`
**Resolution:** Reassign to available drone or reschedule project

## Performance

- Conflict detection: O(n²) for date overlaps, O(n) for capability matching
- Pilot matching: O(n) filtering with early exit
- Reassignment generation: O(n) with deduplication
- AI response: <2 seconds (GPT-4 Turbo via API Gateway)

Optimized for fleets up to ~100 pilots and drones.

## Future Enhancements

1. **Real Google Sheets Integration**
   - OAuth2 authentication
   - Real-time bidirectional sync
   - Automatic backup sync

2. **Advanced Scheduling**
   - Travel time between locations
   - Pilot fatigue/rest day tracking
   - ML-based optimal assignment

3. **Persistent Database**
   - PostgreSQL for historical tracking
   - Audit logs for all changes
   - Analytics dashboards

4. **Autonomous Operations**
   - Tool-calling to execute reassignments
   - Automatic approval for low-risk changes
   - Escalation workflow for complex decisions

5. **Predictive Analytics**
   - Forecast conflicts before they occur
   - Suggest preemptive reassignments
   - Optimize resource utilization

6. **Mobile Support**
   - Responsive UI for field coordinators
   - Offline mode with sync
   - Push notifications for urgent conflicts

## License

MIT

## Support

For questions or issues:
1. Check the [Decision Log](./DECISION_LOG.md) for design decisions
2. Review sample data in `/lib/sheets-service.ts`
3. Test conflict detection in `/lib/agent-logic.ts`
4. Trace AI responses in `/app/api/agent/route.ts`
