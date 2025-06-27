// src/pages/legalEntitiesSellersPage/LegalEntitiesSellersPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import { Button, Space, Spin } from "antd";
import { useLegalEntityQuery } from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntitiesTable } from "./components/legalEntitiesTable";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { resetState } from "../../redux/slices/legalEntitySellersSlice";
import { RootState } from "../../redux/store";
import { CreateLegalEntityModal } from "./components/createLegalEntityModal";

export const LegalEntitiesPage: React.FC = () => {
  const dispatch = useDispatch();
  const { short_name, inn } = useSelector(
    (state: RootState) => state.legalEntitiesSellers
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Юр. лица", to: "/legal-entities" },
      ])
    );
  }, [dispatch]);

  const {
    data: legalEntitiesData,
    isLoading,
    isError,
    refetch,
  } = useLegalEntityQuery();

  const handleResetFilters = () => {
    dispatch(resetState());
  };

  const handleSuccess = () => {
    refetch();
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
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalVisible(true)}
                  >
                    Добавить юр. лицо
                  </Button>
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!short_name && !inn}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>
                <LegalEntitiesTable
                  data={legalEntitiesData || { total: 0, entities: [] }}
                  loading={isLoading}
                />
              </div>
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}

      <CreateLegalEntityModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleSuccess}
        showCompanySelect={true} // Включаем выбор компании
      />
    </div>
  );
};
