// src/redux/slices/legalEntitiesSellersSlice.tsx
import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface LegalEntitiesSellersState {
  short_name: string;
  inn: string;
  // kpp: string;
  ogrn: string;
  address: string;
  vat_rate: string | null;
  page: number;
  page_size: number;
}

const initialState: LegalEntitiesSellersState = {
  short_name: "",
  inn: "",
  // kpp: "",
  ogrn: "",
  address: "",
  vat_rate: null,
  page: 1,
  page_size: 10,
};

export const legalEntitiesSellersSlice = createSlice({
  name: "legalEntitiesSellers",
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
    setVatRate: (state, action: PayloadAction<string | null>) => {
      state.vat_rate = action.payload;
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
  // setKpp,
  setAddress,
  setOgrn,
  setVatRate,
  resetState,
} = legalEntitiesSellersSlice.actions;

export const legalEntitiesSellersReducer = legalEntitiesSellersSlice.reducer;

export const legalEntitiesSellersSelector = createSelector(
  (state: RootState) => state.legalEntitiesSellers,
  (legalEntitiesSellers) => legalEntitiesSellers
);
