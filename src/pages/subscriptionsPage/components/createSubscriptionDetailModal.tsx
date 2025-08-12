"use client";

import type React from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Typography,
  Button,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useSubscriptionDetailsMutations } from "../../../hooks/subscriptionDetails/useSubscriptionDetailsMutations";
import type { ICreateSubscriptionDetailRequest } from "../../../api/subscriptionDetailsApi";

const { Text } = Typography;

interface CreateSubscriptionDetailModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  subscriptionId: string;
}

export const CreateSubscriptionDetailModal: React.FC<
  CreateSubscriptionDetailModalProps
> = ({ open, onCancel, onSuccess, subscriptionId }) => {
  const [form] = Form.useForm();
  const { createMutation } = useSubscriptionDetailsMutations();

  const handleSubmit = async (values: ICreateSubscriptionDetailRequest) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        subscription_id: subscriptionId,
      });
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Error creating subscription detail:", error);
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
          <SaveOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Добавление новой детали подписки
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
          Создать деталь
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
          name="entity_name"
          label="Название сущности"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите название сущности",
            },
          ]}
        >
          <Input placeholder="Введите название сущности" size="large" />
        </Form.Item>

        <Form.Item
          name="bd_table"
          label="Таблица БД"
          rules={[
            { required: true, message: "Пожалуйста, введите название таблицы" },
          ]}
        >
          <Input placeholder="Введите название таблицы БД" size="large" />
        </Form.Item>

        <Form.Item
          name="restriction"
          label="Ограничение"
          rules={[
            { required: true, message: "Пожалуйста, укажите ограничение" },
            {
              type: "number",
              min: 0,
              message: "Ограничение не может быть отрицательным",
            },
          ]}
        >
          <InputNumber
            placeholder="Введите ограничение"
            size="large"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }
            parser={(value) => value!.replace(/\$\s?|( *)/g, "")}
          />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <Input placeholder="Введите описание (необязательно)" size="large" />
        </Form.Item>

        <Form.Item name="comment" label="Комментарий">
          <Input.TextArea
            placeholder="Введите комментарий (необязательно)"
            size="large"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
