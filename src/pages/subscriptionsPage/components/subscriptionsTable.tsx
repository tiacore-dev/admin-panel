import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ISubscription } from "../../../api/subscriptionsApi";
import {
  Button,
  Table,
  type TableColumnsType,
  Typography,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import { useAppsMap } from "../../../hooks/base/useAppHelpers";
import { getTegColorForString } from "../../../utils/stringToColour";
import { SubscriptionDetailsContent } from "./subscriptionDetailsContent";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSubscriptionsMutations } from "../../../hooks/subscriptions/useSubscriptionsMutations";
import { EditSubscriptionModal } from "./editSubscriptionModal";

interface SubscriptionsTableResponse {
  subscriptionsData: {
    total: number;
    subscriptions: ISubscription[];
  };
}

export const SubscriptionsTable: React.FC<SubscriptionsTableResponse> = ({
  subscriptionsData = { total: 0, subscriptions: [] },
}) => {
  const navigate = useNavigate();
  const appsMap = useAppsMap();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [editingSubscription, setEditingSubscription] =
    useState<ISubscription | null>(null);
  const { deleteMutation } = useSubscriptionsMutations();

  const handleSubscriptionClick = useCallback(
    (subscriptionId: string) => {
      navigate(`/subscriptions/${subscriptionId}`);
    },
    [navigate]
  );

  const handleExpand = useCallback(
    (expanded: boolean, record: ISubscription) => {
      if (expanded) {
        setExpandedRowKeys([record.subscription_id]);
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
      console.error("Error deleting subscription:", error);
    }
  };

  const columns: TableColumnsType<ISubscription> = useMemo(
    () => [
      {
        title: "Название подписки",
        dataIndex: "subscription_name",
        key: "subscription_name",
        render: (text: string, record: ISubscription) => (
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
            onClick={() => handleSubscriptionClick(record.subscription_id)}
          >
            {text}
          </div>
        ),
        sorter: (a, b) =>
          a.subscription_name.localeCompare(b.subscription_name),
      },
      {
        title: "Приложение",
        dataIndex: "application_id",
        key: "application_id",
        render: (applicationId: string) => {
          const appName = appsMap.get(applicationId);
          const color = appName ? getTegColorForString(appName) : "default";
          return appName ? (
            <Tag color={color} style={{ fontSize: 14 }}>
              {appName}
            </Tag>
          ) : (
            <Tag color="orange">Неизвестное приложение</Tag>
          );
        },
        sorter: (a, b) => {
          const appNameA = appsMap.get(a.application_id) || "";
          const appNameB = appsMap.get(b.application_id) || "";
          return appNameA.localeCompare(appNameB);
        },
      },
      {
        title: "Цена",
        dataIndex: "price",
        key: "price",
        render: (price: number) => (
          <Typography>{price.toLocaleString("ru-RU")} ₽</Typography>
        ),
        sorter: (a, b) => a.price - b.price,
      },
      {
        title: "Описание",
        dataIndex: "description",
        key: "description",
        render: (description?: string) => (
          <Typography>{description || "—"}</Typography>
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
              onClick={(e) => {
                e.stopPropagation();
                setEditingSubscription(record);
              }}
            />
            <Popconfirm
              title="Удалить подписку?"
              description="Это действие нельзя отменить"
              onConfirm={(e) => {
                e?.stopPropagation();
                handleDelete(record.subscription_id);
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
    [handleSubscriptionClick, appsMap, deleteMutation.isPending]
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
        rowKey="subscription_id"
        pagination={paginationConfig}
        size="middle"
        scroll={{ x: 600 }}
        expandable={{
          expandedRowRender: (record) => (
            <SubscriptionDetailsContent
              subscriptionId={record.subscription_id}
            />
          ),
          expandedRowKeys,
          onExpand: handleExpand,
        }}
      />
      {editingSubscription && (
        <EditSubscriptionModal
          subscription={editingSubscription}
          onCancel={() => setEditingSubscription(null)}
          onSuccess={() => setEditingSubscription(null)}
        />
      )}
    </>
  );
};
