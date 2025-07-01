"use client";

import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Card,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  EditOutlined,
  BankOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ILegalEntityEdit } from "../../../api/legalEntitiesApi";

const { Option } = Select;
const { Title, Text } = Typography;

interface EditLegalEntityModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: ILegalEntityEdit) => void;
  initialValues: ILegalEntityEdit;
  isLoading: boolean;
}

const vatRateOptions = [
  { value: 0, label: "НДС не облагается" },
  { value: 5, label: "5%" },
  { value: 7, label: "7%" },
  { value: 20, label: "20%" },
];

export const EditLegalEntityModal: React.FC<EditLegalEntityModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
  isLoading,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, form, initialValues]);

  const handleSubmit = (values: ILegalEntityEdit) => {
    const editableFields = {
      ...values,
      short_name: undefined,
      inn: undefined,
      kpp: undefined,
      ogrn: undefined,
    };
    onSave(editableFields);
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#f0f9ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EditOutlined style={{ fontSize: 20, color: "#0ea5e9" }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Редактировать организацию
            </Title>
            <Text type="secondary">
              Изменение информации о юридическом лице
            </Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="cancel" size="large" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="save"
          type="primary"
          size="large"
          onClick={() => form.submit()}
          loading={isLoading}
          icon={<EditOutlined />}
        >
          Сохранить изменения
        </Button>,
      ]}
    >
      <Divider />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
        size="large"
      >
        {/* Read-only Information */}
        <Card
          title={
            <Space>
              <FileTextOutlined />
              <span>Неизменяемые данные</span>
            </Space>
          }
          size="small"
          style={{ marginBottom: 16, background: "#fafafa" }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
          >
            <Form.Item name="short_name" label="Короткое название">
              <Input disabled prefix={<BankOutlined />} />
            </Form.Item>
            <Form.Item name="inn" label="ИНН">
              <Input disabled prefix={<FileTextOutlined />} />
            </Form.Item>
            <Form.Item name="kpp" label="КПП">
              <Input disabled prefix={<FileTextOutlined />} />
            </Form.Item>
            <Form.Item name="ogrn" label="ОГРН">
              <Input disabled prefix={<FileTextOutlined />} />
            </Form.Item>
          </div>
        </Card>

        {/* Editable Information */}
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Card
            title={
              <Space>
                <BankOutlined />
                <span>Основная информация</span>
              </Space>
            }
            size="small"
          >
            <Form.Item name="opf" label="Организационно-правовая форма">
              <Input placeholder="Введите ОПФ" prefix={<BankOutlined />} />
            </Form.Item>

            <Form.Item
              name="vat_rate"
              label="Ставка НДС"
              rules={[{ required: true, message: "Выберите ставку НДС" }]}
            >
              <Select placeholder="Выберите ставку НДС">
                {vatRateOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Card>

          <Card
            title={
              <Space>
                <EnvironmentOutlined />
                <span>Адресная информация</span>
              </Space>
            }
            size="small"
          >
            <Form.Item
              name="address"
              label="Адрес"
              rules={[
                { required: true, message: "Поле обязательно" },
                { min: 5, message: "Минимум 5 символов" },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Введите адрес"
                showCount
                maxLength={255}
              />
            </Form.Item>
          </Card>

          <Card
            title={
              <Space>
                <UserOutlined />
                <span>Контактная информация</span>
              </Space>
            }
            size="small"
          >
            <Form.Item name="signer" label="Подписант">
              <Input placeholder="ФИО подписанта" prefix={<UserOutlined />} />
            </Form.Item>
          </Card>
        </Space>
      </Form>
    </Modal>
  );
};
