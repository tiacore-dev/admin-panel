// contexts/PermissionsContext.tsx
import React, { createContext, useMemo, useContext } from "react";
import { useCompany } from "./companyContext";

interface PermissionsContextType {
  isSuperAdmin: boolean;
  permissions: Set<string>;
  hasPermission: (permission: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType>({
  isSuperAdmin: false,
  permissions: new Set(),
  hasPermission: () => false,
});

export const PermissionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { selectedCompanyId } = useCompany();

  const { isSuperAdmin, permissions } = useMemo(() => {
    const isSuperAdmin = localStorage.getItem("is_superadmin") === "true";
    const permissionsStr = localStorage.getItem("permissions");

    let permissions = new Set<string>();

    if (!isSuperAdmin && selectedCompanyId && permissionsStr) {
      try {
        const allPermissions = JSON.parse(permissionsStr);
        const companyPermissions = allPermissions[selectedCompanyId] || [];
        permissions = new Set(companyPermissions);
      } catch (e) {
        console.error("Error parsing permissions", e);
      }
    }

    return { isSuperAdmin, permissions };
  }, [selectedCompanyId]); // Теперь зависит от selectedCompanyId

  const hasPermission = (permission: string) => {
    return isSuperAdmin || permissions.has(permission);
  };

  return (
    <PermissionsContext.Provider
      value={{ isSuperAdmin, permissions, hasPermission }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
