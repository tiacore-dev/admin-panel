// src/pages/rolePermissions/RolePermissionsDetailsPage.tsx
import type React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import {
  Spin,
  Space,
  Card,
  Typography,
  Row,
  Col,
  Tag,
  Alert,
  Empty,
  Badge,
} from "antd";
import {
  UserOutlined,
  SafetyOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { BackButton } from "../../components/buttons/backButton";
import { useRoleDetailsQuery } from "../../hooks/role/useRoleQuery";
import { useParams, useNavigate } from "react-router-dom";
import { useCombinedPermissionsQuery } from "../../hooks/permissions/usePermissionsQuery";
import { useRestrictionsQuery } from "../../hooks/permissions/useRestrictionsQuery";
import { useRolePermissionsQuery } from "../../hooks/rolePermissionRelations/useRolePermissionRelationsQuery";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useRoleMutations } from "../../hooks/role/useRoleMutations";
import { useRolePermissionRelationsMutations } from "../../hooks/rolePermissionRelations/useRolePermissionRelationsMutations";
import toast from "react-hot-toast";
import { useAppNameById } from "../../hooks/base/useAppHelpers";

// Импорты новых компонентов
import { RoleHeader } from "./components/roleHeader";
import { PermissionsList } from "./components/permissionsList";
import { RenameModal } from "./components/renameModal";
import { ScrollToTopButton } from "./components/scrollToTopButton";
import { PermissionsListSkeleton } from "./components/permissionsListSkeleton";
import { RoleHeaderSkeleton } from "./components/roleHeaderSkeleton";

const { Title, Text } = Typography;

