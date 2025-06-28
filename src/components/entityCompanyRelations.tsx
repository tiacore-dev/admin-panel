"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  Typography,
  Button,
  Spin,
  Dropdown,
  Avatar,
  Card,
  Tag,
  Tooltip,
  Empty,
  message,
} from "antd";
import { useEntityCompanyQuery } from "../hooks/entityCompanyRelations/useEntityCompanyRelationsQuery";
import { useLegalEntityQuery } from "../hooks/legalEntities/useLegalEntityQuery";
import { Link } from "react-router-dom";
import {
  ExportOutlined,
  MoreOutlined,
  DeleteOutlined,
  BankOutlined,
  CopyOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEntityCompanyRelationMutations } from "../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";
import { ConfirmDeleteModal } from "./modals/confirmDeleteModal";
import type { ILegalEntity } from "../api/legalEntitiesApi";

const { Text, Title } = Typography;

interface EntityCompanyRelationsTableProps {
  companyId: string;
  relationType: "seller" | "buyer";
  title: string;
  companyName?: string;
}

const getEntityInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const getEntityColor = (inn: string) => {
  const colors = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#87d068",
    "#108ee9",
  ];
  const index =
    inn.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  message.success(`${label} скопирован в буфер обмена`);
};

const getVatRateTag = (vatRate: number | null | undefined) => {
  if (vatRate === 0) {
    return <Tag color="orange">НДС не облагается</Tag>;
  }
  if (vatRate === 20) {
    return <Tag color="green">20%</Tag>;
  }
  if (vatRate === 5) {
    return <Tag color="blue">5%</Tag>;
  }
  if (vatRate === 7) {
    return <Tag color="purple">7%</Tag>;
  }
  return <Tag color="default">Не указано</Tag>;
};

export const EntityCompanyRelationsTable: React.FC<
  EntityCompanyRelationsTableProps
> = ({ companyId, relationType, companyName, title }) => {
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

  if (isError) {
    return (
      <Card>
        <Text type="danger">Ошибка загрузки данных</Text>
      </Card>
    );
  }

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
          message.success("Связь успешно удалена");
        },
        onError: () => {
          message.error("Ошибка при удалении связи");
        },
      });
    }
  };

  const getMenuItems = (relationId: string) => {
    return [
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Удалить из компании",
        danger: true,
        onClick: () => handleDelete(relationId),
      },
    ];
  };

  const columns = [
    {
      title: relationType === "seller" ? "Организация" : "Контрагент",
      dataIndex: "short_name",
      key: "short_name",
      width: 300,
      render: (text: string, record: ILegalEntity) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={40}
            style={{
              backgroundColor: getEntityColor(record.inn),
              fontSize: 14,
              fontWeight: 600,
            }}
            icon={!text ? <BankOutlined /> : null}
          >
            {text ? getEntityInitials(text) : null}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Link
                to={`/legal-entities/${record.legal_entity_id}`}
                state={{
                  fromCompany: true,
                  companyId: companyId,
                  companyName: companyName,
                }}
                style={{
                  fontWeight: 600,
                  color: "#1890ff",
                  textDecoration: "none",
                }}
              >
                {text}
              </Link>
              <Tooltip title="Перейти к деталям">
                <ExportOutlined style={{ color: "#1890ff", fontSize: 12 }} />
              </Tooltip>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.opf || "Организация"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "ИНН / КПП",
      key: "inn_kpp",
      width: 180,
      render: (record: ILegalEntity) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Text code strong style={{ fontSize: 12 }}>
              {record.inn}
            </Text>
            <Tooltip title="Копировать ИНН">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(record.inn, "ИНН")}
              />
            </Tooltip>
          </div>
          {record.kpp && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                КПП: {record.kpp}
              </Text>
              <Tooltip title="Копировать КПП">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(record.kpp!, "КПП")}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "ОГРН",
      dataIndex: "ogrn",
      key: "ogrn",
      width: 160,
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Text code style={{ fontSize: 11 }}>
            {text}
          </Text>
          <Tooltip title="Копировать ОГРН">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(text, "ОГРН")}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text style={{ fontSize: 12 }}>{text}</Text>
        </Tooltip>
      ),
    },
    ...(relationType === "seller"
      ? [
          {
            title: "НДС",
            dataIndex: "vat_rate",
            key: "vat_rate",
            width: 120,
            align: "center" as const,
            render: (vatRate: number) => getVatRateTag(vatRate),
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

  const cardTitle = (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: relationType === "seller" ? "#f0f9ff" : "#f0fdf4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BankOutlined
          style={{
            fontSize: 16,
            color: relationType === "seller" ? "#0ea5e9" : "#22c55e",
          }}
        />
      </div>
      <div>
        <Title level={5} style={{ margin: 0 }}>
          {title}
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {legalEntities.length} записей
        </Text>
      </div>
    </div>
  );

  return (
    <Card
      title={cardTitle}
      style={{ marginBottom: 24 }}
      extra={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => {
            // Здесь можно добавить логику для открытия модального окна создания связи
          }}
        >
          Добавить
        </Button>
      }
    >
      <Spin spinning={isLoading}>
        {legalEntities.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary">
                  Нет связанных{" "}
                  {relationType === "seller" ? "организаций" : "контрагентов"}
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      // Логика добавления
                    }}
                  >
                    Добавить{" "}
                    {relationType === "seller" ? "организацию" : "контрагента"}
                  </Button>
                </div>
              </div>
            }
          />
        ) : (
          <Table
            columns={columns}
            dataSource={legalEntities}
            rowKey="legal_entity_id"
            size="small"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total, range) => (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {range[0]}-{range[1]} из {total}
                </Text>
              ),
            }}
            onRow={(record) => ({
              style: { cursor: "pointer" },
              onMouseEnter: (e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.backgroundColor = "";
              },
            })}
          />
        )}
      </Spin>

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleteLoading={false}
        />
      )}
    </Card>
  );
};
