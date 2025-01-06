// slices/jobSlice.jsx
// Desc: Redux slice for managing job data

import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import JobService from '../../services/jobService';
import { validateJobProgress } from '../../utils/jobProgressValidation';

// Constants
const JOBS_PER_PAGE = 10;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Create entity adapter for normalized state management
const jobsAdapter = createEntityAdapter({
  selectId: (job) => job.id,
  sortComparer: (a, b) => b.created_at.localeCompare(a.created_at)
});

// Initial state with entity adapter
const initialState = jobsAdapter.getInitialState({
  currentJob: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: JOBS_PER_PAGE
  },
  loadingStates: {
    fetchJobs: 'idle',
    createJob: 'idle',
    updateJob: 'idle',
    fetchJobDetails: 'idle',
    addJobMaterials: 'idle',
    addJobExpenses: 'idle',
    updateJobProgress: 'idle',
    updateJobTimeframe: 'idle'
  },
  errors: {
    fetchJobs: null,
    createJob: null,
    updateJob: null,
    fetchJobDetails: null,
    addJobMaterials: null,
    addJobExpenses: null,
    updateJobProgress: null,
    updateJobTimeframe: null
  },
  lastUpdated: null
});


// Helper function to clean filters
const cleanFilters = (filters) => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value && value !== 'all' && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// Async Thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ page = 1, limit = JOBS_PER_PAGE, ...filters }, { rejectWithValue }) => {
    try {
      const cleanedFilters = cleanFilters(filters);
      const response = await JobService.getJobs({ page, limit, ...cleanedFilters });
      
      return {
        jobs: response.jobs.map(job => ({
          ...job,
          lastFetched: Date.now()
        })),
        pagination: {
          currentPage: page,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch jobs',
        status: error.response?.status
      });
    }
  },
  {
    condition: (_, { getState }) => {
      const { jobs } = getState();
      return jobs.loadingStates.fetchJobs !== 'loading';
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      // Optional: Add validation here if needed
      if (!jobData) {
        throw new Error('Job data is required');
      }

      console.log('Creating job with data:', jobData); // Log job data before API call
      const response = await JobService.createJob(jobData);
      
      // Ensure we have a valid response
      if (!response || !response.id) {
        throw new Error('Invalid response from server');
      }

      return response;
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error
        return rejectWithValue({
          message: error.response.data?.message || 'Server error occurred',
          status: error.response.status,
          details: error.response.data
        });
      } else if (error.request) {
        // Request was made but no response received
        return rejectWithValue({
          message: 'No response from server',
          status: 'NETWORK_ERROR'
        });
      } else {
        // Error in request setup
        return rejectWithValue({
          message: error.message || 'Failed to create job',
          status: 'REQUEST_ERROR'
        });
      }
    }
  },
  {
    // Condition function to prevent duplicate requests
    condition: (_, { getState }) => {
      const { jobs } = getState();
      return jobs.loadingStates.createJob !== 'loading';
    }
  }
);

// Update Job thunk not used in the project
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, data }, { rejectWithValue, getState }) => {
    try {
      // Optimistic update
      const originalJob = getState().jobs.entities[jobId];
      if (!originalJob) {
        throw new Error('Job not found');
      }

      const response = await JobService.updateJob(jobId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchJobDetails',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await JobService.getJobDetails(jobId);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch job details'
      });
    }
  },
  {
    condition: (_, { getState }) => {
      return getState().jobs.loadingStates.fetchJobDetails !== 'loading';
    }
  }
);

