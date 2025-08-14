// useAnalysesReport.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchAnalysesReport,
  IAnalysesReportResponse,
} from "../../api/analysisReportApi";

export interface IAnalysesReportQueryParams {
  company_id: string;
  date_to: string;
  date_from: string;
}

export const useAnalysesReportQuery = (params: IAnalysesReportQueryParams) => {
  return useQuery<IAnalysesReportResponse>({
    queryKey: ["analysesReport", params],
    queryFn: () => fetchAnalysesReport(params),
    enabled: false, // Отключаем автоматический запрос при монтировании
    retry: false,
  });
};
