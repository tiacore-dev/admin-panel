import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface RolesState {
  searchText: string;
  selectedApp: string | null;
}

const initialState: RolesState = {
  searchText: "",
  selectedApp: null,
};

export const rolesSlice = createSlice({
  name: "roles",
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

export const { setSearchText, setSelectedApp, resetState } = rolesSlice.actions;

export const rolesReducer = rolesSlice.reducer;

export const rolesSelector = createSelector(
  (state: RootState) => state.roles,
  (roles) => roles
);
