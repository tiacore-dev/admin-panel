import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface LegalEntitiesState {
  search: string;
  company: string;
  entity_type: string;
  page: number;
  page_size: number;
}

const initialState: LegalEntitiesState = {
  search: "",
  company: "",
  entity_type: "",
  page: 1,
  page_size: 10,
};

export const legalEntitiesSlice = createSlice({
  name: "legal_entities",
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
    setCompany: (state, action: PayloadAction<string>) => {
      state.company = action.payload;
      state.page = 1;
    },
    setEntityType: (state, action: PayloadAction<string>) => {
      state.entity_type = action.payload;
      state.page = 1;
    },
    resetState: () => initialState,
  },
});

export const {
  setPage,
  setPageSize,
  setSearch,
  setCompany,
  setEntityType,
  resetState,
} = legalEntitiesSlice.actions;

export const legalEntitiesReducer = legalEntitiesSlice.reducer;

export const legalEntitiesSelector = createSelector(
  (state: RootState) => state.legalEntities,
  (legalEntities) => legalEntities
);
