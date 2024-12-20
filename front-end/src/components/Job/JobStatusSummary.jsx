import React from 'react';
import { useSelector } from 'react-redux';

const JobStatusSummary = () => {
  const { jobs } = useSelector((state) => state.jobs);

  if (!jobs) {
    return null;
  }

  const statusSummary = jobs.reduce((summary, job) => {
    summary[job.progress_status] = (summary[job.progress_status] || 0) + 1;
    return summary;
  }, {});

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Job Status Summary</h2>
      <ul>
        {Object.entries(statusSummary).map(([status, count]) => (
          <li key={status}>
            {status}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobStatusSummary;
