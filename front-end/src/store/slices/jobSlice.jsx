import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import {
  getJobs,
  createJob as createJobService,
  getJobDetails,
  updateJob as updateJobService,
  addJobMaterials as addJobMaterialsService,
  addJobExpenses as jobExpensesService,
  updateJobProgress as jobProgressService,
  updateJobTimeframe as jobTimeframeService,

} from '../../services/jobService';

// Constants
const JOBS_PER_PAGE = 10;

// Helper function to clean filters
const cleanFilters = (filters) => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value && value !== 'all' && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// Initial state
const initialState = {
  jobs: [],
  currentJob: null,
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
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: JOBS_PER_PAGE
  },
  filters: {
    jobType: null,
    progressStatus: null,
    startDate: null,
    endDate: null
  },
  notifications: {
    message: null,
    type: null,
    data: null
  }
};

// Async Thunks
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async ({ page = 1, limit = JOBS_PER_PAGE, ...filters }, { rejectWithValue }) => {
    try {
      const cleanedFilters = cleanFilters(filters);
      const response = await getJobs({ 
        page, 
        limit, 
        ...cleanedFilters 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch jobs'
      });
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      const response = await createJobService(jobData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to create job'
      });
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, data }, { rejectWithValue }) => {
    try {
      const response = await updateJobService(jobId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to update job'
      });
    }
  }
);

export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchJobDetails',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getJobDetails(jobId);
      
      console.log('Job Details Response:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch job details'
      });
    }
  }
);

export const addJobMaterials = createAsyncThunk(
  'jobs/addJobMaterials',
  async ({ jobId, materials }, { rejectWithValue }) => {
    try {
      const response = await addJobMaterialsService(jobId, materials);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to add materials'
      });
    }
  }
);

export const addJobExpenses = createAsyncThunk(
  'jobs/addJobExpenses',
  async ({ jobId, expenses }, { rejectWithValue }) => {
    try {
      const response = await jobExpensesService(jobId, expenses);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to add expenses'
      });
    }
  }
);

export const updateJobProgress = createAsyncThunk(
  'jobs/updateJobProgress',
  async ({ jobId, progressData }, { rejectWithValue }) => {
    try {
      const response = await jobProgressService(jobId, progressData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to update progress'
      });
    }
  }
);

