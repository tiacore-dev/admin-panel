"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import {
  Spin,
  Button,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Input,
  Select,
} from "antd";
import { CityFormModal } from "./cityFormModal";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusOutlined,
  ClearOutlined,
  BankOutlined,
  ShopOutlined,
  TeamOutlined,
  SearchOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import {
  resetState,
  setCityName,
  setRegion,
  setPage,
} from "../../redux/slices/citiesSlice";
import type { RootState } from "../../redux/store";
import { useCitiesQuery } from "../../hooks/cities/useCitiesQuery";
import { CitiesTable } from "./citiesTable";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const CitiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { city_name, region } = useSelector((state: RootState) => state.cities);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Города", to: "/cities" },
      ])
    );
  }, [dispatch]);

  const { data: cities_data, isLoading, isError } = useCitiesQuery();

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  // Безопасная фильтрация данных
  const filteredData =
    cities_data?.cities?.filter((city) => {
      const matchesCityName = city_name
        ? city.city_name.toLowerCase().includes(city_name.toLowerCase())
        : true;
      const matchesRegion = region
        ? city.region.toLowerCase().includes(region.toLowerCase())
        : true;
      return matchesCityName && matchesRegion;
    }) || [];

  // Статистика с проверкой на наличие данных
  const totalCities = cities_data?.cities?.length || 0;
  const hasActiveFilters = Boolean(city_name) || Boolean(region);

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
                  <EnvironmentOutlined
                    style={{ fontSize: 24, color: "white" }}
                  />
                </div>
                <div className="header-text">
                  <ContextualNavigation
                    textColor="rgba(255, 255, 255, 0.9)"
                    size="small"
                  />
                  <Title level={2} className="header-title">
                    Города
                  </Title>
                  <Text className="header-description">
                    {totalCities} записей
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
                  onClick={() => setIsModalVisible(true)}
                  className="primary-button"
                  style={{ color: "#764ba2" }}
                >
                  Добавить город
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Фильтры */}
        <Card className="filters-card">
          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Поиск по названию города"
                prefix={<SearchOutlined />}
                value={city_name || ""}
                onChange={(e) => {
                  dispatch(setCityName(e.target.value));
                }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Поиск по региону"
                prefix={<SearchOutlined />}
                value={region || ""}
                onChange={(e) => {
                  dispatch(setRegion(e.target.value));
                }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                icon={<ClearOutlined />}
                disabled={!hasActiveFilters}
                onClick={handleResetFilters}
              >
                Сбросить фильтры
              </Button>
            </Col>
          </Row>

          {/* Таблица городов */}
          <CitiesTable
            data={{
              total: filteredData.length,
              cities: filteredData,
            }}
            loading={isLoading}
          />
        </Card>

        <CityFormModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          mode="create"
        />
      </div>
    </div>
  );
};
