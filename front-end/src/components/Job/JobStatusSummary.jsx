const JobStatusSummary = ({ jobs }) => {
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Object.keys(statusCounts).map((status) => (
        <div
          key={status}
          className="rounded-lg bg-white p-4 shadow-sm border border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-500">{status}</h3>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {statusCounts[status]}
          </p>
        </div>
      ))}
    </div>
  );
};


export default JobStatusSummary;