import { Table, Typography } from "antd";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { useNavigate } from "react-router-dom";
import { getLegalEntitiesTableColumns } from "./legalEntitiesTableColumns";
import { useSelector, useDispatch } from "react-redux";
import {
  // legalEntitiesSelector,
  setPage,
  setPageSize,
  setSearch,
  // setCompany,
  setEntityType,
} from "../../../redux/slices/legalEntitiesSlice";
import { RootState } from "../../../redux/store";

interface LegalEntitiesTableProps {
  data: {
    total: number;
    entities: ILegalEntity[];
  };
  loading: boolean;
  isSellers: boolean;
  customNavigate?: (id: string) => void;
}

export const LegalEntitiesTable: React.FC<LegalEntitiesTableProps> = ({
  data = { total: 0, entities: [] },
  loading,
  isSellers,
  customNavigate,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    search,
    //  company,
    entity_type,
    page,
    page_size,
  } = useSelector((state: RootState) => state.legalEntities);

  const columns = getLegalEntitiesTableColumns({
    navigate: customNavigate || navigate,
    search,
    entity_type,
    onSearchChange: (value) => dispatch(setSearch(value)),
    onEntityTypeChange: (value) => dispatch(setEntityType(value)),
    isSellers,
  });

  const filteredData = data.entities.filter((entity) => {
    const matchesSearch = search
      ? entity.legal_entity_name.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesSearch;
  });

  return (
    <div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="legal_entity_id"
        loading={loading}
        scroll={{ x: true }}
        pagination={
          filteredData.length > 10
            ? {
                current: page,
                pageSize: page_size,
                total: filteredData.length,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total) => (
                  <Typography.Text>Всего: {total}</Typography.Text>
                ),
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
