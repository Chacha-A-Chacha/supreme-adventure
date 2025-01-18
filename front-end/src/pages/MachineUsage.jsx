// pages/MachineUsage.jsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobLogInput from '../components/MachineReading/JobLogInput';
import MachineUsageChart from '../components/MachineReading/MachineUsageChart';
import MachineUsageTable from '../components/MachineReading/MachineUsageTable';
import MachineList from '../components/MachineReading/MachineList';

const MachineUsage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Machine Usage</h1>
        <p className="text-sm text-gray-600">Track and log machine usage for each print job.</p>
      </header>

      <Tabs defaultValue="log" className="w-full">
        <TabsList>
          <TabsTrigger value="log">Log Usage</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="machines">Machines</TabsTrigger>
        </TabsList>

        {/* Log Usage Tab */}
        <TabsContent value="log">
          <JobLogInput />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          {/* <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Usage Analytics</h3>
            <MachineUsageChart />
          </div> */}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <MachineUsageTable />
        </TabsContent>

        {/* Machines Tab */}
        <TabsContent value="machines">
          <MachineList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MachineUsage;