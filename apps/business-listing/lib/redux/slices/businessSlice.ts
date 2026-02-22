import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Business, apiClient } from '../../api';
import * as actions from '@/app/actions/business';

export const fetchBusinessesByUserId = createAsyncThunk(
  'business/fetchByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const result = await actions.getBusinessesByUserIdAction(userId);
      if (result.success) return result.businesses;
      return rejectWithValue(result.error);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBusinessById = createAsyncThunk(
  'business/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const result = await actions.getBusinessByIdAction(id);
      if (result.success) return result.business;
      return rejectWithValue(result.error);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'business/update',
  async ({ id, data }: { id: string; data: Partial<Business> }, { rejectWithValue }) => {
    try {
      const result = await actions.updateBusinessProfile(id, data);
      if (result.success) return result.business;
      return rejectWithValue(result.error);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleStoreStatusAction = createAsyncThunk(
  'business/toggleStatus',
  async ({ id, isOpen }: { id: string; isOpen: boolean }, { rejectWithValue }) => {
    try {
      const result = await actions.toggleStoreStatus(id, isOpen);
      if (result.success) return result.business;
      return rejectWithValue(result.error);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBusiness = createAsyncThunk(
  'business/create',
  async (data: Partial<Business>, { rejectWithValue }) => {
    try {
      // Note: If you have a server action for creation, use it here
      return await apiClient.createBusiness(data);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface BusinessState {
  currentBusiness: Business | null;
  userBusinesses: Business[];
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  currentBusiness: null,
  userBusinesses: [],
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setCurrentBusiness: (state, action: PayloadAction<Business | null>) => {
      state.currentBusiness = action.payload;
    },
    setUserBusinesses: (state, action: PayloadAction<Business[]>) => {
      state.userBusinesses = action.payload;
    },
    updateBusinessLocally: (state, action: PayloadAction<Partial<Business>>) => {
      if (state.currentBusiness && state.currentBusiness.id === action.payload.id) {
        state.currentBusiness = { ...state.currentBusiness, ...action.payload };
      }
      
      const index = state.userBusinesses.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.userBusinesses[index] = { ...state.userBusinesses[index], ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Businesses By User ID
      .addCase(fetchBusinessesByUserId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusinessesByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.userBusinesses = action.payload;
      })
      .addCase(fetchBusinessesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Business By ID
      .addCase(fetchBusinessById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentBusiness = action.payload;
          
          // Update the list too
          const index = state.userBusinesses.findIndex(b => b.id === action.payload?.id);
          if (index !== -1) {
            state.userBusinesses[index] = action.payload;
          }
        }
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Business
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentBusiness = action.payload;
          
          const index = state.userBusinesses.findIndex(b => b.id === action.payload.id);
          if (index !== -1) {
            state.userBusinesses[index] = action.payload;
          }
        }
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Toggle store status
      .addCase(toggleStoreStatusAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleStoreStatusAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.currentBusiness = action.payload as any;
          const index = state.userBusinesses.findIndex(b => b.id === (action.payload as any).id);
          if (index !== -1) {
            state.userBusinesses[index] = action.payload as any;
          }
        }
      })
      .addCase(toggleStoreStatusAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Business
      .addCase(createBusiness.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.userBusinesses.push(action.payload);
        state.currentBusiness = action.payload; // Usually switch to newly created
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentBusiness, 
  setUserBusinesses, 
  updateBusinessLocally,
  setLoading, 
  setError 
} = businessSlice.actions;

export default businessSlice.reducer;
