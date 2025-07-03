"use client";

import type React from "react";

import {
  Table,
  Tag,
  Typography,
  Spin,
  Space,
  Dropdown,
  Button,
  Avatar,
  Tooltip,
  message,
} from "antd";
import {
  useUserRelationsQuery,
  useCompanyRelationsQuery,
} from "../../hooks/userCompanyRelations/useUserCompanyRelationsQuery";
import type { IUserCompanyRelation } from "../../api/userCompanyRelationsApi";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { getCompanyNameById } from "../../utils/infoById";
import { useUserQueryAll } from "../../hooks/users/useUserQuery";
import { getEmailById } from "../../utils/infoById";
import { Link } from "react-router-dom";
import {
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
  BuildOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
  CopyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useUserCompanyRelationsMutations } from "../../hooks/userCompanyRelations/useUserCompanyRelationsMutations";
import { ConfirmDeleteModal } from "../modals/confirmDeleteModal";
import { RelationFormModal } from "./userCompanyRelationFormModal";
import { useRolesQuery } from "../../hooks/role/useRoleQuery";
import { InviteFormModal } from "../../pages/invitePages/inviteFormModal";
import { useAppsQuery } from "../../hooks/base/useBaseQuery";
import { useAppNameById } from "../../hooks/base/useAppHelpers";
import { getTegColorForString } from "../../utils/stringToColour";

const { Text, Title } = Typography;

interface UserCompanyRelationsTableProps {
  userId?: string;
  companyId?: string;
  fromAccount?: boolean;
}

