"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin, Card, Typography, Input, Select, Row, Col } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { PlusOutlined, ClearOutlined, SafetyOutlined } from "@ant-design/icons";
import { CompanySubscriptionsTable } from "./components/companySubscriptionsTable";
import { useCompanySubscriptionsQuery } from "../../hooks/companySubscriptions/useCompanySubscriptionsQuery";
import { CreateCompanySubscriptionModal } from "./components/createCompanySubscriptionModal";
import { useCompanyQuery } from "../../hooks/companies/useCompanyQuery";
import { useSubscriptionsQuery } from "../../hooks/subscriptions/useSubscriptionsQuery";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import {
  resetState,
  setSearchText,
  setSelectedCompany,
  setSelectedSubscription,
} from "../../redux/slices/companySubscriptionsSlice";
import type { RootState } from "../../redux/store";
import { createCompaniesMap } from "../../utils/companiesUtils";
import { createSubsMap } from "../../utils/subscriptionUtils";

const { Title, Text } = Typography;
const { Search } = Input;

export const CompanySubscriptionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { searchText, selectedCompany, selectedSubscription } = useSelector(
    (state: RootState) => state.companySubscriptions
  );

  const {
    data: companySubscriptionsData,
    isLoading: isLoadingCompanySubscriptions,
    isError: isErrorCompanySubscriptions,
  } = useCompanySubscriptionsQuery();
  const { data: companiesData } = useCompanyQuery();
  const companiesMap = useMemo(() => {
    return createCompaniesMap(companiesData?.companies || []);
  }, [companiesData]);
  const { data: subscriptionsData } = useSubscriptionsQuery();

  const subscriptionsMap = useMemo(() => {
    return createSubsMap(subscriptionsData?.subscriptions || []);
  }, [subscriptionsData]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Подписки компаний", to: "/company-subscriptions" },
      ])
    );
  }, [dispatch]);

  const filteredCompanySubscriptions = useMemo(() => {
    if (!companySubscriptionsData?.subscriptions) return [];

    return companySubscriptionsData.subscriptions.filter((subscription) => {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        subscription.company_id.toLowerCase().includes(searchLower) ||
        subscription.subscription_id.toLowerCase().includes(searchLower);
      const matchesCompany =
        !selectedCompany || subscription.company_id === selectedCompany;
      const matchesSubscription =
        !selectedSubscription ||
        subscription.subscription_id === selectedSubscription;
      return matchesSearch && matchesCompany && matchesSubscription;
    });
  }, [
    companySubscriptionsData?.subscriptions,
    searchText,
    selectedCompany,
    selectedSubscription,
  ]);

  const showModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      dispatch(setSearchText(value));
    },
    [dispatch]
  );

  const handleCompanyFilter = useCallback(
    (value: string) => {
      dispatch(setSelectedCompany(value === "all" ? null : value));
    },
    [dispatch]
  );

  const handleSubscriptionFilter = useCallback(
    (value: string) => {
      dispatch(setSelectedSubscription(value === "all" ? null : value));
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  const totalCompanySubscriptions =
    companySubscriptionsData?.subscriptions?.length || 0;
  const hasActiveFilters =
    searchText || selectedCompany || selectedSubscription;

  if (isLoadingCompanySubscriptions) {
    return (
      <div className="page-container">
        <div className="center-spin">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (isErrorCompanySubscriptions) {
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
                    Подписки компаний
                  </Title>
                  <Text className="header-description">
                    {totalCompanySubscriptions} записей
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
                  Добавить подписку компании
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        <Card className="filters-card" style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Поиск по ID компании или подписки..."
                allowClear
                value={searchText}
                onChange={(e) => dispatch(setSearchText(e.target.value))}
                onSearch={handleSearch}
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Фильтр по компании"
                allowClear
                value={selectedCompany || undefined}
                onChange={handleCompanyFilter}
                style={{ width: "100%" }}
              >
                <Select.Option value="all">Все компании</Select.Option>
                {Array.from(companiesMap.entries()).map(([id, name]) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="Фильтр по подписке"
                allowClear
                value={selectedSubscription || undefined}
                onChange={handleSubscriptionFilter}
                style={{ width: "100%" }}
              >
                <Select.Option value="all">Все подписки</Select.Option>
                {Array.from(subscriptionsMap.entries()).map(([id, name]) => (
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

          <CompanySubscriptionsTable
            subscriptionsData={{
              total: filteredCompanySubscriptions.length,
              subscriptions: filteredCompanySubscriptions,
            }}
          />
        </Card>

        <CreateCompanySubscriptionModal
          visible={isModalOpen}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};
