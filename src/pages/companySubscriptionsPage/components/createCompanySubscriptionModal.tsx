"use client";

import React, { useState, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Spin,
  Button,
  Typography,
  DatePicker,
} from "antd";
import {
  SaveOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useCompanySubscriptionsMutations } from "../../../hooks/companySubscriptions/useCompanySubscriptionsMutations";
import { useCompanyQuery } from "../../../hooks/companies/useCompanyQuery";
import { useSubscriptionsQuery } from "../../../hooks/subscriptions/useSubscriptionsQuery";
import { useUserQueryAll } from "../../../hooks/users/useUserQuery";

const { Text } = Typography;

interface CreateCompanySubscriptionModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateCompanySubscriptionModal: React.FC<
  CreateCompanySubscriptionModalProps
> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { createMutation } = useCompanySubscriptionsMutations();
  const { data: companiesData, isLoading: isLoadingCompanies } =
    useCompanyQuery();
  const { data: subscriptionsData, isLoading: isLoadingSubscriptions } =
    useSubscriptionsQuery();
  const { data: usersData, isLoading: isLoadingUsers } = useUserQueryAll();

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values) => {
      createMutation.mutate(
        {
          company_id: values.company_id,
          subscription_id: values.subscription_id,
          user_id: values.user_id,
        },
        {
          onSuccess: () => {
            onSuccess();
            form.resetFields();
          },
        }
      );
    });
  }, [form, createMutation, onSuccess]);

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
          <AppstoreOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Добавление подписки компании
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      centered
      width={700}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          Создать
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
          name="company_id"
          label="Компания"
          rules={[{ required: true, message: "Пожалуйста, выберите компанию" }]}
          style={{ marginBottom: 16 }}
        >
          <Select
            placeholder="Выберите компанию"
            loading={isLoadingCompanies}
            size="large"
            showSearch
            optionFilterProp="children"
          >
            {companiesData?.companies.map((company) => (
              <Select.Option
                key={company.company_id}
                value={company.company_id}
              >
                {company.company_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="subscription_id"
          label="Подписка"
          rules={[{ required: true, message: "Пожалуйста, выберите подписку" }]}
          style={{ marginBottom: 16 }}
        >
          <Select
            placeholder="Выберите подписку"
            loading={isLoadingSubscriptions}
            size="large"
            showSearch
            optionFilterProp="children"
          >
            {subscriptionsData?.subscriptions.map((subscription) => (
              <Select.Option
                key={subscription.subscription_id}
                value={subscription.subscription_id}
              >
                {subscription.subscription_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="user_id"
          label="Пользователь"
          rules={[
            { required: true, message: "Пожалуйста, выберите пользователя" },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Select
            placeholder="Выберите пользователя"
            loading={isLoadingUsers}
            size="large"
            showSearch
            optionFilterProp="children"
            suffixIcon={<UserOutlined />}
          >
            {usersData?.users.map((user) => (
              <Select.Option key={user.user_id} value={user.user_id}>
                {user.full_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
