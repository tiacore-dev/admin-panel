import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEntityCompanyRelation,
  deleteEntityCompanyRelation,
  IEntityCompanyRelationCreate,
} from "../../api/entityCompanyRelationsApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useEntityCompanyRelationMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation<
    IEntityCompanyRelationCreate,
    AxiosError,
    IEntityCompanyRelationCreate
  >({
    mutationFn: createEntityCompanyRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["entityCompanyRelations"],
      });
      toast.success("Успешно создано");
    },
    onError: (error) => {
      toast.error(`Ошибка при создании: ${error.message}`);
    },
  });

  const deleteMutation = useMutation<void, AxiosError, string>({
    mutationFn: deleteEntityCompanyRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["entityCompanyRelations"],
      });
      toast.success("Успешно удалено");
    },
    onError: (error) => {
      toast.error(`Ошибка при удалении: ${error.message}`);
    },
  });

  return {
    mutate: deleteMutation.mutate,
    createRelation: createMutation.mutate,
  };
};

// Добавляем отдельный хук для создания связи
export const useCreateEntityCompanyRelation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    IEntityCompanyRelationCreate,
    AxiosError,
    IEntityCompanyRelationCreate
  >({
    mutationFn: createEntityCompanyRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["entityCompanyRelations"],
      });
      toast.success("Успешно создано");
    },
    onError: (error) => {
      toast.error(`Ошибка при создании: ${error.message}`);
    },
  });
};
