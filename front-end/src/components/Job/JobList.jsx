import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../../store/slices/jobSlice';
import { useNavigate } from 'react-router-dom';

const JobList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, status, error, currentPage, totalPages } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleViewDetails = (id) => {
    navigate(`/jobs/${id}`);
  };

  const handlePageChange = (page) => {
    dispatch(fetchJobs({ page, limit: 10 }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900">Job List</h2>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && (
        <>
          <ul>
            {jobs.map((job) => (
              <li key={job.id} className="border-b py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p>{job.description}</p>
                    <p>Status: {job.progress_status}</p>
                  </div>
                  <button
                    onClick={() => handleViewDetails(job.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default JobList;
