// src/pages/legalEntitiesBuyersPage/LegalEntitiesBuyersPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import { Button, Space, Spin } from "antd";
import { useLegalEntitiesBuyers } from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntitiesBuyersTable } from "./components/legalEntitiesBuyersTable";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { resetState } from "../../redux/slices/legalEntityBuyersSlice";
import { RootState } from "../../redux/store";
import { CreateBuyerModal } from "./components/createBuyerModal";

export const LegalEntitiesBuyersPage: React.FC = () => {
  const dispatch = useDispatch();
  const { short_name, inn, kpp } = useSelector(
    (state: RootState) => state.legalEntitiesBuyers
  );
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Контрагенты", to: "/legal-entities/buyers" },
      ])
    );
  }, [dispatch]);

  const {
    data: buyersData,
    isLoading,
    isError,
    refetch,
  } = useLegalEntitiesBuyers();

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
                    Добавить контрагента
                  </Button>
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!short_name && !inn && !kpp}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>
                <LegalEntitiesBuyersTable
                  data={buyersData || { total: 0, entities: [] }}
                  loading={isLoading}
                />
              </div>
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}

      <CreateBuyerModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleSuccess}
        showCompanySelect={true} // Включаем выбор компании
      />
    </div>
  );
};
