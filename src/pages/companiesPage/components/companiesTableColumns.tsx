import { Button, Input, Select } from "antd";
import { ColumnType } from "antd/es/table";
import { ICompany } from "../../../api/companiesApi";
import { NavigateFunction } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { IApp } from "../../../api/baseApi";

interface CompaniesTableColumnsProps {
  navigate: NavigateFunction;
  search: string;
  appFilter: string;
  onSearchChange: (value: string) => void;
  onAppFilterChange: (value: string) => void;
  apps: IApp[];
}

export const getCompaniesTableColumns = ({
  navigate,
  search,
  appFilter,
  onSearchChange,
  onAppFilterChange,
  apps,
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
    {
      title: "Приложение",
      dataIndex: "application_id",
      key: "application_id",
      render: (application_id: string) => {
        const app = apps.find((a) => a.application_id === application_id);
        return app?.application_name || application_id;
      },
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Фильтр по приложению"
            value={appFilter || undefined}
            onChange={onAppFilterChange}
            style={{ width: 200 }}
            allowClear
            options={apps.map((app) => ({
              value: app.application_id,
              label: app.application_name,
            }))}
          />
        </div>
      ),
      filteredValue: appFilter ? [appFilter] : null,
    },
  ];
};
