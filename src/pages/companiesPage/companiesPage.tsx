"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
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
import { CompanyFormModal } from "./components/companyFormModal";
import { CompaniesTable } from "./components/companiesTable";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusOutlined,
  ClearOutlined,
  BankOutlined,
  ShopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import { resetState } from "../../redux/slices/companiesSlice";
import type { RootState } from "../../redux/store";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const CompaniesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { search } = useSelector((state: RootState) => state.companies);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Компании", to: "/companies" },
      ])
    );
  }, [dispatch]);

  const { data: companies_data, isLoading, isError } = useCompanyQuery();

  const handleResetFilters = () => {
    dispatch(resetState());
    setSearchText("");
    setStatusFilter("all");
  };

  // Фильтрация компаний
  const filteredCompanies =
    companies_data?.companies?.filter((company) => {
      const matchesSearch =
        company.company_name
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === "all";
      return matchesSearch && matchesStatus;
    }) || [];

  // Статистика
  const totalCompanies = companies_data?.companies?.length || 0;
  const activeCompanies = totalCompanies;
  const inactiveCompanies = 0;
  const hasActiveFilters = searchText || statusFilter !== "all" || search;

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
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
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
                    Компании
                  </Title>
                  <Text className="header-description">
                    Управление компаниями и организациями • {totalCompanies}{" "}
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
                  onClick={() => setIsModalVisible(true)}
                  className="primary-button"
                  style={{ color: "#4facfe" }}
                >
                  Добавить компанию
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Статистические карточки
        <div className="stats-grid">
          <Card className="stat-card">
            <Statistic
              title="Всего компаний"
              value={totalCompanies}
              prefix={<BankOutlined style={{ color: "#4facfe" }} />}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Активные"
              value={activeCompanies}
              prefix={<ShopOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Неактивные"
              value={inactiveCompanies}
              prefix={<TeamOutlined style={{ color: "#fa8c16" }} />}
            />
          </Card>
        </div> */}

        {/* Фильтры */}
        <Card className="filters-card">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Поиск по названию компании"
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
                <Option value="active">Активные</Option>
                <Option value="inactive">Неактивные</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Таблица компаний */}
        <Card className="content-card">
          <CompaniesTable
            data={companies_data || { total: 0, companies: [] }}
            loading={isLoading}
          />
        </Card>

        <CompanyFormModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          mode="create"
        />
      </div>
    </div>
  );
};
