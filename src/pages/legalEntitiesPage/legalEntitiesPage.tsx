"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import {
  Button,
  Spin,
  Card,
  Typography,
  Row,
  Col,
  Input,
  Select,
  Space,
} from "antd";
import { useLegalEntityQuery } from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntitiesTable } from "./components/legalEntitiesTable";
import {
  PlusOutlined,
  ClearOutlined,
  BankOutlined,
  FileTextOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  resetState,
  setInn,
  setOgrn,
  setShortName,
  setVatRate,
} from "../../redux/slices/legalEntitySellersSlice";
import type { RootState } from "../../redux/store";
import { CreateLegalEntityModal } from "./components/createLegalEntityModal";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const LegalEntitiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { short_name, inn, ogrn, address, vat_rate } = useSelector(
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

  const hasActiveFilters =
    short_name || inn || ogrn || address || vat_rate !== null;
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
                    {totalEntities} записей
                  </Text>
                </div>
              </div>
            </Col>
            <Col>
              <div className="header-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setModalVisible(true)}
                  className="primary-button"
                  style={{ color: "#764ba2" }}
                >
                  Добавить юр. лицо
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Фильтры */}
        {/* Фильтры */}
        <Card className="filters-card">
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col flex="auto">
              <Input
                placeholder="Поиск по названию"
                value={short_name}
                onChange={(e) => dispatch(setShortName(e.target.value))}
                allowClear
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col flex="auto">
              <Input
                placeholder="Поиск по ИНН"
                value={inn}
                onChange={(e) => dispatch(setInn(e.target.value))}
                allowClear
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col flex="auto">
              <Input
                placeholder="Поиск по ОГРН"
                value={ogrn}
                onChange={(e) => dispatch(setOgrn(e.target.value))}
                allowClear
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col>
              <Select
                placeholder="Ставка НДС"
                value={vat_rate}
                onChange={(value) => dispatch(setVatRate(value))}
                style={{ width: 165 }}
              >
                <Option value="0">НДС не облагается</Option>
                <Option value="5">5%</Option>
                <Option value="7">7%</Option>
                <Option value="20">20%</Option>
              </Select>
            </Col>
            <Col>
              <Button
                icon={<ClearOutlined />}
                onClick={handleResetFilters}
                disabled={!hasActiveFilters}
              >
                Сбросить фильтры
              </Button>
            </Col>
          </Row>

          {/* Основная таблица */}
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
