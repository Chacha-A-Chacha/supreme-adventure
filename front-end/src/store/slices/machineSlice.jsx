import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  getMachines,
  createMachine,
  createMachineReading,
  getMachineReadings,
  getMachineReadingsByMachine,
  getJobReadings
} from '../../services/machineService';

// Async Thunks
export const fetchMachines = createAsyncThunk(
  'machines/fetchMachines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMachines();
      return {
        data: response.data,
        message: 'Machines retrieved successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch machines',
        data: error.response?.data
      });
    }
});

export const addMachine = createAsyncThunk(
  'machines/addMachine',
  async (machineData, { rejectWithValue }) => {
    try {
      const response = await createMachine(machineData);
      return {
        data: response.data.machine,
        message: response.data.message || 'Machine created successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to create machine',
        data: error.response?.data
      });
    }
});

export const logMachineReading = createAsyncThunk(
  'machines/logReading',
  async (readingData, { rejectWithValue }) => {
    try {
      const response = await createMachineReading(readingData);
      return {
        data: response.data.reading,
        message: response.data.message || 'Reading logged successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to log reading',
        data: error.response?.data
      });
    }
});

export const fetchMachineReadings = createAsyncThunk(
  'machines/fetchReadings',
  async ({ machineId, startDate, endDate }, { rejectWithValue }) => {
    try {
      const response = await getMachineReadingsByMachine(machineId, startDate, endDate);
      return {
        data: {
          readings: response.data.readings,
          totalUsage: response.data.total_usage
        },
        message: 'Machine readings retrieved successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch readings',
        data: error.response?.data
      });
    }
});

export const fetchJobReadings = createAsyncThunk(
  'machines/fetchJobReadings',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await getJobReadings(jobId);
      return {
        data: response.data.readings,
        message: 'Job readings retrieved successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch job readings',
        data: error.response?.data
      });
    }
});

export const fetchPaginatedReadings = createAsyncThunk(
  'machines/fetchPaginatedReadings',
  async ({ page = 1, per_page = 10 }, { rejectWithValue }) => {
    try {
      const response = await getMachineReadings(page, per_page);
      return {
        data: {
          readings: response.data.readings,
          pagination: response.data.pagination
        },
        message: 'Readings retrieved successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch readings',
        data: error.response?.data
      });
    }
});

// Initial State
const initialState = {
  machines: [],
  readings: [],
  currentJobReadings: [],
  totalUsage: 0,
  status: 'idle',
  error: null,
  notifications: {
    message: null,
    type: null,
    data: null
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }
};

const machineSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {
    clearNotification: (state) => {
      state.notifications = {
        message: null,
        type: null,
        data: null
      };
    },
    clearReadings: (state) => {
      state.readings = [];
      state.totalUsage = 0;
    },
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch machines
      .addCase(fetchMachines.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.machines = action.payload.data.machines;
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: action.payload.data
        };
      })

      // Add new machine
      .addCase(addMachine.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMachine.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.machines.unshift(action.payload.data);
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(addMachine.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: action.payload.data
        };
      })

      // Log machine reading
      .addCase(logMachineReading.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logMachineReading.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.readings.unshift(action.payload.data);
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(logMachineReading.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: action.payload.data
        };
      })

      // Fetch machine readings
      .addCase(fetchMachineReadings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMachineReadings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.readings = action.payload.data.readings;
        state.totalUsage = action.payload.data.totalUsage;
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(fetchMachineReadings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: action.payload.data
        };
      })

      // Fetch job readings
      .addCase(fetchJobReadings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchJobReadings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentJobReadings = action.payload.data;
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(fetchJobReadings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: action.payload.data
        };
      })

      // Fetch paginated readings
      .addCase(fetchPaginatedReadings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPaginatedReadings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.readings = action.payload.data.readings;
        state.pagination = action.payload.data.pagination;
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(fetchPaginatedReadings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: action.payload.data
        };
      });
  }
});

// Basic Selectors
export const selectAllMachines = (state) => state.machines?.machines ?? [];
export const selectMachineReadings = (state) => state.machines?.readings ?? [];
export const selectCurrentJobReadings = (state) => state.machines?.currentJobReadings ?? [];
export const selectTotalUsage = (state) => state.machines?.totalUsage ?? 0;
export const selectMachinesLoadingState = (state) => state.machines?.status ?? 'idle';
export const selectMachineErrors = (state) => state.machines?.error ?? null;
export const selectMachineNotifications = (state) => state.machines?.notifications ?? {
  message: null,
  type: null,
  data: null
};
export const selectMachinePagination = (state) => state.machines?.pagination ?? {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10
};

// Memoized Selectors
export const selectActiveMachines = createSelector(
  [selectAllMachines],
  (machines) => machines.filter(machine => machine.status === 'active')
);

export const selectMachineById = createSelector(
  [selectAllMachines, (_, machineId) => machineId],
  (machines, machineId) => machines.find(machine => machine.id === machineId) || null
);

export const selectMachineReadingsById = createSelector(
  [selectMachineReadings, (_, machineId) => machineId],
  (readings, machineId) => readings.filter(reading => reading.machine_id === machineId)
);

export const selectMachineStats = createSelector(
  [selectAllMachines],
  (machines) => ({
    total: machines.length,
    active: machines.filter(m => m.status === 'active').length,
    inactive: machines.filter(m => m.status !== 'active').length
  })
);

export const { 
  clearNotification, 
  clearReadings, 
  setPagination 
} = machineSlice.actions;

export default machineSlice.reducer;
