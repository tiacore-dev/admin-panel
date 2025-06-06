// src/pages/rolePermissions/RolePermissionsDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin, List, Space } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { useRoleDetailsQuery } from "../../hooks/role/useRoleQuery";
import { useParams, useNavigate } from "react-router-dom";
import { usePermissionsQuery } from "../../hooks/permissions/usePermissionsQuery";
import { useRolePermissionsQuery } from "../../hooks/rolePermissionRelations/useRolePermissionRelationsQuery";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useRoleMutations } from "../../hooks/role/useRoleMutations";
import { useRolePermissionRelationsMutations } from "../../hooks/rolePermissionRelations/useRolePermissionRelationsMutations";
import { PermissionItem } from "./components/permissionItem";

export const RolePermissionsDetailsPage: React.FC = () => {
  const { role_id } = useParams<{ role_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: role,
    isLoading: isLoadingRole,
    isError: isErrorRole,
  } = useRoleDetailsQuery(role_id || "");

  const {
    data: allPermissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = usePermissionsQuery();

  const {
    data: rolePermissions,
    isLoading: isLoadingRolePermissions,
    isError: isErrorRolePermissions,
  } = useRolePermissionsQuery({ role: role_id });

  const { deleteMutation } = useRoleMutations(
    role_id || "",
    role?.role_name || ""
  );

  useEffect(() => {
    if (rolePermissions?.relations) {
      setSelectedPermissions(
        rolePermissions.relations.map((rp) => rp.permission_id)
      );
    }
  }, [rolePermissions]);

  useEffect(() => {
    if (role) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Управление доступом", to: "/role_permissions_relations" },
          {
            label: role.role_name,
            to: `/role_permissions_relations/${role_id}`,
          },
        ])
      );
    }
  }, [role, dispatch, role_id]);

  const { saveChangesMutation } = useRolePermissionRelationsMutations(role_id);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionId]
        : prev.filter((id) => id !== permissionId)
    );
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setSelectedPermissions(
      rolePermissions?.relations.map((rp) => rp.permission_id) || []
    );
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(role_id || "", {
      onSuccess: () => {
        navigate("/role_permissions_relations");
      },
    });
  };

  const handleSelectAll = () => {
    setSelectedPermissions(
      allPermissions?.permissions.map((p) => p.permission_id) || []
    );
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  return (
    <div>
      {isLoadingRole || isLoadingPermissions || isLoadingRolePermissions ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!(isErrorRole || isErrorPermissions || isErrorRolePermissions) && (
            <div className="main-container">
              {!isEditing ? (
                <Space>
                  <Button
                    onClick={handleEditClick}
                    style={{ marginBottom: 16 }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    danger
                    onClick={handleDeleteClick}
                    style={{ marginBottom: 16 }}
                  >
                    Удалить роль
                  </Button>
                </Space>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      saveChangesMutation.mutate(selectedPermissions, {
                        onSuccess: () => {
                          setIsEditing(false);
                        },
                      });
                    }}
                    loading={saveChangesMutation.isPending}
                    style={{ marginBottom: 16, marginRight: 8 }}
                    type="primary"
                  >
                    Сохранить
                  </Button>
                  <Button
                    onClick={handleCancelClick}
                    style={{ marginBottom: 16, marginRight: 8 }}
                    danger
                  >
                    Отмена
                  </Button>
                  <Button
                    onClick={handleSelectAll}
                    style={{ marginBottom: 16, marginRight: 8 }}
                  >
                    Выделить все
                  </Button>
                  <Button
                    onClick={handleDeselectAll}
                    style={{ marginBottom: 16 }}
                  >
                    Убрать все
                  </Button>
                </>
              )}
              <List
                bordered
                dataSource={allPermissions?.permissions || []}
                renderItem={(permission) => (
                  <PermissionItem
                    permission={permission}
                    isLinked={selectedPermissions.includes(
                      permission.permission_id
                    )}
                    isEditing={isEditing}
                    onPermissionChange={handlePermissionChange}
                  />
                )}
              />
              {isDeleteModalOpen && (
                <ConfirmDeleteModal
                  onConfirm={handleConfirmDelete}
                  onCancel={() => setIsDeleteModalOpen(false)}
                  isDeleteLoading={deleteMutation.isPending}
                />
              )}
            </div>
          )}
          {(isErrorRole || isErrorPermissions || isErrorRolePermissions) && (
            <BackButton />
          )}
        </>
      )}
    </div>
  );
};
