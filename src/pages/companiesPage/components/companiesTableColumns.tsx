import { Button, Input } from "antd";
import { ColumnType } from "antd/es/table";
import { ICompany } from "../../../api/companiesApi";
import { NavigateFunction } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

interface CompaniesTableColumnsProps {
  navigate: NavigateFunction;
  search: string;
  onSearchChange: (value: string) => void;
}

export const getCompaniesTableColumns = ({
  navigate,
  search,
  onSearchChange,
}: CompaniesTableColumnsProps): ColumnType<ICompany>[] => {
  return [
    {
      title: "Название компании",
      dataIndex: "company_name",
      key: "company_name",
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      sorter: (a: ICompany, b: ICompany) =>
        a.company_name.localeCompare(b.company_name),
      sortDirections: ["ascend", "descend"],
      render: (text: string, record: ICompany) => (
        <Button
          type="link"
          onClick={() => navigate(`/companies/${record.company_id}`)}
        >
          {text}
        </Button>
      ),
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Поиск по названию"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
        </div>
      ),
      filteredValue: search ? [search] : null,
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
  ];
};
