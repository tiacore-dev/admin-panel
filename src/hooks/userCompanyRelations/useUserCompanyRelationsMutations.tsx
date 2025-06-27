import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserCompanyRelation,
  updateUserCompanyRelation,
  deleteUserCompanyRelation,
  checkExistingRelation,
} from "../../api/userCompanyRelationsApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useUserCompanyRelationsMutations = (
  user_company_id: string,
  user_id: string,
  company_id: string,
  role_id: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (newRelation: {
      user_id: string;
      company_id: string;
      role_id: string;
      application_id: string;
    }) => {
      const exists = await checkExistingRelation({
        user_id: newRelation.user_id,
        company_id: newRelation.company_id,
      });

      return createUserCompanyRelation(newRelation);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userRelations"] });
      queryClient.invalidateQueries({ queryKey: ["companyRelations"] });
      toast.success("Информация добавлена");
    },
    onError: (error: AxiosError | Error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: {
      role_id: string;
      user_company_id: string;
      application_id: string;
    }) =>
      user_company_id
        ? updateUserCompanyRelation(user_company_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRelations"] });
      queryClient.invalidateQueries({ queryKey: ["companyRelations"] });
      setIsEditing && setIsEditing(false);
      toast.success("Информация обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении данных");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (user_company_id: string) =>
      deleteUserCompanyRelation(user_company_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRelations"] });
      queryClient.invalidateQueries({ queryKey: ["companyRelations"] });
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
