import { useQuery } from "@tanstack/react-query";
import {
  fetchLegalEntities,
  fetchLegalEntityDetails,
  ILegalEntity,
  fetchLegalEntityByInnKpp,
  IInnKppResponse,
  fetchSellers,
  fetchBuyers,
  fetchLegalEntitiesFiltred,
} from "../../api/legalEntitiesApi";
import { useCompany } from "../../context/companyContext";

export interface ILegalEntitiesResponse {
  total: number;
  entities: ILegalEntity[];
}

export const useLegalEntityByInnKppQuery = (
  inn: string,
  kpp: string | null = null
) => {
  return useQuery<IInnKppResponse>({
    queryKey: ["legalEntityByInnKpp", inn, kpp],
    queryFn: () => fetchLegalEntityByInnKpp(inn, kpp),
    enabled: !!inn, // Запрос выполняется только если inn указан
    retry: false,
  });
};

export const useLegalEntityQuery = () => {
  const { selectedCompanyId } = useCompany();
  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntities", selectedCompanyId],
    queryFn: () => fetchLegalEntities(selectedCompanyId),
    retry: false,
  });
};

export const useLegalEntityFiltredQuery = (company_id: string) => {
  const { selectedCompanyId } = useCompany();
  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntities", selectedCompanyId],
    queryFn: () => fetchLegalEntitiesFiltred(company_id),
    retry: false,
  });
};

export const useLegalEntityDetailsQuery = (legal_entity_id: string) => {
  const { selectedCompanyId } = useCompany();
  return useQuery({
    queryKey: ["legalEntityDetails", legal_entity_id, selectedCompanyId],
    queryFn: () => {
      if (!legal_entity_id) {
        return Promise.resolve(null); // Возвращаем null если ID пустой
      }
      return fetchLegalEntityDetails(legal_entity_id);
    },
    retry: false,
    enabled: !!legal_entity_id, // Запрос выполняется только если legal_entity_id указан
  });
};

export const useLegalEntitiesForSelection = () => {
  const { selectedCompanyId } = useCompany();

  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntitiesForSelection", selectedCompanyId],
    queryFn: () => fetchLegalEntities(selectedCompanyId),
    retry: false,
  });
};

export const useLegalEntitiesSellers = (companyId?: string) => {
  const { selectedCompanyId } = useCompany();
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  return useQuery<ILegalEntitiesResponse>({
    queryKey: [
      "legalEntitiesSellers",
      isSuperadmin ? companyId : selectedCompanyId,
    ],
    queryFn: () => fetchSellers(isSuperadmin ? companyId : selectedCompanyId),
    retry: false,
  });
};

export const useLegalEntitiesBuyers = () => {
  const { selectedCompanyId } = useCompany();

  return useQuery<ILegalEntitiesResponse>({
    queryKey: ["legalEntitiesBuyers", selectedCompanyId],
    queryFn: () => fetchBuyers(selectedCompanyId),
    retry: false,
  });
};
