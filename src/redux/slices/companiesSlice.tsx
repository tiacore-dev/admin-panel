import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface CompaniesState {
  search: string;
  page: number;
  page_size: number;
}

const initialState: CompaniesState = {
  page: 1,
  page_size: 10,
  search: "",
};

export const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const { setPage, setPageSize, setSearch, resetState } =
  companiesSlice.actions;

export const companiesReducer = companiesSlice.reducer;

export const companiesSelector = createSelector(
  (state: RootState) => state.companies,
  (companies) => companies
);
