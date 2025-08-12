// src/hooks/subscriptions/useSubscriptionsMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "../../api/subscriptionsApi";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useSubscriptionsMutations = (
  subscription_id?: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Подписка создана");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при создании подписки: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (!subscription_id) {
        return Promise.reject(new Error("ID подписки не указан"));
      }
      return updateSubscription(subscription_id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionDetails", { subscription_id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionDetailsBySubscription", subscription_id],
      });
      setIsEditing && setIsEditing(false);
      toast.success("Подписка обновлена");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при обновлении подписки: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (subscription_id: string) =>
      deleteSubscription(subscription_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionDetailsBySubscription", subscription_id],
      });
      toast.success("Подписка удалена");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при удалении подписки: ${error.message}`);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
