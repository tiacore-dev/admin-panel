import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UsersState {
  email: string;
  full_name: string;
  position: string;
  page: number;
  page_size: number;
}

const initialState: UsersState = {
  email: "",
  full_name: "",
  position: "",
  page: 1,
  page_size: 10,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      state.page = 1;
    },
    setFullName: (state, action: PayloadAction<string>) => {
      state.full_name = action.payload;
      state.page = 1;
    },
    setPosition: (state, action: PayloadAction<string>) => {
      state.position = action.payload;
      state.page = 1;
    },
    resetState: () => initialState, // Добавляем действие для сброса состояния
  },
});

export const {
  setPage,
  setPageSize,
  setEmail,
  setFullName,
  setPosition,
  resetState,
} = usersSlice.actions;

export const usersReducer = usersSlice.reducer;

export const usersSelector = createSelector(
  (state: RootState) => state.users,
  (users) => users
);
