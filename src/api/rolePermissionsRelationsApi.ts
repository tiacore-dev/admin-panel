// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";

export interface IRolePermission {
  role_permission_id: string;
  role_id: string;
  permission_id: string;
  restriction_id?: string;
  application_id?: string;
}

// Функция для получения списка с параметрами
export const fetchRolePermissions = async (params?: {
  role_id?: string;
  page?: number;
  page_size?: number;
}) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const queryParams = {
    page: params?.page || 1,
    page_size: params?.page_size || 100,
    ...(params?.role_id && { role_id: params.role_id }), // Добавляем legal_entity только если он передан
  };

  const response = await axiosInstance.get(
    `${url}/api/role-permission-relations/all`,
    {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Функция для создания нового
export const createRolePermission = async (newRolePermission: {
  role_id: string;
  permission_id: string;
  restriction_id?: string;
}): Promise<IRolePermission> => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/role-permission-relations/add`,
    newRolePermission,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//изменить данные
export const updateRolePermission = async (
  role_permission_id: string,
  updatedData: any
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/role-permission-relations/${role_permission_id}`,
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

export const deleteRolePermission = async (role_permission_id: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(
    `${url}/api/role-permission-relations/${role_permission_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
