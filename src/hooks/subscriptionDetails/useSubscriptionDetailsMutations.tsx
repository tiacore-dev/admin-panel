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
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSubscriptionDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionDetails"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionDetails"] });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionDetailById", detail_id],
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionDetails"] });
      toast.success("Деталь подписки удалена");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при удалении детали подписки: ${error.message}`);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
