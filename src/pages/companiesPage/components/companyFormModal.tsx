import React, { useEffect, useState } from "react";
import { Modal, Input, Button, Form } from "antd"; // Импортируем Form и Select
import { ICompany } from "../../../api/companiesApi";
import { useCompanyMutations } from "../../../hooks/companies/useCompanyMutation";

interface CompanyFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: ICompany | null;
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createMutation, updateMutation } = useCompanyMutations(
    initialData?.company_id || "",
    initialData?.company_name || "",
    initialData?.description || ""
  );

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          company_name: initialData.company_name,
          description: initialData.description,
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

      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (mode === "edit" && initialData?.company_id) {
        await updateMutation.mutateAsync(values);
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      // console.error("Validation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={mode === "create" ? "Добавить компаню" : "Редактировать компаню"}
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
          {mode === "create" ? "Создать" : "Сохранить"}
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Название компании"
          name="company_name"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите название компании",
            },
            { min: 3, message: "Минимум 3 символа" },
          ]}
        >
          <Input placeholder="Введите название компании" />
        </Form.Item>
        <Form.Item
          label="Описание"
          name="description"
          rules={[{ min: 3, message: "Минимум 3 символа" }]}
        >
          <Input placeholder="Введите описание (необязательно)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
