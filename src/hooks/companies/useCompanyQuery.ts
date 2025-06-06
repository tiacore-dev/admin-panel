//companyUseQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchCompanies,
  fetchCompanyDetails,
  ICompany,
} from "../../api/companiesApi";
import { useCompany } from "../../context/companyContext";

export interface useCompanyQueryResponse {
  total: number;
  companies: ICompany[];
}
export interface ICompaniesResponse {
  total: number;
  companies: ICompany[];
}

export const useCompanyQuery = () => {
  const { selectedCompanyId } = useCompany();

  return useQuery<useCompanyQueryResponse>({
    queryKey: ["companies", selectedCompanyId],
    queryFn: () => fetchCompanies(selectedCompanyId),
  });
};

export const useCompanyDetailsQuery = (company_id: string) => {
  const { selectedCompanyId } = useCompany();
  return useQuery({
    queryKey: ["companyDetails", company_id, selectedCompanyId],
    queryFn: () => fetchCompanyDetails(company_id),
    retry: false,
  });
};

export const useCompaniesForSelection = () => {
  const { selectedCompanyId } = useCompany();
  return useQuery<ICompaniesResponse>({
    queryKey: ["companiesForSelection", selectedCompanyId], //??????
    queryFn: () => fetchCompanies(selectedCompanyId),
  });
};
