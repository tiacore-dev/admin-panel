// src/pages/subscriptionPayments/components/createSubscriptionPaymentModal.tsx
"use client";

import React, { useState, useCallback } from "react";
import { Modal, Form, Input, DatePicker, Button, Typography } from "antd";
import { SaveOutlined, DollarOutlined } from "@ant-design/icons";
import { useSubscriptionPaymentsMutations } from "../../../hooks/subscriptionPayments/useSubscriptionPaymentsMutations";
import dayjs from "dayjs";

const { Text } = Typography;

interface CreateSubscriptionPaymentModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  companySubscriptionId: string;
}

export const CreateSubscriptionPaymentModal: React.FC<
  CreateSubscriptionPaymentModalProps
> = ({ open, onCancel, onSuccess, companySubscriptionId }) => {
  const [form] = Form.useForm();
  const { createMutation } = useSubscriptionPaymentsMutations();

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values) => {
      createMutation.mutate(
        {
          company_subscription_id: companySubscriptionId,
          payment_amount: Number(values.payment_amount),
          payment_date: values.payment_date.format("YYYY-MM-DD"),
          date_from: values.period[0].format("YYYY-MM-DD"),
          date_to: values.period[1].format("YYYY-MM-DD"),
        },
        {
          onSuccess: () => {
            onSuccess();
            form.resetFields();
          },
        }
      );
    });
  }, [form, createMutation, onSuccess, companySubscriptionId]);

  const handleCancel = useCallback(() => {
    onCancel();
    form.resetFields();
  }, [onCancel, form]);

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
          <DollarOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Добавление платежа подписки
          </span>
        </div>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      centered
      width={700}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          Создать платеж
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
      confirmLoading={createMutation.isPending}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="payment_amount"
          label="Сумма платежа"
          rules={[
            { required: true, message: "Пожалуйста, укажите сумму платежа" },
            {
              type: "number",
              min: 0.01,
              message: "Сумма должна быть больше нуля",
              transform: (value) => Number(value),
            },
          ]}
          style={{ marginBottom: 16 }}
        >
          <Input
            placeholder="Введите сумму платежа"
            size="large"
            type="number"
            step="0.01"
          />
        </Form.Item>

        <Form.Item
          name="payment_date"
          label="Дата платежа"
          rules={[
            { required: true, message: "Пожалуйста, укажите дату платежа" },
          ]}
          style={{ marginBottom: 16 }}
        >
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="DD.MM.YYYY"
          />
        </Form.Item>

        <Form.Item
          name="period"
          label="Период действия"
          rules={[
            { required: true, message: "Пожалуйста, укажите период действия" },
          ]}
        >
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            size="large"
            format="DD.MM.YYYY"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
