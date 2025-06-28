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
} from "antd";
import type { ICompany } from "../../../api/companiesApi";
import {
  BuildOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  CopyOutlined,
  IdcardOutlined,
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

  // Функция для получения инициалов компании
  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Функция для получения цвета аватара
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

  // Функция копирования в буфер обмена
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${type} скопирован в буфер обмена`);
    });
  };

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: 800,
        marginBottom: 24,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      loading={loading}
    >
      {/* Заголовок с аватаром */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Avatar
          style={{
            backgroundColor: getAvatarColor(data.company_name),
            fontSize: "24px",
            fontWeight: 600,
            marginRight: 16,
          }}
          size={64}
        >
          {getCompanyInitials(data.company_name)}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Title level={3} style={{ margin: 0, color: "#262626" }}>
            {data.company_name}
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Информация о компании
          </Text>
        </div>
      </div>

      {/* Основная информация */}
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Название компании */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <BuildOutlined style={{ color: "#1890ff", marginRight: 8 }} />
            <Title level={5} style={{ margin: 0 }}>
              Название компании
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              backgroundColor: "#fafafa",
              borderRadius: 6,
              border: "1px solid #f0f0f0",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 500 }}>
              {data.company_name}
            </Text>
            <Tooltip title="Копировать название">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() =>
                  copyToClipboard(data.company_name, "Название компании")
                }
              />
            </Tooltip>
          </div>
        </div>

        {/* Описание */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <FileTextOutlined style={{ color: "#52c41a", marginRight: 8 }} />
            <Title level={5} style={{ margin: 0 }}>
              Описание
            </Title>
          </div>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fafafa",
              borderRadius: 6,
              border: "1px solid #f0f0f0",
              minHeight: 60,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 1.6 }}>
              {data.description || (
                <Text type="secondary" italic>
                  Описание не указано
                </Text>
              )}
            </Text>
          </div>
        </div>

        {/* Приложение */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <AppstoreOutlined style={{ color: "#722ed1", marginRight: 8 }} />
            <Title level={5} style={{ margin: 0 }}>
              Приложение
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Tag
              color="blue"
              style={{
                fontSize: 14,
                padding: "4px 12px",
                borderRadius: 6,
              }}
            >
              <AppstoreOutlined style={{ marginRight: 4 }} />
              {appName || data.application_id}
            </Tag>
            <Tooltip title="Копировать ID приложения">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() =>
                  copyToClipboard(data.application_id, "ID приложения")
                }
              />
            </Tooltip>
          </div>
        </div>

        {/* ID компании */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <IdcardOutlined style={{ color: "#fa8c16", marginRight: 8 }} />
            <Title level={5} style={{ margin: 0 }}>
              ID компании
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              backgroundColor: "#fafafa",
              borderRadius: 6,
              border: "1px solid #f0f0f0",
            }}
          >
            <Text code style={{ fontSize: 12, margin: 0 }}>
              {data.company_id}
            </Text>
            <Tooltip title="Копировать ID">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(data.company_id, "ID компании")}
              />
            </Tooltip>
          </div>
        </div>
      </Space>
    </Card>
  );
};
