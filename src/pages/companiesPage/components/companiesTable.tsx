"use client";

import type React from "react";
import { Table, Avatar, Typography, Tag, Tooltip, Button, message } from "antd";
import type { ICompany } from "../../../api/companiesApi";
import { useNavigate } from "react-router-dom";
import { CopyOutlined } from "@ant-design/icons";
const { Text } = Typography;

interface CompaniesTableProps {
  data: {
    total: number;
    companies: ICompany[];
  };
  loading: boolean;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  data = { total: 0, companies: [] },
  loading,
}) => {
  const navigate = useNavigate();

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

  const columns = [
    {
      title: "Компания",
      dataIndex: "company_name",
      key: "company_name",
      render: (name: string, record: ICompany) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            style={{
              backgroundColor: getAvatarColor(name),
              fontSize: "14px",
              fontWeight: 600,
            }}
            size={40}
          >
            {getCompanyInitials(name)}
          </Avatar>
          <div>
            <div
              style={{
                fontWeight: 600,
                color: "#1890ff",
                cursor: "pointer",
                marginBottom: 2,
              }}
              onClick={() => navigate(`/companies/${record.company_id}`)}
            >
              {name}
            </div>
            {record.description && (
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.description.length > 50
                  ? `${record.description.substring(0, 50)}...`
                  : record.description}
              </Text>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "ID",
      dataIndex: "company_id",
      key: "company_id",
      width: 190,
      render: (id: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text code style={{ fontSize: "11px", margin: 0 }}>
            {id.substring(0, 8)}...
          </Text>
          <Tooltip title="Копировать ID">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(id, "ID компании");
              }}
              style={{ padding: "2px 4px", height: "auto" }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.companies}
        rowKey="company_id"
        loading={loading}
        pagination={
          data.total > 10
            ? {
                pageSize: 10,
                total: data.total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} из ${total} компаний`,
              }
            : false
        }
        onRow={(record) => ({
          onClick: () => navigate(`/companies/${record.company_id}`),
          style: { cursor: "pointer" },
        })}
        rowClassName="hover:bg-gray-50"
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        }}
      />
    </div>
  );
};
