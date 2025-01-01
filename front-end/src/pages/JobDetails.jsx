// pages/JobDetails.jsx
// page for displaying the details of a job

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectJobById, selectJobsLoadingState, clearCurrentJob, fetchJobDetails } from '../store/slices/jobSlice';
import Header from '../components/Shared/Header/Header';
import JobDetailsView from '../components/Job/JobDetailsView';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobId } = useParams();
  console.log('JobDetailsPage - jobId:', jobId);

  useEffect(() => {
    // Clear current job and fetch fresh data when jobId changes
    dispatch(clearCurrentJob());
    dispatch(fetchJobDetails(parseInt(jobId)));
  }, [dispatch, jobId]);

  const job = useSelector(state => selectJobById(state, parseInt(jobId)));
  console.log('JobDetailsPage - job:', job);
  
  const loadingStates = useSelector(selectJobsLoadingState);
  console.log('JobDetailsPage - loadingStates:', loadingStates);

  const handleBack = () => {
    navigate('/jobs');
  };

  const handlePrint = () => {
    window.print();
  };

  // Define breadcrumbs for the header
  const breadcrumbs = [
    { label: 'Home', href: '/', current: false },
    { label: 'Jobs', href: '/jobs', current: false },
    { label: `Job #${jobId}`, href: '#', current: true }
  ];

  // Define actions for the header
  const actions = [
    {
      label: 'Print Details',
      icon: <Printer className="h-4 w-4" />,
      onClick: handlePrint,
      variant: 'outline'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <Header
        title={`Job Details #${jobId}`}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />

      {/* Back Button */}
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>

        {/* Main Content */}
        <div className="rounded-lg bg-white shadow">
          <JobDetailsView jobId={parseInt(jobId)} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
