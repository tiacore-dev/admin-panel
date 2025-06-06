import { useQuery } from "@tanstack/react-query";
import { fetchRoleDetails, fetchRoles, IRole } from "../../api/roleApi";

export interface IRolesResponse {
  total: number;
  roles: IRole[];
}

export const useRolesQuery = () => {
  return useQuery<IRolesResponse>({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });
};

export const useRoleDetailsQuery = (role_id: string) => {
  return useQuery<IRole>({
    queryKey: ["roleDetails", role_id],
    queryFn: () => fetchRoleDetails(role_id),
  });
};
