"use client";

import type React from "react";
import { useState } from "react";
import { Table, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { IRoleIncludeRelation } from "../../../api/includeRolesApi";
import { useIncludeRolesMutations } from "../../../hooks/includeRoles/useIncludeRolesMutations";
import { useRoleDetailsQuery } from "../../../hooks/role/useRoleQuery";
import { EditIncludeRoleModal } from "./editIncludeRoleModal";

interface IncludeRolesTableProps {
  data: IRoleIncludeRelation[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const RoleNameCell: React.FC<{ roleId: string }> = ({ roleId }) => {
  const { data: role } = useRoleDetailsQuery(roleId);
  return <span>{role?.role_name || roleId}</span>;
};

export const IncludeRolesTable: React.FC<IncludeRolesTableProps> = ({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [editingRelation, setEditingRelation] =
    useState<IRoleIncludeRelation | null>(null);
  const { deleteMutation } = useIncludeRolesMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting include role:", error);
    }
  };

  const columns: ColumnsType<IRoleIncludeRelation> = [
    {
      title: "Основная роль",
      dataIndex: "parent_role_id",
      key: "parent_role_id",
      render: (roleId: string) => <RoleNameCell roleId={roleId} />,
    },
    {
      title: "Включаемая роль",
      dataIndex: "child_role_id",
      key: "child_role_id",
      render: (roleId: string) => <RoleNameCell roleId={roleId} />,
    },
    {
      title: "Дата создания",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleString("ru-RU"),
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => setEditingRelation(record)}
            size="small"
          />
          <Popconfirm
            title="Удалить связь ролей?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDelete(record.role_include_relation_id)}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteMutation.isPending}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="role_include_relation_id"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} из ${total} записей`,
          onChange: onPageChange,
          onShowSizeChange: (current, size) => {
            onPageSizeChange(size);
            onPageChange(1);
          },
        }}
      />

      {editingRelation && (
        <EditIncludeRoleModal
          open={!!editingRelation}
          relation={editingRelation}
          onCancel={() => setEditingRelation(null)}
          onSuccess={() => setEditingRelation(null)}
        />
      )}
    </>
  );
};
