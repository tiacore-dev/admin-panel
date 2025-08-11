"use client";

import type React from "react";
import { useState } from "react";
import { Button, Card, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRoleIncludeRelationsQuery } from "../../hooks/includeRoles/useIncludeRolesQuery";
import { IncludeRolesTable } from "./components/includeRolesTable";
import { CreateIncludeRoleModal } from "./components/createIncludeRoleModal";

const { Title } = Typography;

export const IncludeRolesPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, error } = useRoleIncludeRelationsQuery({
    page,
    page_size: pageSize,
  });

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Включение ролей
          </Title>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Добавить связь
            </Button>
          </Space>
        </div>

        <IncludeRolesTable
          data={data?.relations || []}
          loading={isLoading}
          total={data?.total || 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />

        <CreateIncludeRoleModal
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </Card>
    </div>
  );
};
