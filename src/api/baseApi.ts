import { axiosInstance } from "../axiosConfig";
// import { ILegalEntityType } from "../pages/legalEntitiesPage/components/legalEntityCreateModal";
// import { IContractStatus } from "../pages/contractsPage/components/contractFormModal";
export interface ILegalEntityTypesResponse {
  total: number;
  legal_entity_types: ILegalEntityType[];
}

export interface IUserRolesResponse {
  total: number;
  user_roles: IUserRole[];
}
export interface IUserRole {
  role_id: string;
  role_name: string;
}

export interface ILegalEntityType {
  legal_entity_type_id: string;
  entity_name: string;
}

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
