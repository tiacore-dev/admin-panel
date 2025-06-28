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
} from "@ant-design/icons";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import { resetState } from "../../redux/slices/usersSlice";
import type { RootState } from "../../redux/store";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const UsersPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { email, full_name, position, is_verified } = useSelector(
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
    setSearchText("");
    setStatusFilter("all");
  };

  // Фильтрация пользователей
  const filteredUsers =
    users_data?.users?.filter((user) => {
      const matchesSearch =
        user.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && user.is_verified) ||
        (statusFilter === "unverified" && !user.is_verified);
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

  const hasFilters = !!(
    email ||
    full_name ||
    position ||
    is_verified !== null ||
    searchText ||
    statusFilter !== "all"
  );

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
                    Управление пользователями системы • {totalUsers}{" "}
                    пользователей
                  </Text>
                </div>
              </div>
            </Col>
            <Col>
              <div className="header-actions">
                <Button
                  size="large"
                  icon={<ClearOutlined />}
                  disabled={!hasFilters}
                  onClick={handleResetFilters}
                  className="filter-button"
                >
                  Сбросить фильтры
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  className="primary-button"
                  style={{ color: "#667eea" }}
                >
                  Добавить пользователя
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Статистические карточки
        <div className="stats-grid">
          <Card className="stat-card">
            <Statistic
              title="Всего пользователей"
              value={totalUsers}
              prefix={<UserOutlined style={{ color: "#667eea" }} />}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Верифицированные"
              value={verifiedUsers}
              prefix={<TeamOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Неверифицированные"
              value={unverifiedUsers}
              prefix={<UserOutlined style={{ color: "#fa8c16" }} />}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Администраторы"
              value={adminUsers}
              prefix={<CrownOutlined style={{ color: "#722ed1" }} />}
            />
          </Card>
        </div> */}

        {/* Фильтры */}
        <Card className="filters-card">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Поиск по имени или email"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: "100%" }}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: "100%" }}
              >
                <Option value="all">Все статусы</Option>
                <Option value="verified">Верифицированные</Option>
                <Option value="unverified">Неверифицированные</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Таблица пользователей */}
        <Card className="content-card">
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
