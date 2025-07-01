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
  SearchOutlined,
} from "@ant-design/icons";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import {
  resetState,
  setSearch,
  setPage,
} from "../../redux/slices/companiesSlice";
import type { RootState } from "../../redux/store";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export const CompaniesPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    setStatusFilter("all");
  };

  // Фильтрация компаний
  const filteredCompanies =
    companies_data?.companies?.filter((company) => {
      const matchesSearch =
        !search ||
        company.company_name?.toLowerCase().includes(search.toLowerCase()) ||
        company.description?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all";
      return matchesSearch && matchesStatus;
    }) || [];

  // Статистика
  const totalCompanies = companies_data?.companies?.length || 0;
  const hasActiveFilters = search || statusFilter !== "all";

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
                    {totalCompanies} записей
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
                  Добавить компанию
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
                placeholder="Поиск по названию или описанию"
                prefix={<SearchOutlined />}
                value={search}
                onChange={(e) => {
                  dispatch(setSearch(e.target.value));
                  dispatch(setPage(1));
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
          {/* </Card> */}

          {/* Таблица компаний */}
          {/* <Card className="content-card"> */}
          <CompaniesTable
            data={{
              total: filteredCompanies.length,
              companies: filteredCompanies,
            }}
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
