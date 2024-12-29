import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobDetails, selectJobById, selectJobsLoadingState } from '../store/slices/jobSlice';
import Header from '../components/Shared/Header/Header';
import JobDetailsView from '../components/Job/JobDetailsView';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobDetailsPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const job = useSelector(state => selectJobById(state, parseInt(jobId)));
  const loadingStates = useSelector(selectJobsLoadingState);

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobDetails(parseInt(jobId)));
    }
  }, [jobId, dispatch]);

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

  if (loadingStates.fetchJobDetails === 'loading') {
    return <div>Loading...</div>;
  }

  if (!job) {
    return <div>No job details available</div>;
  }

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
          <JobDetailsView />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
