import { useQuery } from "@tanstack/react-query";
import { fetchRoleDetails, fetchRoles, IRole } from "../../api/roleApi";

export interface IRolesResponse {
  total: number;
  roles: IRole[];
}

export const useRolesQuery = (application_id?: string) => {
  return useQuery<IRolesResponse>({
    queryKey: ["roles"],
    queryFn: () => fetchRoles(application_id),
  });
};

export const useRoleDetailsQuery = (role_id: string) => {
  return useQuery<IRole>({
    queryKey: ["roleDetails", role_id],
    queryFn: () => fetchRoleDetails(role_id),
  });
};