export const updateJobTimeframe = createAsyncThunk(
  'jobs/updateTimeframe',
  async ({ jobId, timeframeData }, { rejectWithValue }) => {
    try {
      const response = await jobTimeframeService(jobId, timeframeData);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to update timeframe'
      });
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
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
      // Reset to first page when filters change
      state.pagination.currentPage = 1;
    },
    clearNotification: (state) => {
      state.notifications = {
        message: null,
        type: null,
        data: null
      };
    },
    updateJobLocally: (state, action) => {
      const { jobId, updates } = action.payload;
      const jobIndex = state.jobs.findIndex(job => job.id === jobId);
      if (jobIndex !== -1) {
        state.jobs[jobIndex] = { ...state.jobs[jobIndex], ...updates };
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
        state.jobs = action.payload.jobs;
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          totalPages: action.payload.pagination.totalPages,
          totalItems: action.payload.pagination.totalItems,
          itemsPerPage: action.payload.pagination.itemsPerPage
        };
        state.notifications = {
          message: 'Jobs fetched successfully',
          type: 'success'
        };
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loadingStates.fetchJobs = 'failed';
        state.errors.fetchJobs = action.payload?.message;
        state.notifications = {
          message: action.payload?.message,
          type: 'error'
        };
      })

      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loadingStates.createJob = 'loading';
        state.errors.createJob = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loadingStates.createJob = 'succeeded';
        state.jobs.unshift(action.payload);
        state.notifications = {
          message: 'Job created successfully',
          type: 'success'
        };
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loadingStates.createJob = 'failed';
        state.errors.createJob = action.payload?.message;
        state.notifications = {
          message: action.payload?.message,
          type: 'error'
        };
      })

      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loadingStates.updateJob = 'loading';
        state.errors.updateJob = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loadingStates.updateJob = 'succeeded';
        const index = state.jobs.findIndex(job => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
        state.notifications = {
          message: 'Job updated successfully',
          type: 'success'
        };
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loadingStates.updateJob = 'failed';
        state.errors.updateJob = action.payload?.message;
        state.notifications = {
          message: action.payload?.message,
          type: 'error'
        };
      })

      // Fetch Job Details
      .addCase(fetchJobDetails.pending, (state) => {
        state.loadingStates.fetchJobDetails = 'loading';
        state.errors.fetchJobDetails = null;
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.loadingStates.fetchJobDetails = 'succeeded';
        state.currentJob = action.payload;
        state.notifications = {
          message: 'Job details fetched successfully',
          type: 'success'
        };
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loadingStates.fetchJobDetails = 'failed';
        state.errors.fetchJobDetails = action.payload?.message;
        state.notifications = {
          message: action.payload?.message,
          type: 'error'
        };
      })

      // Add Job Materials
      .addCase(addJobMaterials.pending, (state) => {
        state.loadingStates.addJobMaterials = 'loading';
        state.errors.addJobMaterials = null;
      })
      .addCase(addJobMaterials.fulfilled, (state, action) => {
        state.loadingStates.addJobMaterials = 'succeeded';
        state.notifications = {
          message: 'Materials added successfully',
          type: 'success',
          data: action.payload
        };
      })
      .addCase(addJobMaterials.rejected, (state, action) => {
        state.loadingStates.addJobMaterials = 'failed';
        state.errors.addJobMaterials = action.payload?.message;
        state.notifications = {
          message: action.payload?.message,
          type: 'error'
        };
      })

      // Add Job Expenses
      .addCase(addJobExpenses.pending, (state) => {
        state.loadingStates.addJobExpenses = 'loading';
        state.errors.addJobExpenses = null;
      })
      .addCase(addJobExpenses.fulfilled, (state, action) => {
        state.loadingStates.addJobExpenses = 'succeeded';
        state.notifications = {
          message: 'Expenses added successfully',
          type: 'success',
          data: action.payload
        };
      })
      .addCase(addJobExpenses.rejected, (state, action) => {
        state.loadingStates.addJobExpenses = 'failed';
        state.errors.addJobExpenses = action.payload?.message;
        state.notifications = {
          message: action.payload?.message,
          type: 'error'
        };
      })

      // Update Job Progress
      .addCase(updateJobProgress.pending, (state) => {
        state.loadingStates.updateJobProgress = 'loading';
        state.errors.updateJobProgress = null;
      })
      .addCase(updateJobProgress.fulfilled, (state, action) => {
        state.loadingStates.updateJobProgress = 'succeeded';
        state.notifications = {
          message: 'Job progress updated successfully',
          type: 'success',
          data: action.payload
        };
      })
      .addCase(updateJobProgress.rejected, (state, action) => {
        state.loadingStates.updateJobProgress = 'failed';
        state.errors.updateJobProgress = action.payload?.message;
        state.notifications = {
          message: action.payload?.message,
          type: 'error'
        };
      })

      // Update Job Timeframe
      .addCase(updateJobTimeframe.pending, (state) => {
        state.loadingStates.updateJobTimeframe = 'loading';
        state.errors.updateJobTimeframe = null;
      })
      .addCase(updateJobTimeframe.fulfilled, (state, action) => {
        state.loadingStates.updateJobTimeframe = 'succeeded';
        state.notifications = {
          message: 'Job timeframe updated successfully',
          type: 'success',
          data: action.payload
        };
      })
      .addCase(updateJobTimeframe.rejected, (state, action) => {
        state.loadingStates.updateJobTimeframe = 'failed';
        state.errors.updateJobTimeframe = action.payload?.message;
        state.notifications = {
          message: action.payload?.message,
          type: 'error'
        };
      });
  }
});

// Export actions
export const {
  resetJobErrors,
  clearCurrentJob,
  setFilters,
  clearNotification,
  updateJobLocally
} = jobsSlice.actions;

// Selectors
export const selectJobsState = state => state.jobs;
export const selectAllJobs = state => state.jobs.jobs;
export const selectCurrentJob = state => state.jobs.currentJob;
export const selectJobById = (state, jobId) => 
  state.jobs.jobs.find(job => job.id === jobId);
export const selectJobsLoadingState = state => state.jobs.loadingStates;
export const selectJobsErrors = state => state.jobs.errors;
export const selectJobsPagination = state => state.jobs.pagination;
export const selectNotification = state => state.jobs.notifications;
export const selectJobFilters = state => state.jobs.filters;

// Memoized selectors
export const selectFilteredJobs = createSelector(
  [selectAllJobs, selectJobFilters],
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

// Export default reducer
export default jobsSlice.reducer;