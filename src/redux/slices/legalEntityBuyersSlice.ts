// src/redux/slices/legalEntitiesBuyersSlice.tsx
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface LegalEntitiesBuyersState {
  short_name: string;
  inn: string;
  kpp: string;
  ogrn: string;
  address: string;
  // vat_rate: string | null;
  page: number;
  page_size: number;
}

const initialState: LegalEntitiesBuyersState = {
  short_name: "",
  inn: "",
  kpp: "",
  ogrn: "",
  address: "",
  // vat_rate: null,
  page: 1,
  page_size: 10,
};

export const legalEntitiesBuyersSlice = createSlice({
  name: "legalEntitiesBuyers",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1;
    },
    setShortName: (state, action: PayloadAction<string>) => {
      state.short_name = action.payload;
      state.page = 1;
    },
    setInn: (state, action: PayloadAction<string>) => {
      state.inn = action.payload;
      state.page = 1;
    },
    setOgrn: (state, action: PayloadAction<string>) => {
      state.ogrn = action.payload;
      state.page = 1;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.page = 1;
    },
    resetState: () => initialState,
  },
});

export const {
  setPage,
  setPageSize,
  setShortName,
  setInn,
  setOgrn,
  setAddress,
  resetState,
} = legalEntitiesBuyersSlice.actions;

export const legalEntitiesBuyersReducer = legalEntitiesBuyersSlice.reducer;

export const legalEntitiesBuyersSelector = createSelector(
  (state: RootState) => state.legalEntitiesBuyers,
  (legalEntitiesBuyers) => legalEntitiesBuyers
);
