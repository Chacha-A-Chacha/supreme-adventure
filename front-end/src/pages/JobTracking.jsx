import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Shared/Header/Header.jsx';
import JobStatusSummary from '../components/Job/JobStatusSummary';
import JobList from '../components/Job/JobList';
import JobDetailsView from '../components/Job/JobDetailsView';

const JobTracking = () => {
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();

  const handleCreateJob = () => {
    navigate('/create-job');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Job Tracking"
        breadcrumbs={[{ label: 'Home', href: '/', current: false }, { label: 'Job Tracking', href: '#', current: true }]}
        actions={[{
          label: 'Create Job',
          primary: true,
          onClick: handleCreateJob,
        }]}
      />
      <div className="mt-6">
        <JobStatusSummary />
      </div>

      <div className="mt-6">
        <JobList onSelectJob={setSelectedJobId} />
      </div>

      <div className="mt-6">
        {selectedJobId && <JobDetailsView jobId={selectedJobId} />}
      </div>
    </div>
  );
};

export default JobTracking;
