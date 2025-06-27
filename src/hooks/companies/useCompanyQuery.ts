//companyUseQuery.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  fetchCompanies,
  fetchCompanyDetails,
  ICompany,
} from "../../api/companiesApi";

export interface useCompanyQueryResponse {
  total: number;
  companies: ICompany[];
}
export interface ICompaniesResponse {
  total: number;
  companies: ICompany[];
}

export const useCompanyQuery = () => {
  return useQuery<useCompanyQueryResponse>({
    queryKey: ["companies"],
    queryFn: () => fetchCompanies(),
  });
};

export const useCompanyDetailsQuery = (
  company_id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ICompany>({
    queryKey: ["companyDetails", company_id],
    queryFn: () => fetchCompanyDetails(company_id),
    retry: false,
    ...options, // Распространяем переданные options
  });
};

export const useCompaniesForSelection = () => {
  return useQuery<ICompaniesResponse>({
    queryKey: ["companiesForSelection"], //??????
    queryFn: () => fetchCompanies(),
  });
};
