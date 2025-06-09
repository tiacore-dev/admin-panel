import { IUser } from "../../../api/usersApi";
import React from "react";
import type { TableColumnsType } from "antd";
import { Button, Input, Table, Tag, Typography, Radio, Space } from "antd";
import {
  setFullName,
  setPage,
  setPageSize,
  setEmail,
  setIsVerified,
} from "../../../redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { RootState } from "../../../redux/store";

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
      title: "Имя",
      dataIndex: "full_name",
      key: "full_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: IUser, b: IUser) => a.full_name.localeCompare(b.full_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: IUser) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/users/${record.user_id}`, {
              state: { from: "usersPage" },
            })
          }
        >
          {text}
        </Button>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по имени"
            value={full_name}
            onChange={(e) => dispatch(setFullName(e.target.value))}
            style={{ width: 200 }}
            allowClear
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
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
    },
    {
      title: "Статус",
      dataIndex: "is_verified",
      key: "is_verified",
      render: (isVerified: boolean) => (
        <Tag color={isVerified ? "green" : "orange"}>
          {isVerified ? "Верифицирован" : "Не верифицирован"}
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <SearchOutlined
            style={{
              color: filtered ? "#1890ff" : undefined,
              marginRight: 4,
            }}
          />
          {filtered && (
            <span style={{ color: "#1890ff" }}>
              {is_verified === true
                ? "Верифицированные"
                : is_verified === false
                ? "Не верифицированные"
                : "Все статусы"}
            </span>
          )}
        </div>
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
        showTotal: (total) => <Typography.Text>Всего: {total}</Typography.Text>,
        onChange: (newPage, newPageSize) => {
          if (newPageSize !== page_size) {
            dispatch(setPageSize(newPageSize));
          }
          dispatch(setPage(newPage));
        },
      }}
    />
  );
};
