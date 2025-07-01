"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUserDetailsQuery } from "../../hooks/users/useUserQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin, Card, Typography, Row, Col } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useUserMutations } from "../../hooks/users/useUserMutation";
import { UserDetailsCard } from "./components/userDetails";
import {
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { UserFormModal } from "./components/userFormModal";
import { UserCompanyRelationsTable } from "../../components/userCompanyRelations/userCompanyRelationsTable";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompanyQuery";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";

const { Title, Text } = Typography;

export const UserDetailsPage: React.FC = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const { data: companyDetails } = useCompanyDetailsQuery(
    location.state?.companyId || "",
    {
      enabled: !!location.state?.companyId,
    }
  );

  const {
    data: userDetails,
    isLoading,
    isError,
  } = useUserDetailsQuery(user_id!);

  useEffect(() => {
    if (userDetails) {
      if (
        location.state?.from === "companyDetails" &&
        location.state?.companyId
      ) {
        dispatch(
          setBreadcrumbs([
            { label: "Главная страница", to: "/home" },
            { label: "Компании", to: "/companies" },
            {
              label: companyDetails?.company_name || "Компания",
              to: `/companies/${location.state.companyId}`,
            },
            {
              label: userDetails.full_name,
              to: `/users/${user_id}`,
            },
          ])
        );
      } else {
        dispatch(
          setBreadcrumbs([
            { label: "Главная страница", to: "/home" },
            { label: "Пользователи", to: "/users" },
            { label: userDetails.full_name, to: `/users/${user_id}` },
          ])
        );
      }
    }
  }, [dispatch, userDetails, user_id, location.state, companyDetails]);

  const { deleteMutation } = useUserMutations(
    user_id || "",
    userDetails?.email || "",
    userDetails?.full_name || "",
    userDetails?.password || "",
    userDetails?.position || ""
  );

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/users");
      },
    });
  };

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

  if (!userDetails) {
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
        {/* Заголовок страницы с градиентом и контекстной навигацией */}
        <Card
          className="gradient-header"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "12px",
            color: "white",
            marginBottom: "24px",
          }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Space direction="vertical" size="small">
                <ContextualNavigation
                  textColor="rgba(255, 255, 255, 0.8)"
                  size="small"
                  showIcon={true}
                />
                <div className="header-content">
                  <div className="header-icon">
                    <UserOutlined style={{ fontSize: 24, color: "white" }} />
                  </div>
                  <div className="header-text">
                    <Title level={2} style={{ margin: 0, color: "white" }}>
                      {userDetails.full_name}
                    </Title>
                    <Text className="header-description">
                      Подробная информация о пользователе
                    </Text>
                  </div>
                </div>
              </Space>
            </Col>
            <Col>
              <div className="header-actions">
                <Button
                  size="large"
                  type="primary"
                  onClick={() => setShowEditModal(true)}
                  icon={<EditOutlined />}
                  className="primary-button"
                  style={{ color: "#764ba2" }}
                >
                  Редактировать
                </Button>
                <Button
                  size="large"
                  danger
                  onClick={() => setShowDeleteConfirm(true)}
                  icon={<DeleteOutlined />}
                  className="primary-button"
                  style={{
                    background: "rgba(255, 77, 79, 0.2) !important",
                    borderColor: "rgba(255, 77, 79, 0.5) !important",
                  }}
                >
                  Удалить
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Основная информация */}
          <UserDetailsCard userDetails={userDetails} />

          {/* Связи с компаниями */}
          <Card>
            <UserCompanyRelationsTable userId={user_id} />
          </Card>
        </Space>

        {/* Модальные окна */}
        {showEditModal && (
          <UserFormModal
            visible={showEditModal}
            onCancel={() => setShowEditModal(false)}
            mode="edit"
            initialData={userDetails}
            onSuccess={() => setShowEditModal(false)}
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
