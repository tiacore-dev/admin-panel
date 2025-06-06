import { useQuery } from "@tanstack/react-query";
import { fetchPermissions, IPermission } from "../../api/permissionsApi";

export interface IPermissionsResponse {
  total: number;
  permissions: IPermission[];
}

export const usePermissionsQuery = () => {
  return useQuery<IPermissionsResponse>({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });
};
