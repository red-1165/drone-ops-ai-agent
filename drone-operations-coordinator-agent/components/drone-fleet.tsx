'use client';

import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Zap } from 'lucide-react';

export default function DroneFleet() {
  const [drones, setDrones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${window.location.origin}/api/agent`)
      .then((r) => r.json())
      .then((d) => {
        setDrones(d.drones || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="border-slate-700 bg-slate-800">
        <CardContent className="pt-6 text-center text-slate-400">
          Loading drones...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-800">

      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="h-5 w-5 text-blue-400" />
          Drone Fleet
        </CardTitle>
      </CardHeader>

      <CardContent>

        <div className="space-y-2">

          {drones.map((d, index) => (
            <div
              key={d.id || index}

              className="flex justify-between rounded border border-slate-600 bg-slate-900 p-3"
            >

              <span className="text-white">
                {d.name}
              </span>

              <Badge
                variant="outline"
                className={
                  d.status === 'available'
                    ? 'border-green-600 text-green-300'
                    : 'border-yellow-600 text-yellow-300'
                }
              >
                {d.status}
              </Badge>

            </div>

          ))}

        </div>

      </CardContent>

    </Card>
  );
}
