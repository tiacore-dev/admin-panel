// src/pages/rolePermissions/rolePermissionsPage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { Button, Spin } from "antd";
import { BackButton } from "../../components/buttons/backButton";
import { PlusOutlined } from "@ant-design/icons";
import { RolesTable } from "./components/rolesTable";
import { useRolesQuery } from "../../hooks/role/useRoleQuery";
import { CreateRoleModal } from "./components/createRoleModal";

export const RolePermissionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: roles_data,
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
  } = useRolesQuery();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Управление доступом", to: "/role_permissions_relations" },
      ])
    );
  }, [dispatch]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {isLoadingRoles ? (
        <Spin size="large" className="center-spin" />
      ) : (
        <>
          {!isErrorRoles && (
            <div>
              <div className="main-container">
                <Button
                  icon={<PlusOutlined />}
                  onClick={showModal}
                  style={{ marginBottom: 16 }}
                >
                  Создать роль
                </Button>

                <RolesTable rolesData={roles_data || { total: 0, roles: [] }} />
              </div>
            </div>
          )}
          {isErrorRoles && <BackButton />}

          <CreateRoleModal
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onSuccess={handleSuccess}
          />
        </>
      )}
    </div>
  );
};
