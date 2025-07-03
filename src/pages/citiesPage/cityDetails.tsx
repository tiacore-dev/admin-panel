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
  Button,
} from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
// import type { ICity } from "../../../api/usersApi";
import { useState } from "react";
import { ICity } from "../../api/citiesApi";
import { useCityMutations } from "../../hooks/cities/useCityMutation";
// import { useUserMutations } from "../../../hooks/users/useUserMutation";

const { Title, Text } = Typography;

interface CityDetailsCardProps {
  cityDetails?: ICity;
  loading?: boolean;
}

export const CityDetailsCard: React.FC<CityDetailsCardProps> = ({
  cityDetails,
  loading = false,
}) => {
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
  if (!cityDetails) {
    return (
      <Card
        style={{
          width: "100%",
          maxWidth: 800,
          textAlign: "center",
          padding: "40px",
        }}
      >
        <EnvironmentOutlined
          style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
        />
        <div>
          <Title level={4} type="secondary">
            Не удалось загрузить данные
          </Title>
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ width: "100%", maxWidth: 800 }}>
      <Row gutter={[24, 24]} align="top">
        {/* Аватар и основная информация */}
        <Col xs={24} sm={8} style={{ textAlign: "center" }}>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Avatar
              size={80}
              style={{
                backgroundColor: "#667eea",

                color: "white",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              <EnvironmentOutlined />
            </Avatar>

            <div>
              <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                {cityDetails.city_name || "Не указано"}
              </Title>
              {/* <Text type="secondary" copyable={{ text: cityDetails.email }}>
                <MailOutlined style={{ marginRight: 4 }} />
                {cityDetails.email}
              </Text> */}
            </div>
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
                  <span>ID города</span>
                </Space>
              }
            >
              <Text code copyable={{ text: cityDetails.city_id }}>
                {cityDetails.city_id}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <span>Регион</span>
                </Space>
              }
            >
              <Text copyable={{ text: cityDetails.region }}>
                {cityDetails.region}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <span>Индекс</span>
                </Space>
              }
            >
              <Text copyable={{ text: cityDetails.code }}>
                {cityDetails.code}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <Space>
                  <span>external_id</span>
                </Space>
              }
            >
              <Text code copyable={{ text: cityDetails.external_id }}>
                {cityDetails.external_id}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};
