"use client";

import type React from "react";
import { useEffect } from "react";
import { Modal, Form, Select, message } from "antd";
import { useIncludeRolesMutations } from "../../../hooks/includeRoles/useIncludeRolesMutations";
import { useRolesQuery } from "../../../hooks/role/useRoleQuery";
import type {
  IRoleIncludeRelation,
  IRoleIncludeRelationEdit,
} from "../../../api/includeRolesApi";

interface EditIncludeRoleModalProps {
  open: boolean;
  relation: IRoleIncludeRelation;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditIncludeRoleModal: React.FC<EditIncludeRoleModalProps> = ({
  open,
  relation,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { updateMutation } = useIncludeRolesMutations();

  // Получаем список всех ролей для выбора
  const { data: rolesData } = useRolesQuery();

  useEffect(() => {
    if (open && relation) {
      form.setFieldsValue({
        parent_role_id: relation.parent_role_id,
        child_role_id: relation.child_role_id,
      });
    }
  }, [open, relation, form]);

  const handleSubmit = async (values: IRoleIncludeRelationEdit) => {
    if (values.parent_role_id === values.child_role_id) {
      message.error("Роль не может включать саму себя");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: relation.role_include_relation_id,
        data: values,
      });
      onSuccess();
    } catch (error) {
      console.error("Error updating include role:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Редактировать включение роли"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={updateMutation.isPending}
      okText="Сохранить"
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
            // filterOption={(input, option) =>
            //   (option?.children as string)
            //     ?.toLowerCase()
            //     .includes(input.toLowerCase())
            // }
          >
            {rolesData?.roles?.map((role) => (
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
            // filterOption={(input, option) =>
            //   (option?.children as string)
            //     ?.toLowerCase()
            //     .includes(input.toLowerCase())
            // }
          >
            {rolesData?.roles?.map((role) => (
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
