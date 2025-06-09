// src/pages/legalEntitiesSellersPage/components/createSellerModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Steps, Form, Input, Select, Button, message, Spin } from "antd";
import { useLegalEntityByInnKppQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useLegalEntityDetailsQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useCreateLegalEntityByINN } from "../../../hooks/legalEntities/useLegalEntityMutation";
import { useCreateLegalEntity } from "../../../hooks/legalEntities/useLegalEntityMutation";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";

const { Step } = Steps;
const { Option } = Select;

interface CreateSellerModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

// Варианты для селектора НДС
const vatRateOptions = [
  { value: 0, label: "НДС не облагается" },
  { value: 5, label: "5%" },
  { value: 7, label: "7%" },
  { value: 20, label: "20%" },
];

export const CreateSellerModal: React.FC<CreateSellerModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [inn, setInn] = useState("");
  const [kpp, setKpp] = useState("");
  const [legalEntityId, setLegalEntityId] = useState("");
  const [isExistingEntity, setIsExistingEntity] = useState(false);

  const { data: companyData } = useCompaniesForSelection();
  const companies = companyData?.companies || [];

  const {
    data: innKppData,
    isFetching: isFetchingInnKpp,
    error: innKppError,
    refetch: fetchByInnKpp,
  } = useLegalEntityByInnKppQuery(inn, kpp, { enabled: false });

  const { data: entityDetails, isFetching: isFetchingDetails } =
    useLegalEntityDetailsQuery(legalEntityId, { enabled: !!legalEntityId });

  const { mutate: createByInn, isPending: isCreatingByInn } =
    useCreateLegalEntityByINN();
  const { mutate: createEntity, isPending: isCreating } =
    useCreateLegalEntity();

  useEffect(() => {
    if (innKppData) {
      setLegalEntityId(innKppData.legal_entity_id);
      setIsExistingEntity(true);
    }
  }, [innKppData]);

  useEffect(() => {
    if (entityDetails && isExistingEntity) {
      form.setFieldsValue({
        short_name: entityDetails.short_name,
        address: entityDetails.address,
        ogrn: entityDetails.ogrn,
        opf: entityDetails.opf,
        vat_rate: entityDetails.vat_rate,
        signer: entityDetails.signer,
      });
    }
  }, [entityDetails, isExistingEntity, form]);

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(["inn"]);
        await fetchByInnKpp();
        setCurrentStep(1);
      }
    } catch (error) {
      message.error("Пожалуйста, заполните обязательные поля");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const company_id = values.company_id;

      if (isExistingEntity) {
        createByInn(
          {
            inn,
            kpp: kpp || undefined,
            company_id,
            relation_type: "seller",
            // opf: values.opf,
            // vat_rate: values.vat_rate,
            // signer: values.signer,
          },
          {
            onSuccess: () => {
              message.success("Организация успешно создана");
              onSuccess();
              handleCancel();
            },
          }
        );
      } else {
        createEntity(
          {
            ...values,
            inn,
            kpp: kpp || undefined,
            company_id,
            relation_type: "seller",
            opf: values.opf,
            vat_rate: values.vat_rate,
            signer: values.signer,
          },
          {
            onSuccess: () => {
              message.success("Организация успешно создана");
              onSuccess();
              handleCancel();
            },
          }
        );
      }
    } catch (error) {
      message.error("Ошибка при создании организации");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    setInn("");
    setKpp("");
    setLegalEntityId("");
    setIsExistingEntity(false);
    onCancel();
  };

  return (
    <Modal
      title="Добавить организацию"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Основные данные" />
        <Step title="Дополнительная информация" />
      </Steps>

      <Form form={form} layout="vertical">
        {currentStep === 0 && (
          <>
            <Form.Item
              name="inn"
              label="ИНН"
              rules={[
                { required: true, message: "Пожалуйста, введите ИНН" },
                {
                  pattern: /^[0-9]{10,12}$/,
                  message: "ИНН должен содержать 10 или 12 цифр",
                },
              ]}
            >
              <Input
                placeholder="Введите ИНН"
                onChange={(e) => setInn(e.target.value)}
                maxLength={12}
              />
            </Form.Item>

            <Form.Item
              name="kpp"
              label="КПП"
              rules={[
                {
                  pattern: /^[0-9]{9}$/,
                  message: "КПП должен содержать 9 цифр",
                },
              ]}
            >
              <Input
                placeholder="Введите КПП (необязательно)"
                onChange={(e) => setKpp(e.target.value)}
                maxLength={9}
              />
            </Form.Item>

            <div style={{ textAlign: "right" }}>
              <Button
                type="primary"
                onClick={handleNext}
                loading={isFetchingInnKpp}
              >
                Продолжить
              </Button>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <>
            {(isFetchingInnKpp || isFetchingDetails) && <Spin />}

            {innKppError && (
              <div style={{ marginBottom: 16, color: "red" }}>
                Организация с указанными ИНН/КПП не найдена. Пожалуйста,
                заполните данные вручную.
              </div>
            )}

            <Form.Item
              name="short_name"
              label="Название"
              rules={[
                { required: true, message: "Пожалуйста, введите название" },
              ]}
            >
              <Input
                placeholder="Введите краткое название"
                disabled={isExistingEntity}
              />
            </Form.Item>

            <Form.Item
              name="address"
              label="Адрес"
              rules={[{ required: true, message: "Пожалуйста, введите адрес" }]}
            >
              <Input.TextArea
                placeholder="Введите адрес"
                disabled={isExistingEntity}
                rows={2}
              />
            </Form.Item>

            {!isExistingEntity && (
              <Form.Item
                name="ogrn"
                label="ОГРН"
                rules={[
                  { required: true, message: "Пожалуйста, введите ОГРН" },
                  {
                    pattern: /^[0-9]{13}$/,
                    message: "ОГРН должен содержать 13 цифр",
                  },
                ]}
              >
                <Input placeholder="Введите ОГРН" maxLength={13} />
              </Form.Item>
            )}

            <Form.Item
              name="opf"
              label="ОПФ"
              rules={[{ required: true, message: "Пожалуйста, введите ОПФ" }]}
            >
              <Input
                placeholder="Введите организационно-правовую форму"
                disabled={isExistingEntity}
              />
            </Form.Item>

            <Form.Item
              name="vat_rate"
              label="Ставка НДС"
              rules={[
                { required: true, message: "Пожалуйста, выберите ставку НДС" },
              ]}
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
              name="signer"
              label="Подписант"
              rules={[
                { required: true, message: "Пожалуйста, введите подписанта" },
              ]}
            >
              <Input placeholder="Введите ФИО подписанта" />
            </Form.Item>

            <Form.Item
              name="company_id"
              label="Компания"
              rules={[
                { required: true, message: "Пожалуйста, выберите компанию" },
              ]}
            >
              <Select placeholder="Выберите компанию">
                {companies.map((company) => (
                  <Option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handlePrev}>Назад</Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isCreating || isCreatingByInn}
              >
                Создать
              </Button>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};
