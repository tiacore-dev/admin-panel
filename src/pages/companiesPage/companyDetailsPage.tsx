"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompanyQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin, Typography, Card } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useCompanyMutations } from "../../hooks/companies/useCompanyMutation";
import { CompanyCard } from "./components/companyDetailsCard";
import { CompanyFormModal } from "./components/companyFormModal";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  BuildOutlined,
  TeamOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { UserCompanyRelationsTable } from "../../components/userCompanyRelations/userCompanyRelationsTable";
// import { EntityCompanyRelationsTable } from "../../components/entityCompanyRelations";
import { CreateLegalEntityModal } from "../legalEntitiesPage/components/createLegalEntityModal";
import { useUserDetailsQuery } from "../../hooks/users/useUserQuery";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";

const { Title, Text } = Typography;

export const CompanyDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { company_id } = useParams<{ company_id: string }>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const location = useLocation();

  const { data: userDetails } = useUserDetailsQuery(
    location.state?.userId || "",
    {
      enabled: !!location.state?.userId,
    }
  );

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
      if (location.state?.from === "userDetails" && location.state?.userId) {
        dispatch(
          setBreadcrumbs([
            { label: "Главная страница", to: "/home" },
            { label: "Пользователи", to: "/users" },
            {
              label: userDetails?.full_name || "Пользователь",
              to: `/users/${location.state.userId}`,
            },
            {
              label: companyDetails.company_name,
              to: `/companies/${company_id}`,
            },
          ])
        );
      } else {
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
    }
  }, [dispatch, userDetails, company_id, location.state, companyDetails]);

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

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="center-spin">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-container">
        <div className="page-content">
          <BackButton />
        </div>
      </div>
    );
  }

  if (!companyDetails) {
    return (
      <div className="page-container">
        <div className="page-content">
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Заголовок страницы с контекстной навигацией */}
        <Card className="content-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <BuildOutlined
                style={{ fontSize: 24, color: "#1890ff", marginRight: 12 }}
              />
              <div>
                <ContextualNavigation
                  textColor="#8c8c8c"
                  size="small"
                  showIcon={true}
                />
                <Title
                  level={2}
                  style={{ margin: "4px 0 0 0", color: "#262626" }}
                >
                  {companyDetails.company_name}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  Детальная информация о компании
                </Text>
              </div>
            </div>

            <Space>
              <Button
                type="primary"
                onClick={() => setShowEditModal(true)}
                icon={<EditOutlined />}
                size="large"
              >
                Редактировать
              </Button>

              <Button
                danger
                onClick={() => setShowDeleteConfirm(true)}
                icon={<DeleteOutlined />}
                size="large"
              >
                Удалить
              </Button>
            </Space>
          </div>
        </Card>

        {/* Карточка с информацией о компании */}
        <CompanyCard data={companyDetails} loading={isLoading} />

        {/* Таблица пользователей компании */}
        <Card className="content-card">
          <UserCompanyRelationsTable companyId={company_id} />
        </Card>

        {/* Таблица организаций (sellers) */}
        {/* <Card className="content-card"> */}
        {/* <EntityCompanyRelationsTable
          companyId={company_id!}
          relationType="seller"
          title="Организации"
          companyName={companyDetails?.company_name}
        /> */}
        {/* </Card> */}

        {/* Таблица контрагентов (buyers) */}
        {/* <Card
          className="content-card"
          title={
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space>
                <BankOutlined style={{ color: "#fa8c16" }} />
                <span>Контрагенты</span>
              </Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowBuyerModal(true)}
              >
                Добавить контрагента
              </Button>
            </div>
          }
        > */}
        {/* <EntityCompanyRelationsTable
          companyId={company_id!}
          relationType="buyer"
          title="Контрагенты"
          companyName={companyDetails?.company_name}
        /> */}
        {/* </Card> */}

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
          <CreateLegalEntityModal
            visible={showSellerModal}
            onCancel={() => setShowSellerModal(false)}
            onSuccess={handleSellerSuccess}
            companyId={company_id!}
            relationTypeBeforeSelect={"seller"}
          />
        )}

        {showBuyerModal && (
          <CreateLegalEntityModal
            visible={showBuyerModal}
            onCancel={() => setShowBuyerModal(false)}
            onSuccess={handleBuyerSuccess}
            companyId={company_id!}
            relationTypeBeforeSelect={"buyer"}
          />
        )}

        {showDeleteConfirm && (
          <ConfirmDeleteModal
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
            isDeleteLoading={deleteMutation.isPending}
          />
        )}
      </div>
    </div>
  );
};
