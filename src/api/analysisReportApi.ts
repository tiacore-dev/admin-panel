// analysisReportApi.ts
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface IAnalysis {
  schedule_name: string;
  prompt_name: string;
  date: string;
  tokens_input: number;
  tokens_output: number;
}

export interface IAnalysesReportResponse {
  total_tokens_input: number;
  total_tokens_output: number;
  analyses: IAnalysis[];
}

export const fetchAnalysesReport = async (params: {
  company_id: string;
  date_to: string;
  date_from: string;
}): Promise<IAnalysesReportResponse> => {
  try {
    const url = process.env.REACT_APP_OBSERVER_API_URL;
    const accessToken = localStorage.getItem("access_token");

    const response = await axiosInstance.get(`${url}/api/analysis/report`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      toast.error("Ошибка при загрузке отчета");
    } else {
      toast.error("Неизвестная ошибка");
    }
    throw error;
  }
};
