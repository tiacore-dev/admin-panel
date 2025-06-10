import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchUserCompanyRelations,
  IUserCompanyRelation,
} from "../../api/userCompanyRelationsApi";

export interface IUserCompanyRelationsQueryParams {
  user_id?: string;
  company?: string;
}

export interface IUserCompanyRelationsResponse {
  total: number;
  relations: IUserCompanyRelation[];
}

export const useUserRelationsQuery = (
  userId?: string,
  options?: UseQueryOptions<IUserCompanyRelationsResponse>
) => {
  return useQuery<IUserCompanyRelationsResponse>({
    queryKey: ["userRelations", userId],
    queryFn: () =>
      fetchUserCompanyRelations({
        user_id: userId,
      }),
    enabled: !!userId,
    ...options,
  });
};

export const useCompanyRelationsQuery = (
  companyId?: string,
  options?: UseQueryOptions<IUserCompanyRelationsResponse>
) => {
  return useQuery<IUserCompanyRelationsResponse>({
    queryKey: ["companyRelations", companyId],
    queryFn: () => fetchUserCompanyRelations({ company_id: companyId }),
    enabled: !!companyId,
    ...options,
  });
};
