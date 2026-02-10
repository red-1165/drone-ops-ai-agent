# Skylark Drones - Operations Coordinator AI Agent
## Decision Log

### Project Overview
Built a comprehensive AI-powered Drone Operations Coordinator agent that helps manage pilot assignments, drone fleet inventory, project coordination, and conflict resolution for Skylark Drones.

---

## Key Assumptions & Decisions

### 1. **Technology Stack**
**Decision:** Next.js 16 with AI SDK 6 + Vercel AI Gateway (OpenAI)

**Reasoning:**
- AI SDK provides production-ready streaming and tool-calling capabilities
- Vercel AI Gateway eliminates need for API key management (no env vars required)
- Next.js 16 provides modern server/client architecture with Turbopack
- React 19 enables cutting-edge patterns (useEffectEvent, Activity)

**Trade-off:** Could have used Claude via Anthropic for better reasoning, but OpenAI with Gateway provides zero-config setup aligned with assignment goals.

---

### 2. **Google Sheets Integration**
**Decision:** Sample data layer with mock Sheets API service

**Reasoning:**
- Assignment requires 2-way sync with Google Sheets
- Implemented data service layer (`sheets-service.ts`) with:
  - `getPilotsFromSheets()` - read pilot roster
  - `getdronesFromSheets()` - read drone fleet
  - `updatePilotStatusInSheets()` - write pilot status back
  - `updateDroneStatusInSheets()` - write drone status back
  - `updateAssignmentInSheets()` - write assignments back

**Real Implementation:** In production, would use Google Sheets API with OAuth2:
```typescript
const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
const response = await sheets.spreadsheets.values.get({
  spreadsheetId: SHEET_ID,
  range: 'Pilot Roster!A:H'
});
```

**Trade-off:** Demo uses in-memory sample data, but service layer is ready for real API integration without code changes.

---

### 3. **Conflict Detection Strategy**
**Decision:** Implemented 5 conflict types with severity levels

**Conflict Types Implemented:**
1. **Double-booking** (Critical) - Pilot or drone assigned to overlapping date ranges
2. **Skill-mismatch** (Warning) - Pilot lacks required skill level or certifications
3. **Equipment-mismatch** (Warning) - Drone lacks required capabilities
4. **Location-mismatch** (Info) - Pilot and project in different locations
5. **Maintenance-conflict** (Critical) - Drone in maintenance assigned to project

**Algorithm:**
- Date overlap detection: `new Date(p1.start) < new Date(p2.end) && new Date(p1.end) > new Date(p2.start)`
- Skill ordering: beginner < intermediate < advanced < expert
- Capability matching: Set comparison
- Status-based validation: Check maintenance, reserved, unavailable states

**Justification:** Severity levels allow prioritization - critical conflicts halt operations, warnings suggest improvement, info is advisory.

---

### 4. **Urgent Reassignment Implementation**
**Decision:** Dual-strategy approach - Immediate Replacement + Cascade Reassignment

#### **Strategy A: Immediate Replacement**
- Detects **critical conflicts only**
- Finds qualified replacement pilots (matching skills, certifications)
- Direct 1:1 substitution
- For: Double-booking, critical skill mismatches

```typescript
const immediateOptions = generateReassignmentOptions(
  pilots, drones, conflicts, true // criticalOnly=true
);
```

#### **Strategy B: Cascade Reassignment**
- Analyzes workload distribution across pilots
- Identifies overloaded pilots (>2 concurrent projects)
- Suggests reassignments to redistribute work
- For: Resource optimization, preventing future conflicts

```typescript
const cascadeOptions = analyzeCascadeReassignments(
  pilots, drones, projects
);
```

**Why Both?**
- **Immediate:** Solves urgent operational problems NOW
- **Cascade:** Prevents future problems through proactive rebalancing
- Gives coordinators flexibility to choose approach based on context

**Trade-off:** Could implement ML-based optimal assignment, but greedy matching is sufficient for 6-hour assignment scope.

---

### 5. **Agent Interface Design**
**Decision:** Multi-tab dashboard with conversational chat

**Components:**
1. **Agent Chat** - Natural language interface powered by GPT-4 Turbo
   - Conversational interaction with context-aware responses
   - Quick action buttons for common tasks
   - Real-time conflict/data context injected into prompts

2. **Conflicts Tab** - Real-time conflict visualization
   - Visual severity indicators
   - Suggested resolutions
   - Affected items highlighting

3. **Reassignments Tab** - Reassignment recommendations
   - Immediate replacement options
   - Cascade options with benefit analysis
   - One-click reassignment actions

4. **Roster Tab** - Pilot management
   - Table view with inline status updates
   - Certification visualization
   - Location and assignment tracking

5. **Fleet Tab** - Drone management
   - Fleet status overview
   - Capability tracking
   - Maintenance status
   - Location monitoring

**Reasoning:** Multi-view approach serves different user patterns:
- Power users: Quick AI chat for natural language queries
- Coordinators: Visual panels for specific concerns
- Managers: Dashboard overview of fleet health

---

### 6. **Data Model Decisions**

**Pilot Fields:**
- `skillLevel` (enum): 4-tier classification for matching
- `certifications` (array): Specific qualifications
- `droneExperience` (array): Drone models flown
- `status` (enum): available/on-leave/unavailable - syncs to Sheets
- `currentAssignment`: Project tracking
- `assignmentDates`: Start/end for overlap detection

