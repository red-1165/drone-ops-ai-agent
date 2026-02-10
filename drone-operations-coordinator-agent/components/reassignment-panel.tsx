'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, ArrowRight } from 'lucide-react';
import { samplePilots, sampleDrones } from '@/lib/sheets-service';
import {
  detectConflicts,
  generateReassignmentOptions,
  analyzeCascadeReassignments,
} from '@/lib/agent-logic';
import { type ReassignmentOption } from '@/lib/types';

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
];

export default function ReassignmentPanel() {
  const [immediateOptions, setImmediateOptions] = useState<ReassignmentOption[]>(
    [],
  );
  const [cascadeOptions, setCascadeOptions] = useState<ReassignmentOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const conflicts = detectConflicts(samplePilots, sampleDrones, sampleProjects);
    const immediate = generateReassignmentOptions(
      samplePilots,
      sampleDrones,
      conflicts,
      true,
    );
    const cascade = analyzeCascadeReassignments(
      samplePilots,
      sampleDrones,
      sampleProjects,
    );

    setImmediateOptions(immediate);
    setCascadeOptions(cascade);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardContent className="pt-6">
          <div className="text-center text-slate-400">
            Analyzing reassignment options...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Immediate Replacement Options */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-400" />
            Immediate Replacement Options
          </CardTitle>
          <CardDescription className="text-slate-400">
            Quick reassignments to resolve critical conflicts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {immediateOptions.length === 0 ? (
            <Alert className="border-blue-900 bg-blue-950">
              <AlertDescription className="text-blue-200">
                No critical conflicts requiring immediate reassignment.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {immediateOptions.map((option, idx) => {
                const pilot = samplePilots.find((p) => p.id === option.pilotId);
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-600 bg-slate-900 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {option.pilotName}
                        </h4>
                        {pilot && (
                          <div className="mt-1 flex gap-2">
                            <Badge
                              variant="outline"
                              className="border-slate-600 text-slate-300 text-xs"
                            >
                              {pilot.skillLevel}
                            </Badge>
                            {pilot.currentLocation && (
                              <Badge
                                variant="outline"
                                className="border-slate-600 text-slate-300 text-xs"
                              >
                                {pilot.currentLocation}
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="mt-2 text-sm text-slate-400">
                          {option.reason}
                        </p>
                        {option.conflictsResolved.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-semibold text-green-400">
                              Resolves:
                            </p>
                            {option.conflictsResolved.map((conflict, i) => (
                              <p key={i} className="text-xs text-slate-400">
                                • {conflict}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="ml-4 bg-blue-600 hover:bg-blue-700"
                      >
                        Reassign
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cascade Reassignment Options */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ArrowRight className="h-5 w-5 text-blue-400" />
            Cascade Reassignment Options
          </CardTitle>
          <CardDescription className="text-slate-400">
            Redistribute workload for better resource allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cascadeOptions.length === 0 ? (
            <Alert className="border-blue-900 bg-blue-950">
              <AlertDescription className="text-blue-200">
                No cascade reassignments recommended at this time.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {cascadeOptions.map((option, idx) => {
                const pilot = samplePilots.find((p) => p.id === option.pilotId);
                return (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-600 bg-slate-900 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">
                          {option.pilotName}
                        </h4>
                        {pilot && (
                          <div className="mt-1 flex gap-2">
                            <Badge
                              variant="outline"
                              className="border-slate-600 text-slate-300 text-xs"
                            >
                              {pilot.skillLevel}
                            </Badge>
                            {pilot.status && (
                              <Badge
                                variant="outline"
                                className="border-green-600 text-green-300 text-xs"
                              >
                                {pilot.status}
                              </Badge>
                            )}
                          </div>
                        )}
                        <p className="mt-2 text-sm text-slate-400">
                          {option.reason}
                        </p>
                        {option.conflictsResolved.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-semibold text-blue-400">
                              Benefits:
                            </p>
                            {option.conflictsResolved.map((benefit, i) => (
                              <p key={i} className="text-xs text-slate-400">
                                • {benefit}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-4 border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
                      >
                        Evaluate
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
