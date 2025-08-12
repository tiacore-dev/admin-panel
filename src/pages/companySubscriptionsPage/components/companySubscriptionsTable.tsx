"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ICompanySubscription } from "../../../api/companySubscriptionsApi";
import {
  Button,
  Table,
  type TableColumnsType,
  Typography,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import { useCompanyQuery } from "../../../hooks/companies/useCompanyQuery";
import { useSubscriptionsQuery } from "../../../hooks/subscriptions/useSubscriptionsQuery";
import { getTegColorForString } from "../../../utils/stringToColour";
import { SubscriptionPaymentsContent } from "./subscriptionPaymentsContent";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCompanySubscriptionsMutations } from "../../../hooks/companySubscriptions/useCompanySubscriptionsMutations";
import { EditCompanySubscriptionModal } from "./editCompanySubscriptionModal";
import { createCompaniesMap } from "../../../utils/companiesUtils";
import { createSubsMap } from "../../../utils/subscriptionUtils";

interface CompanySubscriptionsTableResponse {
  subscriptionsData: {
    total: number;
    subscriptions: ICompanySubscription[];
  };
}

export const CompanySubscriptionsTable: React.FC<
  CompanySubscriptionsTableResponse
> = ({ subscriptionsData = { total: 0, subscriptions: [] } }) => {
  const navigate = useNavigate();
  const { data: companiesData } = useCompanyQuery();
  const { data: subData } = useSubscriptionsQuery();

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [editingSubscription, setEditingSubscription] =
    useState<ICompanySubscription | null>(null);
  const { deleteMutation } = useCompanySubscriptionsMutations();

  const companiesMap = useMemo(() => {
    return createCompaniesMap(companiesData?.companies || []);
  }, [companiesData]);

  const subscriptionsMap = useMemo(() => {
    return createSubsMap(subData?.subscriptions || []);
  }, [subscriptionsData]);

  const handleSubscriptionClick = useCallback(
    (subscriptionId: string) => {
      navigate(`/company-subscriptions/${subscriptionId}`);
    },
    [navigate]
  );

  const handleExpand = useCallback(
    (expanded: boolean, record: ICompanySubscription) => {
      if (expanded) {
        setExpandedRowKeys([record.company_subscription_id]);
      } else {
        setExpandedRowKeys([]);
      }
    },
    []
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting company subscription:", error);
    }
  };

  const columns: TableColumnsType<ICompanySubscription> = useMemo(
    () => [
      {
        title: "Компания",
        dataIndex: "company_id",
        key: "company_id",
        render: (text: string, record: ICompanySubscription) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              fontWeight: 600,
              color: "#1890ff",
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onClick={() =>
              handleSubscriptionClick(record.company_subscription_id)
            }
          >
            {companiesMap.get(text) || text}
          </div>
        ),
        sorter: (a, b) => {
          const companyA = companiesMap.get(a.company_id) || a.company_id;
          const companyB = companiesMap.get(b.company_id) || b.company_id;
          return companyA.localeCompare(companyB);
        },
      },
      {
        title: "Подписка",
        dataIndex: "subscription_id",
        key: "subscription_id",
        render: (text: string, record: ICompanySubscription) => {
          const subscriptionName = subscriptionsMap.get(text);
          const color = subscriptionName
            ? getTegColorForString(subscriptionName)
            : "default";
          return subscriptionName ? (
            <Tag color={color} style={{ fontSize: 14 }}>
              {subscriptionName}
            </Tag>
          ) : (
            <Tag color="orange">Неизвестная подписка</Tag>
          );
        },
      },
      {
        title: "Дата создания",
        dataIndex: "created_at",
        key: "created_at",
        render: (date: string) => (
          <Typography>{new Date(date).toLocaleDateString("ru-RU")}</Typography>
        ),
        sorter: (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      },
      {
        title: "",
        key: "actions",
        width: 120,
        render: (_, record: ICompanySubscription) => (
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setEditingSubscription(record);
              }}
            />
            <Popconfirm
              title="Удалить подписку компании?"
              description="Это действие нельзя отменить"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(record.company_subscription_id);
              }}
              onCancel={(e) => e?.stopPropagation()}
              okText="Да"
              cancelText="Нет"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={deleteMutation.isPending}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [
      handleSubscriptionClick,
      companiesMap,
      subscriptionsMap,
      deleteMutation.isPending,
    ]
  );

  const paginationConfig = useMemo(
    () => ({
      total: subscriptionsData.total,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      showTotal: (total: number, range: [number, number]) => (
        <Typography.Text type="secondary">Всего {total}</Typography.Text>
      ),
    }),
    [subscriptionsData.total]
  );

  return (
    <>
      <Table
        columns={columns}
        dataSource={subscriptionsData.subscriptions}
        rowKey="company_subscription_id"
        pagination={paginationConfig}
        size="middle"
        scroll={{ x: 600 }}
        expandable={{
          expandedRowRender: (record) => (
            <SubscriptionPaymentsContent
              companySubscriptionId={record.company_subscription_id}
            />
          ),
          expandedRowKeys,
          onExpand: handleExpand,
        }}
      />
      {editingSubscription && (
        <EditCompanySubscriptionModal
          subscription={editingSubscription}
          onCancel={() => setEditingSubscription(null)}
          onSuccess={() => setEditingSubscription(null)}
        />
      )}
    </>
  );
};
