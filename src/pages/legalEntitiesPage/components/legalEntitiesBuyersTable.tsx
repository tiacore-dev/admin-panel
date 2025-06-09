// src/pages/legalEntitiesBuyersPage/components/LegalEntitiesBuyersTable.tsx
import React from "react";
import type { TableColumnsType } from "antd";
import { Button, Input, Table, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { useNavigate } from "react-router-dom";
import {
  setPage,
  setPageSize,
  setShortName,
  setInn,
  setKpp,
} from "../../../redux/slices/legalEntityBuyersSlice";

interface LegalEntitiesBuyersTableProps {
  data: {
    total: number;
    entities: ILegalEntity[];
  };
  loading: boolean;
}

export const LegalEntitiesBuyersTable: React.FC<
  LegalEntitiesBuyersTableProps
> = ({ data = { total: 0, entities: [] }, loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { short_name, inn, kpp, page, page_size } = useSelector(
    (state: RootState) => state.legalEntitiesBuyers
  );

  const columns: TableColumnsType<ILegalEntity> = [
    {
      title: "Название",
      dataIndex: "short_name",
      key: "short_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        a.short_name.localeCompare(b.short_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: ILegalEntity) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/legal-entities/buyers/${record.legal_entity_id}`)
          }
        >
          {text}
        </Button>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
            value={short_name}
            onChange={(e) => dispatch(setShortName(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: short_name ? [short_name] : null,
    },
    {
      title: "ИНН",
      dataIndex: "inn",
      key: "inn",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по ИНН"
            value={inn}
            onChange={(e) => dispatch(setInn(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: inn ? [inn] : null,
    },
    {
      title: "КПП",
      dataIndex: "kpp",
      key: "kpp",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      //   sorter: (a: ILegalEntity, b: ILegalEntity) =>
      //     (a.kpp || "").localeCompare(b.kpp || ""),
      //   sortDirections: ["ascend", "descend"],
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по КПП"
            value={kpp}
            onChange={(e) => dispatch(setKpp(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: kpp ? [kpp] : null,
      render: (text: string) => text || "-",
    },
    {
      title: "ОГРН",
      dataIndex: "ogrn",
      key: "ogrn",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
    },
  ];

  // Фильтрация данных
  const filteredData = data.entities.filter((entity) => {
    const matchesShortName = short_name
      ? entity.short_name.toLowerCase().includes(short_name.toLowerCase())
      : true;
    const matchesInn = inn
      ? entity.inn.toLowerCase().includes(inn.toLowerCase())
      : true;
    // const matchesKpp = kpp
    //   ? (entity.kpp || "").includes(kpp)
    //   : true;

    return matchesShortName && matchesInn;
  });

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="legal_entity_id"
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
