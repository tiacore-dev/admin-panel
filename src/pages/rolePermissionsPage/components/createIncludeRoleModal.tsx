"use client";

import type React from "react";
import { Modal, Form, Select, message, Typography, Button } from "antd";
import { useIncludeRolesMutations } from "../../../hooks/includeRoles/useIncludeRolesMutations";
import { useRolesQuery } from "../../../hooks/role/useRoleQuery";
import type { IRoleIncludeRelationCreate } from "../../../api/includeRolesApi";
import { IRole } from "../../../api/roleApi";
import { SafetyOutlined, SaveOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface CreateIncludeRoleModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  parentRoleId: string;
}

export const CreateIncludeRoleModal: React.FC<CreateIncludeRoleModalProps> = ({
  open,
  onCancel,
  onSuccess,
  parentRoleId,
}) => {
  const [form] = Form.useForm();
  const { createMutation } = useIncludeRolesMutations();

  // Получаем список всех ролей для выбора
  const { data: rolesData } = useRolesQuery();

  const handleSubmit = async (values: IRoleIncludeRelationCreate) => {
    if (values.child_role_id === parentRoleId) {
      message.error("Роль не может включать саму себя");
      return;
    }

    try {
      await createMutation.mutateAsync({
        parent_role_id: parentRoleId,
        child_role_id: values.child_role_id,
      });
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Error creating include role:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
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
          <SafetyOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Добавление новой связи ролей
          </span>
        </div>
      }
      open={open}
      onCancel={handleCancel}
      centered
      width={700}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          Создать связь
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
        disabled: createMutation.isPending,
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
      onOk={() => form.submit()}
      confirmLoading={createMutation.isPending}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="parent_role_id"
          label="Основная роль"
          initialValue={parentRoleId}
        >
          <Select disabled size="large">
            {rolesData?.roles
              ?.filter((role) => role.role_id === parentRoleId)
              .map((role: IRole) => (
                <Select.Option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="child_role_id"
          label="Включаемая роль"
          rules={[{ required: true, message: "Выберите включаемую роль" }]}
        >
          <Select
            placeholder="Выберите включаемую роль"
            showSearch
            optionFilterProp="children"
            size="large"
          >
            {rolesData?.roles
              ?.filter((role) => role.role_id !== parentRoleId)
              .map((role: IRole) => (
                <Select.Option key={role.role_id} value={role.role_id}>
                  {role.role_name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
