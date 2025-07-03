"use client";

import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  EditOutlined,
  BankOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ILegalEntityEdit } from "../../../api/legalEntitiesApi";

const { Title } = Typography;
const { Option } = Select;
const { Text } = Typography;

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
          <EditOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Редактировать организацию
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      centered
      width={700}
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
          key="save"
          type="primary"
          size="large"
          onClick={() => form.submit()}
          loading={isLoading}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "none",
            borderRadius: "8px",
            height: "40px",
            fontWeight: "500",
          }}
          icon={<EditOutlined />}
        >
          Сохранить изменения
        </Button>,
      ]}
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
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        {/* <div
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

        <Divider /> */}

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

        <Form.Item name="signer" label="Подписант">
          <Input placeholder="ФИО подписанта" prefix={<UserOutlined />} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
