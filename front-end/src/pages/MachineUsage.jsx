import React, { useState } from 'react';
import JobLogInput from '../components/MachineReading/JobLogInput';
import MachineUsageChart from '../components/MachineReading/MachineUsageChart';
import MachineUsageTable from '../components/MachineReading/MachineUsageTable';



const MachineUsage = () => {
    const [jobs, setJobs] = useState([]);
  
    const handleAddJob = (job) => {
      setJobs((prevJobs) => [...prevJobs, job]);
    };
  
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Machine Usage</h1>
          <p className="text-sm text-gray-600">Track and log machine usage for each print job.</p>
        </header>
  
        {/* Job Log Input Section */}
        <JobLogInput onAddJob={handleAddJob} />
  
        {/* Chart Section */}
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200 mt-6">
          <h3 className="text-lg font-medium text-gray-900">Usage Chart</h3>
          <MachineUsageChart jobs={jobs} />
        </div>
  
        {/* Table Section */}
        <MachineUsageTable machines={[
          {
            id: 1,
            name: 'Printer A',
            totalUsage: jobs.reduce((acc, job) => acc + job.usage, 0),
            materialUsage: jobs.reduce((acc, job) => acc + parseFloat(job.materialUsed || 0), 0),
          },
        ]} />
      </div>
    );
  };
  
  export default MachineUsage;
  