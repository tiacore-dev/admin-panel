import React, { useEffect } from "react";
import { refreshToken } from "../../api/authApi";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { useDispatch } from "react-redux";
import { Button, Typography } from "antd"; // Импорт компонентов Ant Design
// import { useUserDetailsQuery } from "../../hooks/users/useUserQuery";
// import { UserDetailsCard } from "../usersPage/components/userDetails";
// import { EditOutlined } from "@ant-design/icons";
// import { UserFormModal } from "../usersPage/components/userFormModal";
// import { UserCompanyRelationsTable } from "../../components/userCompanyRelations/userCompanyRelationsTable";

export const HomePage: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumbs([{ label: "Главная страница", to: "/home" }]));
  }, [dispatch]);

  const tryRefresh = () => {
    refreshToken();
  };
  // const [showEditModal, setShowEditModal] = useState(false);
  // const selectedCompanyId =
  // localStorage.getItem("selectedCompanyId") || undefined;

  // const {
  //   data: userDetails,
  //   isLoading,
  //   isError,
  //   // } = useUserDetailsQuery(user_id!);
  // } = useUserDetailsQuery("19edaa8f-3951-4abf-8f1a-332571f80738");

  return (
    <div className="main-container">
      <Typography.Title level={1}>Вы успешно авторизовались!</Typography.Title>

      {/* Кнопка для обновления токена */}
      <Button onClick={tryRefresh}>Обновить токен</Button>

      {/* <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{ flex: "0 0 300px", marginTop: "16px", marginBottom: "16px" }}
        >
          <UserDetailsCard userDetails={userDetails} />
        </div>
        <div style={{ flex: 1 }}>
          <UserCompanyRelationsTable
            userId={"19edaa8f-3951-4abf-8f1a-332571f80738"}
            companyId={selectedCompanyId}
          />
        </div>
      </div> */}
      {/* <Button
        onClick={() => {
          setShowEditModal(true);
        }}
      >
        <EditOutlined />
        Редактировать
      </Button> */}
      {/* {showEditModal && (
        <UserFormModal
          visible={showEditModal}
          onCancel={() => setShowEditModal(false)}
          mode="edit"
          initialData={userDetails}
        />
      )} */}
    </div>
  );
};
