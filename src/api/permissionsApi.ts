// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";

export interface IPermission {
  permission_id: string;
  permission_name: string;
  comment?: string;
}

// export interface IPermission {
//   permission_id: string;
//   permission_name: string;
// }

// Функция для получения списка с параметрами
export const fetchPermissions = async () => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.get(`${url}/api/permissions/all`, {
    params: {
      page: 1,
      page_size: 300,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

// Функция для создания нового
// export const createPermission = async (newPermission: {
//   permission_id: string;
//   permission_name: string;
//   comment?: string;
// }): Promise<IPermission> => {
//   const url = process.env.REACT_APP_AUTH_API_URL;
//   const accessToken = localStorage.getItem("access_token");
//   const response = await axiosInstance.post(
//     `${url}/api/permissions/add`,
//     newPermission,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   return response.data;
// };

// //изменить данные
// export const updatePermission = async (
//   permission_id: string,
//   updatedData: any
// ) => {
//   const url = process.env.REACT_APP_AUTH_API_URL;
//   const accessToken = localStorage.getItem("access_token");
//   const response = await axiosInstance.patch(
//     `${url}/api/permissions/${permission_id}`,
//     updatedData,
//     {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );
//   return response.data;
// };

// //удалить данные

// export const deletePermission = async (permission_id: string) => {
//   const url = process.env.REACT_APP_AUTH_API_URL;
//   const accessToken = localStorage.getItem("access_token");

//   await axiosInstance.delete(`${url}/api/permissions/${permission_id}`, {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//   });
// };
