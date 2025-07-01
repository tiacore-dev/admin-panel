import {
  fetchApps,
  IAppsResponse,
  ILegalEntityTypesResponse,
} from "../../api/baseApi";
import { fetchEntityTypes } from "../../api/baseApi";
import { useQuery } from "@tanstack/react-query";

export const useEntityTypes = () => {
  return useQuery<ILegalEntityTypesResponse>({
    queryKey: ["entityTypes"],
    queryFn: fetchEntityTypes,
  });
};

// // useBaseQuery.ts
// import { useQuery } from "@tanstack/react-query";
// import { fetchApps, IAppsResponse, IApp, ILegalEntityTypesResponse } from "../../api/baseApi";

// export const useEntityTypes = () => {
//   return useQuery<ILegalEntityTypesResponse>({
//     queryKey: ["entityTypes"],
//     queryFn: fetchEntityTypes,
//   });
// };

export const useAppsQuery = () => {
  return useQuery<IAppsResponse>({
    queryKey: ["apps"],
    queryFn: fetchApps,
    staleTime: Infinity, // Устанавливаем бесконечный срок устаревания, так как данные статичны
  });
};

// Новая функция для получения application_name по ID
export const useAppNameById = (application_id?: string) => {
  const { data: appsData } = useAppsQuery();

  if (!application_id) return null;

  const app = appsData?.applications.find(
    (app) => app.application_id === application_id
  );
  return app?.application_name || null;
};
