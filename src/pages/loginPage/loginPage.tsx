import React, { useCallback, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { Button, Typography, Spin, Space, Alert } from "antd";
import "./loginPage.css";
import { FloatingInput } from "../../components/floatingInput/floatingInput";
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
  const location = useLocation();
  const [showResendLink, setShowResendLink] = useState(false);
  // const [showAdminWarning, setShowAdminWarning] = useState(false);

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
      // if (!data.email.includes("admin@")) {
      //   setShowAdminWarning(true);
      //   return;
      // }

      // setShowAdminWarning(false);
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

        {/* {showAdminWarning && (
          <Alert
            message="Чтобы зайти на сайт у вас должен быть доступ администратора"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )} */}

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
          </Space>
        </form>
      </div>
    </div>
  );
};
