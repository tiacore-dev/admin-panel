import { Modal, Form, Select, Button, message } from "antd";
import { useUserCompanyRelationsMutations } from "../../hooks/userCompanyRelations/useUserCompanyRelationsMutations";
import { IUserCompanyRelation } from "../../api/userCompanyRelationsApi";
import { useEffect, useState } from "react";
import { IUser } from "../../api/usersApi";
import { fetchUserCompanyRelations } from "../../api/userCompanyRelationsApi";

interface RelationFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IUserCompanyRelation | null;
  roles: Array<{ role_id: string; role_name: string }>;
  userId?: string;
  companyId?: string;
  companies?: Array<{ company_id: string; company_name: string }>;
  users?: IUser[];
}

export const RelationFormModal = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData,
  roles,
  userId,
  companyId,
  companies = [],
  users = [],
}: RelationFormModalProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useUserCompanyRelationsMutations(
    initialData?.user_company_id || "",
    initialData?.user_id || "",
    initialData?.company_id || "",
    initialData?.role_id || "",
    () => {}
  );

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        user_id: initialData.user_id,
        company_id: initialData.company_id,
        role_id: initialData.role_id,
      });
    } else {
      form.resetFields();
      if (userId) {
        form.setFieldsValue({ user_id: userId });
      }
      if (companyId) {
        form.setFieldsValue({ company_id: companyId });
      }
    }
  }, [initialData, mode, form, userId, companyId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      const user_id = userId || values.user_id;
      const company_id = companyId || values.company_id;

      if (mode === "create") {
        const existingRelations = await fetchUserCompanyRelations({
          user_id,
          company_id,
        });

        // if (existingRelations.total === 0) {
        //   message.error(
        //     userId
        //       ? "Этот пользователь уже привязан к выбранной компании"
        //       : "Эта компания уже привязана к выбранному пользователю"
        //   );
        //   return;
        // }

        await createMutation.mutateAsync({
          user_id,
          role_id: values.role_id,
          company_id,
        });
      } else if (mode === "edit" && initialData?.user_company_id) {
        await updateMutation.mutateAsync({
          role_id: values.role_id,
          user_company_id: initialData.user_company_id,
        });
      }

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
      title={initialData ? "Редактировать" : "Добавить"}
      open={visible}
      onOk={handleSubmit}
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
          {mode === "create" ? "Добавить" : "Сохранить"}
        </Button>,
      ]}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          role_id: initialData?.role_id,
        }}
      >
        {mode === "create" && !userId && (
          <Form.Item
            name="user_id"
            label="Пользователь"
            rules={[
              {
                required: !companyId,
                message: "Пожалуйста, выберите пользователя",
              },
            ]}
          >
            <Select placeholder="Выберите пользователя">
              {users.map((user) => (
                <Select.Option key={user.user_id} value={user.user_id}>
                  {user.full_name
                    ? `${user.full_name}${user.email ? ` (${user.email})` : ""}`
                    : user.email || user.user_id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {mode === "create" && !companyId && (
          <Form.Item
            name="company_id"
            label="Компания"
            rules={[
              { required: !userId, message: "Пожалуйста, выберите компанию" },
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
        )}

        <Form.Item
          name="role_id"
          label="Роль"
          rules={[{ required: true, message: "Пожалуйста, выберите роль" }]}
        >
          <Select placeholder="Выберите роль">
            {roles.map((role) => (
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
