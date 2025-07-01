"use client";

import type React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin, Card, Typography, Input, Select, Row, Col } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { PlusOutlined, SafetyOutlined, ClearOutlined } from "@ant-design/icons";
import { RolesTable } from "./components/rolesTable";
import { useRolesQuery } from "../../hooks/role/useRoleQuery";
import { CreateRoleModal } from "./components/createRoleModal";
import { useAppsMap } from "../../hooks/base/useAppHelpers";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import {
  resetState,
  setSearchText,
  setSelectedApp,
} from "../../redux/slices/rolesSlice";
import type { RootState } from "../../redux/store";

const { Title, Text } = Typography;
const { Search } = Input;

export const RolePermissionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Получаем значения фильтров из Redux
  const { searchText, selectedApp } = useSelector(
    (state: RootState) => state.roles
  );

  const {
    data: roles_data,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useRolesQuery();
  const appsMap = useAppsMap();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Управление доступом", to: "/role_permissions_relations" },
      ])
    );
  }, [dispatch]);

  // Фильтрация ролей
  const filteredRoles = useMemo(() => {
    if (!roles_data?.roles) return [];

    return roles_data.roles.filter((role) => {
      const matchesSearch = role.role_name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesApp = !selectedApp || role.application_id === selectedApp;
      return matchesSearch && matchesApp;
    });
  }, [roles_data?.roles, searchText, selectedApp]);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Обработчики изменений фильтров
  const handleSearch = useCallback(
    (value: string) => {
      dispatch(setSearchText(value));
    },
    [dispatch]
  );

  const handleAppFilter = useCallback(
    (value: string) => {
      dispatch(setSelectedApp(value === "all" ? null : value));
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  // Вычисляем статистику для карточек
  const totalRoles = roles_data?.roles?.length || 0;
  const hasActiveFilters = searchText || selectedApp;

  if (isLoadingRoles) {
    return (
      <div className="page-container">
        <div className="center-spin">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (isErrorRoles) {
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
                  <SafetyOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <div className="header-text">
                  <ContextualNavigation
                    textColor="rgba(255, 255, 255, 0.9)"
                    size="small"
                  />
                  <Title level={2} className="header-title">
                    Роли и права доступа
                  </Title>
                  <Text className="header-description">
                    {totalRoles} записей
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
                  onClick={showModal}
                  className="primary-button"
                  style={{ color: "#764ba2" }}
                >
                  Создать роль
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Основной контент */}
        <Card className="filters-card" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Поиск по названию роли..."
                allowClear
                value={searchText}
                onChange={(e) => dispatch(setSearchText(e.target.value))}
                onSearch={handleSearch}
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Фильтр по приложению"
                allowClear
                value={selectedApp || undefined}
                onChange={handleAppFilter}
                style={{ width: "100%" }}
              >
                <Select.Option value="all">Все приложения</Select.Option>
                {Array.from(appsMap.entries()).map(([id, name]) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Button
                icon={<ClearOutlined />}
                disabled={!hasActiveFilters}
                onClick={clearFilters}
              >
                Сбросить фильтры
              </Button>
            </Col>
          </Row>

          <RolesTable
            rolesData={{
              total: filteredRoles.length,
              roles: filteredRoles,
            }}
          />
        </Card>

        <CreateRoleModal
          visible={isModalOpen}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};
