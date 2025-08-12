// src/api/subscriptionDetailsApi.ts
import { axiosInstance } from "../axiosConfig";

export interface ISubscriptionDetail {
  entity_name: string;
  subscription_id: string;
  bd_table: string;
  restriction: number;
  description?: string;
  comment?: string;

  subscription_detail_id: string;
  created_at: string; //2025-08-11T22:19:04.504Z,
  created_by: string;
  modified_at: string; //2025-08-11T22:19:04.504Z,
  modified_by: string;
}

export interface ISubscriptionDetailsResponse {
  total: number;
  details: ISubscriptionDetail[];
}

export interface ICreateSubscriptionDetailRequest {
  entity_name: string;
  subscription_id: string;
  bd_table: string;
  restriction: number;
  description?: string;
  comment?: string;
}

export interface IUpdateSubscriptionDetailRequest {
  subscription_id?: string;
  entity_name?: string;
  bd_table?: string;
  restriction?: number;
  description?: string;
  comment?: string;
}

export const fetchSubscriptionDetails = async (params?: {
  subscription_id?: string;
  page?: number;
  page_size?: number;
}) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const queryParams = {
    page: 1,
    page_size: 100,
    ...(params?.subscription_id && {
      subscription_id: params.subscription_id,
    }),
  };

  const response = await axiosInstance.get(
    `${url}/api/subscription-details/all`,
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

export const fetchSubscriptionDetailById = async (detailId: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.get(
    `${url}/api/subscription-details/${detailId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const createSubscriptionDetail = async (
  data: ICreateSubscriptionDetailRequest
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.post(
    `${url}/api/subscription-details/add`,
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

export const updateSubscriptionDetail = async (
  detailId: string,
  data: IUpdateSubscriptionDetailRequest
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.patch(
    `${url}/api/subscription-details/${detailId}`,
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

export const deleteSubscriptionDetail = async (detailId: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.delete(
    `${url}/api/subscription-details/${detailId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
