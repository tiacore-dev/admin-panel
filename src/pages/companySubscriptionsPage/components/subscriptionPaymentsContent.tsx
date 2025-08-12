"use client";

import React from "react";
import { Space } from "antd";
import { SubscriptionPaymentsTable } from "./subscriptionPaymentsTable";
// import { CreateSubscriptionPaymentModal } from "./createSubscriptionPaymentModal";
import { useSubscriptionPaymentsByCompanySubscriptionQuery } from "../../../hooks/subscriptionPayments/useSubscriptionPaymentsQuery";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { CreateSubscriptionPaymentModal } from "./createSubscriptionPaymentModal";

interface SubscriptionPaymentsContentProps {
  companySubscriptionId: string;
}

export const SubscriptionPaymentsContent: React.FC<
  SubscriptionPaymentsContentProps
> = ({ companySubscriptionId }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { data: subscriptionPayments } =
    useSubscriptionPaymentsByCompanySubscriptionQuery(companySubscriptionId);

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
          Добавить платеж
        </Button>
      </Space>
      <SubscriptionPaymentsTable
        data={subscriptionPayments?.payments || []}
        loading={false}
        total={subscriptionPayments?.total || 0}
        page={1}
        pageSize={100}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />

      <CreateSubscriptionPaymentModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={() => setIsCreateModalOpen(false)}
        companySubscriptionId={companySubscriptionId}
      />
    </div>
  );
};
