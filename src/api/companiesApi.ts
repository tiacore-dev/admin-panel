// src/api/companiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface ICompany {
  company_id: string;
  company_name: string;
  description?: string;
  application_id: string;
}

export const fetchCompanies = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }

  const response = await axiosInstance.get(`${url}/api/companies/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const createCompany = async (newCompany: {
  company_name: string;
  description?: string;
  application_id: string;
}): Promise<ICompany> => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.post(
    `${url}/api/companies/add`,
    newCompany,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const fetchCompanyDetails = async (company_id: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  try {
    const response = await axiosInstance.get(
      `${url}/api/companies/${company_id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      toast.error("Ошибка при загрузке страницы");
    } else {
      toast.error("Неизвестная ошибка");
    }
    throw error;
  }
};

export const updateCompany = async (company_id: string, updatedData: any) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const response = await axiosInstance.patch(
    `${url}/api/companies/${company_id}`,
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

export const deleteCompany = async (company_id: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");
  await axiosInstance.delete(`${url}/api/companies/${company_id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
