const JobDetails = ({ jobId, jobs }) => {
  const job = jobs.find((j) => j.id === jobId);

  if (!job) return <p className="text-sm text-gray-500">No job selected.</p>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Job Details</h3>
      <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-gray-500">Job ID</dt>
          <dd className="mt-1 text-sm text-gray-900">{job.id}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Client</dt>
          <dd className="mt-1 text-sm text-gray-900">{job.client}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Status</dt>
          <dd className="mt-1 text-sm text-gray-900">{job.status}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-gray-500">Progress</dt>
          <dd className="mt-1 text-sm text-gray-900">{job.progress}%</dd>
        </div>
      </dl>
    </div>
  );
};


export default JobDetails;
