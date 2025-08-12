"use client";

import type React from "react";
import { useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Typography,
} from "antd";
import { AppstoreOutlined, SaveOutlined } from "@ant-design/icons";
import { useSubscriptionsMutations } from "../../../hooks/subscriptions/useSubscriptionsMutations";
import { useAppsQuery } from "../../../hooks/base/useBaseQuery";
import type { ISubscription } from "../../../api/subscriptionsApi";

const { Text } = Typography;

interface EditSubscriptionModalProps {
  subscription: ISubscription;
  onCancel: () => void;
  onSuccess: () => void;
}

export const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({
  subscription,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { updateMutation } = useSubscriptionsMutations(
    subscription.subscription_id
  );
  const { data: appsData, isLoading: isLoadingApps } = useAppsQuery();

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values) => {
      updateMutation.mutate(
        {
          subscription_name: values.subscription_name,
          description: values.description,
          price: values.price,
          application_id: values.application_id,
        },
        {
          onSuccess: () => {
            onSuccess();
          },
        }
      );
    });
  }, [form, updateMutation, onSuccess]);

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
          <AppstoreOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Редактирование подписки
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
          subscription_name: subscription.subscription_name,
          description: subscription.description,
          price: subscription.price,
          application_id: subscription.application_id,
        }}
      >
        <Form.Item
          name="subscription_name"
          label="Название подписки"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите название подписки",
            },
          ]}
          style={{ marginBottom: 16 }}
        >
          <Input placeholder="Введите название подписки" size="large" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Описание"
          style={{ marginBottom: 16 }}
        >
          <Input.TextArea
            placeholder="Введите описание подписки"
            size="large"
            rows={3}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label="Цена"
          rules={[
            { required: true, message: "Пожалуйста, укажите цену подписки" },
            {
              type: "number",
              min: 0,
              message: "Цена не может быть отрицательной",
            },
          ]}
          style={{ marginBottom: 16 }}
        >
          <InputNumber
            placeholder="Введите цену подписки"
            size="large"
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }
            parser={(value) => value!.replace(/\$\s?|( *)/g, "")}
          />
        </Form.Item>

        <Form.Item
          name="application_id"
          label="Приложение"
          rules={[
            { required: true, message: "Пожалуйста, выберите приложение" },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Select
            placeholder="Выберите приложение"
            loading={isLoadingApps}
            size="large"
            showSearch
            optionFilterProp="children"
            suffixIcon={<AppstoreOutlined />}
          >
            {appsData?.applications.map((app) => (
              <Select.Option
                key={app.application_id}
                value={app.application_id}
              >
                {app.application_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
