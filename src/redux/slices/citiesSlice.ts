import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface CitiesState {
  city_name: string;
  region: string;
  page: number;
  page_size: number;
}

const initialState: CitiesState = {
  page: 1,
  page_size: 10,
  city_name: "",
  region: "",
};

export const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1;
    },
    setCityName: (state, action: PayloadAction<string>) => {
      state.city_name = action.payload;
      state.page = 1;
    },
    setRegion: (state, action: PayloadAction<string>) => {
      state.region = action.payload;
      state.page = 1;
    },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const { setPage, setPageSize, setCityName, setRegion, resetState } =
  citiesSlice.actions;

export const citiesReducer = citiesSlice.reducer;

export const citiesSelector = createSelector(
  (state: RootState) => state.cities,
  (cities) => cities
);
