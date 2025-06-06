import React, { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
// import { useMutation } from "@tanstack/react-query";
// import toast from "react-hot-toast";
import { Button, Typography, Spin, Space } from "antd";
import "./loginPage.css";
import { FloatingInput } from "../../components/floatingInput/floatingInput";
import { UserFormModal } from "../usersPage/components/userFormModal";
import {
  useLoginMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} from "../../hooks/auth/useAuthMutations";

declare global {
  interface Window {
    verificationExecuted?: boolean;
  }
}

type FormData = {
  email: string;
  password: string;
};

export const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const emailValue = watch("email");
  // const navigate = useNavigate();
  const location = useLocation();
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [showResendLink, setShowResendLink] = useState(false);

  const resendVerificationMutation = useResendVerificationMutation();
  const verifyEmailMutation = useVerifyEmailMutation();
  const loginMutation = useLoginMutation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token && !window.verificationExecuted) {
      window.verificationExecuted = true;
      verifyEmailMutation.mutate(token);
    }

    return () => {
      window.verificationExecuted = false;
    };
  }, []);

  const onSubmit = useCallback(
    (data: FormData) => {
      loginMutation.mutate(data, {
        onSuccess: () => {
          setShowResendLink(false);
        },
        onError: (error) => {
          if (error.response?.status === 403) {
            setShowResendLink(true);
          } else {
            setShowResendLink(false);
          }
        },
      });
    },
    [loginMutation]
  );

  return (
    <div className="login_container">
      <div className="form">
        {showResendLink && (
          <div className="resend-notification">
            <Typography.Text type="danger" style={{ marginRight: 8 }}>
              Email не подтвержден
            </Typography.Text>
            <Button
              type="link"
              loading={resendVerificationMutation.isPending}
              onClick={() => resendVerificationMutation.mutate(emailValue)}
              style={{ padding: 0, marginRight: 8 }}
            >
              Отправить письмо повторно
            </Button>
          </div>
        )}

        <Typography.Title level={3} className="form-title">
          Вход
        </Typography.Title>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "E-mail обязателен",
            }}
            render={({ field }) => (
              <FloatingInput
                id="email"
                name="email"
                value={field.value}
                onChange={field.onChange}
                disabled={loginMutation.isPending}
                hint="Введите email"
              />
            )}
          />
          {errors.email && (
            <div className="error-text">{errors.email.message}</div>
          )}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Пароль обязателен",
              minLength: {
                value: 6,
                message: "Пароль должен содержать минимум 6 символов",
              },
            }}
            render={({ field }) => (
              <FloatingInput
                id="password"
                name="Пароль"
                type="password"
                value={field.value}
                onChange={field.onChange}
                disabled={loginMutation.isPending}
                hint="Минимум 6 символов"
              />
            )}
          />
          {errors.password && (
            <div className="error-text">{errors.password.message}</div>
          )}

          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              htmlType="submit"
              className="button"
              size="large"
              disabled={loginMutation.isPending}
              block
            >
              {loginMutation.isPending ? <Spin size="small" /> : "Войти"}
            </Button>

            <Button
              type="link"
              onClick={() => setIsRegisterModalVisible(true)}
              block
            >
              Зарегистрироваться
            </Button>
          </Space>
        </form>
      </div>

      <UserFormModal
        visible={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        onSuccess={() => {
          setIsRegisterModalVisible(false);
        }}
        mode="registration"
      />
    </div>
  );
};
