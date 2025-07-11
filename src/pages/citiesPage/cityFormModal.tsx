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
import type { ICity } from "../../api/citiesApi";
import { useCityMutations } from "../../hooks/cities/useCityMutation";
import {
  BuildOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface CityFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: ICity | null;
}

export const CityFormModal: React.FC<CityFormModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData = null,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timezoneOptions = Array.from({ length: 25 }, (_, i) => i - 12).map(
    (tz) => ({
      value: tz,
      label: tz >= 0 ? `UTC+${tz}` : `UTC${tz}`,
    })
  );

  const { createMutation, updateMutation } = useCityMutations(
    initialData?.city_id || "",
    initialData?.city_name || "",
    initialData?.region || "",
    initialData?.code || "",
    initialData?.external_id || "",
    initialData?.timezone || 0
  );

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          city_id: initialData.city_id,
          city_name: initialData.city_name,
          region: initialData.region,
          code: initialData.code,
          external_id: initialData.external_id,
          timezone: initialData.timezone,
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
      } else if (mode === "edit" && initialData?.city_id) {
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
          <EnvironmentOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            {mode === "create"
              ? "Добавление нового города"
              : "Редактирование города"}
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
          {mode === "create" ? "Добавить" : "Сохранить изменения"}
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
          {mode === "create" ? "Добавить город" : "Сохранить изменения"}
        </Button>,
      ]}
    >
      <div style={{ marginTop: 24 }}>
        <Form form={form} layout="vertical" size="large">
          <Form.Item
            label="Название города"
            name="city_name"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите название города",
              },
              { min: 3, message: "Минимум 3 символа" },
              { max: 100, message: "Максимум 100 символов" },
            ]}
          >
            <Input placeholder="Введите название города" />
          </Form.Item>

          <Form.Item
            label="Регион"
            name="region"
            rules={[
              { min: 3, message: "Минимум 3 символа" },
              {
                required: true,
                message: "Пожалуйста, введите название региона",
              },
            ]}
          >
            <Input placeholder="Введите регион" />
          </Form.Item>
          <Form.Item
            label="Часовой пояс"
            name="timezone"
            rules={[
              {
                required: true,
                message: "Пожалуйста, выберите часовой пояс",
              },
            ]}
          >
            <Select
              placeholder="Выберите часовой пояс"
              options={timezoneOptions}
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item
            label="Индекс"
            name="code"
            rules={[
              { min: 3, message: "Минимум 3 символа" },
              {
                required: true,
                message: "Пожалуйста, введите индекс",
              },
            ]}
          >
            <Input
              placeholder="Введите индекс"
              type="number"
              onKeyPress={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "-" ||
                  e.key === "+" ||
                  e.key === "."
                ) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="external_id"
            name="external_id"
            rules={[
              { min: 3, message: "Минимум 3 символа" },
              {
                required: true,
                message: "Пожалуйста, введите external_id",
              },
            ]}
          >
            <Input placeholder="Введите external_id" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
