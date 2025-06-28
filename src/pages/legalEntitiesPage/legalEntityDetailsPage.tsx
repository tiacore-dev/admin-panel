"use client";

import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import {
  Spin,
  Descriptions,
  Typography,
  Button,
  Space,
  Card,
  Avatar,
  Tag,
  Row,
  Col,
  Tooltip,
  message,
} from "antd";
import {
  BankOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLegalEntityDetailsQuery } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useDeleteLegalEntity } from "../../hooks/legalEntities/useLegalEntityMutation";
import { useUpdateLegalEntity } from "../../hooks/legalEntities/useLegalEntityMutation";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { EditLegalEntityModal } from "./components/editLegalEntityModal";
import type { ILegalEntityEdit } from "../../api/legalEntitiesApi";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";

const { Title, Text } = Typography;

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
    return (
      <Tag color="orange" icon={<FileTextOutlined />}>
        НДС не облагается
      </Tag>
    );
  }
  if (vatRate === 20) {
    return (
      <Tag color="green" icon={<FileTextOutlined />}>
        20%
      </Tag>
    );
  }
  if (vatRate === 5) {
    return (
      <Tag color="blue" icon={<FileTextOutlined />}>
        5%
      </Tag>
    );
  }
  if (vatRate === 7) {
    return (
      <Tag color="purple" icon={<FileTextOutlined />}>
        7%
      </Tag>
    );
  }
  return <Tag color="default">Не указано</Tag>;
};

