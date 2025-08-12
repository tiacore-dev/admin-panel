// src/api/subscriptionPaymentsApi.ts
import { axiosInstance } from "../axiosConfig";

export interface ISubscriptionPayment {
  payment_id: string;
  company_subscription_id: string;
  payment_amount: number;
  payment_date: string;
  date_from: string;
  date_to: string;
  subscription_payment_id: string;
  created_at: string;
  payment_external_id?: string;
  modified_by: string;
  modified_at: string;
  created_by: string;
}

export interface ISubscriptionPaymentsResponse {
  total: number;
  payments: ISubscriptionPayment[];
}

export interface ICreateSubscriptionPaymentRequest {
  company_subscription_id: string;
  payment_amount: number;
  payment_date: string;
  payment_external_id?: string;
  date_from: string;
  date_to: string;
}

export interface IUpdateSubscriptionPaymentRequest {
  payment_amount?: number;
  payment_date?: string;
  company_subscription_id?: string;
  payment_external_id?: string;
  date_from?: string;
  date_to?: string;
}

export const fetchSubscriptionPayments = async (params?: {
  company_subscription_id?: string;
  page?: number;
  page_size?: number;
}) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const queryParams = {
    page: 1,
    page_size: 100,
    ...(params?.company_subscription_id && {
      company_subscription_id: params.company_subscription_id,
    }),
  };

  const response = await axiosInstance.get(
    `${url}/api/subscription-payments/all`,
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

export const fetchSubscriptionPaymentById = async (paymentId: string) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.get(
    `${url}/api/subscription-payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const createSubscriptionPayment = async (
  data: ICreateSubscriptionPaymentRequest
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.post(
    `${url}/api/subscription-payments/add`,
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

export const updateSubscriptionPayment = async (
  paymentId: string,
  data: IUpdateSubscriptionPaymentRequest
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.patch(
    `${url}/api/subscription-payments/${paymentId}`,
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

export const deleteSubscriptionPayment = async (
  subscription_payment_id: string
) => {
  const url = process.env.REACT_APP_AUTH_API_URL;
  const accessToken = localStorage.getItem("access_token");

  const response = await axiosInstance.delete(
    `${url}/api/subscription-payments/${subscription_payment_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
