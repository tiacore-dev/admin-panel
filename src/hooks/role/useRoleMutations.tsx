// src/hooks/role/useRoleMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRole, deleteRole, renameRole } from "../../api/roleApi";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

export const useRoleMutations = (
  role_id: string,
  role_name: string,
  setIsEditing?: (val: boolean) => void
) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Информация добавлена");
    },
    onError: (error: AxiosError) => {
      toast.error("Ошибка при добавлении");
    },
  });

  const renameMutation = useMutation({
    mutationFn: (new_name: string) => renameRole(role_id, new_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roleDetails", role_id] });
      toast.success("Название роли успешно изменено");
    },
    onError: () => {
      toast.error("Ошибка при изменении названия роли");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (role_id: string) => deleteRole(role_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Успешно удалено");
    },
    onError: () => {
      toast.error("Ошибка при удалении");
    },
  });

  return { createMutation, renameMutation, deleteMutation };
};
