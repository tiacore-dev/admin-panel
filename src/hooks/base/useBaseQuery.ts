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

export const useAppsQuery = () => {
  return useQuery<IAppsResponse>({
    queryKey: ["apps"],
    queryFn: fetchApps,
  });
};
