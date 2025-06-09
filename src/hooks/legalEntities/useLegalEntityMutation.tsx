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
import { useCompany } from "../../context/companyContext";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";

export const useCreateLegalEntity = () => {
  const queryClient = useQueryClient();
  const { selectedCompanyId } = useCompany();
  return useMutation<ILegalEntity, AxiosError, ILegalEntityCreate>({
    mutationFn: createLegalEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities", selectedCompanyId],
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
  const { selectedCompanyId } = useCompany();
  return useMutation<ILegalEntity, AxiosError, ILegalEntityINNCreate>({
    mutationFn: createLegalEntityINN,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities", selectedCompanyId],
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
  const { selectedCompanyId } = useCompany();
  return useMutation<
    ILegalEntity,
    AxiosError,
    { legal_entity_id: string; updatedData: ILegalEntityEdit }
  >({
    mutationFn: ({ legal_entity_id, updatedData }) =>
      updateLegalEntity(legal_entity_id, updatedData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities", selectedCompanyId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "legalEntityDetails",
          variables.legal_entity_id,
          selectedCompanyId,
        ],
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
  const { selectedCompanyId } = useCompany();
  return useMutation<void, AxiosError, string>({
    mutationFn: deleteLegalEntity,
    onSuccess: (_, legal_entity_id) => {
      queryClient.invalidateQueries({
        queryKey: ["legalEntities", selectedCompanyId],
      });
      queryClient.invalidateQueries({
        queryKey: ["legalEntityDetails", legal_entity_id, selectedCompanyId],
      });
      toast.success("Успешно удалено");
    },
    onError: (error) => {
      toast.error(`Ошибка при удалении: ${error.message}`);
    },
  });
};
