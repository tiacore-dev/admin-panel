import { useQuery } from "@tanstack/react-query";
import {
  fetchLegalEntities,
  fetchLegalEntityDetails,
  ILegalEntity,
  fetchLegalEntityByInnKpp,
  fetchSellers,
  fetchBuyers,
  ILegalEtitiesResponse,
  fetchLegalEntitiesByCompany,
  ILegalEntityINN,
} from "../../api/legalEntitiesApi";

// const fetchLegalEntityDetails = async (legal_entity_id: string)
export const useLegalEntityDetailsQuery = (
  legal_entity_id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ILegalEntity>({
    queryKey: ["legalEntityDetails", legal_entity_id],
    queryFn: () => {
      if (!legal_entity_id) {
        return Promise.resolve(null);
      }
      return fetchLegalEntityDetails(legal_entity_id);
    },
    retry: false,
    enabled: options?.enabled ?? !!legal_entity_id,
    ...options, // Распространяем остальные опции
  });
};
// export const fetchLegalEntities = async (  selectedCompanyId?: string | null)
export const useLegalEntityQuery = () => {
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntities"],
    queryFn: () => fetchLegalEntities(),
    retry: false,
  });
};
// export const fetchBuyers = async (selectedCompanyId?: string | null)
export const useLegalEntitiesBuyers = () => {
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntitiesBuyers"],
    queryFn: () => fetchBuyers(),
    retry: false,
  });
};
// export const fetchSellers = async (selectedCompanyId?: string | null)
export const useLegalEntitiesSellers = () => {
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntitiesSellers"],
    queryFn: () => fetchSellers(),
    retry: false,
  });
};
// export const fetchLegalEntitiesByCompany = async (selectedCompanyId?: string | null, company_id?: string)
export const useLegalEntitiesByCompany = (company_id?: string) => {
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntitiesByCompany", company_id],
    queryFn: () => fetchLegalEntitiesByCompany(company_id),
    retry: false,
  });
};
// export const fetchLegalEntityByInnKpp = async ( inn: string, kpp?: string)
export const useLegalEntityByInnKppQuery = (
  inn: string,
  kpp?: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ILegalEntityINN>({
    queryKey: ["legalEntityByInnKpp", inn, kpp],
    queryFn: () => fetchLegalEntityByInnKpp(inn, kpp),
    enabled: options?.enabled ?? !!inn, // Запрос выполняется только если inn указан или явно включен
    retry: false,
    ...options, // Распространяем остальные опции
  });
};

// export const useLegalEntityFiltredQuery = (company_id: string) => {
//   const { selectedCompanyId } = useCompany();
//   return useQuery<ILegalEntitiesResponse>({
//     queryKey: ["legalEntities", selectedCompanyId],
//     queryFn: () => fetchLegalEntitiesFiltred(company_id),
//     retry: false,
//   });
// };

// export const useLegalEntitiesForSelection = () => {
//   const { selectedCompanyId } = useCompany();

//   return useQuery<ILegalEntitiesResponse>({
//     queryKey: ["legalEntitiesForSelection", selectedCompanyId],
//     queryFn: () => fetchLegalEntities(selectedCompanyId),
//     retry: false,
//   });
// };
