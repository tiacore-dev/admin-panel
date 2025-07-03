"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin, Card, Typography, Row, Col } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ContextualNavigation } from "../../components/contextualNavigation/contextualNavigation";
import { useCityDetailsQuery } from "../../hooks/cities/useCitiesQuery";
import { useCityMutations } from "../../hooks/cities/useCityMutation";
import { CityFormModal } from "./cityFormModal";
import { CityDetailsCard } from "./cityDetails";

const { Title, Text } = Typography;

export const CityDetailsPage: React.FC = () => {
  const { city_id } = useParams<{ city_id: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const {
    data: cityDetails,
    isLoading,
    isError,
  } = useCityDetailsQuery(city_id!);

  useEffect(() => {
    if (cityDetails) {
      dispatch(
        setBreadcrumbs([
          { label: "Главная страница", to: "/home" },
          { label: "Города", to: "/cities" },
          { label: cityDetails.city_name, to: `/cities/${city_id}` },
        ])
      );
    }
  }, [dispatch, cityDetails, city_id, location.state]);

  const { updateMutation, deleteMutation } = useCityMutations(
    city_id || "",
    cityDetails?.city_name || "",
    cityDetails?.code || "",
    cityDetails?.region || "",
    cityDetails?.external_id || ""
  );

  const handleDelete = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
        navigate("/cities");
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

  if (!cityDetails) {
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
                    <EnvironmentOutlined
                      style={{ fontSize: 24, color: "white" }}
                    />
                  </div>
                  <div className="header-text">
                    <Title level={2} style={{ margin: 0, color: "white" }}>
                      {cityDetails.city_name}
                    </Title>
                    <Text className="header-description">
                      Подробная информация о городе
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
          <CityDetailsCard cityDetails={cityDetails} />
        </Space>

        {/* Модальные окна */}
        {showEditModal && (
          <CityFormModal
            visible={showEditModal}
            onCancel={() => setShowEditModal(false)}
            mode="edit"
            initialData={cityDetails}
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
