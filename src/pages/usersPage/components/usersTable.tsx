"use client";

import type { IUser } from "../../../api/usersApi";
import type React from "react";
import type { TableColumnsType } from "antd";
import {
  Button,
  Input,
  Table,
  Tag,
  Typography,
  Radio,
  Space,
  Avatar,
  Tooltip,
} from "antd";
import {
  setFullName,
  setPage,
  setPageSize,
  setEmail,
  setIsVerified,
} from "../../../redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import type { RootState } from "../../../redux/store";

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
  const dispatch = useDispatch();
  const { email, full_name, page, page_size, is_verified } = useSelector(
    (state: RootState) => state.users
  );

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

  // Фильтрация данных
  const filteredData = data.users.filter((user) => {
    const matchesEmail = email
      ? user.email.toLowerCase().includes(email.toLowerCase())
      : true;
    const matchesFullName = full_name
      ? user.full_name.toLowerCase().includes(full_name.toLowerCase())
      : true;
    const matchesStatus =
      is_verified !== null ? user.is_verified === is_verified : true;

    return matchesEmail && matchesFullName && matchesStatus;
  });

  const columns: TableColumnsType<IUser> = [
    {
      title: "Пользователь",
      dataIndex: "full_name",
      key: "full_name",
      width: 300,
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IUser, b: IUser) => a.full_name.localeCompare(b.full_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: IUser) => (
        <Space>
          <Avatar
            style={{ backgroundColor: getAvatarColor(text) }}
            icon={!text ? <UserOutlined /> : null}
          >
            {text ? getInitials(text) : null}
          </Avatar>
          <div>
            <Button
              type="link"
              style={{ padding: 0, height: "auto", fontWeight: 500 }}
              onClick={() =>
                navigate(`/users/${record.user_id}`, {
                  state: { from: "usersPage" },
                })
              }
            >
              {text}
            </Button>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              <MailOutlined style={{ marginRight: 4 }} />
              {record.email}
            </div>
          </div>
        </Space>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по имени"
            value={full_name}
            onChange={(e) => dispatch(setFullName(e.target.value))}
            style={{ width: 200 }}
            allowClear
            prefix={<SearchOutlined />}
          />
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IUser, b: IUser) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
      render: (email: string) => (
        <Tooltip title="Нажмите, чтобы скопировать">
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() => navigator.clipboard.writeText(email)}
          >
            <MailOutlined style={{ marginRight: 4 }} />
            {email}
          </Button>
        </Tooltip>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            style={{ width: 200 }}
            allowClear
            prefix={<SearchOutlined />}
          />
        </div>
      ),
    },
    {
      title: "Статус",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 150,
      render: (isVerified: boolean) => (
        <Tag
          color={isVerified ? "success" : "warning"}
          icon={isVerified ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
        >
          {isVerified ? "Верифицирован" : "Ожидает верификации"}
        </Tag>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Radio.Group
            value={is_verified}
            onChange={(e) => dispatch(setIsVerified(e.target.value))}
          >
            <Space direction="vertical">
              <Radio value={null}>Все статусы</Radio>
              <Radio value={true}>Верифицированные</Radio>
              <Radio value={false}>Не верифицированные</Radio>
            </Space>
          </Radio.Group>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="user_id"
      loading={loading}
      pagination={{
        current: page,
        pageSize: page_size,
        total: filteredData.length,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        showTotal: (total, range) => (
          <Typography.Text>{`${range[0]}-${range[1]} из ${total} пользователей`}</Typography.Text>
        ),
        onChange: (newPage, newPageSize) => {
          if (newPageSize !== page_size) {
            dispatch(setPageSize(newPageSize));
          }
          dispatch(setPage(newPage));
        },
      }}
      size="middle"
    />
  );
};
