"use client";

import React, { useState } from "react";
import { Table, Button, Space, Popconfirm, Typography, Tag, Badge } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { ISubscriptionPayment } from "../../../api/subscriptionPaymentsApi";
import { useSubscriptionPaymentsMutations } from "../../../hooks/subscriptionPayments/useSubscriptionPaymentsMutations";
import { EditSubscriptionPaymentModal } from "./editSubscriptionPaymentModal";

const { Text } = Typography;

interface SubscriptionPaymentsTableProps {
  data: ISubscriptionPayment[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const SubscriptionPaymentsTable: React.FC<
  SubscriptionPaymentsTableProps
> = ({
  data,
  loading,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [editingPayment, setEditingPayment] =
    useState<ISubscriptionPayment | null>(null);
  const { deleteMutation } = useSubscriptionPaymentsMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting subscription payment:", error);
    }
  };

  const columns: ColumnsType<ISubscriptionPayment> = [
    {
      title: "Сумма",
      dataIndex: "payment_amount",
      key: "payment_amount",
      render: (amount: number) => (
        <Text strong>{amount.toLocaleString("ru-RU")} ₽</Text>
      ),
      sorter: (a, b) => a.payment_amount - b.payment_amount,
    },
    {
      title: "Дата платежа",
      dataIndex: "payment_date",
      key: "payment_date",
      render: (date: string) => (
        <Text> {new Date(date).toLocaleDateString("ru-RU")}</Text>
      ),
      sorter: (a, b) =>
        new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime(),
    },
    {
      title: "Период",
      key: "period",
      render: (_, record) => (
        <Text>
          <Typography>
            {new Date(record.date_from).toLocaleDateString("ru-RU")}-
            {new Date(record.date_to).toLocaleDateString("ru-RU")}
          </Typography>
        </Text>
      ),
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
            onClick={() => setEditingPayment(record)}
          />
          <Popconfirm
            title="Удалить платеж?"
            description="Это действие нельзя отменить"
            onConfirm={() => handleDelete(record.subscription_payment_id)}
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
        rowKey="payment_id"
        pagination={false}
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        }}
      />
      {editingPayment && (
        <EditSubscriptionPaymentModal
          payment={editingPayment}
          onCancel={() => setEditingPayment(null)}
          onSuccess={() => setEditingPayment(null)}
        />
      )}
    </>
  );
};
