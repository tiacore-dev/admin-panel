import type React from "react";
import { Modal, Form, Select, message } from "antd";
import { useIncludeRolesMutations } from "../../../hooks/includeRoles/useIncludeRolesMutations";
import { useRolesQuery } from "../../../hooks/role/useRoleQuery";
import type { IRoleIncludeRelationCreate } from "../../../api/includeRolesApi";
import { IRole } from "../../../api/roleApi";

interface CreateIncludeRoleModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateIncludeRoleModal: React.FC<CreateIncludeRoleModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { createMutation } = useIncludeRolesMutations();

  // Получаем список всех ролей для выбора
  const { data: rolesData } = useRolesQuery();

  const handleSubmit = async (values: IRoleIncludeRelationCreate) => {
    if (values.parent_role_id === values.child_role_id) {
      message.error("Роль не может включать саму себя");
      return;
    }

    try {
      await createMutation.mutateAsync(values);
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
      title="Добавить включение роли"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={createMutation.isPending}
      okText="Создать"
      cancelText="Отмена"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="parent_role_id"
          label="Основная роль"
          rules={[{ required: true, message: "Выберите основную роль" }]}
        >
          <Select
            placeholder="Выберите основную роль"
            showSearch
            optionFilterProp="children"
            // filterOption={(input, option) => (option?.children as string)?.toLowerCase().includes(input.toLowerCase())}
          >
            {rolesData?.roles?.map((role: IRole) => (
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
            // filterOption={(input, option) => (option?.children as string)?.toLowerCase().includes(input.toLowerCase())}
          >
            {rolesData?.roles?.map((role: IRole) => (
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
