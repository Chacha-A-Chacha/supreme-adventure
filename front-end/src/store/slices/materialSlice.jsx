// Redux Slice for Materials (redux/materialSlice.js)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial as deleteMaterialService } from '../../services/materialService';

// Async Thunk to fetch materials
export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials', 
  async (_, { rejectWithValue }) => {
  try {
    const response = await getMaterials();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Something went wrong');
  }
});

// Async Thunk to create a new material
export const addMaterial = createAsyncThunk('materials/addMaterial', async (newMaterial, { rejectWithValue }) => {
  try {
    const response = await createMaterial(newMaterial);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Failed to create material');
  }
});

// Async Thunk to update an existing material
export const editMaterial = createAsyncThunk('materials/editMaterial', async ({ id, updatedData }, { rejectWithValue }) => {
  try {
    const response = await updateMaterial(id, updatedData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : 'Failed to update material');
  }
});

// Async Thunk to delete a material
export const deleteMaterial = createAsyncThunk('materials/deleteMaterial', async (id, { rejectWithValue }) => {
    try {
      await deleteMaterialService(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Failed to delete material');
    }
  });

const materialSlice = createSlice({
  name: 'materials',
  initialState: {
    materials: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
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
        state.error = action.payload || 'Failed to fetch materials';
      })
      // Add new material
      .addCase(addMaterial.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materials.push(action.payload);
      })
      .addCase(addMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to add material';
      })
      // Update existing material
      .addCase(editMaterial.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.materials.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.materials[index] = action.payload;
        }
      })
      .addCase(editMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update material';
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.materials = state.materials.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete material';
      });

  },
});

export default materialSlice.reducer;
