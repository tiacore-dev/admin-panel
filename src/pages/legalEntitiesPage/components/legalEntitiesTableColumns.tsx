import { ColumnType } from "antd/es/table";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface LegalEntitiesTableColumnsProps {
  navigate: ReturnType<typeof useNavigate> | ((id: string) => void);
  search: string;
  entity_type: string;
  onSearchChange: (value: string) => void;
  onEntityTypeChange: (value: string) => void;
  isSellers: boolean;
}

export const getLegalEntitiesTableColumns = ({
  navigate,
  search,
  onSearchChange,
  isSellers,
}: LegalEntitiesTableColumnsProps): ColumnType<ILegalEntity>[] => {
  const handleNavigate = (id: string) => {
    if (typeof navigate === "function") {
      if (navigate.length === 1) {
        // Это кастомная функция navigate (принимает только id)
        (navigate as (id: string) => void)(id);
      } else {
        // Это стандартный navigate из react-router
        (navigate as NavigateFunction)(`/legal_entities/${id}`);
      }
    }
  };

  const baseColumns: ColumnType<ILegalEntity>[] = [
    {
      title: "Название",
      dataIndex: "legal_entity_name",
      key: "legal_entity_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        a.legal_entity_name.localeCompare(b.legal_entity_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: ILegalEntity) => {
        return (
          <Button
            type="link"
            onClick={() => handleNavigate(record.legal_entity_id)}
          >
            {text}
          </Button>
        );
      },
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        </div>
      ),
      filteredValue: search ? [search] : null,
    },
    {
      title: "ИНН",
      dataIndex: "inn",
      key: "inn",
      // width: 150,
    },
    {
      title: "КПП",
      dataIndex: "kpp",
      key: "kpp",
      // width: 130,
      render: (kpp) => kpp || "—",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      sorter: (a: ILegalEntity, b: ILegalEntity) =>
        a.address.localeCompare(b.address),
      sortDirections: ["ascend", "descend"],
    },
  ];

  const sellerSpecificColumns: ColumnType<ILegalEntity>[] = isSellers
    ? [
        {
          title: "Ставка НДС",
          dataIndex: "vat_rate",
          key: "vat_rate",
          render: (vat_rate) =>
            vat_rate ? `${vat_rate}%` : "НДС не облагается",
          // width: 200,
        },
        {
          title: "Подписант",
          dataIndex: "signer",
          key: "signer",
          render: (signer) => signer || "Не указано",
        },
      ]
    : [];

  return [...baseColumns, ...sellerSpecificColumns];
};