export const UserCompanyRelationsTable = ({
  userId,
  companyId,
  fromAccount,
}: UserCompanyRelationsTableProps) => {
  const { data: rolesData, isLoading: rolesLoading } = useRolesQuery();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { data: companiesData, isLoading: companiesLoading } =
    useCompanyQuery();
  const { data: usersData, isLoading: usersLoading } = useUserQueryAll();
  const { data: applicationsData, isLoading: applicationsLoading } =
    useAppsQuery();

  const userRelations = useUserRelationsQuery(userId);
  const companyRelations = useCompanyRelationsQuery(companyId);

  const { data, isLoading, isError } = userId
    ? userRelations
    : companyRelations;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRelation, setSelectedRelation] =
    useState<IUserCompanyRelation | null>(null);
  const [editingRelation, setEditingRelation] =
    useState<IUserCompanyRelation | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";

  const { deleteMutation } = useUserCompanyRelationsMutations(
    "",
    "",
    "",
    "",
    () => {}
  );

  // Компонент для отображения названия приложения
  const AppNameDisplay: React.FC<{ applicationId: string }> = ({
    applicationId,
  }) => {
    const appName = useAppNameById(applicationId);
    const color = appName ? getTegColorForString(appName) : "orange";

    return (
      <Tag
        color={color}
        icon={<AppstoreOutlined />}
        style={{ borderRadius: 6, fontSize: "12px" }}
      >
        {appName || applicationId}
      </Tag>
    );
  };

  // Функция для получения инициалов
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Функция для получения цвета аватара
  const getAvatarColor = (name: string) => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#87d068",
      "#108ee9",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Функция копирования в буфер обмена
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${type} скопирован в буфер обмена`);
    });
  };

  const handleInvite = () => {
    if (companyId) {
      setIsInviteModalVisible(true);
    } else {
      setEditingRelation(null);
      setIsEditModalVisible(true);
    }
  };

  const handleEdit = (relation: IUserCompanyRelation) => {
    setEditingRelation(relation);
    setIsEditModalVisible(true);
  };

  const handleDelete = (relation: IUserCompanyRelation) => {
    setSelectedRelation(relation);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = () => {
    if (userId) {
      userRelations.refetch();
    } else if (companyId) {
      companyRelations.refetch();
    }
    setIsEditModalVisible(false);
    setEditingRelation(null);
  };

  const confirmDelete = () => {
    if (selectedRelation) {
      deleteMutation.mutate(selectedRelation.user_company_id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
        },
      });
    }
  };

  const getMenuItems = (relation: IUserCompanyRelation) => {
    const items = [];

    items.push({
      key: "edit",
      icon: <EditOutlined />,
      label: "Редактировать",
      onClick: () => handleEdit(relation),
    });
    items.push({
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Удалить",
      danger: true,
      onClick: () => handleDelete(relation),
    });

    return items;
  };

  const columns = [
    {
      title: userId ? "Компания" : "Пользователь",
      dataIndex: userId ? "company_id" : "user_id",
      key: userId ? "company" : "user",
      render: (id: string, record: IUserCompanyRelation) => {
        if (userId) {
          // Отображение компании
          const companyName = getCompanyName(id);
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                style={{
                  backgroundColor: getAvatarColor(companyName),
                  fontSize: "14px",
                }}
                size={32}
                icon={<BuildOutlined />}
              >
                {getInitials(companyName)}
              </Avatar>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Link
                    to={`/companies/${id}`}
                    state={{ from: "userDetails", userId: userId }}
                    style={{ fontWeight: 500, color: "#1890ff" }}
                  >
                    {companyName}
                  </Link>
                  <ExportOutlined
                    style={{ color: "#8c8c8c", fontSize: "12px" }}
                  />
                </div>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  ID: {id.substring(0, 8)}...
                </Text>
              </div>
            </div>
          );
        } else {
          // Отображение пользователя
          const userEmail = getEmailById(id, usersData?.users) || id;
          const user = usersData?.users.find((u) => u.user_id === id);
          const userName = user?.full_name || "Без имени";

          return (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar
                style={{
                  backgroundColor: getAvatarColor(userName),
                  fontSize: "14px",
                }}
                size={32}
              >
                {getInitials(userName)}
              </Avatar>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Link
                    to={`/users/${id}`}
                    state={{ from: "companyDetails", companyId: companyId }}
                    style={{ fontWeight: 500, color: "#1890ff" }}
                  >
                    {userName}
                  </Link>
                  <ExportOutlined
                    style={{ color: "#8c8c8c", fontSize: "12px" }}
                  />
                </div>
              </div>
            </div>
          );
        }
      },
    },
    {
      title: "Роль",
      dataIndex: "role_id",
      key: "role",
      render: (roleId: string) => (
        <Tag
          color="blue"
          icon={<SafetyCertificateOutlined />}
          style={{ borderRadius: 6, fontSize: "12px" }}
        >
          {getRoleName(roleId)}
        </Tag>
      ),
    },
    {
      title: "Приложение",
      dataIndex: "application_id",
      key: "application",
      render: (appId: string) => <AppNameDisplay applicationId={appId} />,
    },
    {
      title: "",
      key: "actions",
      width: 48,
      render: (_: any, record: IUserCompanyRelation) => {
        const menuItems = getMenuItems(record);
        if (menuItems.length === 0) return null;

        return (
          <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
            <Button
              type="text"
              icon={<MoreOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        );
      },
    },
  ];

  const getRoleName = (roleId: string) => {
    const role = rolesData?.roles.find((r) => r.role_id === roleId);
    return role ? role.role_name : roleId;
  };

  const getCompanyName = (companyId: string) => {
    return getCompanyNameById(companyId, companiesData?.companies) || companyId;
  };

  const isTotalLoading =
    isLoading ||
    rolesLoading ||
    companiesLoading ||
    usersLoading ||
    applicationsLoading;

  const getHeaderTitle = () => {
    if (fromAccount) return "Компании";
    if (userId) return "Компании пользователя";
    return "Пользователи компании";
  };

  const getHeaderIcon = () => {
    if (userId) return <BuildOutlined />;
    return <TeamOutlined />;
  };

  const showInviteButton = () => {
    if (fromAccount) return false;
    if (userId) return false;
    return true;
  };

  const showAddButton = () => {
    if (fromAccount) return false;
    if (userId) return isSuperadmin;
    return isSuperadmin;
  };

  const handleCreate = () => {
    setEditingRelation(null);
    setIsCreateModalVisible(true);
  };

  return (
    <>
      {isTotalLoading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : isError ? (
        <Text type="danger">Ошибка при загрузке данных</Text>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {getHeaderIcon()}
              <Title level={5} style={{ margin: 0 }}>
                {getHeaderTitle()}
              </Title>
            </div>

            <Space>
              {showInviteButton() && (
                <Button
                  // type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleInvite}
                >
                  {isSuperadmin ? "Пригласить" : "Добавить"}
                </Button>
              )}
              {showAddButton() && (
                <Button icon={<PlusOutlined />} onClick={handleCreate}>
                  Добавить
                </Button>
              )}
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={data?.relations || []}
            rowKey="user_company_id"
            pagination={false}
            locale={{
              emptyText: (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <TeamOutlined
                    style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
                  />
                  <div>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                      {userId
                        ? "Пользователь не связан ни с одной компанией"
                        : "В компании нет пользователей"}
                    </Text>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      {userId
                        ? "Добавьте связь с компанией"
                        : "Пригласите пользователей в компанию"}
                    </Text>
                  </div>
                </div>
              ),
            }}
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow:
                "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
            }}
          />
        </>
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}
      {isCreateModalVisible && (
        <RelationFormModal
          visible={isCreateModalVisible}
          onCancel={() => setIsCreateModalVisible(false)}
          onSuccess={handleSuccess}
          mode="create"
          initialData={null}
          roles={rolesData?.roles || []}
          userId={userId}
          companyId={companyId}
          companies={companiesData?.companies || []}
          users={usersData?.users || []}
          applications={applicationsData?.applications || []}
        />
      )}
      {isInviteModalVisible && (
        <InviteFormModal
          visible={isInviteModalVisible}
          onCancel={() => setIsInviteModalVisible(false)}
          onSuccess={handleSuccess}
          roles={rolesData?.roles || []}
          companyId={companyId || ""}
        />
      )}
      {isEditModalVisible && (
        <RelationFormModal
          visible={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingRelation(null);
          }}
          onSuccess={handleSuccess}
          mode={editingRelation ? "edit" : "create"}
          initialData={editingRelation}
          roles={rolesData?.roles || []}
          userId={userId}
          companyId={companyId}
          companies={companiesData?.companies || []}
          users={usersData?.users || []}
          applications={applicationsData?.applications || []}
        />
      )}
    </>
  );
};
