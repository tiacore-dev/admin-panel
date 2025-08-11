// src/hooks/includeRoles/useIncludeRolesMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRoleIncludeRelation,
  updateRoleIncludeRelation,
  deleteRoleIncludeRelation,
} from "../../api/includeRolesApi";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

export const useIncludeRolesMutations = (
  role_include_relation_id?: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createRoleIncludeRelation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleIncludeRelations"] });
      toast.success("Связь включения ролей добавлена");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Ошибка при добавлении связи включения ролей: ${error.message}`
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (!role_include_relation_id) {
        return Promise.reject(new Error("ID связи не указан"));
      }
      return updateRoleIncludeRelation(role_include_relation_id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleIncludeRelations"] });
      queryClient.invalidateQueries({
        queryKey: ["roleIncludeRelation", role_include_relation_id],
      });
      setIsEditing && setIsEditing(false);
      toast.success("Связь включения ролей обновлена");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Ошибка при обновлении связи включения ролей: ${error.message}`
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (role_include_relation_id: string) =>
      deleteRoleIncludeRelation(role_include_relation_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleIncludeRelations"] });
      toast.success("Связь включения ролей удалена");
    },
    onError: (error: AxiosError) => {
      toast.error(
        `Ошибка при удалении связи включения ролей: ${error.message}`
      );
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
