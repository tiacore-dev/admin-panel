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
      toast.error("Ошибка при добавлении связи включения ролей");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedData: any) =>
      role_include_relation_id
        ? updateRoleIncludeRelation(role_include_relation_id, editedData)
        : Promise.reject(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleIncludeRelations"] });
      queryClient.invalidateQueries({
        queryKey: ["roleIncludeRelation", role_include_relation_id],
      });
      setIsEditing && setIsEditing(false);
      toast.success("Связь включения ролей обновлена");
    },
    onError: () => {
      toast.error("Ошибка при обновлении связи включения ролей");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (role_include_relation_id: string) =>
      deleteRoleIncludeRelation(role_include_relation_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roleIncludeRelations"] });
      toast.success("Связь включения ролей удалена");
    },
    onError: () => {
      toast.error("Ошибка при удалении связи включения ролей");
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
