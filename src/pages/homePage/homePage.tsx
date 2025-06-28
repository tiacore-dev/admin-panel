"use client";

import React from "react";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Card, Typography, Row, Col, Statistic, Button, Space } from "antd";
import {
  UserOutlined,
  BankOutlined,
  ShopOutlined,
  SafetyOutlined,
  RocketOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";

const { Title, Text } = Typography;

export const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Главная страница", to: "/home" }]));
  }, [dispatch]);

  const quickActions = [
    {
      title: "Пользователи",
      description: "Управление пользователями системы",
      icon: <UserOutlined style={{ fontSize: 24, color: "#667eea" }} />,
      path: "/users",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Компании",
      description: "Управление компаниями",
      icon: <ShopOutlined style={{ fontSize: 24, color: "#4facfe" }} />,
      path: "/companies",
      color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Юр. лица",
      description: "Управление юридическими лицами",
      icon: <BankOutlined style={{ fontSize: 24, color: "#667eea" }} />,
      path: "/legal-entities",
      color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "Роли и права",
      description: "Управление доступом",
      icon: <SafetyOutlined style={{ fontSize: 24, color: "#ff6b6b" }} />,
      path: "/role_permissions_relations",
      color: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
    },
  ];

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Градиентный заголовок */}
        <Card
          className="gradient-header"
          style={{
            background:
              "linear-gradient(135deg, #0f00df 0%, #3b82f6 50%, #8b5cf6 100%)",
            marginBottom: 24,
          }}
        >
          <Row align="middle" justify="space-between">
            <Col>
              <div className="header-content">
                <div className="header-icon">
                  <RocketOutlined style={{ fontSize: 24, color: "white" }} />
                </div>
                <div className="header-text">
                  <ContextualNavigation
                    textColor="rgba(255, 255, 255, 0.9)"
                    size="small"
                  />
                  <Title level={2} className="header-title">
                    Панель управления
                  </Title>
                  <Text className="header-description">
                    Добро пожаловать в административную панель Tiacore
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Статистика */}
        <div className="stats-grid">
          <Card className="stat-card">
            <Statistic
              title="Активные пользователи"
              value={42}
              prefix={<UserOutlined style={{ color: "#667eea" }} />}
              suffix="чел."
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Компании"
              value={15}
              prefix={<ShopOutlined style={{ color: "#4facfe" }} />}
              suffix="орг."
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Юр. лица"
              value={28}
              prefix={<BankOutlined style={{ color: "#667eea" }} />}
              suffix="ед."
            />
          </Card>
          <Card className="stat-card">
            <Statistic
              title="Активные роли"
              value={8}
              prefix={<SafetyOutlined style={{ color: "#ff6b6b" }} />}
              suffix="шт."
            />
          </Card>
        </div>

        {/* Быстрые действия */}
        <Card className="content-card" title="Быстрые действия">
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                  }}
                  bodyStyle={{ padding: 20 }}
                  onClick={() => navigate(action.path)}
                >
                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: action.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {React.cloneElement(action.icon, {
                        style: { fontSize: 24, color: "white" },
                      })}
                    </div>
                    <div>
                      <Title level={4} style={{ margin: 0, fontSize: 16 }}>
                        {action.title}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 14 }}>
                        {action.description}
                      </Text>
                    </div>
                    <Button
                      type="link"
                      icon={<ArrowRightOutlined />}
                      style={{ padding: 0, height: "auto", color: "#0f00df" }}
                    >
                      Перейти
                    </Button>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Последние действия */}
        <Card className="content-card" title="Последние действия">
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Создан новый пользователь</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  2 минуты назад
                </Text>
              </div>
              <UserOutlined style={{ color: "#667eea" }} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Обновлена информация о компании</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  15 минут назад
                </Text>
              </div>
              <ShopOutlined style={{ color: "#4facfe" }} />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Text strong>Изменены права доступа</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  1 час назад
                </Text>
              </div>
              <SafetyOutlined style={{ color: "#ff6b6b" }} />
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};
