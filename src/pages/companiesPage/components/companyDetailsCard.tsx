"use client";

import type React from "react";
import {
  Typography,
  Card,
  Space,
  Avatar,
  Button,
  Tooltip,
  message,
  Tag,
  Descriptions,
  Row,
  Col,
  Spin,
} from "antd";
import type { ICompany } from "../../../api/companiesApi";
import {
  BuildOutlined,
  FileTextOutlined,
  CopyOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAppNameById } from "../../../hooks/base/useAppHelpers";

const { Title, Text } = Typography;

interface CompanyCardProps {
  data: ICompany;
  loading?: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  data,
  loading = false,
}) => {
  const appName = useAppNameById(data.application_id);

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#87d068",
      "#108ee9",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${type} скопирован в буфер обмена`);
    });
  };

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
          <Text type="secondary">Загрузка информации о компании...</Text>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card
        style={{
          width: "100%",
          maxWidth: 800,
          textAlign: "center",
          padding: "40px",
        }}
      >
        <BuildOutlined
          style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }}
        />
        <div>
          <Title level={4} type="secondary">
            Информация о компании недоступна
          </Title>
          <Text type="secondary">Не удалось загрузить данные компании</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card
      style={{ width: "100%", maxWidth: 800 }}
      title={
        <Space>
          <BuildOutlined />
          <span>Информация о компании</span>
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
                backgroundColor: getAvatarColor(data.company_name),
                color: "white",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {getCompanyInitials(data.company_name)}
            </Avatar>

            <div>
              <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                {data.company_name || "Не указано"}
              </Title>
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
                  <IdcardOutlined />
                  <span>ID компании</span>
                </Space>
              }
            >
              <Text code copyable={{ text: data.company_id }}>
                {data.company_id}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <BuildOutlined />
                  <span>Название компании</span>
                </Space>
              }
            >
              <Text copyable={{ text: data.company_name }}>
                {data.company_name}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <FileTextOutlined />
                  <span>Описание</span>
                </Space>
              }
            >
              {data.description || (
                <Text type="secondary" italic>
                  Описание не указано
                </Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};
