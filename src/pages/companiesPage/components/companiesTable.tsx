"use client";

import type React from "react";
import {
  Table,
  Avatar,
  Typography,
  Tag,
  Tooltip,
  Button,
  message,
  Input,
  Select,
} from "antd";
import type { ICompany } from "../../../api/companiesApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setPage,
  setPageSize,
  setSearch,
  setAppFilter,
} from "../../../redux/slices/companiesSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../../redux/store";
import { useAppsQuery } from "../../../hooks/base/useBaseQuery";
import { useAppNameById } from "../../../hooks/base/useAppHelpers";
import {
  CopyOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

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
  const dispatch = useDispatch();
  const { search, appFilter, page, page_size } = useSelector(
    (state: RootState) => state.companies
  );
  const navigate = useNavigate();
  const { data: appsData } = useAppsQuery();

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

  // Компонент для отображения названия приложения
  const AppNameDisplay: React.FC<{ applicationId: string }> = ({
    applicationId,
  }) => {
    const appName = useAppNameById(applicationId);
    return (
      <Tag color="blue" style={{ borderRadius: 6 }}>
        {appName || applicationId}
      </Tag>
    );
  };

  // Фильтрация данных
  const filteredData = data.companies.filter((company) => {
    const matchesSearch =
      !search ||
      company.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesAppFilter = !appFilter || company.application_id === appFilter;
    return matchesSearch && matchesAppFilter;
  });

  const columns = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span>Компания</span>
          <Input
            placeholder="Поиск по названию"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              dispatch(setSearch(e.target.value));
              dispatch(setPage(1));
            }}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
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
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FilterOutlined />
          <span>Приложение</span>
          <Select
            placeholder="Все приложения"
            value={appFilter}
            onChange={(value) => {
              dispatch(setAppFilter(value));
              dispatch(setPage(1));
            }}
            style={{ width: 150 }}
            allowClear
          >
            {appsData?.applications.map((app) => (
              <Option key={app.application_id} value={app.application_id}>
                {app.application_name}
              </Option>
            ))}
          </Select>
        </div>
      ),
      dataIndex: "application_id",
      key: "application_id",
      render: (appId: string) => <AppNameDisplay applicationId={appId} />,
    },
    {
      title: "ID",
      dataIndex: "company_id",
      key: "company_id",
      width: 120,
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
        dataSource={filteredData}
        rowKey="company_id"
        loading={loading}
        pagination={
          filteredData.length > 10
            ? {
                current: page,
                pageSize: page_size,
                total: filteredData.length,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (newPage, newPageSize) => {
                  if (newPageSize !== page_size) {
                    dispatch(setPageSize(newPageSize));
                  }
                  dispatch(setPage(newPage));
                },
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
