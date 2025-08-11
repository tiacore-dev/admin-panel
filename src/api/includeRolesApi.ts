// src/api/includeRolesApi.ts
import { axiosInstance } from "../axiosConfig";

export interface IRoleIncludeRelation {
  role_include_relation_id: string;
  parent_role_id: string;
  child_role_id: string;
  created_at: string;
}

export interface IRoleIncludeRelationCreate {
  parent_role_id: string;
  child_role_id: string;
}

export interface IRoleIncludeRelationEdit {
  parent_role_id?: string;
  child_role_id?: string;
}

export interface IRoleIncludeRelationsResponse {
  total: number;
  relations: IRoleIncludeRelation[];
}

// Получение списка связей включения ролей
export const fetchRoleIncludeRelations = async (params?: {
  parent_role_id?: string;
  child_role_id?: string;
  page?: number;
  page_size?: number;
}) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const queryParams = {
    page: params?.page || 1,
    page_size: params?.page_size || 100,
    ...(params?.parent_role_id && { parent_role_id: params.parent_role_id }),
    ...(params?.child_role_id && { child_role_id: params.child_role_id }),
  };

  const response = await axiosInstance.get(`${url}/api/include-roles/all`, {
    params: queryParams,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Получение одной связи
export const fetchRoleIncludeRelation = async (
  role_include_relation_id: string
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.get(
    `${url}/api/include-roles/${role_include_relation_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Создание новой связи
export const createRoleIncludeRelation = async (
  data: IRoleIncludeRelationCreate
): Promise<{ role_include_relation_id: string }> => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.post(
    `${url}/api/include-roles/add`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Изменение связи
export const updateRoleIncludeRelation = async (
  role_include_relation_id: string,
  data: IRoleIncludeRelationEdit
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.patch(
    `${url}/api/include-roles/${role_include_relation_id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Удаление связи
export const deleteRoleIncludeRelation = async (
  role_include_relation_id: string
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  await axiosInstance.delete(
    `${url}/api/include-roles/${role_include_relation_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};
