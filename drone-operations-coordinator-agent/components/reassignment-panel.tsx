'use client';

import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { Zap, ArrowRight } from 'lucide-react';

import {
  generateReassignmentOptions,
  analyzeCascadeReassignments,
} from '@/lib/assignmentEngine';

import { ReassignmentOption } from '@/lib/types';

export default function ReassignmentPanel() {
  const [immediateOptions, setImmediateOptions] = useState<
    ReassignmentOption[]
  >([]);

  const [cascadeOptions, setCascadeOptions] = useState<
    ReassignmentOption[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${window.location.origin}/api/agent`)

      .then((res) => res.json())
      .then((data) => {
        const pilots = data.pilots || [];
        const drones = data.drones || [];
        const missions = data.missions || [];

        if (missions.length === 0) return;

        const mission = missions[0];

        const immediate = generateReassignmentOptions(
          mission,
          pilots,
          drones
        );

        const cascade = analyzeCascadeReassignments(
          mission,
          pilots
        );

        setImmediateOptions(immediate);
        setCascadeOptions(cascade);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardContent className="pt-6 text-center text-slate-400">
          Analyzing reassignment options...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">

      {/* Immediate Options */}
      <Card className="border-slate-700 bg-slate-800">

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-400" />
            Immediate Reassignment
          </CardTitle>

          <CardDescription className="text-slate-400">
            Quick conflict resolution
          </CardDescription>
        </CardHeader>

        <CardContent>

          {immediateOptions.length === 0 ? (
            <Alert className="border-blue-900 bg-blue-950">
              <AlertDescription className="text-blue-200">
                No immediate actions needed.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">

              {immediateOptions.map((opt, i) => (

                <div
                  key={i}
                  className="rounded border border-slate-600 bg-slate-900 p-4"
                >

                  <h4 className="font-semibold text-white">
                    Pilot: {opt.pilotId}
                  </h4>

                  <p className="text-sm text-slate-400">
                    {opt.reason}
                  </p>

                  <div className="mt-2 flex gap-1">

                    {opt.conflictsResolved.map((c, j) => (
                      <Badge
                        key={j}
                        variant="outline"
                        className="text-xs"
                      >
                        {c}
                      </Badge>
                    ))}

                  </div>

                  <Button
                    size="sm"
                    className="mt-3 bg-blue-600 hover:bg-blue-700"
                  >
                    Reassign
                  </Button>

                </div>

              ))}

            </div>
          )}

        </CardContent>
      </Card>

      {/* Cascade Options */}
      <Card className="border-slate-700 bg-slate-800">

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ArrowRight className="h-5 w-5 text-blue-400" />
            Cascade Reassignment
          </CardTitle>

          <CardDescription className="text-slate-400">
            Long-term optimization
          </CardDescription>
        </CardHeader>

        <CardContent>

          {cascadeOptions.length === 0 ? (
            <Alert className="border-blue-900 bg-blue-950">
              <AlertDescription className="text-blue-200">
                No cascade actions needed.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">

              {cascadeOptions.map((opt, i) => (

                <div
                  key={i}
                  className="rounded border border-slate-600 bg-slate-900 p-4"
                >

                  <h4 className="font-semibold text-white">
                    Pilot: {opt.pilotId}
                  </h4>

                  <p className="text-sm text-slate-400">
                    {opt.reason}
                  </p>

                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                  >
                    Evaluate
                  </Button>

                </div>

              ))}

            </div>
          )}

        </CardContent>

      </Card>

    </div>
  );
}