export const LegalEntityDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { legal_entity_id } = useParams<{ legal_entity_id: string }>();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const {
    data: legalEntity,
    isLoading,
    isError,
    refetch,
  } = useLegalEntityDetailsQuery(legal_entity_id || "", {
    enabled: !!legal_entity_id,
  });

  const deleteMutation = useDeleteLegalEntity();
  const updateMutation = useUpdateLegalEntity();
  const location = useLocation();
  const { state: locationState } = location;

  React.useEffect(() => {
    if (locationState?.fromCompany) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Компании", to: "/companies" },
          {
            label: locationState.companyName || "Компания",
            to: `/companies/${locationState.companyId}`,
          },
          {
            label: legalEntity?.short_name || "Детали",
            to: `/legal-entities/${legal_entity_id}`,
          },
        ])
      );
    } else {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Юр. лица", to: "/legal-entities" },
          {
            label: legalEntity?.short_name || "Детали",
            to: `/legal-entities/${legal_entity_id}`,
          },
        ])
      );
    }
  }, [dispatch, legalEntity, legal_entity_id, locationState]);

  const handleDelete = () => {
    if (!legal_entity_id) return;

    deleteMutation.mutate(legal_entity_id, {
      onSuccess: () => {
        navigate("/legal-entities");
        message.success("Организация успешно удалена");
      },
      onError: () => {
        message.error("Ошибка при удалении организации");
      },
    });
  };

  const handleUpdate = (values: ILegalEntityEdit) => {
    if (!legal_entity_id) return;

    updateMutation.mutate(
      { legal_entity_id, updatedData: values },
      {
        onSuccess: () => {
          message.success("Данные успешно обновлены");
          setEditModalVisible(false);
          refetch();
        },
        onError: () => {
          message.error("Ошибка при обновлении данных");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="center-spin">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (isError || !legalEntity) {
    return (
      <div className="page-container">
        <div className="page-content">
          <BackButton />
          <div>Не удалось загрузить данные организации</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Header Card с контекстной навигацией */}
        <Card className="content-card">
          <Row align="middle" justify="space-between">
            <Col>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Avatar
                  size={64}
                  style={{
                    backgroundColor: getEntityColor(legalEntity.inn),
                    fontSize: 24,
                    fontWeight: 600,
                  }}
                  icon={!legalEntity.short_name ? <BankOutlined /> : null}
                >
                  {legalEntity.short_name
                    ? getEntityInitials(legalEntity.short_name)
                    : null}
                </Avatar>
                <div>
                  <ContextualNavigation
                    textColor="#8c8c8c"
                    size="small"
                    showIcon={true}
                  />
                  <Title level={2} style={{ margin: "4px 0 0 0" }}>
                    {legalEntity.short_name}
                  </Title>
                  <Space size="middle" style={{ marginTop: 8 }}>
                    <Text type="secondary">
                      {legalEntity.opf || "Организация"}
                    </Text>
                    {getVatRateTag(legalEntity.vat_rate)}
                  </Space>
                </div>
              </div>
            </Col>
            <Col>
              <Space size="middle">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditModalVisible(true)}
                  size="large"
                >
                  Редактировать
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setDeleteModalVisible(true)}
                  size="large"
                >
                  Удалить
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Basic Information */}
          <Col xs={24} lg={12}>
            <Card
              className="content-card"
              title={
                <Space>
                  <BankOutlined />
                  <span>Основная информация</span>
                </Space>
              }
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Полное название">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Text>{legalEntity.full_name || "—"}</Text>
                    {legalEntity.full_name && (
                      <Tooltip title="Копировать">
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() =>
                            copyToClipboard(
                              legalEntity.full_name!,
                              "Полное название"
                            )
                          }
                        />
                      </Tooltip>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Короткое название">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Text strong>{legalEntity.short_name}</Text>
                    <Tooltip title="Копировать">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() =>
                          copyToClipboard(legalEntity.short_name, "Название")
                        }
                      />
                    </Tooltip>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="ОПФ">
                  <Text>{legalEntity.opf || "—"}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Tax Information */}
          <Col xs={24} lg={12}>
            <Card
              className="content-card"
              title={
                <Space>
                  <FileTextOutlined />
                  <span>Налоговая информация</span>
                </Space>
              }
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="ИНН">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Text code strong>
                      {legalEntity.inn}
                    </Text>
                    <Tooltip title="Копировать ИНН">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(legalEntity.inn, "ИНН")}
                      />
                    </Tooltip>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="КПП">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Text code>{legalEntity.kpp || "—"}</Text>
                    {legalEntity.kpp && (
                      <Tooltip title="Копировать КПП">
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() =>
                            copyToClipboard(legalEntity.kpp!, "КПП")
                          }
                        />
                      </Tooltip>
                    )}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="ОГРН">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Text code>{legalEntity.ogrn}</Text>
                    <Tooltip title="Копировать ОГРН">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() =>
                          copyToClipboard(legalEntity.ogrn, "ОГРН")
                        }
                      />
                    </Tooltip>
                  </div>
                </Descriptions.Item>
                <Descriptions.Item label="Ставка НДС">
                  {getVatRateTag(legalEntity.vat_rate)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Address Information */}
          <Col xs={24} lg={12}>
            <Card
              className="content-card"
              title={
                <Space>
                  <EnvironmentOutlined />
                  <span>Адресная информация</span>
                </Space>
              }
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Адрес">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <Text style={{ flex: 1 }}>{legalEntity.address}</Text>
                    <Tooltip title="Копировать адрес">
                      <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() =>
                          copyToClipboard(legalEntity.address, "Адрес")
                        }
                      />
                    </Tooltip>
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} lg={12}>
            <Card
              className="content-card"
              title={
                <Space>
                  <UserOutlined />
                  <span>Контактная информация</span>
                </Space>
              }
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Подписант">
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Text>{legalEntity.signer || "—"}</Text>
                    {legalEntity.signer && (
                      <Tooltip title="Копировать">
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() =>
                            copyToClipboard(legalEntity.signer!, "Подписант")
                          }
                        />
                      </Tooltip>
                    )}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        {deleteModalVisible && (
          <ConfirmDeleteModal
            onConfirm={handleDelete}
            onCancel={() => setDeleteModalVisible(false)}
            isDeleteLoading={deleteMutation.isPending}
          />
        )}

        <EditLegalEntityModal
          visible={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          onSave={handleUpdate}
          initialValues={{
            short_name: legalEntity.short_name,
            full_name: legalEntity.full_name || undefined,
            inn: legalEntity.inn,
            kpp: legalEntity.kpp || undefined,
            ogrn: legalEntity.ogrn,
            opf: legalEntity.opf || undefined,
            vat_rate: legalEntity.vat_rate,
            address: legalEntity.address,
            signer: legalEntity.signer || undefined,
          }}
          isLoading={updateMutation.isPending}
        />
      </div>
    </div>
  );
};
