"use client";

import type React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import {
  Card,
  Typography,
  Descriptions,
  Avatar,
  Space,
  Button,
  Row,
  Col,
} from "antd";
import { UserOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";

const { Title, Text } = Typography;

export const AccountPage: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Мой аккаунт", to: "/account" },
      ])
    );
  }, [dispatch]);

  // Моковые данные пользователя
  const userInfo = {
    full_name: "Администратор",
    email: "admin@tiacore.com",
    position: "Системный администратор",
    created_at: "2024-01-15",
    last_login: "2024-12-29 14:30",
  };

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
                    Мой аккаунт
                  </Title>
                  <Text className="header-description">
                    Управление профилем и настройками аккаунта
                  </Text>
                </div>
              </div>
            </Col>
            <Col>
              <div className="header-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<EditOutlined />}
                  className="primary-button"
                  style={{ color: "#667eea" }}
                >
                  Редактировать профиль
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Основная информация */}
          <Col xs={24} lg={16}>
            <Card
              className="content-card"
              title={
                <Space>
                  <UserOutlined />
                  <span>Информация о профиле</span>
                </Space>
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  marginBottom: 24,
                }}
              >
                <Avatar
                  size={80}
                  style={{
                    backgroundColor: "#667eea",
                    fontSize: 32,
                    fontWeight: 600,
                  }}
                >
                  {userInfo.full_name.charAt(0)}
                </Avatar>
                <div>
                  <Title level={3} style={{ margin: 0 }}>
                    {userInfo.full_name}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    {userInfo.position}
                  </Text>
                </div>
              </div>

              <Descriptions column={1} size="middle">
                <Descriptions.Item label="Полное имя">
                  <Text strong>{userInfo.full_name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <Text code>{userInfo.email}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Должность">
                  <Text>{userInfo.position}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Дата регистрации">
                  <Text>{userInfo.created_at}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Последний вход">
                  <Text>{userInfo.last_login}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Настройки */}
          <Col xs={24} lg={8}>
            <Card
              className="content-card"
              title={
                <Space>
                  <SettingOutlined />
                  <span>Настройки</span>
                </Space>
              }
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Button block>Изменить пароль</Button>
                <Button block>Настройки уведомлений</Button>
                <Button block>Настройки безопасности</Button>
                <Button block>Экспорт данных</Button>
                <Button block danger>
                  Удалить аккаунт
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
