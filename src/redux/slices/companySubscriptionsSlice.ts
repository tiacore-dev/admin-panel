// src/redux/slices/companySubscriptionsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CompanySubscriptionsState {
  searchText: string;
  selectedCompany: string | null;
  selectedSubscription: string | null;
}

const initialState: CompanySubscriptionsState = {
  searchText: "",
  selectedCompany: null,
  selectedSubscription: null,
};

export const companySubscriptionsSlice = createSlice({
  name: "companySubscriptions",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setSelectedCompany: (state, action: PayloadAction<string | null>) => {
      state.selectedCompany = action.payload;
    },
    setSelectedSubscription: (state, action: PayloadAction<string | null>) => {
      state.selectedSubscription = action.payload;
    },
    resetState: () => initialState,
  },
});

export const {
  setSearchText,
  setSelectedCompany,
  setSelectedSubscription,
  resetState,
} = companySubscriptionsSlice.actions;

export default companySubscriptionsSlice.reducer;