**Drone Fields:**
- `capabilities` (array): Features (4K, LiDAR, Thermal, etc.)
- `status` (enum): available/deployed/maintenance/reserved
- `location`: Geographic tracking
- `maintenanceDueDate`: Schedule tracking

**Project Fields:**
- Requirements: skill level, certifications, capabilities, location
- Timeline: startDate, endDate
- Assignments: pilot + drone pairing

**Justification:** Enables precise matching without false positives/negatives

---

### 7. **Edge Cases Handled**

| Edge Case | Handling |
|-----------|----------|
| Pilot on leave assigned to project | Flagged as conflict; reassignment options provided |
| Drone in maintenance with assignment | Critical conflict; cannot deploy |
| Overlapping date ranges | Date overlap detection in millisecond precision |
| Missing certifications | Specific missing certs listed; exact match required |
| Location mismatch | Info-level conflict; coordinators can approve if needed |
| Skill level insufficient | Cannot assign lower-skilled pilot to higher-requirement project |
| Multiple conflicts per assignment | All listed; resolutions address highest severity first |
| No qualified replacements available | Options list may be empty; escalate to manager |

---

## Trade-offs & What I'd Do Differently

### Given More Time:

1. **Real Google Sheets Sync**
   - Implement OAuth2 flow
   - Real-time bidirectional sync with Sheets
   - Automatic conflict detection on data updates
   - Current: Simulated for demonstration

2. **Advanced Scheduling**
   - ML-based optimal assignment (Hungarian algorithm)
   - Travel time between locations
   - Pilot fatigue/rest day tracking
   - Current: Simple greedy matching

3. **Persistent Database**
   - SQLite/Postgres for historical tracking
   - Audit logs for all status changes
   - Analytics on pilot utilization
   - Current: In-memory only

4. **Mobile-First UI**
   - Better responsive design for field coordinators
   - Offline mode with sync when online
   - Push notifications for urgent conflicts
   - Current: Desktop-optimized

5. **Tool Calling with AI**
   - Let agent execute reassignments directly via tools
   - Agent proposes, coordinator approves
   - Current: Agent recommends; manual execution

6. **Predictive Conflict Detection**
   - Forecast conflicts based on upcoming assignments
   - Suggest preemptive reassignments
   - Current: Reactive only

---

## Interpretation of "Urgent Reassignments"

**Our Approach:** Two-pronged strategy recognizing different urgency contexts

**Immediate Urgency** (Critical Conflicts Now):
- Pilot double-booked on overlapping dates
- Drone in maintenance but assigned
- Pilot missing required certifications
- Solution: Instant replacement pilot + drone swap

**Proactive Urgency** (Prevent Future Problems):
- Pilot overloaded with >2 concurrent projects
- Unbalanced workload across team
- Resources inefficiently allocated
- Solution: Cascade reassignments to preemptively rebalance

**Coordinator Has Options:**
- Choose "Immediate" for emergencies
- Choose "Cascade" for operational health
- Blend both approaches based on context

This interpretation assumes the coordinator needs flexibility for the 80% of cases that aren't black-and-white emergencies.

---

## Testing Scenarios Included

### Conflict Detection:
- ✅ Double-booking: Bob Smith assigned to overlapping dates (Project Alpha Feb 10-17)
- ✅ Skill mismatch: Carol Davis (intermediate) lacks "Commercial" cert
- ✅ Equipment mismatch: Drone lacking capabilities for project
- ✅ Location mismatch: Pilot in San Francisco, project in Los Angeles
- ✅ Maintenance conflict: Freefly Alta X in maintenance until Feb 15

### Available Pilots:
- ✅ Alice Johnson: Expert, all certs, available
- ✅ David Wilson: Advanced, all certs, available
- ✅ Emma Chen: Beginner, available

### Reassignment Options:
- ✅ Immediate: Replace Bob with David Wilson
- ✅ Cascade: Redistribute Emma Chen to reduce future bottlenecks

---

## Architecture Summary

```
App/
├── API Routes
│   └── /api/agent - Main agent endpoint (POST)
├── Components
│   ├── agent-chat - Conversational interface
│   ├── conflict-panel - Conflict visualization
│   ├── reassignment-panel - Reassignment options
│   ├── pilot-roster - Pilot management table
│   └── drone-fleet - Drone management table
├── Lib
│   ├── types.ts - Data models
│   ├── sheets-service.ts - Google Sheets integration
│   └── agent-logic.ts - Conflict detection & reassignment
└── Page - Main dashboard (Tabs UI)
```

---

## Conclusion

This implementation provides a solid foundation for the Drone Operations Coordinator role. The AI agent, conflict detection, and reassignment logic handle the core requirements with proper data modeling, error handling, and user flexibility. The architecture is designed for easy integration with real Google Sheets when the demo data layer is replaced with actual API calls.

**Key Strengths:**
- Comprehensive conflict detection (5 types)
- Dual reassignment strategies
- Clean separation of concerns
- AI-powered natural language interface
- Production-ready code structure

**Ready for:**
- Integration with real Google Sheets
- Scaling to larger fleets
- Tool-calling implementation for autonomous operations
- Historical analytics and reporting
