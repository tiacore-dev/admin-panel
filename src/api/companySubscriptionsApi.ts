// src/api/companySubscriptionsApi.ts
import { axiosInstance } from "../axiosConfig";

export interface ICompanySubscription {
  company_subscription_id: string;
  company_id: string;
  subscription_id: string;
  user_id: string;
  modified_at: string;
  modified_by: string;
  created_at: string;
  created_by: string;
}

export interface ICompanySubscriptionsResponse {
  total: number;
  subscriptions: ICompanySubscription[];
}

export interface ICreateCompanySubscriptionRequest {
  company_id: string;
  subscription_id: string;
  user_id: string;
}

export interface IUpdateCompanySubscriptionRequest {
  company_id: string;
  subscription_id: string;
  user_id: string;
}

export const fetchCompanySubscriptions = async (params?: {
  company_id?: string;
  subscription_id?: string;
  page?: number;
  page_size?: number;
}) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const queryParams = {
    page: 1,
    page_size: 100,
    ...(params?.company_id && {
      company_id: params.company_id,
    }),
    ...(params?.subscription_id && { subscription_id: params.subscription_id }),
  };

  const response = await axiosInstance.get(
    `${url}/api/company-subscriptions/all`,
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

export const fetchCompanySubscriptionById = async (
  companySubscriptionId: string
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.get(
    `${url}/api/company-subscriptions/${companySubscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const createCompanySubscription = async (
  data: ICreateCompanySubscriptionRequest
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.post(
    `${url}/api/company-subscriptions/add`,
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

export const updateCompanySubscription = async (
  companySubscriptionId: string,
  data: IUpdateCompanySubscriptionRequest
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.patch(
    `${url}/api/company-subscriptions/${companySubscriptionId}`,
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

export const deleteCompanySubscription = async (
  companySubscriptionId: string
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.delete(
    `${url}/api/company-subscriptions/${companySubscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
