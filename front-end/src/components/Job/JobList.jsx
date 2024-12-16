const JobList = ({ jobs, onSelectJob }) => {
  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Job ID
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Client
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {job.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {job.client}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {job.status}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onSelectJob(job.id)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default JobList;