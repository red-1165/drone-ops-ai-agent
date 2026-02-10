'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { samplePilots, sampleDrones } from '@/lib/sheets-service';
import { detectConflicts } from '@/lib/agent-logic';
import { Conflict } from '@/lib/types';

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

export default function ConflictPanel() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectedConflicts = detectConflicts(
      samplePilots,
      sampleDrones,
      sampleProjects,
    );
    setConflicts(detectedConflicts);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardContent className="pt-6">
          <div className="text-center text-slate-400">Loading conflicts...</div>
        </CardContent>
      </Card>
    );
  }

  const criticalConflicts = conflicts.filter((c) => c.severity === 'critical');
  const warningConflicts = conflicts.filter((c) => c.severity === 'warning');
  const infoConflicts = conflicts.filter((c) => c.severity === 'info');

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-red-900 bg-red-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-200">
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              {criticalConflicts.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-900 bg-yellow-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-200">
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {warningConflicts.length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-900 bg-blue-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-200">Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {infoConflicts.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts List */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Active Conflicts</CardTitle>
          <CardDescription className="text-slate-400">
            {conflicts.length} total conflicts detected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {conflicts.length === 0 ? (
            <p className="text-sm text-slate-400">No conflicts detected!</p>
          ) : (
            conflicts.map((conflict, idx) => {
              const iconMap = {
                critical: (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ),
                warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
                info: <Info className="h-5 w-5 text-blue-500" />,
              };

              const bgMap = {
                critical: 'border-l-red-500 bg-red-950/30',
                warning: 'border-l-yellow-500 bg-yellow-950/30',
                info: 'border-l-blue-500 bg-blue-950/30',
              };

              return (
                <div
                  key={idx}
                  className={`border-l-4 rounded-lg p-4 ${bgMap[conflict.severity]}`}
                >
                  <div className="flex items-start gap-3">
                    {iconMap[conflict.severity]}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">
                          {conflict.type
                            .replace('-', ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            conflict.severity === 'critical'
                              ? 'border-red-500 text-red-300'
                              : conflict.severity === 'warning'
                                ? 'border-yellow-500 text-yellow-300'
                                : 'border-blue-500 text-blue-300'
                          }`}
                        >
                          {conflict.severity}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-300">
                        {conflict.description}
                      </p>
                      {conflict.suggestedResolution && (
                        <p className="mt-2 text-xs text-slate-400">
                          <span className="font-semibold">Suggested:</span>{' '}
                          {conflict.suggestedResolution}
                        </p>
                      )}
                      {conflict.affectedItems.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {conflict.affectedItems.map((item) => (
                            <Badge
                              key={item}
                              variant="secondary"
                              className="bg-slate-700 text-slate-200 text-xs"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
