import { IUser } from "../../../api/usersApi";
import React from "react";
import type { TableColumnsType } from "antd";
import { Button, Input, Table, Tag, Typography } from "antd";
import {
  // usersSelector,
  setFullName,
  setPage,
  setPageSize,
  // setPosition,
  setEmail,
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
  const {
    email,
    full_name,
    //  position,
    page,
    page_size,
  } = useSelector((state: RootState) => state.users);

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
          onClick={() => navigate(`/users/${record.user_id}`)}
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
      filteredValue: full_name ? [full_name] : null,
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
      filteredValue: email ? [email] : null,
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
      filters: [
        { text: "Верифицированные", value: true },
        { text: "Не верифицированные", value: false },
      ],
      onFilter: (value, record) => record.is_verified === value,
    },
    // {
    //   title: "Позиция",
    //   dataIndex: "position",
    //   key: "position",
    //   filterIcon: (filtered) => (
    //     <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    //   ),
    //   sorter: (a: IUser, b: IUser) => a.position.localeCompare(b.position),
    //   sortDirections: ["ascend", "descend"],
    //   filterDropdown: () => (
    //     <div style={{ padding: 8 }}>
    //       <Input
    //         placeholder="Поиск позиции"
    //         value={position}
    //         onChange={(e) => dispatch(setPosition(e.target.value))}
    //         style={{ width: 200 }}
    //         allowClear
    //       />
    //     </div>
    //   ),
    //   filteredValue: position ? [position] : null,
    // },
  ];

  // Фильтрация данных
  const filteredData = data.users.filter((user) => {
    const matchesEmail = email
      ? user.email.toLowerCase().includes(email.toLowerCase())
      : true;
    const matchesFullName = full_name
      ? user.full_name.toLowerCase().includes(full_name.toLowerCase())
      : true;
    // const matchesPosition = position
    //   ? user.position.toLowerCase().includes(position.toLowerCase())
    //   : true;

    return matchesEmail && matchesFullName;
  });

  return (
    <Table
      columns={columns}
      dataSource={filteredData} // Передаем все отфильтрованные данные
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
