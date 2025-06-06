import React, { useEffect, useState } from "react";
// import { refreshToken } from "../loginPage/auth";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import { useUserDetailsQuery } from "../../hooks/users/useUserQuery";
import { UserDetailsCard } from "../usersPage/components/userDetails";
import { EditOutlined } from "@ant-design/icons";
import { UserFormModal } from "../usersPage/components/userFormModal";
import { UserCompanyRelationsTable } from "../../components/userCompanyRelations/userCompanyRelationsTable";

export const AccountPage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Аккаунт", to: "/account" },
      ])
    );
  }, [dispatch]);

  const [showEditModal, setShowEditModal] = useState(false);
  const selectedCompanyId =
    localStorage.getItem("selectedCompanyId") || undefined;
  const userId = localStorage.getItem("user_id");
  const { data: userDetails } = useUserDetailsQuery(userId || "");

  if (!userId) {
    return <div>Пользователь не авторизован</div>;
  }
  return (
    <div className="main-container">
      <Button
        onClick={() => {
          setShowEditModal(true);
        }}
        style={{ marginBottom: 16 }}
      >
        <EditOutlined />
        Редактировать
      </Button>
      <UserDetailsCard userDetails={userDetails} />
      <UserCompanyRelationsTable userId={userId} fromAccount={true} />
      {showEditModal && (
        <UserFormModal
          visible={showEditModal}
          onCancel={() => setShowEditModal(false)}
          mode="edit"
          initialData={userDetails}
        />
      )}
    </div>
  );
};
