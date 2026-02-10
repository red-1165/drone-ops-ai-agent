import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import {
  samplePilots,
  sampleDrones,
} from '@/lib/sheets-service';
import {
  detectConflicts,
  findAvailablePilots,
  findAvailableDrones,
  generateReassignmentOptions,
  analyzeCascadeReassignments,
} from '@/lib/agent-logic';

// Initialize OpenAI with Vercel AI Gateway
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.vercel.ai/openai/v1',
});

// Sample projects for demonstration
const sampleProjects = [
  {
    id: 'PROJ-001',
    name: 'Project Alpha',
    requiredSkillLevel: 'advanced' as const,
    requiredCertifications: ['Commercial', 'Part 107'],
    requiredDroneCapabilities: ['4K Video', 'LiDAR'],
    requiredLocation: 'Los Angeles, CA',
    startDate: '2025-02-10',
    endDate: '2025-02-17',
    assignedPilot: 'P002',
    assignedDrone: 'D001',
    status: 'active' as const,
  },
  {
    id: 'PROJ-002',
    name: 'Project Beta',
    requiredSkillLevel: 'intermediate' as const,
    requiredCertifications: ['Part 107'],
    requiredDroneCapabilities: ['4K Video'],
    requiredLocation: 'San Francisco, CA',
    startDate: '2025-02-20',
    endDate: '2025-02-25',
    assignedPilot: undefined,
    assignedDrone: undefined,
    status: 'pending' as const,
  },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentRequest {
  messages: Message[];
  action?: string;
}

export async function POST(request: Request) {
  try {
    const { messages, action }: AgentRequest = await request.json();

    if (!messages || messages.length === 0) {
      return Response.json(
        { error: 'No messages provided' },
        { status: 400 },
      );
    }

    // Get current state
    const pilots = samplePilots;
    const drones = sampleDrones;
    const projects = sampleProjects;
    const conflicts = detectConflicts(pilots, drones, projects);

    // Build context for the agent
    const systemPrompt = `You are an expert Drone Operations Coordinator AI Agent for Skylark Drones. Your role is to help coordinate pilots, drones, and projects, manage assignments, and resolve conflicts.

CURRENT STATE:
${JSON.stringify({ pilots, drones, projects, conflicts }, null, 2)}

AVAILABLE ACTIONS:
1. Query pilot availability by skill, certification, or location
2. View current assignments and project status
3. Update pilot status (Available/On Leave/Unavailable)
4. Match pilots to projects based on requirements
5. Detect and resolve scheduling conflicts
6. Suggest urgent reassignments (both immediate replacement and cascade strategies)
7. Track drone fleet status and maintenance
8. Alert on skill/equipment mismatches

CONFLICT DETECTION:
- Double-booking: ${conflicts.filter((c) => c.type === 'double-booking').length} detected
- Skill mismatches: ${conflicts.filter((c) => c.type === 'skill-mismatch').length} detected
- Equipment issues: ${conflicts.filter((c) => c.type === 'equipment-mismatch').length} detected
- Maintenance conflicts: ${conflicts.filter((c) => c.type === 'maintenance-conflict').length} detected
- Location mismatches: ${conflicts.filter((c) => c.type === 'location-mismatch').length} detected

When responding:
- Be precise and conversational
- Reference specific pilot/drone/project names
- Suggest solutions for conflicts
- Consider location, skills, certifications, and drone capabilities
- Flag any data that needs to sync back to Google Sheets
- When suggesting reassignments, provide reasoning
- For urgent reassignments, offer both immediate replacement and cascade options

If the user asks to update a pilot status or assignment, you should suggest this action and explain what will be synced back to the Google Sheets.`;

    // Handle specific agent actions
    if (action === 'detect-conflicts') {
      const conflictSummary = conflicts.map((c) => ({
        type: c.type,
        severity: c.severity,
        description: c.description,
        resolution: c.suggestedResolution,
      }));

      return Response.json({
        response: `Found ${conflicts.length} conflicts:\n${JSON.stringify(conflictSummary, null, 2)}`,
        conflicts: conflictSummary,
        data: { pilots, drones, projects, conflicts },
      });
    }

    if (action === 'find-pilot') {
      const userMessage = messages[messages.length - 1].content;
      const availablePilots = findAvailablePilots(pilots, {
        skillLevel: 'advanced',
        certifications: [],
      });

      return Response.json({
        response: `Found ${availablePilots.length} available pilots: ${availablePilots.map((p) => p.name).join(', ')}`,
        pilots: availablePilots,
      });
    }

    if (action === 'reassignment-options') {
      const immediateOptions = generateReassignmentOptions(
        pilots,
        drones,
        conflicts,
        true,
      );
      const cascadeOptions = analyzeCascadeReassignments(
        pilots,
        drones,
        projects,
      );

      return Response.json({
        response: `Immediate replacement options: ${immediateOptions.length}\nCascade reassignment options: ${cascadeOptions.length}`,
        immediateOptions,
        cascadeOptions,
      });
    }

    // Default: Use AI to process natural language
    const result = await generateText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      maxTokens: 1000,
      temperature: 0.7,
    });

    return Response.json({
      response: result.text,
      data: { pilots, drones, projects, conflicts },
    });
  } catch (error) {
    console.error('[v0] Agent error:', error);
    return Response.json(
      { error: 'Failed to process agent request' },
      { status: 500 },
    );
  }
}
