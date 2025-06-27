// src/api/legalEntitiesApi.tsx
import { axiosInstance } from "../axiosConfig";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export interface ILegalEntityCreate {
  full_name?: string;
  short_name: string; //[3, 100] characters
  inn: string; //[10, 12] characters
  kpp?: string; // Expand all( string | null)
  opf?: string; // Expand all( string | null)
  ogrn: string; //13 characters
  vat_rate?: number; // Expand all(integer | null)
  address: string; //[5, 255] characters
  entity_type_id?: string; // Expand all( string | null)
  signer?: string; // Expand all( string | null)
  company_id: string; // Expand all stringuuid4
  relation_type: string; // Expand all string
}

export interface ILegalEntityINNCreate {
  inn: string; //[10, 12] characters
  kpp?: string; // Expand all(string | null)
  company_id: string; // Expand allstringuuid4
  relation_type: string; // Expand allstring
}
export interface ILegalEntityEdit {
  full_name?: string;
  short_name?: string; //[3, 100] characters
  inn?: string; //[10, 12] characters
  kpp?: string; // Expand all( string | null)
  opf?: string; // Expand all( string | null)
  ogrn?: string; //13 characters
  vat_rate?: number; // Expand all(integer | null) (0/5/7/20)
  address?: string; //[5, 255] characters
  entity_type_id?: string; // Expand all( string | null)
  signer?: string; // Expand all( string | null)
}
export interface ILegalEntity {
  legal_entity_id: string;
  full_name?: string;
  short_name: string; //[3, 100] characters
  inn: string; //[10, 12] characters
  kpp?: string; // Expand all( string | null)
  opf?: string; // Expand all( string | null)
  ogrn: string; //13 characters
  vat_rate?: number; // Expand all(integer | null) (0/5/7/20)
  address: string; //[5, 255] characters
  entity_type_id?: string; // Expand all( string | null)
  signer?: string; // Expand all( string | null)
}
export interface ILegalEntityINN {
  legal_entity_id: string;
  legal_entity_name?: string;
}

export interface ILegalEtitiesResponse {
  total: number;
  entities: ILegalEntity[];
}

export const createLegalEntity = async (
  newLegalEntity: ILegalEntityCreate
): Promise<ILegalEntity> => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.post(
    `${url}/api/legal-entities/add`,
    newLegalEntity,
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
// /api/legal-entities/add-by-inn
export const createLegalEntityINN = async (
  newLegalEntity: ILegalEntityINNCreate
): Promise<ILegalEntity> => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.post(
    `${url}/api/legal-entities/add-by-inn`,
    newLegalEntity,
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
// /api/legal-entities/{legal_entity_id}
export const updateLegalEntity = async (
  legal_entity_id: string,
  updatedData: ILegalEntityEdit
) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");

  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.patch(
    `${url}/api/legal-entities/${legal_entity_id}`,
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
// /api/legal-entities/{legal_entity_id}
export const deleteLegalEntity = async (legal_entity_id: string) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  await axiosInstance.delete(`${url}/api/legal-entities/${legal_entity_id}`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
// /api/legal-entities/{legal_entity_id}
export const fetchLegalEntityDetails = async (legal_entity_id: string) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = {};
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  try {
    const response = await axiosInstance.get(
      `${url}/api/legal-entities/${legal_entity_id}`,
      {
        params,
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
      // toast.error("Ошибка при загрузке страницы");
    } else {
      toast.error("Неизвестная ошибка");
    }
    throw error;
  }
};
// /api/legal-entities/all
export const fetchLegalEntities = async (
  selectedCompanyId?: string | null
  // company_id?: string
) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  // if (company_id) {
  //   params.company_id = company_id;
  // }
  const response = await axiosInstance.get(`${url}/api/legal-entities/all`, {
    params,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
// /api/legal-entities/get-buyers

export const fetchBuyers = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  const response = await axiosInstance.get(
    `${url}/api/legal-entities/get-buyers`,
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
// /api/legal-entities/get-sellers
export const fetchSellers = async (selectedCompanyId?: string | null) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = { page: 1, page_size: 100 };
  // if (!isSuperadmin && selectedCompanyId) {
  params.company = selectedCompanyId;
  // }
  const response = await axiosInstance.get(
    `${url}/api/legal-entities/get-sellers`,
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
// /api/legal-entities/get-by-company
export const fetchLegalEntitiesByCompany = async (
  selectedCompanyId?: string | null,
  company_id?: string
) => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: any = { page: 1, page_size: 100 };
  if (!isSuperadmin && selectedCompanyId) {
    params.company = selectedCompanyId;
  }
  if (company_id) {
    params.company_id = company_id;
  }
  const response = await axiosInstance.get(
    `${url}/api/legal-entities/get-by-company`,
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
// /api/legal-entities/inn-kpp
export const fetchLegalEntityByInnKpp = async (
  inn: string,
  kpp?: string
): Promise<ILegalEntityINN> => {
  const url = process.env.REACT_APP_REFERENCE_API_URL;
  const accessToken = localStorage.getItem("access_token");
  // const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  // const selectedCompanyId = localStorage.getItem("selectedCompanyId");
  const params: {
    inn: string;
    kpp?: string;
  } = { inn };
  if (kpp) {
    params.kpp = kpp;
  }
  const response = await axiosInstance.get(
    `${url}/api/legal-entities/inn-kpp`,
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
