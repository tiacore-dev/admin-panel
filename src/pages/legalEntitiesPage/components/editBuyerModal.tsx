// src/pages/legalEntityDetailsPage/components/EditBuyerModal.tsx
import React from "react";
import { Modal, Form, Input, InputNumber, Button } from "antd";
import { ILegalEntityEdit } from "../../../api/legalEntitiesApi";

interface EditBuyerModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: ILegalEntityEdit) => void;
  initialValues: ILegalEntityEdit;
  isLoading: boolean;
}

export const EditBuyerModal: React.FC<EditBuyerModalProps> = ({
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
      title="Редактировать контрагента"
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
        {/* <Form.Item name="full_name" label="Полное название">
          <Input />
        </Form.Item> */}
        {/* <Form.Item
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
        </Form.Item> */}
        {/* <Form.Item name="opf" label="ОПФ">
          <Input />
        </Form.Item> */}
        {/* <Form.Item name="vat_rate" label="Ставка НДС">
          <InputNumber min={0} max={20} />
        </Form.Item> */}
        <Form.Item
          name="address"
          label="Адрес"
          rules={[{ required: true, message: "Поле обязательно" }]}
        >
          <Input.TextArea />
        </Form.Item>
        {/* <Form.Item name="signer" label="Подписант">
          <Input />
        </Form.Item> */}
      </Form>
    </Modal>
  );
};
