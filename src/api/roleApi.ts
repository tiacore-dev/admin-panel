// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";
// import { IUserCompanyRelationsResponse } from "../hooks/userCompanyRelations/useUserCompanyRelationsQuery";

export interface IRole {
  role_id: string;
  role_name: string;
}

// Функция для получения списка с параметрами
export const fetchRoles = async () => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/roles/all`, {
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

export const fetchRoleDetails = async (role_id: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/roles/${role_id}`, {
    params: {
      role_id,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Функция для создания нового
export const createRole = async (data: {
  role_name: string;
  permissions: string[];
}): Promise<IRole> => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(`${url}/api/roles/add-many`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

//изменить данные
export const updateRole = async (role_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/roles/${role_id}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//удалить данные

export const deleteRole = async (role_id: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(`${url}/api/roles/${role_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
