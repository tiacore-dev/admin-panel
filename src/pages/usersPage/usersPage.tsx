"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
  Statistic,
  Input,
  Select,
} from "antd";
import { useUserQueryAll } from "../../hooks/users/useUserQuery";
import { UsersTable } from "./components/usersTable";
import { UserFormModal } from "./components/userFormModal";
import {
  PlusOutlined,
  ClearOutlined,
  UserOutlined,
  TeamOutlined,
  CrownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import {
  resetState,
  setSearch,
  setIsVerified,
} from "../../redux/slices/usersSlice";
import type { RootState } from "../../redux/store";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const UsersPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Получаем значения фильтров из Redux
  const { email: searchText, is_verified: statusFilter } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Пользователи", to: "/users" },
      ])
    );
  }, [dispatch]);

  const { data: users_data, isLoading, isError } = useUserQueryAll();

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  // Обработчики изменений фильтров
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearch(e.target.value));
  };

  const handleStatusFilterChange = (value: boolean | "all") => {
    dispatch(setIsVerified(value));
  };

  // Фильтрация пользователей
  const filteredUsers =
    users_data?.users?.filter((user) => {
      const matchesSearch =
        user.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === true && user.is_verified) ||
        (statusFilter === false && !user.is_verified);
      return matchesSearch && matchesStatus;
    }) || [];

  // Статистика
  const totalUsers = users_data?.users?.length || 0;
  const verifiedUsers =
    users_data?.users?.filter((u) => u.is_verified)?.length || 0;
  const unverifiedUsers = totalUsers - verifiedUsers;
  const adminUsers =
    users_data?.users?.filter(
      (u) => u.email === "admin" || u.full_name?.toLowerCase().includes("admin")
    )?.length || 0;

  const hasFilters = !!(searchText || statusFilter !== "all");

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
                  <UserOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <div className="header-text">
                  <ContextualNavigation
                    textColor="rgba(255, 255, 255, 0.9)"
                    size="small"
                  />
                  <Title level={2} className="header-title">
                    Пользователи
                  </Title>
                  <Text className="header-description">
                    {totalUsers} записей
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
                  Добавить пользователя
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
                placeholder="Поиск по имени или email"
                value={searchText}
                onChange={handleSearchChange}
                style={{ width: "100%" }}
                allowClear
                prefix={<SearchOutlined />}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                style={{ width: "100%" }}
              >
                <Option value="all">Все статусы</Option>
                <Option value={true}>Верифицированные</Option>
                <Option value={false}>Неверифицированные</Option>
              </Select>
            </Col>
            <Button
              icon={<ClearOutlined />}
              disabled={!hasFilters}
              onClick={handleResetFilters}
            >
              Сбросить фильтры
            </Button>
          </Row>

          {/* Таблица пользователей */}
          <UsersTable
            data={{ total: filteredUsers.length, users: filteredUsers }}
            loading={isLoading}
          />
        </Card>

        <UserFormModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          mode="create"
        />
      </div>
    </div>
  );
};
