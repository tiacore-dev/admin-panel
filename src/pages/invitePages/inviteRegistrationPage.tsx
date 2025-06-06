// src/pages/inviteRegistrationPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Input, Typography, Spin, message, Alert } from "antd";
import { useRegisterWithTokenMutation } from "../../hooks/auth/useAuthMutations";

const { Title } = Typography;

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  position: string;
};

export const InviteRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm<FormValues>();
  const [token, setToken] = useState<string>("");
  const [initialEmail, setInitialEmail] = useState<string>("");
  const [isValidLink, setIsValidLink] = useState<boolean>(true);

  const registerWithTokenMutation = useRegisterWithTokenMutation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");

    if (!urlToken) {
      message.error("Неверная ссылка приглашения - отсутствует токен");
      setIsValidLink(false);
      return;
    }

    setToken(urlToken);

    // Устанавливаем email из URL или оставляем пустым
    const initialEmailValue = urlEmail || "";
    setInitialEmail(initialEmailValue);
    form.setFieldsValue({ email: initialEmailValue });
  }, [location.search]);

  const onFinish = async (values: FormValues) => {
    try {
      await registerWithTokenMutation.mutateAsync({
        token, // Токен будет передаваться в URL
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        position: values.position || "",
      });

      message.success("Регистрация завершена успешно!");
      navigate("/home");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Ошибка при регистрации";
      message.error(errorMessage);
      console.error("Registration error:", error);
    }
  };

  if (!isValidLink) {
    return (
      <div style={{ maxWidth: "400px", margin: "0 auto", padding: "24px" }}>
        <Alert
          message="Ошибка"
          description="Ссылка приглашения недействительна. Пожалуйста, запросите новое приглашение."
          type="error"
          showIcon
        />
        <Button
          type="primary"
          onClick={() => navigate("/login")}
          style={{ marginTop: "16px" }}
        >
          Перейти на страницу входа
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "24px" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "24px" }}>
        Завершение регистрации
      </Title>

      <Form<FormValues>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Пожалуйста, введите email" },
            { type: "email", message: "Введите корректный email" },
          ]}
        >
          <Input
            disabled={!!initialEmail} // Блокируем если email был в URL
            placeholder="Введите ваш email"
          />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Пожалуйста, введите пароль" },
            { min: 6, message: "Пароль должен содержать минимум 6 символов" },
          ]}
        >
          <Input.Password placeholder="Введите пароль" />
        </Form.Item>

        <Form.Item
          label="Подтверждение пароля"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Пожалуйста, подтвердите пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Повторите пароль" />
        </Form.Item>

        <Form.Item
          label="Ф.И.О."
          name="full_name"
          rules={[
            { required: true, message: "Пожалуйста, введите Ф.И.О." },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите ваше полное имя" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={registerWithTokenMutation.isPending}
            size="large"
          >
            Завершить регистрацию
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
