"use client";

import type React from "react";
import type { TableColumnsType } from "antd";
import {
  Button,
  Input,
  Table,
  Typography,
  Select,
  Avatar,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  SearchOutlined,
  BankOutlined,
  CopyOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import type { ILegalEntity } from "../../../api/legalEntitiesApi";
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
const { Text } = Typography;

interface LegalEntitiesTableProps {
  data: {
    total: number;
    entities: ILegalEntity[];
  };
  loading: boolean;
}

const getEntityInitials = (name: string) => {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

const getEntityColor = (inn: string) => {
  const colors = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#87d068",
    "#108ee9",
  ];
  const index =
    inn.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  message.success(`${label} скопирован в буфер обмена`);
};

const getVatRateTag = (vatRate: number | null | undefined) => {
  if (vatRate === 0) {
    return <Tag color="orange">НДС не облагается</Tag>;
  }
  if (vatRate === 20) {
    return <Tag color="green">20%</Tag>;
  }
  if (vatRate === 5) {
    return <Tag color="blue">5%</Tag>;
  }
  if (vatRate === 7) {
    return <Tag color="purple">7%</Tag>;
  }
  return <Tag color="default">Не указано</Tag>;
};

export const LegalEntitiesTable: React.FC<LegalEntitiesTableProps> = ({
  data = { total: 0, entities: [] },
  loading,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { short_name, inn, ogrn, address, vat_rate, page, page_size } =
    useSelector((state: RootState) => state.legalEntitiesSellers);

  const columns: TableColumnsType<ILegalEntity> = [
    {
      title: "Организация",
      dataIndex: "short_name",
      key: "short_name",
      width: 300,
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        a.short_name.localeCompare(b.short_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: ILegalEntity) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            cursor: "pointer",
          }}
          onClick={() =>
            navigate(`/legal-entities/${record.legal_entity_id}`, {
              state: { fromList: true },
            })
          }
        >
          <Avatar
            size={40}
            style={{
              backgroundColor: getEntityColor(record.inn),
              fontSize: 14,
              fontWeight: 600,
            }}
            icon={!text ? <BankOutlined /> : null}
          >
            {text ? getEntityInitials(text) : null}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
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
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.opf || "Организация"}
            </Text>
          </div>
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/legal-entities/${record.legal_entity_id}`, {
                state: { fromList: true },
              });
            }}
          />
        </div>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
            value={short_name}
            onChange={(e) => dispatch(setShortName(e.target.value))}
            style={{ width: 200 }}
            allowClear
            prefix={<SearchOutlined />}
          />
        </div>
      ),
      filteredValue: short_name ? [short_name] : null,
    },
    {
      title: "ИНН / КПП",
      key: "inn_kpp",
      width: 180,
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      render: (record: ILegalEntity) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Text strong>{record.inn}</Text>
            <Tooltip title="Копировать ИНН">
              <Button
                type="text"
                size="small"
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(record.inn, "ИНН")}
              />
            </Tooltip>
          </div>
          {record.kpp && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                КПП: {record.kpp}
              </Text>
              <Tooltip title="Копировать КПП">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(record.kpp!, "КПП")}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по ИНН"
            value={inn}
            onChange={(e) => dispatch(setInn(e.target.value))}
            style={{ width: 200 }}
            allowClear
            prefix={<SearchOutlined />}
          />
        </div>
      ),
      filteredValue: inn ? [inn] : null,
    },
    {
      title: "ОГРН",
      dataIndex: "ogrn",
      key: "ogrn",
      width: 160,
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Text code style={{ fontSize: 12 }}>
            {text}
          </Text>
          <Tooltip title="Копировать ОГРН">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(text, "ОГРН")}
            />
          </Tooltip>
        </div>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по ОГРН"
            value={ogrn}
            onChange={(e) => dispatch(setOgrn(e.target.value))}
            style={{ width: 200 }}
            allowClear
            prefix={<SearchOutlined />}
          />
        </div>
      ),
      filteredValue: ogrn ? [ogrn] : null,
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      render: (text: string) => (
        <Tooltip title={text}>
          <Text style={{ fontSize: 12 }}>{text}</Text>
        </Tooltip>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по адресу"
            value={address}
            onChange={(e) => dispatch(setAddress(e.target.value))}
            style={{ width: 200 }}
            allowClear
            prefix={<SearchOutlined />}
          />
        </div>
      ),
      filteredValue: address ? [address] : null,
    },
    {
      title: "НДС",
      dataIndex: "vat_rate",
      key: "vat_rate",
      width: 120,
      align: "center",
      render: (vatRate: number) => getVatRateTag(vatRate),
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
      size="middle"
      onRow={(record) => ({
        style: { cursor: "pointer" },
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "#f5f5f5";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "";
        },
      })}
      pagination={{
        current: page,
        pageSize: page_size,
        total: filteredData.length,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        showTotal: (total, range) => (
          <Text type="secondary">
            {range[0]}-{range[1]} из {total} записей
          </Text>
        ),
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
