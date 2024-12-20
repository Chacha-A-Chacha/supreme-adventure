import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById } from '../../store/slices/jobSlice';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { job, status, error } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [dispatch, id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'failed' && <p>Error: {error}</p>}
      {status === 'succeeded' && job && (
        <div>
          <p>Description: {job.description}</p>
          <p>Status: {job.progress_status}</p>
          <p>Start Date: {job.start_date}</p>
          <p>End Date: {job.end_date}</p>
          <p>Total Cost: {job.total_cost}</p>
          <p>Payment Status: {job.payment_status}</p>
          {/* Add more job details as needed */}
        </div>
      )}
    </div>
  );
};

export default JobDetails;
