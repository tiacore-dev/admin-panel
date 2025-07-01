"use client";

import type { IUser } from "../../../api/usersApi";
import type React from "react";
import type { TableColumnsType } from "antd";
import { Button, Table, Tag, Typography, Avatar, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface UsersTableProps {
  data: {
    total: number;
    users: IUser[];
  };
  loading: boolean;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  data = { total: 0, users: [] },
  loading,
}) => {
  const navigate = useNavigate();

  // Функция для получения инициалов
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Функция для получения цвета аватара
  const getAvatarColor = (name: string) => {
    const colors = ["#f56a00", "#7265e6", "#ffbf00", "#00a2ae", "#87d068"];
    const index = name.length % colors.length;
    return colors[index];
  };

  const columns: TableColumnsType<IUser> = [
    {
      title: "Пользователь",
      dataIndex: "full_name",
      key: "full_name",
      sorter: (a: IUser, b: IUser) => a.full_name.localeCompare(b.full_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: IUser) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(`/users/${record.user_id}`, {
              state: { from: "usersPage" },
            })
          }
        >
          <Avatar
            size={40}
            style={{
              backgroundColor: getAvatarColor(text),
              fontSize: 14,
              fontWeight: 600,
            }}
            icon={!text ? <UserOutlined /> : null}
          >
            {text ? getInitials(text) : null}
          </Avatar>
          <div
            style={{
              fontWeight: 600,
              color: "#1890ff",
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a: IUser, b: IUser) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
      render: (email: string) => (
        <Tooltip title="Нажмите, чтобы скопировать">
          <Button
            type="text"
            style={{ padding: 0 }}
            onClick={() => navigator.clipboard.writeText(email)}
          >
            <MailOutlined style={{ marginRight: 4 }} />
            {email}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Статус",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 300,
      render: (isVerified: boolean) => (
        <Tag
          color={isVerified ? "success" : "warning"}
          icon={isVerified ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          style={{ fontSize: 14 }}
        >
          {isVerified ? "Верифицирован" : "Ожидает верификации"}
        </Tag>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data.users}
      rowKey="user_id"
      loading={loading}
      size="middle"
      pagination={{
        pageSizeOptions: ["10", "20", "50", "100"],
        showSizeChanger: true,
        showTotal: (total, range) => (
          <Typography.Text>{`${range[0]}-${range[1]} из ${total} пользователей`}</Typography.Text>
        ),
      }}
    />
  );
};
