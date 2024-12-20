import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getJobs, createJob as createJobService, updateJob, getJobById } from '../../services/jobService';

// Async Thunk to fetch all jobs with pagination
export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async ({ page, limit }, { rejectWithValue }) => {
  try {
    const response = await getJobs(page, limit);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Something went wrong');
  }
});

// Async Thunk to create a new job
export const createJob = createAsyncThunk('jobs/createJob', async (newJob, { rejectWithValue }) => {
  try {
    const response = await createJobService(newJob);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Failed to create job');
  }
});

// Async Thunk to update an existing job
export const editJob = createAsyncThunk('jobs/editJob', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await updateJob(id, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Failed to update job');
  }
});

// Async Thunk to fetch a single job by ID
export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (id, { rejectWithValue }) => {
  try {
    const response = await getJobById(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Failed to fetch job details');
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    job: null,
    status: 'idle',
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload.jobs;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch jobs';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs.push(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create job';
      })
      .addCase(editJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.jobs.findIndex((job) => job.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      .addCase(editJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update job';
      })
      .addCase(fetchJobById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.job = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch job details';
      });
  },
});

export default jobSlice.reducer;
export { createJob, fetchJobs, editJob, fetchJobById };