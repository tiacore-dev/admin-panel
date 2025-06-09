// src/pages/legalEntitiesSellersPage/components/LegalEntitiesSellersTable.tsx
import React from "react";
import type { TableColumnsType } from "antd";
import { Button, Input, Table, Typography, Select } from "antd";
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
  setOgrn,
  setAddress,
  setVatRate,
} from "../../../redux/slices/legalEntitySellersSlice";

const { Option } = Select;

interface LegalEntitiesSellersTableProps {
  data: {
    total: number;
    entities: ILegalEntity[];
  };
  loading: boolean;
}

export const LegalEntitiesSellersTable: React.FC<
  LegalEntitiesSellersTableProps
> = ({ data = { total: 0, entities: [] }, loading }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { short_name, inn, ogrn, address, vat_rate, page, page_size } =
    useSelector((state: RootState) => state.legalEntitiesSellers);

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
            navigate(`/legal-entities/sellers/${record.legal_entity_id}`, {
              state: { fromList: true },
            })
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
      render: (text: string) => text || "-",
    },
    {
      title: "ОГРН",
      dataIndex: "ogrn",
      key: "ogrn",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по ОГРН"
            value={ogrn}
            onChange={(e) => dispatch(setOgrn(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: ogrn ? [ogrn] : null,
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по адресу"
            value={address}
            onChange={(e) => dispatch(setAddress(e.target.value))}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: address ? [address] : null,
    },
    {
      title: "Ставка НДС",
      dataIndex: "vat_rate",
      key: "vat_rate",
      render: (vatRate: number) =>
        vatRate === 0 ? "НДС не облагается" : `${vatRate}%`,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Выберите ставку НДС"
            style={{ width: 200 }}
            value={vat_rate}
            onChange={(value) => dispatch(setVatRate(value))}
            allowClear
          >
            <Option value="0">0% (не облагается)</Option>
            <Option value="5">5%</Option>
            <Option value="7">7%</Option>
            <Option value="20">20%</Option>
            <Option value="null">Не указано</Option>
          </Select>
        </div>
      ),
      filteredValue: vat_rate !== null ? [vat_rate] : null,
      onFilter: (value, record) => {
        if (value === "null") {
          return record.vat_rate === null || record.vat_rate === undefined;
        }
        return String(record.vat_rate) === value;
      },
    },
  ];

  const filteredData = data.entities.filter((entity) => {
    const matchesShortName = short_name
      ? entity.short_name.toLowerCase().includes(short_name.toLowerCase())
      : true;
    const matchesInn = inn
      ? entity.inn.toLowerCase().includes(inn.toLowerCase())
      : true;
    const matchesOgrn = ogrn
      ? entity.ogrn.toLowerCase().includes(ogrn.toLowerCase())
      : true;
    const matchesAddress = address
      ? entity.address.toLowerCase().includes(address.toLowerCase())
      : true;
    const matchesVatRate =
      vat_rate !== null
        ? String(entity.vat_rate) === vat_rate ||
          (vat_rate === "null" &&
            (entity.vat_rate === null || entity.vat_rate === undefined))
        : true;

    return (
      matchesShortName &&
      matchesInn &&
      matchesOgrn &&
      matchesAddress &&
      matchesVatRate
    );
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
