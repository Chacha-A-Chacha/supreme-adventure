// services/jobService.jsx
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Fetch all jobs
export const getJobs = (params = {}) => 
  axios.get(`${API_BASE_URL}/print/jobs/summary`, { params });

// Create a new job
export const createJob = (jobData) => 
  axios.post(`${API_BASE_URL}/print/jobs`, jobData);

// Get specific job details
export const getJobDetails = (jobId) => 
  axios.get(`${API_BASE_URL}/print/jobs/${jobId}`);

// Update job details
export const updateJob = (jobId, data) => 
  axios.patch(`${API_BASE_URL}/print/jobs/${jobId}`, data);

// Add materials to job
export const addJobMaterials = (jobId, materials) => 
  axios.post(`${API_BASE_URL}/materials/usage`, materials);

// Add expenses to job
export const addJobExpenses = (jobId, expenses) => 
  axios.post(`${API_BASE_URL}/print/jobs/${jobId}/expenses`, { jobId, expenses });

// Update job progress
export const updateJobProgress = (jobId, progressData) => 
  axios.patch(`${API_BASE_URL}/print/jobs/${jobId}/progress`, progressData);

// Update job timeframe
export const updateJobTimeframe = (jobId, timeframeData) => 
  axios.patch(`${API_BASE_URL}/print/jobs/${jobId}/timeframe`, timeframeData);

// Get payment statuses
export const getPaymentStatuses = () => 
  axios.get(`${API_BASE_URL}/in-house/job/payment_statuses`);