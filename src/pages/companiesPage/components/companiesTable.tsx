import { Table } from "antd";
import { ICompany } from "../../../api/companiesApi";
import { useDispatch, useSelector } from "react-redux";
import { getCompaniesTableColumns } from "./companiesTableColumns";
import {
  setPage,
  setPageSize,
  setSearch,
} from "../../../redux/slices/companiesSlice";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";

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
  const { search, page, page_size } = useSelector(
    (state: RootState) => state.companies
  );
  const navigate = useNavigate();

  // Фильтрация данных
  const filteredData = data.companies.filter((company) => {
    if (!search) return true;
    return company.company_name.toLowerCase().includes(search.toLowerCase());
  });

  const columns = getCompaniesTableColumns({
    navigate,
    search,
    onSearchChange: (value) => {
      dispatch(setSearch(value));
      dispatch(setPage(1)); // Сбрасываем на первую страницу при новом поиске
    },
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredData} // Передаем все отфильтрованные данные
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
