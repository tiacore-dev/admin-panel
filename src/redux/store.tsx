import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "./slices/usersSlice";
import { companiesReducer } from "./slices/companiesSlice";
import breadcrumbsReducer from "./slices/breadcrumbsSlice";
import { legalEntitiesBuyersReducer } from "./slices/legalEntityBuyersSlice";
import { legalEntitiesSellersReducer } from "./slices/legalEntitySellersSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    companies: companiesReducer,
    breadcrumbs: breadcrumbsReducer,
    legalEntitiesBuyers: legalEntitiesBuyersReducer,
    legalEntitiesSellers: legalEntitiesSellersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
