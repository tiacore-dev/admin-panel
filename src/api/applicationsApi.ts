// src/api/applicationsApi.ts
import { axiosInstance } from "../axiosConfig";

export interface IApplication {
  application_id: string;
  application_name: string;
  description?: string;
  is_active: boolean;
}

export interface IApplicationsResponse {
  total: number;
  applications: IApplication[];
}

export const fetchApplications = async (params?: {
  application_name?: string;
  description?: string;
  page?: number;
  page_size?: number;
}) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const queryParams = {
    page: params?.page || 1,
    page_size: params?.page_size || 100,
    ...(params?.application_name && {
      application_name: params.application_name,
    }),
    ...(params?.description && { description: params.description }),
  };

  const response = await axiosInstance.get(`${url}/api/applications/all`, {
    params: queryParams,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
