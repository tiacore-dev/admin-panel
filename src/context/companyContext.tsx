// companyContext.tsx
import { QueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CompanyContextType {
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  availableCompanies: string[];
  isSuperadmin: boolean;
  setAvailableCompanies: (companies: string[]) => void;
}

const CompanyContext = createContext<CompanyContextType>({
  selectedCompanyId: null,
  setSelectedCompanyId: () => {},
  availableCompanies: [],
  isSuperadmin: false,
  setAvailableCompanies: () => {},
});

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [availableCompanies, setAvailableCompanies] = useState<string[]>([]);
  const [isSuperadmin, setIsSuperadmin] = useState<boolean>(false);

  useEffect(() => {
    const savedCompanyId = localStorage.getItem("selectedCompanyId");
    const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");
    const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

    setIsSuperadmin(isSuperadmin);
    setAvailableCompanies(Object.keys(permissions));

    if (!isSuperadmin) {
      if (savedCompanyId && Object.keys(permissions).includes(savedCompanyId)) {
        setSelectedCompanyId(savedCompanyId);
      } else if (Object.keys(permissions).length > 0) {
        setSelectedCompanyId(Object.keys(permissions)[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      localStorage.setItem("selectedCompanyId", selectedCompanyId);
    }
  }, [selectedCompanyId]);

  return (
    <CompanyContext.Provider
      value={{
        selectedCompanyId,
        setSelectedCompanyId,
        availableCompanies,
        isSuperadmin,
        setAvailableCompanies,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);
export const queryClient = new QueryClient();
