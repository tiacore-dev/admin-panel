// src/pages/legalEntityDetailsPage/components/EditSellerModal.tsx
import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { ILegalEntityEdit } from "../../../api/legalEntitiesApi";

const { Option } = Select;

interface EditSellerModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: ILegalEntityEdit) => void;
  initialValues: ILegalEntityEdit;
  isLoading: boolean;
}

// Варианты для селектора НДС
const vatRateOptions = [
  { value: 0, label: "НДС не облагается" },
  { value: 5, label: "5%" },
  { value: 7, label: "7%" },
  { value: 20, label: "20%" },
];

export const EditSellerModal: React.FC<EditSellerModalProps> = ({
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

  return (
    <Modal
      title="Редактировать организацию"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={() => form.submit()}
          loading={isLoading}
        >
          Сохранить
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
        initialValues={initialValues}
      >
        <Form.Item
          name="short_name"
          label="Короткое название"
          rules={[{ required: true, message: "Поле обязательно" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="full_name" label="Полное название">
          <Input />
        </Form.Item>
        <Form.Item
          name="inn"
          label="ИНН"
          rules={[{ required: true, message: "Поле обязательно" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="kpp" label="КПП">
          <Input />
        </Form.Item>
        <Form.Item
          name="ogrn"
          label="ОГРН"
          rules={[{ required: true, message: "Поле обязательно" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="opf" label="ОПФ">
          <Input />
        </Form.Item>
        <Form.Item name="vat_rate" label="Ставка НДС">
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
          rules={[{ required: true, message: "Поле обязательно" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="signer" label="Подписант">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
