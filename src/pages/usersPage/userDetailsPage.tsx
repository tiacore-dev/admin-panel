import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useUserDetailsQuery } from "../../hooks/users/useUserQuery";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Space, Spin } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { useUserMutations } from "../../hooks/users/useUserMutation";
import { UserDetailsCard } from "./components/userDetails";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { UserFormModal } from "./components/userFormModal";
import { UserCompanyRelationsTable } from "../../components/userCompanyRelations/userCompanyRelationsTable";
import { useCompanyDetailsQuery } from "../../hooks/companies/useCompanyQuery";

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
      enabled: !!location.state?.companyId, // Запрос выполняется только если companyId существует
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
        // Хлебные крошки для перехода со страницы компании
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
        // Стандартные хлебные крошки для перехода со страницы пользователей
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

  return (
    <div>
      {isLoading ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isError && userDetails && (
            <>
              <div className="main-container">
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    onClick={() => {
                      setShowEditModal(true);
                    }}
                  >
                    <EditOutlined />
                    Редактировать
                  </Button>
                  <Button danger onClick={() => setShowDeleteConfirm(true)}>
                    <DeleteOutlined /> Удалить
                  </Button>
                </Space>
                <div
                  style={{
                    display: "flex",
                    gap: "24px",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: "0 0 300px" }}>
                    <UserDetailsCard userDetails={userDetails} />
                  </div>
                  {/* <div style={{ flex: 1 }}>
                    <UserCompanyRelationsTable userId={user_id} />
                  </div> */}
                </div>
              </div>

              {showEditModal && (
                <UserFormModal
                  visible={showEditModal}
                  onCancel={() => setShowEditModal(false)}
                  mode="edit"
                  initialData={userDetails}
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
