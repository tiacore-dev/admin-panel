import React from "react";
import { Space } from "antd";
import { SubscriptionDetailsTable } from "./subscriptionDetailsTable";
import { CreateSubscriptionDetailModal } from "./createSubscriptionDetailModal";
import { useSubscriptionDetailsBySubscriptionQuery } from "../../../hooks/subscriptionDetails/useSubscriptionDetailsQuery";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface SubscriptionDetailsContentProps {
  subscriptionId: string;
}

export const SubscriptionDetailsContent: React.FC<
  SubscriptionDetailsContentProps
> = ({ subscriptionId }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { data: subscriptionDetails, refetch } =
    useSubscriptionDetailsBySubscriptionQuery(subscriptionId);

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    refetch();
  };

  return (
    <div style={{ margin: 0 }}>
      <Space
        style={{
          marginBottom: 4,
          display: "flex",
          justifyContent: "end",
        }}
      >
        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Добавить деталь подписки
        </Button>
      </Space>
      <SubscriptionDetailsTable
        data={subscriptionDetails?.details || []}
        loading={false}
        total={subscriptionDetails?.total || 0}
        page={1}
        pageSize={100}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />

      <CreateSubscriptionDetailModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
        subscriptionId={subscriptionId}
      />
    </div>
  );
};
