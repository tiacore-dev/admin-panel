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
import { LegalEntitiesTable } from "../legalEntitiesPage/components/legalEntitiesTable";
import { useLegalEntitiesSellers } from "../../hooks/legalEntities/useLegalEntityQuery";
import { LegalEntityFormModal } from "../legalEntitiesPage/components/legalEntityFormModal";
import { usePermissions } from "../../context/permissionsContext";

export const CompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { company_id } = useParams<{ company_id: string }>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { hasPermission } = usePermissions(); // Добавьте этот хук

  const {
    data: companyDetails,
    isLoading,
    isError,
    refetch,
  } = useCompanyDetailsQuery(company_id!);

  const { data: legalEntitiesData } = useLegalEntitiesSellers(company_id);

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
                <div>
                  <div
                    style={{ display: "flex", marginTop: 16, marginBottom: 16 }}
                  >
                    <Typography.Title level={4} style={{ marginRight: 16 }}>
                      Организации
                    </Typography.Title>

                    {hasPermission("add_legal_entity") &&
                      hasPermission("add_legal_entity_company_relation") && (
                        <Button
                          onClick={() => {
                            setIsModalVisible(true);
                          }}
                          icon={<PlusOutlined />}
                        >
                          Добавить
                        </Button>
                      )}
                  </div>

                  <LegalEntitiesTable
                    data={legalEntitiesData || { total: 0, entities: [] }}
                    loading={isLoading}
                    isSellers={true}
                    customNavigate={(id) =>
                      navigate(`/legal_entities/${id}`, {
                        state: {
                          from: "company",
                          companyId: company_id,
                          companyName: companyDetails.company_name,
                        },
                      })
                    }
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
              {showDeleteConfirm && (
                <ConfirmDeleteModal
                  onConfirm={handleDelete}
                  onCancel={() => setShowDeleteConfirm(false)}
                  isDeleteLoading={deleteMutation.isPending}
                />
              )}
              <LegalEntityFormModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                mode="create"
                defaultRelationType="seller"
              />
            </>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
