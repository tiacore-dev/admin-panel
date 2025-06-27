import { Table, Tag, Typography, Spin, Space, Dropdown, Button } from "antd";
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
} from "@ant-design/icons";
import { useState } from "react";
import { useUserCompanyRelationsMutations } from "../../hooks/userCompanyRelations/useUserCompanyRelationsMutations";
import { ConfirmDeleteModal } from "../modals/confirmDeleteModal";
import { RelationFormModal } from "./userCompanyRelationFormModal";
import { useRolesQuery } from "../../hooks/role/useRoleQuery";
import { InviteFormModal } from "../../pages/invitePages/inviteFormModal";
import { useAppsQuery } from "../../hooks/base/useBaseQuery";

const { Text } = Typography;

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
      render: (id: string) => (
        <Space>
          <Link
            to={`/users/${id}`}
            state={{ from: "companyDetails", companyId: companyId }}
          >
            <ExportOutlined />
          </Link>
          {userId
            ? getCompanyName(id)
            : getEmailById(id, usersData?.users) || id}
        </Space>
      ),
    },
    {
      title: "Роль",
      dataIndex: "role_id",
      key: "role",
      render: (roleId: string) => <Tag color="blue">{getRoleName(roleId)}</Tag>,
    },
    {
      title: "Приложение",
      dataIndex: "application_id",
      key: "application",
      render: (appId: string) => getApplicationName(appId),
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

  const getApplicationName = (appId: string) => {
    const app = applicationsData?.applications.find(
      (a) => a.application_id === appId
    );
    return app ? app.application_name : appId;
  };

  const isTotalLoading =
    isLoading ||
    rolesLoading ||
    companiesLoading ||
    usersLoading ||
    applicationsLoading;

  const getHeaderTitle = () => {
    if (fromAccount) return "Компании";
    if (userId) return "Компании";
    return "Пользователи";
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
        <Spin size="large" />
      ) : isError ? (
        <Text type="danger">Ошибка при загрузке данных</Text>
      ) : (
        <>
          <div style={{ display: "flex", marginTop: 16 }}>
            <Typography.Title level={4} style={{ marginRight: 16 }}>
              {getHeaderTitle()}
            </Typography.Title>
            {showInviteButton() && (
              <Button
                icon={<PlusOutlined />}
                onClick={handleInvite}
                style={{ marginBottom: 16 }}
              >
                {isSuperadmin ? "Пригласить" : "Добавить"}
              </Button>
            )}
            {showAddButton() && (
              <Button
                icon={<PlusOutlined />}
                onClick={handleCreate}
                style={{ marginLeft: 8 }}
              >
                Добавить
              </Button>
            )}
          </div>
          <Table
            columns={columns}
            dataSource={data?.relations || []}
            rowKey="user_company_id"
            pagination={false}
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
