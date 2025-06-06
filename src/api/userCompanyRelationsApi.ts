// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import { IUserCompanyRelationsResponse } from "../hooks/userCompanyRelations/useUserCompanyRelationsQuery";

export interface IUserCompanyRelation {
  user_company_id: string;
  user_id: string;
  company_id: string;
  role_id: string;
}

// Функция для получения списка с параметрами
// Функция для получения списка с параметрами
export const fetchUserCompanyRelations = async (
  params: {
    user_id?: string;
    company_id?: string;
  },
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  interface RequestParams {
    page: number;
    page_size: number;
    user_id?: string;
    company_id?: string;
  }

  const requestParams: RequestParams = {
    page: 1,
    page_size: 100,
    ...params,
    ...(!isSuperadmin && selectedCompanyId
      ? { company_id: selectedCompanyId }
      : {}),
  };

  const response = await axiosInstance.get<IUserCompanyRelationsResponse>(
    `${url}/api/user-company-relations/all`,
    {
      params: requestParams, // Используем объединенные параметры
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Функция для создания нового
export const createUserCompanyRelation = async (
  newUserCompanyRelation: {
    user_id: string;
    company_id: string;
    role_id: string;
  },
  selectedCompanyId?: string | null
): Promise<IUserCompanyRelation> => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.post(
    `${url}/api/user-company-relations/add`,
    newUserCompanyRelation,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//изменить данные
export const updateUserCompanyRelation = async (
  user_company_id: string,
  updatedData: any,
  selectedCompanyId?: string | null
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  } else if (!isSuperadmin && !selectedCompanyId) {
    const selectedCompanyId = localStorage.getItem("selectedCompanyId");
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.patch(
    `${url}/api/user-company-relations/${user_company_id}`,
    updatedData,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

//удалить данные

export const deleteUserCompanyRelation = async (user_company_id: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  await axiosInstance.delete(
    `${url}/api/user-company-relations/${user_company_id}`,
    {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// Функция для проверки существующей связи
export const checkExistingRelation = async (params: {
  user_id: string;
  company_id: string;
}) => {
  const response = await fetchUserCompanyRelations(params);
  return response.total;
};
