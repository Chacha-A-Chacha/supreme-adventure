import React, { useState } from 'react';
import Header from '../components/Shared/Header/Header.jsx';
import JobStatusSummary from '../components/Job/JobStatusSummary';
import JobList from '../components/Job/JobList';
import JobDetails from '../components/Job/JobDetails';

const JobTracking = () => {
  const [selectedJobId, setSelectedJobId] = useState(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Job Tracking"
        breadcrumbs={[{ label: 'Home', href: '/', current: false }, { label: 'Job Tracking', href: '#', current: true }]}
        actions={[{ title: 'Add Job', href: '#', icon: '✍️', onClick: () => alert('Add Job') }]}
      />
      <div className="mt-6">
        <JobStatusSummary />
      </div>

      <div className="mt-6">
        <JobList onSelectJob={setSelectedJobId} />
      </div>

      <div className="mt-6">
        {selectedJobId && <JobDetails jobId={selectedJobId} />}
      </div>
    </div>
  );
};

export default JobTracking;
