"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import { Button, Spin, Card, Typography, Row, Col } from "antd";
import { useLegalEntityQuery } from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntitiesTable } from "./components/legalEntitiesTable";
import {
  PlusOutlined,
  ClearOutlined,
  BankOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { resetState } from "../../redux/slices/legalEntitySellersSlice";
import type { RootState } from "../../redux/store";
import { CreateLegalEntityModal } from "./components/createLegalEntityModal";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";

const { Title, Text } = Typography;

export const LegalEntitiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { short_name, inn } = useSelector(
    (state: RootState) => state.legalEntitiesSellers
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Юр. лица", to: "/legal-entities" },
      ])
    );
  }, [dispatch]);

  const {
    data: legalEntitiesData,
    isLoading,
    isError,
    refetch,
  } = useLegalEntityQuery();

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  const handleSuccess = () => {
    refetch();
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

  if (isError) {
    return (
      <div className="page-container">
        <div className="page-content">
          <BackButton />
        </div>
      </div>
    );
  }

  const hasActiveFilters = short_name || inn;
  const totalEntities = legalEntitiesData?.total || 0;

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Градиентный заголовок */}
        <Card
          className="gradient-header"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <div className="header-content">
                <div className="header-icon">
                  <BankOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <div className="header-text">
                  <ContextualNavigation
                    textColor="rgba(255, 255, 255, 0.9)"
                    size="small"
                  />
                  <Title level={2} className="header-title">
                    Юридические лица
                  </Title>
                  <Text className="header-description">
                    Управление организациями и контрагентами • {totalEntities}{" "}
                    записей
                  </Text>
                </div>
              </div>
            </Col>
            <Col>
              <div className="header-actions">
                <Button
                  size="large"
                  icon={<ClearOutlined />}
                  disabled={!hasActiveFilters}
                  onClick={handleResetFilters}
                  className="filter-button"
                >
                  Сбросить фильтры
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                  className="primary-button"
                  style={{ color: "#667eea" }}
                >
                  Добавить юр. лицо
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Статистические карточки */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "#f0f9ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BankOutlined style={{ fontSize: 20, color: "#0ea5e9" }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Всего организаций
                </Text>
                <div
                  style={{ fontSize: 20, fontWeight: 600, color: "#0ea5e9" }}
                >
                  {totalEntities}
                </div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileTextOutlined style={{ fontSize: 20, color: "#22c55e" }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  С НДС 20%
                </Text>
                <div
                  style={{ fontSize: 20, fontWeight: 600, color: "#22c55e" }}
                >
                  {legalEntitiesData?.entities?.filter((e) => e.vat_rate === 20)
                    .length || 0}
                </div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FileTextOutlined style={{ fontSize: 20, color: "#f59e0b" }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Без НДС
                </Text>
                <div
                  style={{ fontSize: 20, fontWeight: 600, color: "#f59e0b" }}
                >
                  {legalEntitiesData?.entities?.filter((e) => e.vat_rate === 0)
                    .length || 0}
                </div>
              </div>
            </div>
          </Card>
          <Card className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "#fce7f3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BankOutlined style={{ fontSize: 20, color: "#ec4899" }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Активные фильтры
                </Text>
                <div
                  style={{ fontSize: 20, fontWeight: 600, color: "#ec4899" }}
                >
                  {hasActiveFilters ? "✓" : "—"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Основная таблица */}
        <Card
          className="content-card"
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BankOutlined />
              <span>Список юридических лиц</span>
            </div>
          }
          extra={
            hasActiveFilters && <Text type="secondary">Применены фильтры</Text>
          }
        >
          <LegalEntitiesTable
            data={legalEntitiesData || { total: 0, entities: [] }}
            loading={isLoading}
          />
        </Card>

        <CreateLegalEntityModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSuccess={handleSuccess}
          showCompanySelect={true}
        />
      </div>
    </div>
  );
};
