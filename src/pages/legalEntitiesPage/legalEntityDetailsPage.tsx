import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLegalEntityDetailsQuery } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useLegalEntityMutations } from "../../hooks/legalEntities/useLegalEntityMutation";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin } from "antd";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { BackButton } from "../../components/buttons/backButton";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { LegalEntityFormModal } from "./components/legalEntityFormModal";
import { LegalEntityDetailsCard } from "./components/legalEntityDetailsCard";
// import { BankAccountsTable } from "../bankAccountsPage/components/bankAccountsTable";
// import { useBankAccountQuery } from "../../hooks/bankAccounts/useBankAccountQuery";
import { useCompany } from "../../context/companyContext";
// import { BankAccountCreateModal } from "../bankAccountsPage/components/bankAccountFormModal";
// import { useIsSellerQuery } from "../../hooks/entityCompanyRelations/useEntityCompanyRelationsQuery";
import { usePermissions } from "../../context/permissionsContext";

export const LegalEntityDetailsPage: React.FC = () => {
  const { legal_entity_id } = useParams<{ legal_entity_id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { hasPermission } = usePermissions(); // Добавьте этот хук
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCreateBankAccountModal, setShowCreateBankAccountModal] =
    useState(false);
  const { selectedCompanyId } = useCompany();

  const {
    data: legal_entity,
    isLoading,
    isError,
    refetch,
  } = useLegalEntityDetailsQuery(legal_entity_id || "");

  // const {
  // data: sellers,
  // isLoading: loadingIsSellers,
  // isError: errorEsSellers,
  // } = useIsSellerQuery(legal_entity_id, selectedCompanyId);

  const { deleteMutation } = useLegalEntityMutations(
    legal_entity_id || "",
    legal_entity?.legal_entity_name || "",
    legal_entity?.inn || "",
    legal_entity?.kpp || "",
    legal_entity?.vat_rate || 0,
    legal_entity?.address || "",
    legal_entity?.entity_type || "",
    legal_entity?.signer || "",
    legal_entity?.company || ""
  );

  useEffect(() => {
    if (legal_entity) {
      const fromPage = location.state?.from;
      const companyId = location.state?.companyId;
      const companyName = location.state?.companyName;

      if (fromPage === "company" && companyId && companyName) {
        dispatch(
          setBreadcrumbs([
            { label: "Главная страница", to: "/home" },
            { label: "Компании", to: "/companies" },
            {
              label: companyName,
              to: `/companies/${companyId}`,
            },
            {
              label: legal_entity.legal_entity_name,
              to: `/legal_entities/${legal_entity_id}`,
            },
          ])
        );
      } else {
        dispatch(
          setBreadcrumbs([
            { label: "Главная страница", to: "/home" },
            { label: "Контрагенты", to: "/legal_entities" },
            {
              label: legal_entity.legal_entity_name,
              to: `/legal_entities/${legal_entity_id}`,
            },
          ])
        );
      }
    }
  }, [dispatch, legal_entity, legal_entity_id, location.state]);

  useEffect(() => {
    if (selectedCompanyId) {
      refetch();
    }
  }, [selectedCompanyId, refetch]);

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/legal_entities");
      },
    });
  };

  // const isSeller = !!sellers?.relations?.length;
  const fromPage = location.state?.from;
  // const showAdditionalFields = fromPage === "company" || isSeller;

  // const { data: bankAccountsData, isLoading: isBankAccountsLoading } =
  //   useBankAccountQuery({
  //     legal_entity: legal_entity_id,
  //   });

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && legal_entity && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  {hasPermission("edit_legal_entity") && (
                    <Button
                      onClick={() => {
                        setIsModalVisible(true);
                      }}
                    >
                      <EditOutlined />
                      Редактировать
                    </Button>
                  )}
                  {hasPermission("delete_legal_entity") && (
                    <Button danger onClick={() => setShowDeleteConfirm(true)}>
                      <DeleteOutlined /> Удалить
                    </Button>
                  )}
                </Space>

                <LegalEntityDetailsCard
                  legal_entity={legal_entity}
                  showAdditionalFields={fromPage === "company"}
                />

                {fromPage === "company" && (
                  <>
                    {/* {hasPermission("add_bank_account") && (
                      <Button
                        style={{ marginBottom: 16 }}
                        onClick={() => setShowCreateBankAccountModal(true)}
                        icon={<PlusOutlined />}
                      >
                        Добавить банковский счёт
                      </Button>
                    )} */}
                    {/* <BankAccountsTable
                      data={bankAccountsData || { total: 0, bank_accounts: [] }}
                      loading={isBankAccountsLoading}
                      legalEntitiesData={{
                        legal_entity_id: legal_entity.legal_entity_id,
                        legal_entity_name: legal_entity.legal_entity_name,
                      }}
                    /> */}
                  </>
                )}
              </div>

              <LegalEntityFormModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onSuccess={() => {
                  setIsModalVisible(false);
                  refetch();
                }}
                mode="edit"
                initialData={legal_entity}
                defaultRelationType={
                  fromPage === "company" ? "seller" : "buyer"
                }
              />

              {/* <BankAccountCreateModal
                visible={showCreateBankAccountModal}
                onCancel={() => setShowCreateBankAccountModal(false)}
                legalEntitiesData={{
                  legal_entity_id: legal_entity.legal_entity_id,
                  legal_entity_name: legal_entity.legal_entity_name,
                }}
                onSuccess={() => {
                  setShowCreateBankAccountModal(false);
                  refetch();
                }}
                mode="create"
              /> */}

              {showDeleteConfirm && (
                <ConfirmDeleteModal
                  onConfirm={handleDelete}
                  onCancel={() => setShowDeleteConfirm(false)}
                  isDeleteLoading={deleteMutation.isPending}
                />
              )}
            </>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
