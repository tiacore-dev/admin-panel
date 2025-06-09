// EntityCompanyRelationsTable.tsx
import React, { useState } from "react";
import { Table, Typography, Space, Button, Spin, Dropdown, Tag } from "antd";
import { useEntityCompanyQuery } from "../hooks/entityCompanyRelations/useEntityCompanyRelationsQuery";
import { useLegalEntityQuery } from "../hooks/legalEntities/useLegalEntityQuery";
import { Link } from "react-router-dom";
import {
  ExportOutlined,
  MoreOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useEntityCompanyRelationMutations } from "../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";
import { ConfirmDeleteModal } from "./modals/confirmDeleteModal";
import { usePermissions } from "../context/permissionsContext";

interface EntityCompanyRelationsTableProps {
  companyId: string;
  relationType: "seller" | "buyer";
  title: string;
}

export const EntityCompanyRelationsTable: React.FC<
  EntityCompanyRelationsTableProps
> = ({ companyId, relationType, title }) => {
  const {
    data: relationsData,
    isLoading,
    isError,
    refetch,
  } = useEntityCompanyQuery(undefined, companyId, relationType);
  const { hasPermission } = usePermissions();
  const { data: legalEntitiesData } = useLegalEntityQuery();
  const { mutate: deleteMutation } = useEntityCompanyRelationMutations();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(
    null
  );

  if (isError)
    return (
      <Typography.Text type="danger">Ошибка загрузки данных</Typography.Text>
    );

  const legalEntitiesMap = new Map(
    legalEntitiesData?.entities?.map((entity) => [
      entity.legal_entity_id,
      entity,
    ])
  );

  const handleDelete = (relationId: string) => {
    setSelectedRelationId(relationId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedRelationId) {
      deleteMutation(selectedRelationId, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          refetch(); // Обновляем данные таблицы после удаления
        },
      });
    }
  };

  const getMenuItems = (relationId: string) => {
    const items = [];

    if (hasPermission("delete_entity_company_relation")) {
      items.push({
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Удалить",
        danger: true,
        onClick: () => handleDelete(relationId),
      });
    }

    return items;
  };

  const columns = [
    {
      title: relationType === "seller" ? "Организация" : "Контрагент",
      key: "legal_entity",
      render: (record: any) => {
        const legalEntity = legalEntitiesMap.get(record.legal_entity_id);
        return (
          <Space>
            <Link
              to={
                relationType === "seller"
                  ? `/legal-entities/sellers/${record.legal_entity_id}`
                  : `/legal-entities/buyers/${record.legal_entity_id}`
              }
            >
              <ExportOutlined />
            </Link>
            {legalEntity?.short_name || record.legal_entity_id}
          </Space>
        );
      },
    },
    // {
    //   title: "Тип связи",
    //   key: "relation_type",
    //   render: (record: any) => (
    //     <Tag color={record.relation_type === "seller" ? "green" : "blue"}>
    //       {record.relation_type === "seller" ? "Продавец" : "Покупатель"}
    //     </Tag>
    //   ),
    // },
    {
      title: "",
      key: "actions",
      width: 48,
      render: (record: any) => {
        const menuItems = getMenuItems(record.entity_company_relation_id);
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

  return (
    <div style={{ marginBottom: 24 }}>
      {/* <Typography.Title level={4}>{title}</Typography.Title> */}
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={relationsData?.relations || []}
          rowKey="entity_company_relation_id"
          pagination={false}
        />
      </Spin>

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleteLoading={false} // Можно добавить состояние загрузки из мутации, если нужно
        />
      )}
    </div>
  );
};
