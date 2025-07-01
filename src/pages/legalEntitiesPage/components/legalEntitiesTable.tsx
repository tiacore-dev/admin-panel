"use client";

import type React from "react";
import type { TableColumnsType } from "antd";
import { Button, Table, Typography, Avatar, Tag, Tooltip, message } from "antd";
import {
  BankOutlined,
  CopyOutlined,
  // EyeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import type { ILegalEntity } from "../../../api/legalEntitiesApi";
import { useNavigate } from "react-router-dom";
import {
  setPage,
  setPageSize,
} from "../../../redux/slices/legalEntitySellersSlice";

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
      title: "Юр. лицо",
      dataIndex: "short_name",
      key: "short_name",
      width: 380,
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
          {/* <div style={{ flex: 1, minWidth: 0 }}> */}
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
            {/* </div> */}
          </div>
        </div>
      ),
    },
    {
      title: "ИНН / КПП",
      key: "inn_kpp",
      width: 180,
      render: (record: ILegalEntity) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Text>{record.inn}</Text>
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
    },
    {
      title: "ОГРН",
      dataIndex: "ogrn",
      key: "ogrn",
      width: 180,
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Text>{text}</Text>
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
    },
    {
      title: "НДС",
      dataIndex: "vat_rate",
      key: "vat_rate",
      width: 160,
      align: "center",
      render: (vatRate: number) => getVatRateTag(vatRate),
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <Text>{text}</Text>
        </Tooltip>
      ),
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
      vat_rate !== null ? String(entity.vat_rate) === vat_rate : true;

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
      // onRow={() => ({
      //   style: { cursor: "pointer" },
      //   onMouseEnter: (e) => {
      //     e.currentTarget.style.backgroundColor = "#f5f5f5";
      //   },
      //   onMouseLeave: (e) => {
      //     e.currentTarget.style.backgroundColor = "";
      //   },
      // })}
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
