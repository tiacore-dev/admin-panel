// src/hooks/permissions/usePermissionsQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchPermissions,
  IPermissionsResponse,
} from "../../api/permissionsApi";

export const usePermissionsQuery = (application_id?: string) => {
  return useQuery<IPermissionsResponse>({
    queryKey: ["permissions", application_id],
    queryFn: () => fetchPermissions(application_id),
  });
};

export const useCombinedPermissionsQuery = (application_id?: string) => {
  const appPermissions = usePermissionsQuery(application_id);
  const allPermissions = usePermissionsQuery("all");

  return {
    data: {
      permissions: [
        ...(appPermissions.data?.permissions || []),
        ...(allPermissions.data?.permissions || []),
      ],
      total:
        (appPermissions.data?.total || 0) + (allPermissions.data?.total || 0),
    },
    isLoading: appPermissions.isLoading || allPermissions.isLoading,
    isError: appPermissions.isError || allPermissions.isError,
  };
};
