'use client';

import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Alert, AlertDescription } from '@/components/ui/alert';

import { detectConflicts } from '@/lib/conflictDetector';

export default function ConflictPanel() {
  const [pilots, setPilots] = useState<any[]>([]);
  const [drones, setDrones] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${window.location.origin}/api/agent`)
      .then((r) => r.json())
      .then((data) => {
        setPilots(data.pilots || []);
        setDrones(data.drones || []);
        setMissions(data.missions || []);

        if (data.missions?.length) {
          const m = data.missions[0];
          const d = data.drones[0];
          const p = data.pilots[0];

          const c = detectConflicts(p, d, m);

          setConflicts(c ? [c] : []);
        }

        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardContent className="pt-6 text-slate-400 text-center">
          Checking conflicts...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-800">

      <CardHeader>
        <CardTitle className="text-white">
          Conflict Analysis
        </CardTitle>

        <CardDescription className="text-slate-400">
          Current operational conflicts
        </CardDescription>
      </CardHeader>

      <CardContent>

        {conflicts.length === 0 ? (
          <Alert className="border-green-900 bg-green-950">
            <AlertDescription className="text-green-200">
              No conflicts detected.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-red-900 bg-red-950">
            <AlertDescription className="text-red-200">
              {conflicts.join(', ')}
            </AlertDescription>
          </Alert>
        )}

      </CardContent>
    </Card>
  );
}
