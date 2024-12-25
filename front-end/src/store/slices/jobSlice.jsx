import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import JobService from '../../services/jobService';

// Constants
const JOBS_PER_PAGE = 10;

// Initial state
const initialState = {
  entities: {},          // Normalized jobs data
  currentJob: null,      // Currently selected job
  ids: [],              // Array of job IDs for order preservation
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: JOBS_PER_PAGE
  },
  loadingStates: {
    fetchJobs: 'idle',      // 'idle' | 'loading' | 'succeeded' | 'failed'
    createJob: 'idle',
    updateJob: 'idle',
    fetchJobDetails: 'idle'
  },
  errors: {
    fetchJobs: null,
    createJob: null,
    updateJob: null,
    fetchJobDetails: null
  },
  lastUpdated: null
};

// Async Thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ page = 1, limit = JOBS_PER_PAGE }, { rejectWithValue }) => {
    try {
      const response = await JobService.getJobs({ page, limit });
      return {
        jobs: response.jobs,
        pagination: {
          currentPage: page,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      JobService.validateJobData(jobData);
      const response = await JobService.createJob(jobData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
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
  async (jobId, { rejectWithValue, getState }) => {
    try {
      // Check cache first
      const job = getState().jobs.entities[jobId];
      if (job && Date.now() - job.lastFetched < 5 * 60 * 1000) { // 5 minutes cache
        return job;
      }

      const response = await JobService.getJobDetails(jobId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
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
        
        // Normalize jobs data
        const newEntities = {};
        const newIds = [];
        if (action.payload.jobs) {
          
          action.payload.jobs.forEach(job => {
            newEntities[job.id] = {
              ...job,
              lastFetched: Date.now()
            };
            newIds.push(job.id);
          });
        }
        
        state.entities = newEntities;
        state.ids = newIds;
        state.lastUpdated = Date.now();
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
        state.entities[action.payload.id] = {
          ...action.payload,
          lastFetched: Date.now()
        };
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loadingStates.fetchJobDetails = 'failed';
        state.errors.fetchJobDetails = action.payload?.message || 'Failed to fetch job details';
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
      });

  }
});

// Actions
export const {
  resetJobErrors,
  clearCurrentJob,
  invalidateJobsCache,
  updateJobLocally
} = jobsSlice.actions;

// Selectors
const selectJobsState = state => state.jobs;

export const selectJobIds = state => state.jobs.ids;
export const selectJobEntities = state => state.jobs.entities;

// Memoized selectors using createSelector
export const selectAllJobs = createSelector(
  [selectJobEntities, selectJobIds],
  (entities, ids) => ids.map(id => entities[id])
);

export const selectJobById = createSelector(
  [selectJobEntities, (state, jobId) => jobId],
  (entities, jobId) => entities[jobId]
);

export const selectCurrentJob = createSelector(
  [selectJobsState],
  jobs => jobs.currentJob
);

export const selectJobsLoadingState = createSelector(
  [selectJobsState],
  jobs => jobs.loadingStates
);

export const selectJobsErrors = createSelector(
  [selectJobsState],
  jobs => jobs.errors
);

export const selectJobsPagination = createSelector(
  [selectJobsState],
  jobs => jobs.pagination
);

// Memoized filtered jobs selector with composable filters
export const selectFilteredJobs = createSelector(
  [
    selectAllJobs,
    (state, filters) => filters
  ],
  (jobs, filters) => {
    if (!filters) return jobs;
    
    return jobs.filter(job => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
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
