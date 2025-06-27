import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createLegalEntity,
  createLegalEntityINN,
  updateLegalEntity,
  deleteLegalEntity,
  type ILegalEntityCreate,
  type ILegalEntityINNCreate,
  type ILegalEntityEdit,
  type ILegalEntity,
} from "../../api/legalEntitiesApi";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export const useCreateLegalEntity = () => {
  const queryClient = useQueryClient();
  return useMutation<ILegalEntity, AxiosError, ILegalEntityCreate>({
    mutationFn: createLegalEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities"],
      });
      // Добавляем инвалидацию для entityCompanyRelations
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

export const useCreateLegalEntityByINN = () => {
  const queryClient = useQueryClient();
  return useMutation<ILegalEntity, AxiosError, ILegalEntityINNCreate>({
    mutationFn: createLegalEntityINN,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities"],
      });
      // Добавляем инвалидацию для entityCompanyRelations
      queryClient.invalidateQueries({
        queryKey: ["entityCompanyRelations"],
      });
      toast.success("Успешно создано по ИНН");
    },
    onError: (error) => {
      toast.error(`Ошибка при создании: ${error.message}`);
    },
  });
};

export const useUpdateLegalEntity = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ILegalEntity,
    AxiosError,
    { legal_entity_id: string; updatedData: ILegalEntityEdit }
  >({
    mutationFn: ({ legal_entity_id, updatedData }) =>
      updateLegalEntity(legal_entity_id, updatedData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["legalEntityDetails", variables.legal_entity_id],
      });
      toast.success("Успешно изменено");
    },
    onError: (error) => {
      toast.error(`Ошибка при редактировании: ${error.message}`);
    },
  });
};

export const useDeleteLegalEntity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteLegalEntity,
    onSuccess: (_, legal_entity_id) => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities"],
      });
      queryClient.invalidateQueries({
        queryKey: ["legalEntityDetails", legal_entity_id],
      });
      toast.success("Успешно удалено");
      navigate(-1);
    },
    onError: (error) => {
      toast.error(`Ошибка при удалении: ${error.message}`);
    },
  });
};
