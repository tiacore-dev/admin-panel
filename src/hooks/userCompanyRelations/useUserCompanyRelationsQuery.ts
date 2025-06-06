import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchUserCompanyRelations,
  IUserCompanyRelation,
} from "../../api/userCompanyRelationsApi";
import { useCompany } from "../../context/companyContext";

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
  const { selectedCompanyId } = useCompany();

  return useQuery<IUserCompanyRelationsResponse>({
    queryKey: ["userRelations", userId, selectedCompanyId],
    queryFn: () =>
      fetchUserCompanyRelations({
        user_id: userId,
        company_id: selectedCompanyId || undefined,
      }),
    enabled: !!userId,
    ...options,
  });
};

export const useCompanyRelationsQuery = (
  companyId?: string,
  options?: UseQueryOptions<IUserCompanyRelationsResponse>
) => {
  const { selectedCompanyId } = useCompany();

  return useQuery<IUserCompanyRelationsResponse>({
    queryKey: ["companyRelations", companyId, selectedCompanyId],
    queryFn: () =>
      fetchUserCompanyRelations({ company_id: companyId }, selectedCompanyId),
    enabled: !!companyId,
    ...options,
  });
};
