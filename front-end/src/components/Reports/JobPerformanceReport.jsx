const JobPerformanceReport = ({ jobs }) => {
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">Job Performance Report</h3>
      <ul className="mt-4 space-y-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <li key={status} className="flex justify-between text-sm text-gray-700">
            <span>{status}</span>
            <span>{count} jobs</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobPerformanceReport;
