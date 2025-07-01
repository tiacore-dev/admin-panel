"use client";

import { Modal, Form, Select, Button, Input, message, Space } from "antd";
import { useState } from "react";
import { useInviteMutation } from "../../hooks/auth/useAuthMutations";
import {
  MailOutlined,
  LinkOutlined,
  SaveOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

interface InviteFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  roles: Array<{ role_id: string; role_name: string }>;
  companyId: string;
}

export const InviteFormModal = ({
  visible,
  onCancel,
  onSuccess,
  roles,
  companyId,
}: InviteFormModalProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inviteMutation = useInviteMutation();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      await inviteMutation.mutateAsync(
        {
          email: values.email,
          company_id: companyId,
          role_id: values.role_id,
        },
        {
          onError: (error) => {
            if (error.message === "Access token is missing") {
              message.error(
                "Требуется авторизация. Пожалуйста, войдите снова."
              );
            } else {
              message.error("Ошибка при отправке приглашения");
            }
          },
        }
      );

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            margin: "-24px -24px 20px -24px",
            padding: "20px 24px",
            color: "white",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <LinkOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Пригласить пользователя
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      centered
      width={700}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          Отправить приглашение
        </span>
      }
      cancelText="Отмена"
      okButtonProps={{
        size: "large",
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "8px",
          height: "40px",
          fontWeight: "500",
        },
        disabled: isSubmitting,
      }}
      cancelButtonProps={{
        size: "large",
        style: {
          borderRadius: "8px",
          height: "40px",
          fontWeight: "500",
          borderColor: "#d1d5db",
          color: "#6b7280",
        },
      }}
      styles={{
        content: {
          borderRadius: "12px",
          overflow: "hidden",
        },
        footer: {
          borderTop: "1px solid #f3f4f6",
          marginTop: "20px",
        },
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите email пользователя",
            },
            { type: "email", message: "Введите корректный email" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Введите email пользователя"
          />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="Роль"
          rules={[{ required: true, message: "Пожалуйста, выберите роль" }]}
        >
          <Select
            placeholder="Выберите роль"
            suffixIcon={
              <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
            }
          >
            {roles.map((role) => (
              <Select.Option key={role.role_id} value={role.role_id}>
                <Space>
                  <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
                  {role.role_name}
                </Space>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
