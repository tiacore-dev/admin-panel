// src/hooks/companySubscriptions/useCompanySubscriptionsMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompanySubscription,
  updateCompanySubscription,
  deleteCompanySubscription,
} from "../../api/companySubscriptionsApi";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useCompanySubscriptionsMutations = (
  company_subscription_id?: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createCompanySubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["companySubscriptions"],
        refetchType: "active",
      });
      toast.success("Подписка компании создана");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при создании подписки компании: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (!company_subscription_id) {
        return Promise.reject(new Error("ID подписки компании не указан"));
      }
      return updateCompanySubscription(company_subscription_id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["companySubscriptions"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: ["companySubscriptionDetails", company_subscription_id],
      });
      setIsEditing && setIsEditing(false);
      toast.success("Подписка компании обновлена");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при обновлении подписки компании: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (company_subscription_id: string) =>
      deleteCompanySubscription(company_subscription_id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["companySubscriptions"],
        refetchType: "active",
      });
      toast.success("Подписка компании удалена");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при удалении подписки компании: ${error.message}`);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
