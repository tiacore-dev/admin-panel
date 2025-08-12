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
import type {
  ISubscriptionDetail,
  IUpdateSubscriptionDetailRequest,
} from "../../../api/subscriptionDetailsApi";

const { Text } = Typography;

interface EditSubscriptionDetailModalProps {
  detail: ISubscriptionDetail;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditSubscriptionDetailModal: React.FC<
  EditSubscriptionDetailModalProps
> = ({ detail, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { updateMutation } = useSubscriptionDetailsMutations(
    detail.subscription_detail_id
  );

  const handleSubmit = async (values: IUpdateSubscriptionDetailRequest) => {
    try {
      await updateMutation.mutateAsync(values);
      onSuccess();
    } catch (error) {
      console.error("Error updating subscription detail:", error);
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
          <SaveOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Редактирование детали подписки
          </span>
        </div>
      }
      open={true}
      onCancel={onCancel}
      centered
      width={700}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          Сохранить изменения
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
        disabled: updateMutation.isPending,
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
      confirmLoading={updateMutation.isPending}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          entity_name: detail.entity_name,
          bd_table: detail.bd_table,
          restriction: detail.restriction,
          description: detail.description,
          comment: detail.comment,
        }}
      >
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
