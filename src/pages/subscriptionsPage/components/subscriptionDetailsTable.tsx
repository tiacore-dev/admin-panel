"use client";

import type React from "react";
import { useState } from "react";
import { Table, Button, Space, Popconfirm, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ISubscriptionDetail } from "../../../api/subscriptionDetailsApi";
import { useSubscriptionDetailsMutations } from "../../../hooks/subscriptionDetails/useSubscriptionDetailsMutations";
import { EditSubscriptionDetailModal } from "./editSubscriptionDetailModal";
import { useQueryClient } from "@tanstack/react-query";

const { Text } = Typography;

interface DeleteButtonProps {
  record: ISubscriptionDetail;
  onSuccess: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ record, onSuccess }) => {
  const { deleteMutation } = useSubscriptionDetailsMutations(
    record.subscription_detail_id,
    undefined,
    record.subscription_id
  );

  return (
    <Popconfirm
      title="Удалить деталь подписки?"
      description="Это действие нельзя отменить"
      onConfirm={async () => {
        try {
          await deleteMutation.mutateAsync(record.subscription_detail_id, {
            onSuccess: () => onSuccess(),
          });
        } catch (error) {
          console.error("Error deleting subscription detail:", error);
        }
      }}
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
  );
};

interface SubscriptionDetailsTableProps {
  data: ISubscriptionDetail[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const SubscriptionDetailsTable: React.FC<
  SubscriptionDetailsTableProps
> = ({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [editingDetail, setEditingDetail] =
    useState<ISubscriptionDetail | null>(null);
  const queryClient = useQueryClient();

  const handleDeleteSuccess = (subscriptionId: string) => {
    queryClient.invalidateQueries({
      queryKey: ["subscriptionDetailsBySubscription", subscriptionId],
    });
  };

  const columns: ColumnsType<ISubscriptionDetail> = [
    {
      title: "Название сущности",
      dataIndex: "entity_name",
      key: "entity_name",
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: "Таблица БД",
      dataIndex: "bd_table",
      key: "bd_table",
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: "Ограничение",
      dataIndex: "restriction",
      key: "restriction",
      render: (restriction: number) => (
        <Text>{restriction.toLocaleString("ru-RU")}</Text>
      ),
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      render: (description?: string) => <Text>{description || "—"}</Text>,
    },
    {
      title: "",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => setEditingDetail(record)}
          />
          <DeleteButton
            record={record}
            onSuccess={() => handleDeleteSuccess(record.subscription_id)}
          />
        </Space>
      ),
    },
  ];

  const { updateMutation } = useSubscriptionDetailsMutations(
    editingDetail?.subscription_detail_id,
    () => setEditingDetail(null),
    editingDetail?.subscription_id
  );

  const handleEditSuccess = () => {
    setEditingDetail(null);
    if (editingDetail) {
      queryClient.invalidateQueries({
        queryKey: [
          "subscriptionDetailsBySubscription",
          editingDetail.subscription_id,
        ],
      });
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="subscription_detail_id"
        pagination={false}
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        }}
      />
      {editingDetail && (
        <EditSubscriptionDetailModal
          detail={editingDetail}
          onCancel={() => setEditingDetail(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
};
