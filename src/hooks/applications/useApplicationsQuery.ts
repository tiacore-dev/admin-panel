// src/hooks/applications/useApplicationsQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchApplications,
  type IApplicationsResponse,
} from "../../api/applicationsApi";

export interface IApplicationsQueryParams {
  application_name?: string;
  description?: string;
  page?: number;
  page_size?: number;
}

export const useApplicationsQuery = (params?: IApplicationsQueryParams) => {
  return useQuery<IApplicationsResponse>({
    queryKey: ["applications", params],
    queryFn: () => fetchApplications(params),
  });
};
