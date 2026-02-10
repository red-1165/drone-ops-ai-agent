'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Zap } from 'lucide-react';
import { sampleDrones } from '@/lib/sheets-service';
import { Drone } from '@/lib/types';

const statusColors: Record<string, string> = {
  available: 'bg-green-900 text-green-200 border-green-700',
  deployed: 'bg-blue-900 text-blue-200 border-blue-700',
  maintenance: 'bg-red-900 text-red-200 border-red-700',
  reserved: 'bg-yellow-900 text-yellow-200 border-yellow-700',
};

export default function DroneFleet() {
  const [drones, setDrones] = useState<Drone[]>(sampleDrones);

  const availableCount = drones.filter((d) => d.status === 'available').length;
  const deployedCount = drones.filter((d) => d.status === 'deployed').length;
  const maintenanceCount = drones.filter((d) => d.status === 'maintenance')
    .length;
  const reservedCount = drones.filter((d) => d.status === 'reserved').length;

  const handleStatusChange = (droneId: string, newStatus: Drone['status']) => {
    setDrones((prev) =>
      prev.map((d) => (d.id === droneId ? { ...d, status: newStatus } : d)),
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-green-900 bg-green-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-200">
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {availableCount}
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-900 bg-blue-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-200">
              Deployed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {deployedCount}
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-900 bg-red-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-200">
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {maintenanceCount}
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-900 bg-yellow-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-200">
              Reserved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {reservedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drones Table */}
      <Card className="border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-400" />
            Drone Fleet
          </CardTitle>
          <CardDescription className="text-slate-400">
            {drones.length} total drones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-slate-300">Model</TableHead>
                  <TableHead className="text-slate-300">Serial Number</TableHead>
                  <TableHead className="text-slate-300">Capabilities</TableHead>
                  <TableHead className="text-slate-300">Location</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Assignment</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drones.map((drone) => (
                  <TableRow
                    key={drone.id}
                    className="border-slate-700 hover:bg-slate-700"
                  >
                    <TableCell className="font-medium text-white">
                      {drone.model}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {drone.serialNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {drone.capabilities.map((cap) => (
                          <Badge
                            key={cap}
                            variant="secondary"
                            className="bg-slate-700 text-slate-200 text-xs"
                          >
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {drone.location}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[drone.status]}
                      >
                        {drone.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {drone.currentAssignment ? (
                        <Badge variant="secondary" className="bg-blue-900 text-blue-200">
                          {drone.currentAssignment}
                        </Badge>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {drone.status === 'available' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-200 hover:bg-slate-700 text-xs bg-transparent"
                        >
                          Deploy
                        </Button>
                      )}
                      {drone.status === 'maintenance' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-300 hover:bg-green-950 text-xs bg-transparent"
                          onClick={() =>
                            handleStatusChange(drone.id, 'available')
                          }
                        >
                          Complete
                        </Button>
                      )}
                      {drone.status === 'deployed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-200 hover:bg-slate-700 text-xs bg-transparent"
                          onClick={() =>
                            handleStatusChange(drone.id, 'available')
                          }
                        >
                          Return
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
