// src/hooks/rolePermissionRelations/useRolePermissionRelationsMutations.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRolePermission,
  deleteRolePermission,
} from "../../api/rolePermissionsRelationsApi";
import { message } from "antd";
import { AxiosError } from "axios";

export const useRolePermissionRelationsMutations = (role_id?: string) => {
  const queryClient = useQueryClient();

  const saveChangesMutation = useMutation({
    mutationFn: async (selectedPermissions: string[]) => {
      const currentPermissionsResponse = await queryClient.getQueryData<{
        relations: { permission_id: string; role_permission_id: string }[];
      }>(["rolePermissionRelations", { role: role_id }]);

      const currentPermissions =
        currentPermissionsResponse?.relations.map((rp) => rp.permission_id) ||
        [];

      const toAdd = selectedPermissions.filter(
        (permId) => !currentPermissions.includes(permId)
      );

      const toRemove = currentPermissions
        .filter((permId) => !selectedPermissions.includes(permId))
        .map((permId) => {
          const relation = currentPermissionsResponse?.relations.find(
            (rp) => rp.permission_id === permId
          );
          return relation?.role_permission_id || "";
        })
        .filter((id) => id);

      await Promise.all([
        ...toAdd.map((permId) =>
          createRolePermission({
            role_id: role_id || "",
            permission_id: permId,
          })
        ),
        ...toRemove.map((relationId) => deleteRolePermission(relationId)),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rolePermissionRelations"] });
      message.success("Изменения сохранены");
    },
    onError: (error: AxiosError) => {
      message.error("Ошибка при сохранении изменений");
      // console.error("Error saving permission changes:", error);
    },
  });

  return { saveChangesMutation };
};
