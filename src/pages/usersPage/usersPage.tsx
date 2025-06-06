import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import { Button, Space, Spin } from "antd";
import { useUserQueryAll } from "../../hooks/users/useUserQuery";
import { UsersTable } from "./components/usersTable";
import { UserFormModal } from "./components/userFormModal";
import { PlusOutlined, ClearOutlined } from "@ant-design/icons";
import { resetState } from "../../redux/slices/usersSlice";
import { RootState } from "../../redux/store";

export const UsersPage: React.FC = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const {
    email,
    full_name,
    position,
    // page, page_size
  } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Пользователи", to: "/users" },
      ])
    );
  }, [dispatch]);

  const { data: users_data, isLoading, isError } = useUserQueryAll();

  // const { data: userRolesResponse } = useUserRoles();

  const handleResetFilters = () => {
    dispatch(resetState());
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
                    onClick={() => setIsModalVisible(true)}
                    icon={<PlusOutlined />}
                  >
                    Добавить пользователя
                  </Button>
                  <Button
                    onClick={handleResetFilters}
                    icon={<ClearOutlined />}
                    disabled={!email && !full_name && !position}
                  >
                    Сбросить фильтры
                  </Button>
                </Space>
                <UsersTable
                  data={users_data || { total: 0, users: [] }}
                  loading={isLoading}
                />
              </div>
              <UserFormModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                mode="create"
              />
            </div>
          )}
          {isError && <BackButton />}
        </>
      )}
    </div>
  );
};
