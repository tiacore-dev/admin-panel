// src/hooks/subscriptions/useSubscriptionsQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchSubscriptions,
  fetchSubscriptionById,
  type ISubscriptionsResponse,
  type ISubscription,
} from "../../api/subscriptionsApi";

export interface ISubscriptionsQueryParams {
  subscription_name?: string;
  description?: string;
  page?: number;
  page_size?: number;
}

export const useSubscriptionsQuery = (params?: ISubscriptionsQueryParams) => {
  return useQuery<ISubscriptionsResponse>({
    queryKey: ["subscriptions", params],
    queryFn: () => fetchSubscriptions(params),
  });
};

export const useSubscriptionDetailsQuery = (
  subscription_id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ISubscription>({
    queryKey: ["subscriptionDetails", subscription_id],
    queryFn: () => fetchSubscriptionById(subscription_id),
    retry: false,
    enabled: options?.enabled ?? !!subscription_id,
    ...options,
  });
};
