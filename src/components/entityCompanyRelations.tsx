import type React from "react";
import { useState } from "react";
import { Table, Typography, Button, Spin, Dropdown } from "antd";
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
import type { ILegalEntity } from "../api/legalEntitiesApi";

interface EntityCompanyRelationsTableProps {
  companyId: string;
  relationType: "seller" | "buyer";
  title: string;
  companyName?: string; // Добавляем новое свойство
}

export const EntityCompanyRelationsTable: React.FC<
  EntityCompanyRelationsTableProps
> = ({ companyId, relationType, companyName }) => {
  const {
    data: relationsData,
    isLoading,
    isError,
    refetch: refetchRelations,
  } = useEntityCompanyQuery(undefined, companyId, relationType);
  const { data: legalEntitiesData } = useLegalEntityQuery();
  const { mutate: deleteMutation } = useEntityCompanyRelationMutations();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRelationId, setSelectedRelationId] = useState<string | null>(
    null
  );
  const [searchParams] = useState({
    short_name: "",
    inn: "",
    ogrn: "",
    address: "",
    page: 1,
    page_size: 10,
  });

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

  const legalEntities =
    (relationsData?.relations
      ?.map((relation) => legalEntitiesMap.get(relation.legal_entity_id))
      .filter((entity) => entity !== undefined) as ILegalEntity[]) || [];

  const handleDelete = (relationId: string) => {
    setSelectedRelationId(relationId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedRelationId) {
      deleteMutation(selectedRelationId, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
          refetchRelations();
        },
      });
    }
  };

  const getMenuItems = (relationId: string) => {
    const items = [];

    items.push({
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Удалить из компании",
      danger: true,
      onClick: () => handleDelete(relationId),
    });

    return items;
  };

  const columns = [
    {
      title: relationType === "seller" ? "Организация" : "Контрагент",
      dataIndex: "short_name",
      key: "short_name",
      render: (text: string, record: ILegalEntity) => (
        <>
          <Link
            to={`/legal-entities/${relationType}s/${record.legal_entity_id}`}
            state={{
              fromCompany: true,
              companyId: companyId,
              companyName: companyName,
            }}
          >
            <ExportOutlined />
          </Link>{" "}
          {text}
        </>
      ),
    },
    {
      title: "ИНН",
      dataIndex: "inn",
      key: "inn",
    },
    {
      title: "КПП",
      dataIndex: "kpp",
      key: "kpp",
      render: (text: string) => text || "-",
    },
    {
      title: "ОГРН",
      dataIndex: "ogrn",
      key: "ogrn",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
    },
    ...(relationType === "seller"
      ? [
          {
            title: "Ставка НДС",
            dataIndex: "vat_rate",
            key: "vat_rate",
            render: (vatRate: number) =>
              vatRate === 0 ? "НДС не облагается" : `${vatRate}%`,
          },
        ]
      : []),
    {
      title: "",
      key: "actions",
      width: 48,
      render: (record: ILegalEntity) => {
        const relation = relationsData?.relations.find(
          (r) => r.legal_entity_id === record.legal_entity_id
        );

        if (!relation) return null;

        const menuItems = getMenuItems(relation.entity_company_relation_id);
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
      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={legalEntities}
          rowKey="legal_entity_id"
          pagination={{
            current: searchParams.page,
            pageSize: searchParams.page_size,
            total: legalEntities.length,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total) => (
              <Typography.Text>Всего: {total}</Typography.Text>
            ),
          }}
        />
      </Spin>

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleteLoading={false}
        />
      )}
    </div>
  );
};
