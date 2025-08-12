import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionsState {
  searchText: string;
  selectedApp: string | null;
}

const initialState: SubscriptionsState = {
  searchText: "",
  selectedApp: null,
};

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setSelectedApp: (state, action: PayloadAction<string | null>) => {
      state.selectedApp = action.payload;
    },
    resetState: () => initialState,
  },
});

export const { setSearchText, setSelectedApp, resetState } =
  subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
