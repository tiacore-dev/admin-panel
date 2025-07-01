"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Button,
  Form,
  Select,
  Card,
  Typography,
  Space,
} from "antd";
import type { ICompany } from "../../../api/companiesApi";
import { useCompanyMutations } from "../../../hooks/companies/useCompanyMutation";
import { useAppsQuery } from "../../../hooks/base/useBaseQuery";
import {
  BuildOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  BankOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
  const { data: appsData } = useAppsQuery();

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
          application_id: initialData.application_id,
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
          <BankOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            {mode === "create"
              ? "Создание новой компании"
              : "Редактирование компании"}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      centered
      width={700}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          {mode === "create" ? "Создать компанию" : "Сохранить изменения"}
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
      footer={[
        <Button
          key="cancel"
          size="large"
          onClick={onCancel}
          style={{
            borderRadius: "8px",
            height: "40px",
            fontWeight: "500",
            borderColor: "#d1d5db",
            color: "#6b7280",
          }}
        >
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
          size="large"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "8px",
            height: "40px",
            fontWeight: "500",
          }}
          icon={<SaveOutlined />}
        >
          {mode === "create" ? "Создать компанию" : "Сохранить изменения"}
        </Button>,
      ]}
    >
      <div style={{ marginTop: 24 }}>
        <Form form={form} layout="vertical" size="large">
          <Form.Item
            label="Название компании"
            name="company_name"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите название компании",
              },
              { min: 3, message: "Минимум 3 символа" },
              { max: 100, message: "Максимум 100 символов" },
            ]}
          >
            <Input
              placeholder="Введите название компании"
              prefix={<BuildOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>

          <Form.Item
            label="Описание"
            name="description"
            rules={[
              { min: 3, message: "Минимум 3 символа" },
              { max: 500, message: "Максимум 500 символов" },
            ]}
          >
            <Input.TextArea
              placeholder="Введите описание компании (необязательно)"
              rows={3}
              showCount
              maxLength={500}
              // prefix={<InfoCircleOutlined style={{ color: "#bfbfbf" }} />}
            />
          </Form.Item>
          <Form.Item
            label="Приложение"
            name="application_id"
            rules={[
              { required: true, message: "Пожалуйста, выберите приложение" },
            ]}
          >
            <Select
              placeholder="Выберите приложение"
              loading={!appsData}
              suffixIcon={<AppstoreOutlined />}
              options={appsData?.applications.map((app) => ({
                value: app.application_id,
                label: (
                  <Space>
                    <AppstoreOutlined />
                    {app.application_name}
                  </Space>
                ),
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label as any)?.props?.children?.[1]
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase()) ?? false
              }
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
