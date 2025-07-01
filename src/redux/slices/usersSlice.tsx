import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UsersState {
  email: string;
  page: number;
  page_size: number;
  is_verified: boolean | "all"; // Добавили поле для статуса
}

const initialState: UsersState = {
  email: "",
  page: 1,
  page_size: 10,
  is_verified: "all", // Изначально фильтр не применен
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
    setSearch: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      state.page = 1;
    },
    setIsVerified: (state, action: PayloadAction<boolean | "all">) => {
      state.is_verified = action.payload;
      state.page = 1;
    },
    resetState: () => initialState,
  },
});

export const { setPage, setPageSize, setSearch, setIsVerified, resetState } =
  usersSlice.actions;

export const usersReducer = usersSlice.reducer;

export const usersSelector = createSelector(
  (state: RootState) => state.users,
  (users) => users
);
