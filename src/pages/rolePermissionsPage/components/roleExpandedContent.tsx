import React from "react";
import { Space } from "antd";
import { IncludeRolesTable } from "./includeRolesTable";
import { CreateIncludeRoleModal } from "./createIncludeRoleModal";
import { useRoleIncludeRelationsQuery } from "../../../hooks/includeRoles/useIncludeRolesQuery";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface RoleExpandedContentProps {
  roleId: string;
}

export const RoleExpandedContent: React.FC<RoleExpandedContentProps> = ({
  roleId,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const { data: includeRelations } = useRoleIncludeRelationsQuery({
    parent_role_id: roleId,
  });

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
          //   type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Добавить включаемую роль
        </Button>
      </Space>
      <IncludeRolesTable
        data={includeRelations?.relations || []}
        loading={false}
        total={includeRelations?.total || 0}
        page={1}
        pageSize={100}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
      />

      <CreateIncludeRoleModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={() => setIsCreateModalOpen(false)}
        parentRoleId={roleId}
      />
    </div>
  );
};
