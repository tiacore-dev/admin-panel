import { axiosInstance } from "../axiosConfig";
// import { ILegalEntityType } from "../pages/legalEntitiesPage/components/legalEntityCreateModal";
// import { IContractStatus } from "../pages/contractsPage/components/contractFormModal";
export interface ILegalEntityType {
  legal_entity_type_id: string;
  entity_name: string;
}
export interface ILegalEntityTypesResponse {
  total: number;
  legal_entity_types: ILegalEntityType[];
}

export interface IUserRole {
  role_id: string;
  role_name: string;
}
export interface IUserRolesResponse {
  total: number;
  user_roles: IUserRole[];
}

export interface IApp {
  application_id: string;
  application_name: string;
  description?: string;
  is_active: boolean;
}
export interface IAppsResponse {
  total: number;
  applications: IApp[];
}

// /api/legal-entity-types/all
export const fetchEntityTypes =
  async (): Promise<ILegalEntityTypesResponse> => {
    const url = process.env.REACT_APP_AUTH_API_URL;
    const accessToken = localStorage.getItem("access_token");
    const response = await axiosInstance.get(
      `${url}/api/legal-entity-types/all`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  };

export const fetchUserRoles = async (): Promise<IUserRolesResponse> => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/user-roles/all`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// Функция для получения списка с параметрами
export const fetchApps = async () => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/applications/all`, {
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
