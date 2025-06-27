import React from "react";
import "@ant-design/v5-patch-for-react-19";
import ProtectedRoute from "./protectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import { LegalEntitiesPage } from "./pages/legalEntitiesPage/legalEntitiesPage";
import { LegalEntityDetailsPage } from "./pages/legalEntitiesPage/legalEntityDetailsPage";
import { NotFoundPage } from "./pages/homePage/notFoundPage";

dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.locale("ru", {
  weekStart: 1,
});

const queryClient = new QueryClient();

const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const ProtectedRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:user_id" element={<UserDetailsPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/companies/:company_id" element={<CompanyDetailsPage />} />
        <Route path="/legal-entities" element={<LegalEntitiesPage />} />
        <Route
          path="/legal-entities/:legal_entity_id"
          element={<LegalEntityDetailsPage />}
        />
        <Route
          path="/role_permissions_relations"
          element={<RolePermissionsPage />}
        />
        <Route
          path="/role_permissions_relations/:role_id"
          element={<RolePermissionsDetailsPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={ruRU}>
      <ConfigProvider theme={themeConfig}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Toaster position="bottom-right" />
            <Routes>
              <Route
                path="/"
                element={
                  localStorage.getItem("access_token") ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/accept-invite" element={<AcceptInvitePage />} />
              <Route path="/invite" element={<InviteRegistrationPage />} />

              <Route
                path="*"
                element={
                  <AuthWrapper>
                    <ProtectedRoutes />
                  </AuthWrapper>
                }
              />
            </Routes>
          </Router>
        </QueryClientProvider>
      </ConfigProvider>
    </ConfigProvider>
  );
};
export default App;
