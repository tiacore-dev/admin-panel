import { Form, Input, Select } from "antd";
// import { ILegalEntityType } from "../../../api/baseApi";

interface RenderFieldsProps {
  mode: "create" | "edit";
  isExistingEntity: boolean;
  relationType: string;
  // legalEntityTypes: ILegalEntityType[];
  defaultRelationType?: "buyer" | "seller";
}

export const renderBasicFields = ({
  mode,
  defaultRelationType,
}: Partial<RenderFieldsProps>) => (
  <>
    {mode === "create" && defaultRelationType && (
      <Form.Item
        name="relation_type"
        label="Тип контрагента"
        initialValue={defaultRelationType}
        hidden
      >
        <Select
          placeholder="Выберите тип"
          options={[
            { value: "seller", label: "Исполнитель" },
            { value: "buyer", label: "Заказчик" },
          ]}
          disabled
        />
      </Form.Item>
    )}
    <Form.Item
      name="inn"
      label="ИНН"
      rules={[
        { required: true, message: "Пожалуйста, введите ИНН" },
        { min: 10, message: "Минимум 10 символов" },
        { max: 12, message: "Максимум 12 символов" },
        { pattern: /^\d+$/, message: "Поле должно содержать только цифры" },
      ]}
    >
      <Input placeholder="Введите ИНН" />
    </Form.Item>
    <Form.Item
      name="kpp"
      label="КПП"
      rules={[
        { min: 9, message: "Минимум 9 символов" },
        { max: 9, message: "Максимум 9 символов" },
        { pattern: /^\d+$/, message: "Поле должно содержать только цифры" },
      ]}
    >
      <Input placeholder="Введите КПП (если есть)" />
    </Form.Item>
  </>
);

export const renderAdditionalFields = ({
  mode,
  isExistingEntity,
  relationType,
}: // legalEntityTypes,
RenderFieldsProps) => {
  const isBuyer = relationType === "buyer";

  return (
    <>
      {mode === "create" && (
        <>
          <Form.Item name="relation_type" label="Тип контрагента" hidden>
            <Select
              placeholder="Выберите тип"
              options={[
                { value: "seller", label: "Исполнитель" },
                { value: "buyer", label: "Заказчик" },
              ]}
              disabled
            />
          </Form.Item>
          <Form.Item name="inn" label="ИНН">
            <Input placeholder="Введите ИНН" disabled />
          </Form.Item>
          <Form.Item name="kpp" label="КПП">
            <Input placeholder="Введите КПП (если есть)" disabled />
          </Form.Item>
        </>
      )}
      <Form.Item
        name="legal_entity_name"
        label="Название"
        rules={[
          { required: true, message: "Пожалуйста, введите название" },
          { min: 3, message: "Минимум 3 символа" },
        ]}
      >
        <Input placeholder="Введите название" disabled={isExistingEntity} />
      </Form.Item>

      {!isBuyer && (
        <Form.Item
          name="vat_rate"
          label="Ставка НДС"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите ставку НДС",
            },
          ]}
        >
          <Select
            placeholder="Выберите ставку НДС"
            disabled={isExistingEntity}
            options={[
              { value: 0, label: "НДС не облагается" },
              { value: 5, label: "5%" },
              { value: 7, label: "7%" },
              { value: 20, label: "20%" },
            ]}
          />
        </Form.Item>
      )}

      <Form.Item
        name="address"
        label="Адрес"
        rules={[
          { required: true, message: "Пожалуйста, введите адрес" },
          { min: 5, message: "Минимум 5 символов" },
          {
            required: false,
          },
        ]}
      >
        <Input placeholder="Введите адрес" disabled={isExistingEntity} />
      </Form.Item>

      {/* {!isBuyer && (
        <Form.Item name="entity_type" label="Тип">
          <Select
            placeholder="Выберите тип"
            options={legalEntityTypes.map((type) => ({
              value: type.legal_entity_type_id,
              label: type.entity_name,
            }))}
            disabled={isExistingEntity}
          />
        </Form.Item>
      )} */}

      {!isBuyer && (
        <Form.Item
          name="signer"
          label="Подписант"
          rules={[
            {
              required: false,
              min: 3,
              message: "Минимум 3 символа",
            },
          ]}
        >
          <Input disabled={isExistingEntity} />
        </Form.Item>
      )}
    </>
  );
};
