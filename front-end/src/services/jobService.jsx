import axios from 'axios';
import { API_BASE_URL } from '../config';

// Fetch all jobs
export const getJobs = () => axios.get(`${API_BASE_URL}/in-house/jobs`);

// Create a new job
export const createJob = (data) => axios.post(`${API_BASE_URL}/in-house/new_job`, data);

// Update an existing job (partial update)
export const updateJob = (jobId, data) => axios.patch(`${API_BASE_URL}/in-house/update_job/${jobId}`, data);

// View single job details by ID
export const getJobById = (jobId) => axios.get(`${API_BASE_URL}/in-house/job/${jobId}`);

// Fetch available payment statuses
export const getPaymentStatuses = () => axios.get(`${API_BASE_URL}/job/payment_statuses`);
