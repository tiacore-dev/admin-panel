// src/hooks/subscriptionDetails/useSubscriptionDetailsMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubscriptionDetail,
  updateSubscriptionDetail,
  deleteSubscriptionDetail,
} from "../../api/subscriptionDetailsApi";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useSubscriptionDetailsMutations = (
  detail_id?: string,
  setIsEditing?: (val: boolean) => void,
  subscription_id?: string
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSubscriptionDetail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionDetails"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionDetailsBySubscription", data.subscription_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
      toast.success("Деталь подписки создана");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при создании детали подписки: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (!detail_id) {
        return Promise.reject(new Error("ID детали подписки не указан"));
      }
      return updateSubscriptionDetail(detail_id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionDetails"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionDetailById", detail_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionDetailsBySubscription", subscription_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
      setIsEditing && setIsEditing(false);
      toast.success("Деталь подписки обновлена");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при обновлении детали подписки: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (detail_id: string) => deleteSubscriptionDetail(detail_id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionDetails"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionDetailsBySubscription", subscription_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptions"],
      });
      toast.success("Деталь подписки удалена");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при удалении детали подписки: ${error.message}`);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
