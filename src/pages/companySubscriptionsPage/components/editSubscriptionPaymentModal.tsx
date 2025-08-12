// src/pages/subscriptionPayments/components/editSubscriptionPaymentModal.tsx
"use client";

import React, { useCallback } from "react";
import { Modal, Form, Input, DatePicker, Button, Typography } from "antd";
import { SaveOutlined, DollarOutlined } from "@ant-design/icons";
import { useSubscriptionPaymentsMutations } from "../../../hooks/subscriptionPayments/useSubscriptionPaymentsMutations";
import type { ISubscriptionPayment } from "../../../api/subscriptionPaymentsApi";
import dayjs from "dayjs";

const { Text } = Typography;

interface EditSubscriptionPaymentModalProps {
  payment: ISubscriptionPayment;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditSubscriptionPaymentModal: React.FC<
  EditSubscriptionPaymentModalProps
> = ({ payment, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { updateMutation } = useSubscriptionPaymentsMutations(
    payment.subscription_payment_id
  );

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values) => {
      updateMutation.mutate(
        {
          subscription_payment_id: payment.subscription_payment_id,
          payment_amount: Number(values.payment_amount),
          payment_date: values.payment_date.format("YYYY-MM-DD"),
          date_from: values.period[0].format("YYYY-MM-DD"),
          date_to: values.period[1].format("YYYY-MM-DD"),
        },
        {
          onSuccess: () => {
            onSuccess();
          },
          onError: (error) => {
            console.error("Error updating subscription payment:", error);
          },
        }
      );
    });
  }, [form, updateMutation, onSuccess, payment.subscription_payment_id]);

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
            Редактирование платежа подписки
          </span>
        </div>
      }
      open={true}
      onOk={handleSubmit}
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
      confirmLoading={updateMutation.isPending}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          payment_amount: payment.payment_amount,
          payment_date: dayjs(payment.payment_date),
          period: [dayjs(payment.date_from), dayjs(payment.date_to)],
        }}
      >
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
