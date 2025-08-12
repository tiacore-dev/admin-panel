// src/hooks/companySubscriptions/useCompanySubscriptionsQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchCompanySubscriptions,
  fetchCompanySubscriptionById,
  type ICompanySubscriptionsResponse,
  type ICompanySubscription,
} from "../../api/companySubscriptionsApi";

export interface ICompanySubscriptionsQueryParams {
  company_id?: string;
  subscription_id?: string;
  page?: number;
  page_size?: number;
}

export const useCompanySubscriptionsQuery = (
  params?: ICompanySubscriptionsQueryParams
) => {
  return useQuery<ICompanySubscriptionsResponse>({
    queryKey: ["companySubscriptions", params],
    queryFn: () => fetchCompanySubscriptions(params),
  });
};

export const useCompanySubscriptionDetailsQuery = (
  company_subscription_id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ICompanySubscription>({
    queryKey: ["companySubscriptionDetails", company_subscription_id],
    queryFn: () => fetchCompanySubscriptionById(company_subscription_id),
    retry: false,
    enabled: options?.enabled ?? !!company_subscription_id,
    ...options,
  });
};

export const useCompanySubscriptionsByCompanyQuery = (company_id?: string) => {
  return useQuery<ICompanySubscriptionsResponse>({
    queryKey: ["companySubscriptionsByCompany", company_id],
    queryFn: () => fetchCompanySubscriptions({ company_id }),
    enabled: !!company_id,
    retry: false,
  });
};

export const useCompanySubscriptionsBySubscriptionQuery = (
  subscription_id?: string
) => {
  return useQuery<ICompanySubscriptionsResponse>({
    queryKey: ["companySubscriptionsBySubscription", subscription_id],
    queryFn: () => fetchCompanySubscriptions({ subscription_id }),
    enabled: !!subscription_id,
    retry: false,
  });
};
