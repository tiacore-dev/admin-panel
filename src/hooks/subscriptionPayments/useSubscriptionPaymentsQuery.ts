// src/hooks/subscriptionPayments/useSubscriptionPaymentsQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchSubscriptionPayments,
  fetchSubscriptionPaymentById,
  type ISubscriptionPaymentsResponse,
  type ISubscriptionPayment,
} from "../../api/subscriptionPaymentsApi";

export interface ISubscriptionPaymentsQueryParams {
  company_subscription_id?: string;
  payment_status?: string;
  page?: number;
  page_size?: number;
}

export const useSubscriptionPaymentsQuery = (
  params?: ISubscriptionPaymentsQueryParams
) => {
  return useQuery<ISubscriptionPaymentsResponse>({
    queryKey: ["subscriptionPayments", params],
    queryFn: () => fetchSubscriptionPayments(params),
  });
};

export const useSubscriptionPaymentDetailsQuery = (
  payment_id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ISubscriptionPayment>({
    queryKey: ["subscriptionPaymentDetails", payment_id],
    queryFn: () => fetchSubscriptionPaymentById(payment_id),
    retry: false,
    enabled: options?.enabled ?? !!payment_id,
    ...options,
  });
};

export const useSubscriptionPaymentsByCompanySubscriptionQuery = (
  company_subscription_id?: string
) => {
  return useQuery<ISubscriptionPaymentsResponse>({
    queryKey: [
      "subscriptionPaymentsByCompanySubscription",
      company_subscription_id,
    ],
    queryFn: () => fetchSubscriptionPayments({ company_subscription_id }),
    enabled: !!company_subscription_id,
    retry: false,
  });
};
