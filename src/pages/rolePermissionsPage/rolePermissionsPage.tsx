"use client";

// src/pages/rolePermissions/rolePermissionsPage.tsx
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
} from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { RolesTable } from "./components/rolesTable";
import { useRolesQuery } from "../../hooks/role/useRoleQuery";
import { CreateRoleModal } from "./components/createRoleModal";
import { useAppsMap } from "../../hooks/base/useAppHelpers";

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

  if (isLoadingRoles) {
    return <Spin size="large" className="center-spin" />;
  }

  if (isErrorRoles) {
    return <BackButton />;
  }

  const hasRoles = roles_data?.roles && roles_data.roles.length > 0;

  return (
    <div className="main-container">
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Заголовок страницы */}
        <Card>
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <Title level={2} style={{ margin: 0 }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  Управление ролями
                </Title>
                <Text type="secondary">
                  Создавайте и управляйте ролями пользователей для различных
                  приложений
                </Text>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={showModal}
              >
                Создать роль
              </Button>
            </Col>
          </Row>

          {/* Фильтры и поиск */}
          {hasRoles && (
            <div style={{ margin: "16px 0" }}>
              {" "}
              {/* Добавляем отступы сверху и снизу */}
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
                    <Button onClick={clearFilters}>Сбросить фильтры</Button>
                    <Text type="secondary">
                      Найдено: {statistics.filtered} из {statistics.total}
                    </Text>
                  </Space>
                </Col>
              </Row>
            </div>
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
      </Space>

      <CreateRoleModal
        visible={isModalOpen}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </div>
  );
};
