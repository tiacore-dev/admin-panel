// src/hooks/subscriptionPayments/useSubscriptionPaymentsMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubscriptionPayment,
  updateSubscriptionPayment,
  deleteSubscriptionPayment,
} from "../../api/subscriptionPaymentsApi";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useSubscriptionPaymentsMutations = (
  subscription_payment_id?: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createSubscriptionPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptionPayments"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "subscriptionPayments",
          {
            company_subscription_id: data.company_subscription_id,
          },
        ],
      });
      toast.success("Платеж подписки создан");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при создании платежа подписки: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      subscription_payment_id: string;
      payment_amount: number;
      payment_date: string;
      date_from: string;
      date_to: string;
    }) => {
      if (!data.subscription_payment_id) {
        return Promise.reject(new Error("ID платежа подписки не указан"));
      }
      return updateSubscriptionPayment(data.subscription_payment_id, {
        payment_amount: data.payment_amount,
        payment_date: data.payment_date,
        date_from: data.date_from,
        date_to: data.date_to,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptionPayments"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "subscriptionPayments",
          {
            company_subscription_id: data.company_subscription_id,
          },
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["subscriptionPaymentDetails", subscription_payment_id],
      });
      setIsEditing && setIsEditing(false);
      toast.success("Платеж подписки обновлен");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при обновлении платежа подписки: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (subscription_payment_id: string) =>
      deleteSubscriptionPayment(subscription_payment_id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptionPayments"],
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "subscriptionPayments",
          {
            company_subscription_id: data.company_subscription_id,
          },
        ],
      });
      toast.success("Платеж подписки удален");
    },
    onError: (error: AxiosError) => {
      toast.error(`Ошибка при удалении платежа подписки: ${error.message}`);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
