import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Business } from '../../api';

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
});

export const { 
  setCurrentBusiness, 
  setUserBusinesses, 
  updateBusinessLocally,
  setLoading, 
  setError 
} = businessSlice.actions;

export default businessSlice.reducer;
