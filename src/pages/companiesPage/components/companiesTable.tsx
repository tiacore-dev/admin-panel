import { Table } from "antd";
import { ICompany } from "../../../api/companiesApi";
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesTableColumns } from "./companiesTableColumns";
import {
  setPage,
  setPageSize,
  setSearch,
  setAppFilter,
} from "../../../redux/slices/companiesSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { useAppsQuery } from "../../../hooks/base/useBaseQuery";

interface CompaniesTableProps {
  data: {
    total: number;
    companies: ICompany[];
  };
  loading: boolean;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = ({
  data = { total: 0, companies: [] },
  loading,
}) => {
  const dispatch = useDispatch();
  const { search, appFilter, page, page_size } = useSelector(
    (state: RootState) => state.companies
  );
  const navigate = useNavigate();
  const { data: appsData } = useAppsQuery();

  // Фильтрация данных
  const filteredData = data.companies.filter((company) => {
    const matchesSearch =
      !search ||
      company.company_name.toLowerCase().includes(search.toLowerCase());
    const matchesAppFilter = !appFilter || company.application_id === appFilter;
    return matchesSearch && matchesAppFilter;
  });

  const columns = getCompaniesTableColumns({
    navigate,
    search,
    appFilter,
    onSearchChange: (value) => {
      dispatch(setSearch(value));
      dispatch(setPage(1));
    },
    onAppFilterChange: (value) => {
      dispatch(setAppFilter(value));
      dispatch(setPage(1));
    },
    apps: appsData?.applications || [],
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="company_id"
        loading={loading}
        pagination={
          filteredData.length > 10
            ? {
                current: page,
                pageSize: page_size,
                total: filteredData.length,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                onChange: (newPage, newPageSize) => {
                  if (newPageSize !== page_size) {
                    dispatch(setPageSize(newPageSize));
                  }
                  dispatch(setPage(newPage));
                },
              }
            : false
        }
      />
    </div>
  );
};
