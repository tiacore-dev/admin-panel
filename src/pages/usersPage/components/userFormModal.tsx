import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Checkbox, Select } from "antd";
import { useUserMutations } from "../../../hooks/users/useUserMutation";
import { IUser } from "../../../api/usersApi";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";
import { useAppsQuery } from "../../../hooks/base/useBaseQuery";

interface UserCreateModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit" | "registration";
  initialData?: IUser | null;
}

export const UserFormModal: React.FC<UserCreateModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSuperadmin = localStorage.getItem("is_superadmin") === "true";
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  // Получаем список компаний для выбора
  const { data: companiesData } = useCompaniesForSelection();
  const companies = companiesData?.companies || [];

  // Получаем список приложений для выбора
  const { data: appsData } = useAppsQuery();
  const apps = appsData?.applications || [];

  const { createMutation, updateMutation, registrationMutation } =
    useUserMutations(
      initialData?.user_id || "",
      initialData?.email || "",
      initialData?.full_name || "",
      initialData?.password || ""
    );

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mode === "edit") {
      setIsPasswordChanged(!!e.target.value);
    }
  };

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          email: initialData.email,
          full_name: initialData.full_name,
          password: initialData.password,
          company_id: initialData.company_id,
          is_verified: initialData.is_verified || false,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, mode, form]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      const dataToSend = {
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        position: values.position,
        company_id: values.company_id,
        application_id: values.application_id,
        ...(mode === "edit" &&
          isSuperadmin && {
            is_verified: values.is_verified || false,
          }),
      };

      if (mode === "create") {
        await createMutation.mutateAsync(dataToSend);
      } else if (mode === "edit" && initialData?.user_id) {
        await updateMutation.mutateAsync(dataToSend);
      } else if (mode === "registration") {
        await registrationMutation.mutateAsync(dataToSend);
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      // Ошибки обрабатываются в хуке useUserMutations
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case "create":
        return "Добавить пользователя";
      case "edit":
        return "Редактировать пользователя";
      case "registration":
        return "Регистрация нового пользователя";
      default:
        return "Добавить пользователя";
    }
  };

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          {mode === "registration"
            ? "Зарегистрироваться"
            : mode === "create"
            ? "Создать"
            : "Сохранить"}
        </Button>,
      ]}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Email пользователя"
          name="email"
          rules={[
            {
              required: mode !== "edit",
              message: "Пожалуйста, введите email пользователя",
            },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (
                  value === "admin" ||
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Введите корректный email адрес или "admin"')
                );
              },
            },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите email пользователя или 'admin'" />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            {
              required: mode !== "edit",
              message: "Пожалуйста, введите пароль",
            },
            { min: 6, message: "Минимум 6 символов" },
          ]}
        >
          <Input.Password
            placeholder={
              mode === "edit"
                ? "Оставьте пустым, чтобы не изменять"
                : "Введите пароль"
            }
            onChange={handlePasswordChange}
          />
        </Form.Item>

        <Form.Item
          label="Подтверждение пароля"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: mode !== "edit" || isPasswordChanged,
              message: "Пожалуйста, подтвердите пароль",
            },
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
            {
              required: mode !== "edit",
              message: "Пожалуйста, введите Ф.И.О.",
            },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите Ф.И.О." />
        </Form.Item>

        {/* <Form.Item
          label="Должность"
          name="position"
          rules={[
            {
              required: mode !== "edit",
              message: "Пожалуйста, введите должность",
            },
          ]}
        >
          <Input placeholder="Введите должность" />
        </Form.Item> */}

        {isSuperadmin && mode === "create" && (
          <>
            <Form.Item
              label="Компания"
              name="company_id"
              rules={[
                { required: true, message: "Пожалуйста, выберите компанию" },
              ]}
            >
              <Select placeholder="Выберите компанию">
                {companies.map((company) => (
                  <Select.Option
                    key={company.company_id}
                    value={company.company_id}
                  >
                    {company.company_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Приложение"
              name="application_id"
              rules={[
                { required: true, message: "Пожалуйста, выберите приложение" },
              ]}
            >
              <Select placeholder="Выберите приложение">
                {apps.map((app) => (
                  <Select.Option
                    key={app.application_id}
                    value={app.application_id}
                  >
                    {app.application_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}

        {isSuperadmin && mode === "edit" && (
          <Form.Item name="is_verified" valuePropName="checked">
            <Checkbox>Верифицировать пользователя</Checkbox>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};
