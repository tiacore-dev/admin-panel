import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import { Button, Spin } from "antd";
import {
  useLegalEntitiesBuyers,
  useLegalEntitiesForSelection,
  // useLegalEntityQuery,
} from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntitiesTable } from "./components/legalEntitiesTable";
import { LegalEntityFormModal } from "./components/legalEntityFormModal";
import { PlusOutlined } from "@ant-design/icons";
// import { legalEntitiesSelector } from "../../redux/slices/legalEntitiesSlice";
import { Space } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { resetState } from "../../redux/slices/legalEntitiesSlice";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../context/permissionsContext";

export const LegalEntitiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { search, company, entity_type } = useSelector(
    (state: RootState) => state.legalEntities
  );
  const { hasPermission } = usePermissions(); // Добавьте этот хук

  const buyersData = useLegalEntitiesBuyers();
  const selectionData = useLegalEntitiesForSelection();

  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const {
    data: legal_entities_data,
    isLoading,
    isError,
  } = isSuperadmin ? selectionData : buyersData;

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Контрагенты", to: "/legal_entities" },
      ])
    );
  }, [dispatch]);

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && (
            <div>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  {hasPermission("add_legal_entity_company_relation") &&
                    hasPermission("add_legal_entity") && (
                      <Button
                        onClick={() => setIsModalVisible(true)}
                        icon={<PlusOutlined />}
                      >
                        Добавить контрагента
                      </Button>
                    )}
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!search && !company && !entity_type}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>

                <LegalEntitiesTable
                  data={legal_entities_data || { total: 0, entities: [] }}
                  loading={isLoading}
                  isSellers={false}
                  customNavigate={(id) =>
                    navigate(`/legal_entities/${id}`, {
                      state: { from: "legal_entities" },
                    })
                  }
                />
              </div>
              <LegalEntityFormModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                mode="create"
                defaultRelationType="buyer"
              />
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
