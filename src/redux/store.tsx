import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "./slices/usersSlice";
import { companiesReducer } from "./slices/companiesSlice";
import breadcrumbsReducer from "./slices/breadcrumbsSlice";
import { legalEntitiesSellersReducer } from "./slices/legalEntitySellersSlice";
import { rolesReducer } from "./slices/rolesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    companies: companiesReducer,
    breadcrumbs: breadcrumbsReducer,
    legalEntitiesSellers: legalEntitiesSellersReducer,
    roles: rolesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
