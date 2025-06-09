// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";

export interface IRestriction {
  restriction_id: string;
  restriction_name: string;
  comment?: string;
}

// Функция для получения списка с параметрами
export const fetchRestrictions = async () => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/restrictions/all`, {
    params: {
      page: 1,
      page_size: 100,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Функция для создания нового
