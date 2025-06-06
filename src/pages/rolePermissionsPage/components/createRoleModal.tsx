// src/pages/rolePermissions/components/CreateRoleModal.tsx
import React from "react";
import { Modal, Form, Input, Checkbox } from "antd";
import { usePermissionsQuery } from "../../../hooks/permissions/usePermissionsQuery";
import { useRoleMutations } from "../../../hooks/role/useRoleMutations";

interface CreateRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { createMutation } = useRoleMutations("", "", onCancel);
  const { data: permission_data, isLoading: isLoadingPermissions } =
    usePermissionsQuery();

  const handleOk = () => {
    form.validateFields().then((values) => {
      createMutation.mutate(
        {
          role_name: values.role_name,
          permissions: values.permissions || [],
        },
        {
          onSuccess: () => {
            onSuccess();
            form.resetFields();
          },
        }
      );
    });
    // .catch((info) => {
    // console.log("Validate Failed:", info);
    // });
  };

  return (
    <Modal
      title="Создание новой роли"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={createMutation.isPending}
      okText="Создать"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="role_name"
          label="Название роли"
          rules={[
            { required: true, message: "Пожалуйста, введите название роли" },
          ]}
        >
          <Input placeholder="Введите название роли" />
        </Form.Item>

        <Form.Item name="permissions" label="Разрешения">
          <Checkbox.Group style={{ display: "flex", flexDirection: "column" }}>
            {isLoadingPermissions ? (
              <div>Загрузка разрешений...</div>
            ) : (
              permission_data?.permissions.map((permission) => (
                <Checkbox
                  key={permission.permission_id}
                  value={permission.permission_id}
                >
                  {permission.permission_name}
                </Checkbox>
              ))
            )}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};