export const RolePermissionsDetailsPage: React.FC = () => {
  const { role_id } = useParams<{ role_id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Состояния
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<
    Record<string, string[]>
  >({});
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Запросы данных
  const {
    data: role,
    isLoading: isLoadingRole,
    isError: isErrorRole,
    refetch,
  } = useRoleDetailsQuery(role_id || "");

  const appName = useAppNameById(role?.application_id);

  const {
    data: allPermissions,
    isLoading: isLoadingPermissions,
    isError: isErrorPermissions,
  } = useCombinedPermissionsQuery(role?.application_id);

  const {
    data: allRestrictions,
    isLoading: isLoadingRestrictions,
    isError: isErrorRestrictions,
  } = useRestrictionsQuery();

  const {
    data: rolePermissions,
    isLoading: isLoadingRolePermissions,
    isError: isErrorRolePermissions,
    isFetching: isFetchingRolePermissions,
  } = useRolePermissionsQuery({ role_id: role_id });

  const { deleteMutation, renameMutation } = useRoleMutations(
    role_id || "",
    role?.role_name || ""
  );

  const { createMutation, deleteMutation: deleteRelationMutation } =
    useRolePermissionRelationsMutations();

  // Мемоизированные вычисления
  const assignedPermissions = useMemo(
    () => rolePermissions?.relations || [],
    [rolePermissions?.relations]
  );

  const assignedPermissionIds = useMemo(
    () => assignedPermissions.map((p) => p.permission_id),
    [assignedPermissions]
  );

  const assignedRestrictionIds = useMemo(
    () =>
      assignedPermissions
        .map((p) => p.restriction_id)
        .filter((id): id is string => id !== undefined && id !== null),
    [assignedPermissions]
  );

  // Статистика разрешений
  const permissionsStats = useMemo(() => {
    const totalPermissions = allPermissions?.permissions?.length || 0;
    const assignedCount = assignedPermissionIds.length;
    const totalRestrictions = allRestrictions?.restrictions?.length || 0;
    const assignedRestrictionsCount = assignedRestrictionIds.length;

    const permissionsProgress =
      totalPermissions > 0 ? (assignedCount / totalPermissions) * 100 : 0;

    // Группировка разрешений по типам (если есть поле category или type)
    const permissionsByCategory = new Map<string, number>();
    assignedPermissions.forEach((perm) => {
      const permission = allPermissions?.permissions?.find(
        (p) => p.permission_id === perm.permission_id
      );
      const category = permission?.comment || "Общие";
      permissionsByCategory.set(
        category,
        (permissionsByCategory.get(category) || 0) + 1
      );
    });

    return {
      totalPermissions,
      assignedCount,
      totalRestrictions,
      assignedRestrictionsCount,
      permissionsProgress,
      permissionsByCategory,
      hasRestrictions: assignedRestrictionsCount > 0,
    };
  }, [
    allPermissions,
    assignedPermissionIds,
    allRestrictions,
    assignedRestrictionIds,
    assignedPermissions,
  ]);

  // Проверка состояний загрузки
  const isInitialLoading =
    isLoadingRole ||
    isLoadingPermissions ||
    isLoadingRestrictions ||
    isLoadingRolePermissions;
  const isDataLoading = isFetchingRolePermissions || isSaving;
  const isError =
    isErrorRole ||
    isErrorPermissions ||
    isErrorRestrictions ||
    isErrorRolePermissions;

  // Функция для инициализации состояния из актуальных данных
  const initializeFromCurrentData = useCallback(() => {
    console.log("Initializing from current data:", assignedPermissions);
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
  }, [assignedPermissions, assignedPermissionIds]);

  // Инициализация состояния при загрузке данных
  useEffect(() => {
    if (!isInitialLoading && assignedPermissions.length >= 0) {
      initializeFromCurrentData();
    }
  }, [isInitialLoading, initializeFromCurrentData]);

  // Обработчики событий
  const handleScroll = useCallback(() => {
    if (window.scrollY > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, []);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteMutation.mutate(role_id || "", {
      onSuccess: () => {
        navigate("/role_permissions_relations");
      },
    });
  }, [deleteMutation, role_id, navigate]);

  const handleEditClick = useCallback(() => {
    console.log("Starting edit mode with current data:", {
      assignedPermissionIds,
      assignedPermissions,
    });
    setIsEditing(true);
    initializeFromCurrentData();
  }, [initializeFromCurrentData, assignedPermissionIds, assignedPermissions]);

  const handleRenameClick = useCallback(() => {
    setIsRenaming(true);
  }, []);

  const handleConfirmRename = useCallback(() => {
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
  }, [newRoleName, renameMutation, refetch]);

  const handleCancelRename = useCallback(() => {
    setIsRenaming(false);
    setNewRoleName(role?.role_name || "");
  }, [role?.role_name]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    initializeFromCurrentData();
  }, [initializeFromCurrentData]);

  const handlePermissionChange = useCallback(
    (permissionId: string, checked: boolean) => {
      console.log("Permission change:", permissionId, checked);
      setSelectedPermissions((prev) => {
        if (checked) {
          return [...prev, permissionId];
        } else {
          return prev.filter((id) => id !== permissionId);
        }
      });

      if (!checked) {
        setSelectedRestrictions((prev) => {
          const newRestrictions = { ...prev };
          delete newRestrictions[permissionId];
          return newRestrictions;
        });
      }
    },
    []
  );

  const handleRestrictionChange = useCallback(
    (permissionId: string, restrictionId: string, checked: boolean) => {
      console.log("Restriction change:", permissionId, restrictionId, checked);
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
    },
    []
  );

  // Вспомогательные функции для определения изменений
  const getAddedPermissions = useCallback(() => {
    return selectedPermissions.filter(
      (permissionId) => !assignedPermissionIds.includes(permissionId)
    );
  }, [selectedPermissions, assignedPermissionIds]);

  const getRemovedPermissions = useCallback(() => {
    return assignedPermissionIds.filter(
      (permissionId) => !selectedPermissions.includes(permissionId)
    );
  }, [assignedPermissionIds, selectedPermissions]);

  const getAddedRestrictions = useCallback(
    (permissionId: string) => {
      const currentRestrictions =
        assignedPermissions
          .filter((p) => p.permission_id === permissionId)
          .map((p) => p.restriction_id)
          .filter((id): id is string => id !== undefined) || [];
      const newRestrictions = selectedRestrictions[permissionId] || [];
      return newRestrictions.filter(
        (restrictionId) => !currentRestrictions.includes(restrictionId)
      );
    },
    [assignedPermissions, selectedRestrictions]
  );

  const getRemovedRestrictions = useCallback(
    (permissionId: string) => {
      const currentRestrictions =
        assignedPermissions
          .filter((p) => p.permission_id === permissionId)
          .map((p) => p.restriction_id)
          .filter((id): id is string => id !== undefined) || [];
      const newRestrictions = selectedRestrictions[permissionId] || [];
      return currentRestrictions.filter(
        (restrictionId) => !newRestrictions.includes(restrictionId)
      );
    },
    [assignedPermissions, selectedRestrictions]
  );

  const handleSavePermissions = useCallback(async () => {
    if (!role_id) return;

    setIsSaving(true);
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
      await refetch();
      console.log("Data refetched, permissions should be updated");
    } catch (error) {
      toast.error("Ошибка при обновлении разрешений");
    } finally {
      setIsSaving(false);
    }
  }, [
    role_id,
    getRemovedPermissions,
    getAddedPermissions,
    selectedRestrictions,
    selectedPermissions,
    assignedPermissions,
    assignedPermissionIds,
    getAddedRestrictions,
    getRemovedRestrictions,
    deleteRelationMutation,
    createMutation,
    refetch,
  ]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleSelectAllPermissions = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allPermissionIds =
          allPermissions?.permissions.map((p) => p.permission_id) || [];
        setSelectedPermissions(allPermissionIds);
        setSelectedRestrictions({});
      } else {
        setSelectedPermissions([]);
        setSelectedRestrictions({});
      }
    },
    [allPermissions?.permissions]
  );

  const handleSelectAllRestrictions = useCallback(
    (permissionId: string, checked: boolean) => {
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
    },
    [allRestrictions?.restrictions]
  );

  // Эффекты
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (role && appName) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Управление доступом", to: "/role_permissions_relations" },
          {
            label: `${role.role_name} (${appName})`,
            to: `/role_permissions_relations/${role_id}`,
          },
        ])
      );
      setNewRoleName(role.role_name);
    }
  }, [role, appName, dispatch, role_id]);

  // Показываем полный спиннер только при первоначальной загрузке
  if (isInitialLoading) {
    return <Spin size="large" className="center-spin" />;
  }

  if (isError) {
    return <BackButton />;
  }

  return (
    <div className="main-container">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Информация о роли */}
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center", // Выравнивание по вертикали по центру
            }}
          >
            <Space direction="vertical" size="small" style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <UserOutlined style={{ fontSize: 24, color: "#1890ff" }} />
                <Title level={2} style={{ margin: 0 }}>
                  {role?.role_name}
                </Title>
                {appName && (
                  <Tag color="blue" style={{ fontSize: 14 }}>
                    <AppstoreOutlined style={{ marginRight: 4 }} />
                    {appName}
                  </Tag>
                )}
              </div>
              <Text type="secondary">
                Управление разрешениями и ограничениями для роли пользователя
              </Text>
            </Space>

            {isDataLoading ? (
              <RoleHeaderSkeleton />
            ) : (
              <RoleHeader
                role={role}
                isEditing={isEditing}
                selectedPermissions={selectedPermissions}
                allPermissions={allPermissions}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                onRenameClick={handleRenameClick}
                onSelectAllPermissions={handleSelectAllPermissions}
                onCancelEdit={handleCancelEdit}
                onSavePermissions={handleSavePermissions}
                isSaving={isSaving}
              />
            )}
          </div>
        </Card>

        {/* Предупреждения и информация */}
        {isEditing && (
          <Alert
            message="Режим редактирования"
            description="Вы находитесь в режиме редактирования разрешений. Не забудьте сохранить изменения."
            type="info"
            showIcon
            closable
          />
        )}

        {permissionsStats.hasRestrictions && !isEditing && (
          <Alert
            message="Активные ограничения"
            description="Для этой роли настроены ограничения доступа. Проверьте их актуальность."
            type="warning"
            showIcon
          />
        )}

        {/* Список разрешений */}
        <Card
          title={
            <Space>
              <SafetyOutlined />
              <span>Разрешения роли</span>
              {!isEditing && permissionsStats.assignedCount > 0 && (
                <Badge count={permissionsStats.assignedCount} color="green" />
              )}
            </Space>
          }
          extra={
            !isEditing &&
            permissionsStats.assignedCount === 0 && (
              <Text type="secondary">Разрешения не назначены</Text>
            )
          }
        >
          {isDataLoading ? (
            <PermissionsListSkeleton
              count={allPermissions?.permissions?.length || 5}
            />
          ) : permissionsStats.totalPermissions === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text>Разрешения для приложения не найдены</Text>
                  <Text type="secondary">
                    Обратитесь к администратору для настройки разрешений
                  </Text>
                </Space>
              }
            />
          ) : (
            <PermissionsList
              permissions={allPermissions?.permissions || []}
              restrictions={allRestrictions?.restrictions || []}
              assignedPermissions={assignedPermissions}
              assignedPermissionIds={assignedPermissionIds}
              assignedRestrictionIds={assignedRestrictionIds}
              selectedPermissions={selectedPermissions}
              selectedRestrictions={selectedRestrictions}
              isEditing={isEditing}
              onPermissionChange={handlePermissionChange}
              onRestrictionChange={handleRestrictionChange}
              onSelectAllRestrictions={handleSelectAllRestrictions}
            />
          )}
        </Card>
      </Space>

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}

      <RenameModal
        isOpen={isRenaming}
        newRoleName={newRoleName}
        onRoleNameChange={setNewRoleName}
        onConfirm={handleConfirmRename}
        onCancel={handleCancelRename}
        isLoading={renameMutation.isPending}
      />

      <ScrollToTopButton show={showScrollButton} onClick={scrollToTop} />
    </div>
  );
};
