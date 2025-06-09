// useEntityCompanyRelationMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEntityCompanyRelation,
  deleteEntityCompanyRelation,
  IEntityCompanyRelationCreate,
} from "../../api/entityCompanyRelationsApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useCompany } from "../../context/companyContext";

export const useEntityCompanyRelationMutations = () => {
  const queryClient = useQueryClient();
  const { selectedCompanyId } = useCompany();

  const createMutation = useMutation<
    IEntityCompanyRelationCreate,
    AxiosError,
    IEntityCompanyRelationCreate
  >({
    mutationFn: createEntityCompanyRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [undefined, selectedCompanyId, "seller"],
      });
      queryClient.invalidateQueries({
        queryKey: [undefined, selectedCompanyId, "buyer"],
      });
      toast.success("Успешно создано");
    },
    onError: (error) => {
      toast.error(`Ошибка при создании: ${error.message}`);
    },
  });

  const deleteMutation = useMutation<void, AxiosError, string>({
    mutationFn: deleteEntityCompanyRelation,
    onSuccess: (_, relation_id) => {
      queryClient.invalidateQueries({
        queryKey: [undefined, selectedCompanyId, "seller"],
      });
      queryClient.invalidateQueries({
        queryKey: [undefined, selectedCompanyId, "buyer"],
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

export const useCreateEntityCompanyRelation = () => {
  const queryClient = useQueryClient();
  const { selectedCompanyId } = useCompany();

  return useMutation<
    IEntityCompanyRelationCreate,
    AxiosError,
    IEntityCompanyRelationCreate
  >({
    mutationFn: createEntityCompanyRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [undefined, selectedCompanyId, "seller"],
      });
      queryClient.invalidateQueries({
        queryKey: [undefined, selectedCompanyId, "buyer"],
      });
      toast.success("Успешно создано");
    },
    onError: (error) => {
      toast.error(`Ошибка при создании: ${error.message}`);
    },
  });
};
