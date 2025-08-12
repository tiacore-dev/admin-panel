import { configureStore } from "@reduxjs/toolkit";
import { usersReducer } from "./slices/usersSlice";
import { companiesReducer } from "./slices/companiesSlice";
import breadcrumbsReducer from "./slices/breadcrumbsSlice";
import { legalEntitiesSellersReducer } from "./slices/legalEntitySellersSlice";
import { rolesReducer } from "./slices/rolesSlice";
import { citiesReducer } from "./slices/citiesSlice";
import subscriptionsReducer from "./slices/subscriptionsSlice";
import companySubscriptionsReducer from "./slices/companySubscriptionsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    companies: companiesReducer,
    breadcrumbs: breadcrumbsReducer,
    legalEntitiesSellers: legalEntitiesSellersReducer,
    roles: rolesReducer,
    cities: citiesReducer,
    subscriptions: subscriptionsReducer,
    companySubscriptions: companySubscriptionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