export const addJobMaterials = createAsyncThunk(
  'jobs/addJobMaterials',
  async ({ jobId, materials }, { rejectWithValue }) => {
    try {
      const response = await JobService.addJobMaterials(jobId, materials);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addJobExpenses = createAsyncThunk(
  'jobs/addJobExpenses',
  async ({ jobId, expenses }, { rejectWithValue }) => {
    try {
      const response = await JobService.addJobExpenses(jobId, expenses);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateJobProgress = createAsyncThunk(
  'jobs/updateProgress',
  async ({ jobId, progressData }, { rejectWithValue, getState }) => {
    try {
      // Get current job status for validation
      const currentJob = selectJobById(getState(), jobId);
      if (!currentJob) {
        throw new Error('Job not found');
      }

      // Validate the progress update
      const validation = validateJobProgress(progressData, currentJob.progress_status);
      if (!validation.isValid) {
        return rejectWithValue({
          message: 'Invalid progress update',
          validationErrors: validation.errors
        });
      }

      // If status is being changed to completed, add completion timestamp
      if (progressData.progress_status === 'completed' && !progressData.completed_at) {
        progressData.completed_at = new Date().toISOString();
      }

      const response = await JobService.updateJobProgress(jobId, progressData);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message || 'Failed to update progress',
        status: error.response?.status,
        validationErrors: error.response?.data?.validationErrors
      });
    }
  },
  {
    condition: (_, { getState }) => {
      return getState().jobs.loadingStates.updateJobProgress !== 'loading';
    }
  }
);  

export const updateJobTimeframe = createAsyncThunk(
  'jobs/updateTimeframe',
  async ({ jobId, timeframeData }, { rejectWithValue }) => {
    try {
      const response = await JobService.updateJobTimeframe(jobId, timeframeData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    resetJobErrors: (state) => {
      state.errors = initialState.errors;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
      state.loadingStates.fetchJobDetails = 'idle';
      state.errors.fetchJobDetails = null;
    },
    invalidateJobsCache: (state) => {
      state.lastUpdated = null;
    },
    updateJobLocally: (state, action) => {
      const { jobId, updates } = action.payload;
      if (state.entities[jobId]) {
        state.entities[jobId] = { ...state.entities[jobId], ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loadingStates.fetchJobs = 'loading';
        state.errors.fetchJobs = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loadingStates.fetchJobs = 'succeeded';
        state.pagination = action.payload.pagination;
        state.lastUpdated = Date.now();
        jobsAdapter.setAll(state, action.payload.jobs);
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loadingStates.fetchJobs = 'failed';
        state.errors.fetchJobs = action.payload?.message || 'Failed to fetch jobs';
      })

      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loadingStates.createJob = 'loading';
        state.errors.createJob = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loadingStates.createJob = 'succeeded';
        state.entities[action.payload.id] = {
          ...action.payload,
          lastFetched: Date.now()
        };
        state.ids.unshift(action.payload.id);
        state.pagination.totalItems++;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loadingStates.createJob = 'failed';
        state.errors.createJob = action.payload?.message || 'Failed to create job';
      })

      // Update Job
      .addCase(updateJob.pending, (state, action) => {
        state.loadingStates.updateJob = 'loading';
        state.errors.updateJob = null;
        
        // Optimistic update
        const { jobId, data } = action.meta.arg;
        if (state.entities[jobId]) {
          state.entities[jobId] = {
            ...state.entities[jobId],
            ...data,
            isOptimistic: true
          };
        }
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loadingStates.updateJob = 'succeeded';
        state.entities[action.payload.id] = {
          ...action.payload,
          lastFetched: Date.now(),
          isOptimistic: false
        };
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loadingStates.updateJob = 'failed';
        state.errors.updateJob = action.payload?.message || 'Failed to update job';
        
        // Revert optimistic update
        const { jobId } = action.meta.arg;
        if (state.entities[jobId]?.isOptimistic) {
          const originalJob = action.meta.arg.originalJob;
          state.entities[jobId] = originalJob;
        }
      })

      // Fetch Job Details
      .addCase(fetchJobDetails.pending, (state) => {
        state.loadingStates.fetchJobDetails = 'loading';
        state.errors.fetchJobDetails = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loadingStates.fetchJobDetails = 'succeeded';
        state.currentJob = action.payload;
        jobsAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loadingStates.fetchJobDetails = 'failed';
        state.errors.fetchJobDetails = action.payload?.message;
      })

      // Add Job Materials
      .addCase(addJobMaterials.fulfilled, (state, action) => {
        state.entities[action.payload.id] = {
          ...action.payload,
          lastFetched: Date.now()
        };
      })
      .addCase(addJobMaterials.rejected, (state, action) => {
        state.loadingStates.addJobMaterials = 'failed';
        state.errors.addJobMaterials = action.payload?.message || 'Failed to add materials';
      })

      // Add Job Expenses
      .addCase(addJobExpenses.fulfilled, (state, action) => {
        state.entities[action.payload.id] = {
          ...action.payload,
          lastFetched: Date.now()
        };
      })
      .addCase(addJobExpenses.rejected, (state, action) => {
        state.loadingStates.addJobExpenses = 'failed';
        state.errors.addJobExpenses = action.payload?.message || 'Failed to add expenses';
      })

      // Update Job Progress
      .addCase(updateJobProgress.fulfilled, (state, action) => {
        state.entities[action.payload.id] = {
          ...action.payload,
          lastFetched: Date.now()
        };
      })
      .addCase(updateJobProgress.rejected, (state, action) => {
        state.loadingStates.updateJobProgress = 'failed';
        state.errors.updateJobProgress = action.payload?.message || 'Failed to update progress';
      })

      // Update Job Timeframe
      .addCase(updateJobTimeframe.fulfilled, (state, action) => {
        state.entities[action.payload.id] = {
          ...action.payload,
          lastFetched: Date.now()
        };
      })
      .addCase(updateJobTimeframe.rejected, (state, action) => {
        state.loadingStates.updateJobTimeframe = 'failed';
        state.errors.updateJobTimeframe = action.payload?.message || 'Failed to update timeframe';
      });

  }
});

// Export actions
export const {
  resetJobErrors,
  clearCurrentJob,
  invalidateJobsCache,
  updateJobLocally
} = jobsSlice.actions;

// Selectors
const jobsAdapterSelectors = jobsAdapter.getSelectors((state) => state.jobs);

// Basic selectors
export const {
  selectAll: selectAllJobs,
  selectById: selectJobById,
  selectIds: selectJobIds,
  selectTotal: selectTotalJobs,
  selectEntities: selectJobEntities
} = jobsAdapterSelectors;

// Memoized selectors
export const selectJobsState = state => state.jobs;

export const selectCurrentJob = createSelector(
  [selectJobsState],
  (jobs) => jobs.currentJob
);

export const selectJobsLoadingState = createSelector(
  [selectJobsState],
  (jobs) => jobs.loadingStates
);

export const selectJobsErrors = createSelector(
  [selectJobsState],
  (jobs) => jobs.errors
);

export const selectJobsPagination = createSelector(
  [selectJobsState],
  (jobs) => jobs.pagination
);

export const selectFilteredJobs = createSelector(
  [selectAllJobs, (_, filters) => filters],
  (jobs, filters) => {
    if (!filters) return jobs;
    
    return jobs.filter(job => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        if (key === 'startDate') {
          return new Date(job.created_at) >= new Date(value);
        }
        if (key === 'endDate') {
          return new Date(job.created_at) <= new Date(value);
        }
        return job[key] === value;
      });
    });
  }
);

export default jobsSlice.reducer;