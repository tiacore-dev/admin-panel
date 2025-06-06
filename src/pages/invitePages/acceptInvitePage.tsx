import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Spin, Space, Button } from "antd";
import { useAcceptInviteMutation } from "../../hooks/auth/useAuthMutations";
import toast from "react-hot-toast";
import { refreshToken } from "../../api/authApi";

export const AcceptInvitePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { Title } = Typography;

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const acceptInviteMutation = useAcceptInviteMutation(); // Теперь вызываем без параметров

  useEffect(() => {
    if (token) {
      acceptInviteMutation.mutate(token); // Передаем token при вызове mutate
    } else {
      toast.error("Приглашение отсутствует");
      navigate("/login");
    }
  }, [token]);

  const goToHome = () => {
    refreshToken();
    navigate("/home");
  };

  return (
    <div className="login_container">
      <div className="form">
        {acceptInviteMutation.isPending ? (
          <Space direction="vertical" align="center">
            <Title level={3} className="form-title">
              Обработка приглашения...
            </Title>
            <Spin size="large" />
          </Space>
        ) : acceptInviteMutation.isError ? (
          <Title level={3} className="form-title" style={{ color: "red" }}>
            Ошибка при обработке приглашения
          </Title>
        ) : acceptInviteMutation.isSuccess ? (
          <>
            <Title level={3} className="form-title" style={{ color: "green" }}>
              Приглашение успешно принято{" "}
            </Title>
            <Button
              type="primary"
              onClick={() => goToHome()}
              style={{ marginTop: 16 }}
            >
              Перейти на сайт
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};
