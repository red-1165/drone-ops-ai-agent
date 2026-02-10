'use client';

import { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Users } from 'lucide-react';
import { Pilot } from '@/lib/types';

const statusColors: Record<string, string> = {
  available: 'bg-green-900 text-green-200 border-green-700',
  'on-leave': 'bg-yellow-900 text-yellow-200 border-yellow-700',
  unavailable: 'bg-red-900 text-red-200 border-red-700',
};

const skillColors: Record<string, string> = {
  beginner: 'bg-slate-700 text-slate-200 border-slate-600',
  intermediate: 'bg-blue-700 text-blue-200 border-blue-600',
  advanced: 'bg-purple-700 text-purple-200 border-purple-600',
  expert: 'bg-amber-700 text-amber-200 border-amber-600',
};

export default function PilotRoster() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load data from API
  useEffect(() => {
    fetch(`${window.location.origin}/api/agent`)

      .then((res) => res.json())
      .then((data) => {
        setPilots(data.pilots || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load pilots:', err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (pilotId: string, newStatus: Pilot['status']) => {
    setPilots((prev) =>
      prev.map((p) =>
        p.id === pilotId ? { ...p, status: newStatus } : p
      )
    );
  };

  const availableCount = pilots.filter(
    (p) => p.status === 'available'
  ).length;

  const onLeaveCount = pilots.filter(
    (p) => p.status === 'on-leave'
  ).length;

  const unavailableCount = pilots.filter(
    (p) => p.status === 'unavailable'
  ).length;

  if (loading) {
    return (
      <div className="text-slate-300 p-4">
        Loading pilots...
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">

        <Card className="border-green-900 bg-green-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-200">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">
              {availableCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-900 bg-yellow-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-200">
              On Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400">
              {onLeaveCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-900 bg-red-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-200">
              Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">
              {unavailableCount}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Pilots Table */}
      <Card className="border-slate-700 bg-slate-800">

        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-blue-400" />
            Pilot Roster
          </CardTitle>

          <CardDescription className="text-slate-400">
            {pilots.length} total pilots
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div className="overflow-x-auto">

            <Table>

              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Skill</TableHead>
                  <TableHead className="text-slate-300">Certs</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Assignment</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {pilots.map((pilot, index) => (
                  <TableRow
                    key={pilot.id || index}

                    className="border-slate-700 hover:bg-slate-700"
                  >

                    <TableCell className="font-medium text-white">
                      {pilot.name}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={skillColors[pilot.skillLevel]}
                      >
                        {pilot.skillLevel}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(pilot.certifications || '')
                        .split(',')
                        .map((cert: string) => cert.trim())
                        .filter(Boolean)
                        .map((cert) => (
                          <Badge
                            key={cert}
                            variant="secondary"
                            className="bg-slate-700 text-slate-200 text-xs"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-300">
                      {pilot.currentLocation}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[pilot.status]}
                      >
                        {pilot.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-slate-300">
                      {pilot.currentAssignment ? (
                        <Badge className="bg-blue-900 text-blue-200">
                          {pilot.currentAssignment}
                        </Badge>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </TableCell>

                    <TableCell>

                      {pilot.status === 'available' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-200 text-xs"
                          onClick={() => setSelectedPilot(pilot)}
                        >
                          Assign
                        </Button>
                      )}

                      {pilot.status !== 'available' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-300 text-xs"
                          onClick={() =>
                            handleStatusChange(pilot.id, 'available')
                          }
                        >
                          Mark Available
                        </Button>
                      )}

                    </TableCell>

                  </TableRow>

                ))}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}
