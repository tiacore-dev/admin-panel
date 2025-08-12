// src/hooks/subscriptionDetails/useSubscriptionDetailsQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
  fetchSubscriptionDetails,
  fetchSubscriptionDetailById,
  type ISubscriptionDetailsResponse,
  type ISubscriptionDetail,
} from "../../api/subscriptionDetailsApi";

export interface ISubscriptionDetailsQueryParams {
  subscription_id?: string;
  feature_name?: string;
  page?: number;
  page_size?: number;
}

export const useSubscriptionDetailsQuery = (
  params?: ISubscriptionDetailsQueryParams
) => {
  return useQuery<ISubscriptionDetailsResponse>({
    queryKey: ["subscriptionDetails", params],
    queryFn: () => fetchSubscriptionDetails(params),
  });
};

export const useSubscriptionDetailByIdQuery = (
  detail_id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery<ISubscriptionDetail>({
    queryKey: ["subscriptionDetailById", detail_id],
    queryFn: () => fetchSubscriptionDetailById(detail_id),
    retry: false,
    enabled: options?.enabled ?? !!detail_id,
    ...options,
  });
};

export const useSubscriptionDetailsBySubscriptionQuery = (
  subscription_id?: string
) => {
  return useQuery<ISubscriptionDetailsResponse>({
    queryKey: ["subscriptionDetailsBySubscription", subscription_id],
    queryFn: () => fetchSubscriptionDetails({ subscription_id }),
    enabled: !!subscription_id,
    retry: false,
  });
};
