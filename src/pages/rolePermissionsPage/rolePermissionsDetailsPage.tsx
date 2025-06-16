// src/pages/rolePermissions/RolePermissionsDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import {
  Button,
  Spin,
  List,
  Space,
  Checkbox,
  Typography,
  Input,
  Modal,
} from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { useRoleDetailsQuery } from "../../hooks/role/useRoleQuery";
import { useParams, useNavigate } from "react-router-dom";
import { usePermissionsQuery } from "../../hooks/permissions/usePermissionsQuery";
import { useRestrictionsQuery } from "../../hooks/permissions/useRestrictionsQuery";
import { useRolePermissionsQuery } from "../../hooks/rolePermissionRelations/useRolePermissionRelationsQuery";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useRoleMutations } from "../../hooks/role/useRoleMutations";
import { useRolePermissionRelationsMutations } from "../../hooks/rolePermissionRelations/useRolePermissionRelationsMutations";
import toast from "react-hot-toast";
import { UpOutlined, EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const RolePermissionsDetailsPage: React.FC = () => {
  const { role_id } = useParams<{ role_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<
    Record<string, string[]>
  >({});
  const [showScrollButton, setShowScrollButton] = useState(false);

  const {
    data: role,
    isLoading: isLoadingRole,
    isError: isErrorRole,
    refetch,
  } = useRoleDetailsQuery(role_id || "");

  const {
    data: allPermissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = usePermissionsQuery();

  const {
    data: allRestrictions,
    isLoading: isLoadingRestrictions,
    isError: isErrorRestrictions,
  } = useRestrictionsQuery();

  const {
    data: rolePermissions,
    isLoading: isLoadingRolePermissions,
    isError: isErrorRolePermissions,
  } = useRolePermissionsQuery({ role_id: role_id });

  const { deleteMutation, renameMutation } = useRoleMutations(
    role_id || "",
    role?.role_name || ""
  );

  const { createMutation, deleteMutation: deleteRelationMutation } =
    useRolePermissionRelationsMutations();

  const assignedPermissions = rolePermissions?.relations || [];
  const assignedPermissionIds = assignedPermissions.map((p) => p.permission_id);
  const assignedRestrictionIds = assignedPermissions
    .filter((p) => p.restriction_id)
    .map((p) => p.restriction_id);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setNewRoleName(role.role_name);
    }
  }, [role, dispatch, role_id]);

  useEffect(() => {
    if (assignedPermissions && allPermissions) {
      setSelectedPermissions(assignedPermissionIds);

      const restrictionsMap: Record<string, string[]> = {};
      assignedPermissions.forEach((relation) => {
        if (relation.restriction_id && relation.permission_id) {
          if (!restrictionsMap[relation.permission_id]) {
            restrictionsMap[relation.permission_id] = [];
          }
          restrictionsMap[relation.permission_id].push(relation.restriction_id);
        }
      });
      setSelectedRestrictions(restrictionsMap);
    }
  }, [assignedPermissions, allPermissions]);

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

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleRenameClick = () => {
    setIsRenaming(true);
  };

  const handleConfirmRename = () => {
    if (newRoleName.trim() === "") {
      toast.error("Название роли не может быть пустым");
      return;
    }

    renameMutation.mutate(newRoleName, {
      onSuccess: () => {
        setIsRenaming(false);
        refetch();
      },
    });
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
    setNewRoleName(role?.role_name || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (assignedPermissions && allPermissions) {
      setSelectedPermissions(assignedPermissionIds);

      const restrictionsMap: Record<string, string[]> = {};
      assignedPermissions.forEach((relation) => {
        if (relation.restriction_id && relation.permission_id) {
          if (!restrictionsMap[relation.permission_id]) {
            restrictionsMap[relation.permission_id] = [];
          }
          restrictionsMap[relation.permission_id].push(relation.restriction_id);
        }
      });
      setSelectedRestrictions(restrictionsMap);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionId]
        : prev.filter((id) => id !== permissionId)
    );

    if (!checked) {
      setSelectedRestrictions((prev) => {
        const newRestrictions = { ...prev };
        delete newRestrictions[permissionId];
        return newRestrictions;
      });
    }
  };

  const handleRestrictionChange = (
    permissionId: string,
    restrictionId: string,
    checked: boolean
  ) => {
    setSelectedRestrictions((prev) => {
      const newRestrictions = { ...prev };
      if (!newRestrictions[permissionId]) {
        newRestrictions[permissionId] = [];
      }

      if (checked) {
        if (!newRestrictions[permissionId].includes(restrictionId)) {
          newRestrictions[permissionId] = [
            ...newRestrictions[permissionId],
            restrictionId,
          ];
        }
      } else {
        newRestrictions[permissionId] = newRestrictions[permissionId].filter(
          (id) => id !== restrictionId
        );
      }

      return newRestrictions;
    });
  };

  const getAddedPermissions = () => {
    return selectedPermissions.filter(
      (permissionId) => !assignedPermissionIds.includes(permissionId)
    );
  };

  const getRemovedPermissions = () => {
    return assignedPermissionIds.filter(
      (permissionId) => !selectedPermissions.includes(permissionId)
    );
  };

  const getAddedRestrictions = (permissionId: string) => {
    const currentRestrictions =
      assignedPermissions
        .filter((p) => p.permission_id === permissionId)
        .map((p) => p.restriction_id)
        .filter((id): id is string => id !== undefined) || [];
    const newRestrictions = selectedRestrictions[permissionId] || [];
    return newRestrictions.filter(
      (restrictionId) => !currentRestrictions.includes(restrictionId)
    );
  };

  const getRemovedRestrictions = (permissionId: string) => {
    const currentRestrictions =
      assignedPermissions
        .filter((p) => p.permission_id === permissionId)
        .map((p) => p.restriction_id)
        .filter((id): id is string => id !== undefined) || [];
    const newRestrictions = selectedRestrictions[permissionId] || [];
    return currentRestrictions.filter(
      (restrictionId) => !newRestrictions.includes(restrictionId)
    );
  };

  const handleSavePermissions = async () => {
    if (!role_id) return;

    try {
      const permissionsToRemove = getRemovedPermissions();
      await Promise.all(
        assignedPermissions
          .filter((relation) =>
            permissionsToRemove.includes(relation.permission_id)
          )
          .map((relation) =>
            deleteRelationMutation.mutateAsync(relation.role_permission_id)
          )
      );

      const permissionsToAdd = getAddedPermissions();
      await Promise.all(
        permissionsToAdd.map((permissionId) => {
          const restrictions = selectedRestrictions[permissionId] || [];

          if (restrictions.length > 0) {
            return Promise.all(
              restrictions.map((restrictionId) =>
                createMutation.mutateAsync({
                  role_id: role_id,
                  permission_id: permissionId,
                  restriction_id: restrictionId,
                })
              )
            );
          } else {
            return createMutation.mutateAsync({
              role_id: role_id,
              permission_id: permissionId,
            });
          }
        })
      );

      const existingPermissions = selectedPermissions.filter((permissionId) =>
        assignedPermissionIds.includes(permissionId)
      );

      await Promise.all(
        existingPermissions.map(async (permissionId) => {
          const addedRestrictions = getAddedRestrictions(permissionId);
          const removedRestrictions = getRemovedRestrictions(permissionId);

          await Promise.all(
            assignedPermissions
              .filter(
                (relation) =>
                  relation.permission_id === permissionId &&
                  removedRestrictions.includes(relation.restriction_id || "")
              )
              .map((relation) =>
                deleteRelationMutation.mutateAsync(relation.role_permission_id)
              )
          );

          if (addedRestrictions.length > 0) {
            await Promise.all(
              addedRestrictions.map((restrictionId) =>
                createMutation.mutateAsync({
                  role_id: role_id,
                  permission_id: permissionId,
                  restriction_id: restrictionId,
                })
              )
            );
          }
        })
      );

      toast.success("Разрешения успешно обновлены");
      setIsEditing(false);
      refetch();
    } catch (error) {
      toast.error("Ошибка при обновлении разрешений");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSelectAllPermissions = (checked: boolean) => {
    if (checked) {
      const allPermissionIds =
        allPermissions?.permissions.map((p) => p.permission_id) || [];
      setSelectedPermissions(allPermissionIds);
      setSelectedRestrictions({});
    } else {
      setSelectedPermissions([]);
      setSelectedRestrictions({});
    }
  };

  const handleSelectAllRestrictions = (
    permissionId: string,
    checked: boolean
  ) => {
    setSelectedRestrictions((prev) => {
      const newRestrictions = { ...prev };
      if (checked) {
        newRestrictions[permissionId] =
          allRestrictions?.restrictions.map((r) => r.restriction_id) || [];
      } else {
        delete newRestrictions[permissionId];
      }
      return newRestrictions;
    });
  };

  if (
    isLoadingRole ||
    isLoadingPermissions ||
    isLoadingRestrictions ||
    isLoadingRolePermissions
  ) {
    return <Spin size="large" className="center-spin" />;
  }

  if (
    isErrorRole ||
    isErrorPermissions ||
    isErrorRestrictions ||
    isErrorRolePermissions
  ) {
    return <BackButton />;
  }

  return (
    <div className="main-container">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Title
            level={4}
            style={{
              marginRight: 16,
              marginLeft: 16,
              display: "flex",
              alignItems: "center",
            }}
          >
            {role?.role_name}
          </Title>

          {isEditing ? (
            <Space>
              <Button
                icon={<EditOutlined />}
                onClick={handleRenameClick}
                style={{ marginLeft: 8 }}
              >
                Переименовать
              </Button>
              <Button
                onClick={() => handleSelectAllPermissions(true)}
                disabled={
                  selectedPermissions.length ===
                  allPermissions?.permissions.length
                }
              >
                Выбрать все
              </Button>
              <Button
                onClick={() => handleSelectAllPermissions(false)}
                disabled={selectedPermissions.length === 0}
              >
                Убрать все
              </Button>
              <Button onClick={handleCancelEdit}>Отмена</Button>
              <Button
                type="primary"
                onClick={handleSavePermissions}
                loading={
                  createMutation.isPending || deleteRelationMutation.isPending
                }
              >
                Сохранить
              </Button>
            </Space>
          ) : (
            <Space>
              <Button type="primary" onClick={handleEditClick}>
                Редактировать
              </Button>
              <Button danger onClick={handleDeleteClick}>
                Удалить роль
              </Button>
            </Space>
          )}
        </div>

        <List
          style={{ marginLeft: 24 }}
          dataSource={allPermissions?.permissions || []}
          renderItem={(permission) => (
            <List.Item
              style={{
                borderLeft: assignedPermissionIds.includes(
                  permission.permission_id
                )
                  ? "4px solid #52c41a"
                  : "none",
                paddingLeft: assignedPermissionIds.includes(
                  permission.permission_id
                )
                  ? "12px"
                  : "16px",
                marginBottom: "8px",
                backgroundColor: "#fff",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div>
                  {isEditing ? (
                    <Checkbox
                      checked={selectedPermissions.includes(
                        permission.permission_id
                      )}
                      onChange={(e) =>
                        handlePermissionChange(
                          permission.permission_id,
                          e.target.checked
                        )
                      }
                    >
                      <Text
                        style={{
                          color: selectedPermissions.includes(
                            permission.permission_id
                          )
                            ? "#000"
                            : "inherit",
                        }}
                      >
                        {permission.permission_name}
                      </Text>
                    </Checkbox>
                  ) : (
                    <Checkbox
                      checked={assignedPermissionIds.includes(
                        permission.permission_id
                      )}
                      disabled
                    >
                      <Text
                        style={{
                          color: assignedPermissionIds.includes(
                            permission.permission_id
                          )
                            ? "#000"
                            : "inherit",
                        }}
                      >
                        {permission.permission_name}
                      </Text>
                    </Checkbox>
                  )}

                  {assignedPermissions.some(
                    (p) =>
                      p.permission_id === permission.permission_id &&
                      p.application_id
                  ) && (
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      (Приложение:{" "}
                      {
                        assignedPermissions.find(
                          (p) => p.permission_id === permission.permission_id
                        )?.application_id
                      }
                      )
                    </Text>
                  )}
                </div>

                {permission.comment && (
                  <Text type="secondary" style={{ marginLeft: 24 }}>
                    {permission.comment}
                  </Text>
                )}

                <Space size="middle">
                  {allRestrictions?.restrictions.map((restriction) => {
                    if (
                      isEditing &&
                      selectedPermissions.includes(permission.permission_id)
                    ) {
                      return (
                        <div key={restriction.restriction_id}>
                          <Checkbox
                            checked={
                              selectedRestrictions[
                                permission.permission_id
                              ]?.includes(restriction.restriction_id) || false
                            }
                            onChange={(e) =>
                              handleRestrictionChange(
                                permission.permission_id,
                                restriction.restriction_id,
                                e.target.checked
                              )
                            }
                          >
                            {restriction.restriction_name}
                          </Checkbox>
                        </div>
                      );
                    } else {
                      return (
                        <div key={restriction.restriction_id}>
                          <Checkbox
                            checked={
                              assignedRestrictionIds.includes(
                                restriction.restriction_id
                              ) &&
                              assignedPermissions.some(
                                (p) =>
                                  p.permission_id ===
                                    permission.permission_id &&
                                  p.restriction_id ===
                                    restriction.restriction_id
                              )
                            }
                            disabled
                          >
                            {restriction.restriction_name}
                          </Checkbox>
                        </div>
                      );
                    }
                  })}
                </Space>
              </div>

              {isEditing &&
                selectedPermissions.includes(permission.permission_id) && (
                  <div style={{ marginTop: 8, marginLeft: 24 }}>
                    <Button
                      type="link"
                      size="small"
                      onClick={() =>
                        handleSelectAllRestrictions(
                          permission.permission_id,
                          !selectedRestrictions[permission.permission_id] ||
                            selectedRestrictions[permission.permission_id]
                              .length !== allRestrictions?.restrictions.length
                        )
                      }
                    >
                      {selectedRestrictions[permission.permission_id]
                        ?.length === allRestrictions?.restrictions.length
                        ? "Снять все ограничения"
                        : "Выбрать все ограничения"}
                    </Button>
                  </div>
                )}
            </List.Item>
          )}
        />
      </Space>

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}

      <Modal
        title="Переименовать роль"
        open={isRenaming}
        onOk={handleConfirmRename}
        onCancel={handleCancelRename}
        confirmLoading={renameMutation.isPending}
      >
        <Input
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          placeholder="Введите новое название роли"
        />
      </Modal>

      {showScrollButton && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: "50px",
            right: "50px",
            zIndex: 1000,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
          icon={<UpOutlined />}
        />
      )}
    </div>
  );
};
