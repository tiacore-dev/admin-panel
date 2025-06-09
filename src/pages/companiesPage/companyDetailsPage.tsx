// companyDetailsPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompanyQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin, Typography } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useCompanyMutations } from "../../hooks/companies/useCompanyMutation";
import { CompanyCard } from "./components/companyDetailsCard";
import { CompanyFormModal } from "./components/companyFormModal";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { UserCompanyRelationsTable } from "../../components/userCompanyRelations/userCompanyRelationsTable";
import { usePermissions } from "../../context/permissionsContext";
import { EntityCompanyRelationsTable } from "../../components/entityCompanyRelations";
import { CreateSellerModal } from "./components/createSellerModal";
import { CreateBuyerModal } from "./components/createBuyerModal";

export const CompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { company_id } = useParams<{ company_id: string }>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const { hasPermission } = usePermissions();

  const {
    data: companyDetails,
    isLoading,
    isError,
    refetch,
  } = useCompanyDetailsQuery(company_id!);

  const { deleteMutation } = useCompanyMutations(
    company_id || "",
    companyDetails?.company_name || "",
    companyDetails?.description || ""
  );

  useEffect(() => {
    if (companyDetails) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Компании", to: "/companies" },
          {
            label: companyDetails.company_name,
            to: `/companies/${company_id}`,
          },
        ])
      );
    }
  }, [dispatch, companyDetails, company_id]);

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/companies");
      },
    });
  }, [deleteMutation, navigate]);

  const handleEditSuccess = useCallback(() => {
    setShowEditModal(false);
    refetch();
  }, [refetch]);

  const handleSellerSuccess = useCallback(() => {
    setShowSellerModal(false);
    refetch();
  }, [refetch]);

  const handleBuyerSuccess = useCallback(() => {
    setShowBuyerModal(false);
    refetch();
  }, [refetch]);

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && companyDetails && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  {hasPermission("edit_company") && (
                    <Button
                      onClick={() => {
                        setShowEditModal(true);
                      }}
                      icon={<EditOutlined />}
                    >
                      Редактировать
                    </Button>
                  )}

                  {hasPermission("delete_company") && (
                    <Button
                      danger
                      onClick={() => setShowDeleteConfirm(true)}
                      icon={<DeleteOutlined />}
                    >
                      Удалить
                    </Button>
                  )}
                </Space>
                <CompanyCard data={companyDetails} loading={isLoading} />
                <UserCompanyRelationsTable companyId={company_id} />

                {/* Таблица организаций (sellers) */}
                <div style={{ marginBottom: 24, marginTop: 16 }}>
                  <Space style={{ marginBottom: 16 }}>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      Организации
                    </Typography.Title>
                    {hasPermission("create_entity_company_relation") && (
                      <Button
                        // type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowSellerModal(true)}
                      >
                        Добавить организацию
                      </Button>
                    )}
                  </Space>
                  <EntityCompanyRelationsTable
                    companyId={company_id!}
                    relationType="seller"
                    title="Организации"
                  />
                </div>

                {/* Таблица контрагентов (buyers) */}
                <div style={{ marginBottom: 24 }}>
                  <Space style={{ marginBottom: 16 }}>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      Контрагенты
                    </Typography.Title>
                    {hasPermission("create_entity_company_relation") && (
                      <Button
                        // type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowBuyerModal(true)}
                      >
                        Добавить контрагента
                      </Button>
                    )}
                  </Space>
                  <EntityCompanyRelationsTable
                    companyId={company_id!}
                    relationType="buyer"
                    title="Контрагенты"
                  />
                </div>
              </div>

              {showEditModal && (
                <CompanyFormModal
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  onSuccess={handleEditSuccess}
                  mode="edit"
                  initialData={companyDetails}
                />
              )}

              {showSellerModal && (
                <CreateSellerModal
                  visible={showSellerModal}
                  onCancel={() => setShowSellerModal(false)}
                  onSuccess={handleSellerSuccess}
                  companyId={company_id!}
                />
              )}

              {showBuyerModal && (
                <CreateBuyerModal
                  visible={showBuyerModal}
                  onCancel={() => setShowBuyerModal(false)}
                  onSuccess={handleBuyerSuccess}
                  companyId={company_id!}
                />
              )}

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
