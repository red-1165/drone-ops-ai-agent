'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import AgentChat from '@/components/agent-chat';
import PilotRoster from '@/components/pilot-roster';
import DroneFleet from '@/components/drone-fleet';
import ConflictPanel from '@/components/conflict-panel';
import ReassignmentPanel from '@/components/reassignment-panel';

export default function Page() {
  const [activeTab, setActiveTab] = useState('agent');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Skylark Drones</h1>
              <p className="mt-1 text-sm text-slate-400">Operations Coordinator AI Agent</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
            >
              Refresh Data
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="agent" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Agent Chat
            </TabsTrigger>
            <TabsTrigger value="conflicts" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Conflicts
            </TabsTrigger>
            <TabsTrigger value="reassign" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Reassignments
            </TabsTrigger>
            <TabsTrigger value="pilots" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Roster
            </TabsTrigger>
            <TabsTrigger value="drones" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Fleet
            </TabsTrigger>
          </TabsList>

          {/* Agent Chat Tab */}
          <TabsContent value="agent" className="space-y-4">
            <AgentChat key={`agent-${refreshKey}`} />
          </TabsContent>

          {/* Conflicts Tab */}
          <TabsContent value="conflicts" className="space-y-4">
            <ConflictPanel key={`conflicts-${refreshKey}`} />
          </TabsContent>

          {/* Reassignments Tab */}
          <TabsContent value="reassign" className="space-y-4">
            <ReassignmentPanel key={`reassign-${refreshKey}`} />
          </TabsContent>

          {/* Pilots Tab */}
          <TabsContent value="pilots" className="space-y-4">
            <PilotRoster key={`pilots-${refreshKey}`} />
          </TabsContent>

          {/* Drones Tab */}
          <TabsContent value="drones" className="space-y-4">
            <DroneFleet key={`drones-${refreshKey}`} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
