import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { API_BASE_URL } from '../config';

// Create axios instance with default config
const axiosInstance = setupCache(axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}));

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(handleApiError(error));
  }
);

// Error handler
const handleApiError = (error) => {
  const errorMessage = error.response?.data?.error || 
                      error.response?.data?.message || 
                      error.message || 
                      'An unexpected error occurred';
  
  // Log error for monitoring
  console.error('API Error:', {
    endpoint: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: errorMessage
  });

  return {
    error: errorMessage,
    status: error.response?.status
  };
};

// Retry configuration
const retryConfig = {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000, // Progressive delay
  retryCondition: (error) => {
    const status = error.response?.status;
    return status === 408 || status === 429 || status >= 500;
  }
};

class JobService {
  static endpoints = {
    jobs: '/in-house/jobs',
    newJob: '/print/jobs',
    jobDetails: (id) => `/print/jobs/${id}`,
    materials: (id) => `/print/jobs/${id}/materials`,
    expenses: (id) => `/print/jobs/${id}/expenses`,
    progress: (id) => `/print/jobs/${id}/progress`,
    timeframe: (id) => `/print/jobs/${id}/timeframe`,
    paymentStatuses: '/in-house/job/payment_statuses'
  };

  // Cache configuration for different endpoints
  static cacheConfig = {
    jobs: { ttl: 5 * 60 * 1000 }, // 5 minutes
    jobDetails: { ttl: 2 * 60 * 1000 }, // 2 minutes
    paymentStatuses: { ttl: 30 * 60 * 1000 } // 30 minutes
  };

  // List of available jobs
  static async getJobs(params = {}) {
    return axiosInstance.get(this.endpoints.jobs, {
      params,
      cache: this.cacheConfig.jobs
    });
  }

  static async createJob(jobData) {
    const response = await axiosInstance.post(this.endpoints.newJob, jobData);
    await this.invalidateJobsCache();
    return response;
  }

  static async getJobDetails(jobId) {
    return axiosInstance.get(this.endpoints.jobDetails(jobId), {
      cache: this.cacheConfig.jobDetails
    });
  }

  // Update job details IGNORED 
  static async updateJob(jobId, data) {
    const response = await axiosInstance.patch(
      this.endpoints.jobDetails(jobId),
      data,
      { ...retryConfig }
    );
    await this.invalidateJobCache(jobId);
    return response;
  }

  static async addJobMaterials(jobId, materials) {
    const response = await axiosInstance.post(
      this.endpoints.materials(jobId),
      materials,
      { ...retryConfig }
    );
    await this.invalidateJobCache(jobId);
    return response;
  }

  static async addJobExpenses(jobId, expenses) {
    const response = await axiosInstance.post(
      this.endpoints.expenses(jobId),
      expenses,
      { ...retryConfig }
    );
    await this.invalidateJobCache(jobId);
    return response;
  }

  static async updateJobProgress(jobId, progressData) {
    const response = await axiosInstance.patch(
      this.endpoints.progress(jobId),
      progressData,
      { ...retryConfig }
    );
    await this.invalidateJobCache(jobId);
    return response;
  }

  static async updateJobTimeframe(jobId, timeframeData) {
    const response = await axiosInstance.patch(
      this.endpoints.timeframe(jobId),
      timeframeData,
      { ...retryConfig }
    );
    await this.invalidateJobCache(jobId);
    return response;
  }

  // Payment statuses API route not available in the backend
  static async getPaymentStatuses() {
    return axiosInstance.get(this.endpoints.paymentStatuses, {
      cache: this.cacheConfig.paymentStatuses
    });
  }

  // Cache management
  static async invalidateJobsCache() {
    await axiosInstance.cache.reset();
  }

  static async invalidateJobCache(jobId) {
    await axiosInstance.cache.delete(this.endpoints.jobDetails(jobId));
    await axiosInstance.cache.delete(this.endpoints.jobs);
  }

  // Batch operations
  static async batchUpdateJobs(updates) {
    const responses = await Promise.allSettled(
      updates.map(({ jobId, data }) => this.updateJob(jobId, data))
    );
    
    const results = {
      successful: [],
      failed: []
    };

    responses.forEach((response, index) => {
      if (response.status === 'fulfilled') {
        results.successful.push({
          jobId: updates[index].jobId,
          data: response.value
        });
      } else {
        results.failed.push({
          jobId: updates[index].jobId,
          error: response.reason
        });
      }
    });

    return results;
  }

  // Utility methods
  static isValidJobId(jobId) {
    return typeof jobId === 'number' && jobId > 0;
  }

  static validateJobData(data) {
    const requiredFields = ['client_id', 'description'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
    
    return true;
  }
}

export default JobService;
