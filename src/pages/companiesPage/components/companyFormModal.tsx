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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BuildOutlined style={{ color: "#1890ff" }} />
          <span>
            {mode === "create"
              ? "Создание новой компании"
              : "Редактирование компании"}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} size="large">
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
          size="large"
        >
          {mode === "create" ? "Создать компанию" : "Сохранить изменения"}
        </Button>,
      ]}
      width={700}
      destroyOnClose
    >
      <div style={{ marginTop: 24 }}>
        {/* Информационный блок */}
        <Card
          size="small"
          style={{
            marginBottom: 24,
            backgroundColor: "#f6ffed",
            border: "1px solid #b7eb8f",
          }}
        >
          <Space>
            <InfoCircleOutlined style={{ color: "#52c41a" }} />
            <Text style={{ color: "#389e0d" }}>
              {mode === "create"
                ? "Создайте новую компанию для организации пользователей и управления доступом"
                : "Обновите информацию о компании"}
            </Text>
          </Space>
        </Card>

        <Form form={form} layout="vertical" size="large">
          {/* Основная информация */}
          <Card
            title={
              <Space>
                <BuildOutlined />
                <span>Основная информация</span>
              </Space>
            }
            size="small"
            style={{ marginBottom: 16 }}
          >
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
              />
            </Form.Item>
          </Card>

          {/* Настройки приложения */}
          <Card
            title={
              <Space>
                <AppstoreOutlined />
                <span>Настройки приложения</span>
              </Space>
            }
            size="small"
          >
            <Form.Item
              label="Приложение"
              name="application_id"
              rules={[
                { required: true, message: "Пожалуйста, выберите приложение" },
              ]}
              extra="Выберите приложение, к которому будет привязана компания"
            >
              <Select
                placeholder="Выберите приложение"
                loading={!appsData}
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
          </Card>
        </Form>
      </div>
    </Modal>
  );
};
