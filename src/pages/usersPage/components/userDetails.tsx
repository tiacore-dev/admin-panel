"use client";

import type React from "react";
import {
  Card,
  Typography,
  Tag,
  Space,
  Avatar,
  Descriptions,
  Row,
  Col,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import type { IUser } from "../../../api/usersApi";

const { Title, Text } = Typography;

interface UserDetailsCardProps {
  userDetails?: IUser;
  loading?: boolean;
}

export const UserDetailsCard: React.FC<UserDetailsCardProps> = ({
  userDetails,
  loading = false,
}) => {
  const getInitials = (fullName: string) => {
    if (!fullName) return "?";
    return fullName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Показываем загрузку если данные загружаются
  if (loading) {
    return (
      <Card
        style={{
          width: "100%",
          maxWidth: 800,
          textAlign: "center",
          padding: "40px",
        }}
      >
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">Загрузка информации о пользователе...</Text>
        </div>
      </Card>
    );
  }

  // Показываем сообщение если данные не загружены
  if (!userDetails) {
    return (
      <Card
        style={{
          width: "100%",
          maxWidth: 800,
          textAlign: "center",
          padding: "40px",
        }}
      >
        <UserOutlined
          style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
        />
        <div>
          <Title level={4} type="secondary">
            Информация о пользователе недоступна
          </Title>
          <Text type="secondary">Не удалось загрузить данные пользователя</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{ width: "100%", maxWidth: 800 }}
      title={
        <Space>
          <UserOutlined />
          <span>Информация о пользователе</span>
        </Space>
      }
    >
      <Row gutter={[24, 24]} align="top">
        {/* Аватар и основная информация */}
        <Col xs={24} sm={8} style={{ textAlign: "center" }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Avatar
              size={80}
              style={{
                backgroundColor: userDetails.is_verified
                  ? "#52c41a"
                  : "#faad14",
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {getInitials(userDetails.full_name)}
            </Avatar>

            <div>
              <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                {userDetails.full_name || "Не указано"}
              </Title>
              <Text type="secondary" copyable={{ text: userDetails.email }}>
                <MailOutlined style={{ marginRight: 4 }} />
                {userDetails.email}
              </Text>
            </div>

            <Tag
              color={userDetails.is_verified ? "success" : "warning"}
              icon={
                userDetails.is_verified ? (
                  <CheckCircleOutlined />
                ) : (
                  <ClockCircleOutlined />
                )
              }
              style={{ fontSize: 14, padding: "4px 12px" }}
            >
              {userDetails.is_verified ? "Верифицирован" : "Не верифицирован"}
            </Tag>
          </Space>
        </Col>

        {/* Детальная информация */}
        <Col xs={24} sm={16}>
          <Descriptions
            column={1}
            size="middle"
            labelStyle={{ fontWeight: 500, color: "#595959" }}
          >
            <Descriptions.Item
              label={
                <Space>
                  <IdcardOutlined />
                  <span>ID пользователя</span>
                </Space>
              }
            >
              <Text code copyable={{ text: userDetails.user_id }}>
                {userDetails.user_id}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <MailOutlined />
                  <span>Email адрес</span>
                </Space>
              }
            >
              <Text copyable={{ text: userDetails.email }}>
                {userDetails.email}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <UserOutlined />
                  <span>Полное имя</span>
                </Space>
              }
            >
              {userDetails.full_name || "Не указано"}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <CheckCircleOutlined />
                  <span>Статус верификации</span>
                </Space>
              }
            >
              <Space>
                <Tag
                  color={userDetails.is_verified ? "success" : "warning"}
                  icon={
                    userDetails.is_verified ? (
                      <CheckCircleOutlined />
                    ) : (
                      <ClockCircleOutlined />
                    )
                  }
                >
                  {userDetails.is_verified
                    ? "Верифицирован"
                    : "Не верифицирован"}
                </Tag>
                {!userDetails.is_verified && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Требуется подтверждение email
                  </Text>
                )}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};
