import { useQuery } from "@tanstack/react-query";
import {
  fetchRolePermissions,
  IRolePermission,
} from "../../api/rolePermissionsRelationsApi";

export interface IRolePermissionsResponse {
  total: number;
  relations: IRolePermission[];
}

export interface IRolePermissionsQueryParams {
  role_id?: string;
  page?: number;
  page_size?: number;
}

export const useRolePermissionsQuery = (
  params?: IRolePermissionsQueryParams
) => {
  return useQuery<IRolePermissionsResponse>({
    queryKey: ["rolePermissionRelations", params],
    queryFn: () => fetchRolePermissions(params), // Передаем параметры в fetchBankAccounts
  });
};
