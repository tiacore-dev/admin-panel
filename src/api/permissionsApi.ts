// src/api/permissionsApi.ts
import { axiosInstance } from "../axiosConfig";

export interface IPermission {
  permission_id: string;
  permission_name: string;
  comment?: string;
}

export interface IPermissionsResponse {
  total: number;
  permissions: IPermission[];
}

export const fetchPermissions = async (application_id?: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const params: any = { page: 1, page_size: 300 };

  if (application_id) {
    params.comment = application_id;
  }

  const response = await axiosInstance.get(`${url}/api/permissions/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
