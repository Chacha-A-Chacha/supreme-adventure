import React from 'react';
import Header from '../components/Shared/Header/Header';
import CreateJobForm from '../components/Job/CreateJobForm';

const CreateJob = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Create Job"
        breadcrumbs={[
          { label: 'Home', href: '/', current: false },
          { label: 'Create Job', href: '#', current: true },
        ]}
      />
      <div className="mt-6">
        <CreateJobForm />
      </div>
    </div>
  );
};

export default CreateJob;
