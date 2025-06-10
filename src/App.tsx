import React from "react";
import "@ant-design/v5-patch-for-react-19";
import ProtectedRoute from "./protectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import ruRU from "antd/lib/locale/ru_RU";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./pages/loginPage/loginPage";
import { HomePage } from "./pages/homePage/homePage";
import { UsersPage } from "./pages/usersPage/usersPage";
import { UserDetailsPage } from "./pages/usersPage/userDetailsPage";
import { CompaniesPage } from "./pages/companiesPage/companiesPage";
import { CompanyDetailsPage } from "./pages/companiesPage/companyDetailsPage";
// import { LegalEntitiesPage } from "./pages/legalEntitiesPage/legalEntitiesPage";
// import { LegalEntityDetailsPage } from "./pages/legalEntitiesPage/legalEntityDetailsPage";
import { RolePermissionsPage } from "./pages/rolePermissionsPage/rolePermissionsPage";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import updateLocale from "dayjs/plugin/updateLocale";
import "./App.css";
import "antd/dist/reset.css";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { RolePermissionsDetailsPage } from "./pages/rolePermissionsPage/rolePermissionsDetailsPage";
import { AccountPage } from "./pages/accountPage/accountPage";
import { AcceptInvitePage } from "./pages/invitePages/acceptInvitePage";
import { themeConfig } from "./theme/themeConfig";
import { InviteRegistrationPage } from "./pages/invitePages/inviteRegistrationPage";
import { LegalEntitiesBuyersPage } from "./pages/legalEntitiesPage/legalEntitiesBuyersPage";
import { BuyerDetailsPage } from "./pages/legalEntitiesPage/buyerDetailsPage";
import { LegalEntitiesSellersPage } from "./pages/legalEntitiesPage/legalEntitiesSellersPage";
import { SellerDetailsPage } from "./pages/legalEntitiesPage/sellerDetailsPage";
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale("ru", {
  weekStart: 1,
});

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ConfigProvider locale={ruRU}>
      <ConfigProvider theme={themeConfig}>
        <QueryClientProvider client={queryClient}>
          {" "}
          {/* Обернули все приложение в CompanyProvider */}
          <Router>
            <Toaster position="bottom-right" />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/accept-invite" element={<AcceptInvitePage />} />
              <Route path="/invite" element={<InviteRegistrationPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:user_id" element={<UserDetailsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route
                  path="/companies/:company_id"
                  element={<CompanyDetailsPage />}
                />
                <Route
                  path="/legal-entities/buyers"
                  element={<LegalEntitiesBuyersPage />}
                />
                <Route
                  path="/legal-entities/buyers/:legal_entity_id"
                  element={<BuyerDetailsPage />}
                />
                <Route
                  path="/legal-entities/sellers"
                  element={<LegalEntitiesSellersPage />}
                />
                <Route
                  path="/legal-entities/sellers/:legal_entity_id"
                  element={<SellerDetailsPage />}
                />
                <Route
                  path="/role_permissions_relations"
                  element={<RolePermissionsPage />}
                />
                <Route
                  path="/role_permissions_relations/:role_id"
                  element={<RolePermissionsDetailsPage />}
                />
              </Route>
              {/* <Route path="*" element={<Navigate to="/login" />} /> */}
            </Routes>
          </Router>
        </QueryClientProvider>
      </ConfigProvider>
    </ConfigProvider>
  );
};

export default App;
