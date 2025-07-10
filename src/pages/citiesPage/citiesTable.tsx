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
  Dropdown,
  Spin,
} from "antd";
import type { ICity } from "../../api/citiesApi";
import { useNavigate } from "react-router-dom";
import {
  CopyOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useCityMutations } from "../../hooks/cities/useCityMutation";
import { useState } from "react";
import { CityFormModal } from "./cityFormModal";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";

const { Text } = Typography;

interface CitiesTableProps {
  data: {
    total: number;
    cities: ICity[] | undefined;
  };
  loading: boolean;
}

export const CitiesTable: React.FC<CitiesTableProps> = ({
  data = { total: 0, cities: [] },
  loading,
}) => {
  const navigate = useNavigate();
  const [editingCity, setEditingCity] = useState<ICity | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<ICity | null>(null);

  const { deleteMutation } = useCityMutations();

  // Функция копирования в буфер обмена
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${type} скопирован в буфер обмена`);
    });
  };

  const handleEdit = (city: ICity) => {
    setEditingCity(city);
    setIsEditModalVisible(true);
  };

  const handleDelete = (city: ICity) => {
    setCityToDelete(city);
    setShowDeleteConfirm(true);
  };

  // const confirmDelete = () => {
  //   if (cityToDelete?.city_id) {
  //     deleteMutation.mutate(cityToDelete.city_id, {
  //       onSuccess: () => {
  //         setShowDeleteConfirm(false);
  //       },
  //     });
  //   }
  // };
  const confirmDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        // navigate("/cities");
      },
    });
  };
  const handleSuccess = () => {
    setIsEditModalVisible(false);
    setEditingCity(null);
  };

  const getMenuItems = (city: ICity) => {
    return [
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Редактировать",
        onClick: () => handleEdit(city),
      },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Удалить",
        danger: true,
        onClick: () => handleDelete(city),
      },
    ];
  };

  const columns = [
    {
      title: "Город",
      dataIndex: "city_name",
      key: "city_name",
      render: (name: string, record: ICity) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              fontWeight: 600,
              color: "#1890ff",
              cursor: "pointer",
              marginBottom: 2,
            }}
            onClick={() => navigate(`/cities/${record.city_id}`)}
          >
            <EnvironmentOutlined /> {name}
          </div>
        </div>
      ),
    },
    {
      title: "Регион",
      dataIndex: "region",
      key: "region",
      render: (name: string, record: ICity) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {record.region && (
            <Text>
              {record.region.length > 75
                ? `${record.region.substring(0, 75)}...`
                : record.region}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Индекс",
      dataIndex: "code",
      key: "code",
      width: 190,
      render: (id: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Text>{id}</Text>
          {/* <Tooltip title="Копировать индекс">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(id, "индекс города");
              }}
              style={{ padding: "2px 4px", height: "auto" }}
            />
          </Tooltip> */}
        </div>
      ),
    },
    {
      title: "Внешний код",
      dataIndex: "external_id",
      key: "external_id",
    },
    {
      title: "",
      key: "actions",
      width: 48,
      render: (_: any, record: ICity) => (
        <Dropdown menu={{ items: getMenuItems(record) }} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data.cities}
        rowKey="city_id"
        loading={loading}
        pagination={
          data.total > 10
            ? {
                pageSize: 10,
                total: data.total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} из ${total} городов`,
              }
            : false
        }
        // onRow={(record) => ({
        //   onClick: () => navigate(`/cities/${record.city_id}`),
        //   style: { cursor: "pointer" },
        // })}
        rowClassName="hover:bg-gray-50"
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        }}
      />

      {isEditModalVisible && (
        <CityFormModal
          visible={isEditModalVisible}
          onCancel={() => {
            setIsEditModalVisible(false);
            setEditingCity(null);
          }}
          onSuccess={handleSuccess}
          mode="edit"
          initialData={editingCity}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};
