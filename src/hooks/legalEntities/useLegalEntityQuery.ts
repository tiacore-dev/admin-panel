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
import { useCompany } from "../../context/companyContext";

// const fetchLegalEntityDetails = async (legal_entity_id: string)
export const useLegalEntityDetailsQuery = (
  legal_entity_id: string,
  options?: { enabled?: boolean }
) => {
  const { selectedCompanyId } = useCompany();
  return useQuery<ILegalEntity>({
    queryKey: ["legalEntityDetails", legal_entity_id, selectedCompanyId],
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
  const { selectedCompanyId } = useCompany();
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntities", selectedCompanyId],
    queryFn: () => fetchLegalEntities(selectedCompanyId),
    retry: false,
  });
};
// export const fetchBuyers = async (selectedCompanyId?: string | null)
export const useLegalEntitiesBuyers = () => {
  const { selectedCompanyId } = useCompany();
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntitiesBuyers", selectedCompanyId],
    queryFn: () => fetchBuyers(selectedCompanyId),
    retry: false,
  });
};
// export const fetchSellers = async (selectedCompanyId?: string | null)
export const useLegalEntitiesSellers = () => {
  const { selectedCompanyId } = useCompany();
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntitiesSellers", selectedCompanyId],
    queryFn: () => fetchSellers(selectedCompanyId),
    retry: false,
  });
};
// export const fetchLegalEntitiesByCompany = async (selectedCompanyId?: string | null, company_id?: string)
export const useLegalEntitiesByCompany = (company_id?: string) => {
  const { selectedCompanyId } = useCompany();
  return useQuery<ILegalEtitiesResponse>({
    queryKey: ["legalEntitiesByCompany", selectedCompanyId, company_id],
    queryFn: () => fetchLegalEntitiesByCompany(selectedCompanyId, company_id),
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
