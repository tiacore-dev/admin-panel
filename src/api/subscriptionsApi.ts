// src/api/subscriptionsApi.ts
import { axiosInstance } from "../axiosConfig";

export interface ISubscription {
  subscription_id: string;
  subscription_name: string;
  description?: string;
  price: number;
  comment?: string;
  application_id: string;

  created_at: string; //2025-08-11T22:21:23.809Z,
  created_by: string;
  modified_at: string; //2025-08-11T22:21:23.809Z,
  modified_by: string;
}

export interface ISubscriptionsResponse {
  total: number;
  subscriptions: ISubscription[];
}

export interface ICreateSubscriptionRequest {
  subscription_name: string;
  description?: string;
  price: number;
  comment?: string;
  application_id: string;
}

export interface IUpdateSubscriptionRequest {
  subscription_name?: string;
  description?: string;
  price?: number;
  comment?: string;
  application_id?: string;
}

export const fetchSubscriptions = async (params?: {
  page?: number;
  page_size?: number;
}) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const queryParams = {
    page: 1,
    page_size: 100,
  };

  const response = await axiosInstance.get(`${url}/api/subscriptions/all`, {
    params: queryParams,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const fetchSubscriptionById = async (subscriptionId: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.get(
    `${url}/api/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const createSubscription = async (data: ICreateSubscriptionRequest) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.post(
    `${url}/api/subscriptions/add`,
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

export const updateSubscription = async (
  subscriptionId: string,
  data: IUpdateSubscriptionRequest
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.patch(
    `${url}/api/subscriptions/${subscriptionId}`,
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

export const deleteSubscription = async (subscriptionId: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.delete(
    `${url}/api/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
