import Header from '../components/Shared/Header/Header.jsx';
import JobStatusSummary from '../components/job/JobStatusSummary';
import JobList from '../components/job/JobList';
import JobDetails from '../components/job/JobDetails';

const jobs = [
  { id: 1, client: 'Client A', status: 'Ongoing', progress: 50 },
  { id: 2, client: 'Client B', status: 'Completed', progress: 100 },
  { id: 3, client: 'Client C', status: 'Pending', progress: 0 },
];

const JobTracking = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Header
        title="Job Tracking"
        breadcrumbs={[{ label: 'Home', href: '/', current: false }, { label: 'Job Tracking', href: '#', current: true }]}
        actions={[{ title: 'Add Job', href: '#', icon: '✍️', onClick: () => alert('Add Job') }]}
      />
      <div className="mt-6">
        <JobStatusSummary jobs={jobs} />
      </div>
      <div className="mt-6">
        <JobList jobs={jobs} />
      </div>
      <div className="mt-6">
        <JobDetails jobId={1} /> {/* Placeholder for selected job */}
      </div>
    </div>
  );
};

export default JobTracking;
