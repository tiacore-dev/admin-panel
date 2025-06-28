"use client";

import type React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import {
  Button,
  Spin,
  Card,
  Typography,
  Space,
  Input,
  Select,
  Row,
  Col,
  Empty,
  Statistic,
} from "antd";
import { BackButton } from "../../components/buttons/backButton";
import {
  PlusOutlined,
  UserOutlined,
  SafetyOutlined,
  KeyOutlined,
  SettingOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { RolesTable } from "./components/rolesTable";
import { useRolesQuery } from "../../hooks/role/useRoleQuery";
import { CreateRoleModal } from "./components/createRoleModal";
import { useAppsMap } from "../../hooks/base/useAppHelpers";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";

const { Title, Text } = Typography;
const { Search } = Input;

export const RolePermissionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedApp, setSelectedApp] = useState<string | undefined>(undefined);

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

  // Статистика
  const statistics = useMemo(() => {
    if (!roles_data?.roles) return { total: 0, byApp: new Map() };

    const byApp = new Map<string, number>();
    roles_data.roles.forEach((role) => {
      const count = byApp.get(role.application_id) || 0;
      byApp.set(role.application_id, count + 1);
    });

    return {
      total: roles_data.roles.length,
      byApp,
      filtered: filteredRoles.length,
    };
  }, [roles_data?.roles, filteredRoles.length]);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
  }, []);

  const handleAppFilter = useCallback((value: string) => {
    setSelectedApp(value === "all" ? undefined : value);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchText("");
    setSelectedApp(undefined);
  }, []);

  // Вычисляем статистику для карточек
  const totalRoles = roles_data?.roles?.length || 0;
  const systemRoles =
    roles_data?.roles?.filter(
      (role) =>
        role.role_name.toLowerCase().includes("admin") ||
        role.role_name.toLowerCase().includes("system")
    )?.length || 0;
  const customRoles = totalRoles - systemRoles;
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

  const hasRoles = roles_data?.roles && roles_data.roles.length > 0;

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Градиентный заголовок */}
        <Card
          className="gradient-header"
          style={{
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
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
                    Управление ролями и разрешениями • {totalRoles} ролей
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
                  onClick={clearFilters}
                  className="filter-button"
                >
                  Сбросить фильтры
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={showModal}
                  className="primary-button"
                  style={{ color: "#ff6b6b" }}
                >
                  Создать роль
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Статистические карточки */}
        <div className="stats-grid">
          <Card className="stat-card">
            <Statistic
              title="Всего ролей"
              value={totalRoles}
              prefix={<SafetyOutlined style={{ color: "#ff6b6b" }} />}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Системные роли"
              value={systemRoles}
              prefix={<SettingOutlined style={{ color: "#ee5a24" }} />}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Пользовательские роли"
              value={customRoles}
              prefix={<KeyOutlined style={{ color: "#ff9ff3" }} />}
            />
          </Card>
        </div>

        {/* Основной контент */}
        <Card className="content-card">
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
          >
            <Col>
              <Space direction="vertical" size="small">
                <Title level={3} style={{ margin: 0 }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  Управление ролями
                </Title>
                <Text type="secondary">
                  Создавайте и управляйте ролями пользователей для различных
                  приложений
                </Text>
              </Space>
            </Col>
          </Row>

          {/* Фильтры и поиск */}
          {hasRoles && (
            <Card className="filters-card" style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={8}>
                  <Search
                    placeholder="Поиск по названию роли..."
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={handleSearch}
                    style={{ width: "100%" }}
                  />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Select
                    placeholder="Фильтр по приложению"
                    allowClear
                    value={selectedApp}
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
                  <Space>
                    <Text type="secondary">
                      Найдено: {statistics.filtered} из {statistics.total}
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          )}

          {!hasRoles ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text>Роли не найдены</Text>
                  <Text type="secondary">
                    Создайте первую роль для начала работы
                  </Text>
                </Space>
              }
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showModal}
              >
                Создать первую роль
              </Button>
            </Empty>
          ) : filteredRoles.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text>Роли не найдены по заданным критериям</Text>
                  <Text type="secondary">
                    Попробуйте изменить параметры поиска
                  </Text>
                </Space>
              }
            >
              <Button onClick={clearFilters}>Сбросить фильтры</Button>
            </Empty>
          ) : (
            <RolesTable
              rolesData={{
                total: filteredRoles.length,
                roles: filteredRoles,
              }}
            />
          )}
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
