// src/redux/slices/breadcrumbsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Breadcrumb {
  label: string;
  to: string;
}

interface BreadcrumbsState {
  paths: Breadcrumb[];
}

const initialState: BreadcrumbsState = {
  paths: [],
};

const breadcrumbsSlice = createSlice({
  name: "breadcrumbs",
  initialState,
  reducers: {
    setBreadcrumbs: (state, action: PayloadAction<Breadcrumb[]>) => {
      state.paths = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<Breadcrumb>) => {
      state.paths.push(action.payload);
    },
    resetBreadcrumbs: (state) => {
      state.paths = [];
    },
  },
});

export const { setBreadcrumbs, addBreadcrumb, resetBreadcrumbs } =
  breadcrumbsSlice.actions;

export default breadcrumbsSlice.reducer;
