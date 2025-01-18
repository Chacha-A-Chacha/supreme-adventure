import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getMaterials, 
  createMaterial, 
  restockMaterial as restockMaterialService,
  updateMaterial,
  deleteMaterial as deleteMaterialService 
} from '../../services/materialService';

// Async Thunks
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMaterials();
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch materials'
      });
    }
});

export const addMaterial = createAsyncThunk(
  'materials/addMaterial', 
  async (newMaterial, { rejectWithValue }) => {
    try {
      const response = await createMaterial(newMaterial);
      return {
        data: response.data,
        message: 'Material created successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to create material'
      });
    }
});

export const restockMaterial = createAsyncThunk(
  'materials/restockMaterial',
  async ({ restockData }, { rejectWithValue }) => {
    try {
      const response = await restockMaterialService(restockData);
      return {
        data: response.data,
        message: 'Material restocked successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to restock material',
        details: error.response?.data
      });
    }
  }
);

export const editMaterial = createAsyncThunk(
  'materials/editMaterial', 
  async ({ updatedData }, { rejectWithValue }) => {
    try {
      const response = await updateMaterial(updatedData);
      return {
        data: response.data,
        message: 'Material updated successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to update material'
      });
    }
});

export const deleteMaterial = createAsyncThunk(
  'materials/deleteMaterial', 
  async (id, { rejectWithValue }) => {
    try {
      await deleteMaterialService(id);
      return {
        id,
        message: 'Material deleted successfully'
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to delete material'
      });
    }
});

const materialSlice = createSlice({
  name: 'materials',
  initialState: {
    materials: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    notifications: {
      message: null,
      type: null, // 'success' | 'error'
      data: null
    }
  },
  reducers: {
    clearNotification: (state) => {
      state.notifications = {
        message: null,
        type: null,
        data: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch materials
      .addCase(fetchMaterials.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: null
        };
      })

      // Add new material
      .addCase(addMaterial.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materials.push(action.payload.data);
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(addMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: null
        };
      })

      // Restock material
      .addCase(restockMaterial.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(restockMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { data } = action.payload;
        const index = state.materials.findIndex(
          (m) => m.id === data.material_id
        );
        if (index !== -1) {
          state.materials[index] = {
            ...state.materials[index],
            stock_level: data.new_stock_level,
            updated_at: data.updated_at
          };
        }
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(restockMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: null
        };
      })

      // Update existing material
      .addCase(editMaterial.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.materials.findIndex((m) => m.id === action.payload.data.id);
        if (index !== -1) {
          state.materials[index] = action.payload.data;
        }
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(editMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: null
        };
      })

      // Delete material
      .addCase(deleteMaterial.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materials = state.materials.filter((m) => m.id !== action.payload.id);
        state.notifications = {
          message: action.payload.message,
          type: 'success',
          data: null
        };
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
        state.notifications = {
          message: action.payload.message,
          type: 'error',
          data: null
        };
      });
  },
});

export const { clearNotification } = materialSlice.actions;

export default materialSlice.reducer;
