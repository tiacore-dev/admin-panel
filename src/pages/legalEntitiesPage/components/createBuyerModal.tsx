// src/pages/legalEntitiesBuyersPage/components/createBuyerModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Steps, Form, Input, Select, Button, message, Spin } from "antd";
import { useLegalEntityByInnKppQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useLegalEntityDetailsQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useCreateLegalEntityByINN } from "../../../hooks/legalEntities/useLegalEntityMutation";
import { useCreateLegalEntity } from "../../../hooks/legalEntities/useLegalEntityMutation";
import { useCompaniesForSelection } from "../../../hooks/companies/useCompanyQuery";

const { Step } = Steps;
const { Option } = Select;

interface CreateBuyerModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateBuyerModal: React.FC<CreateBuyerModalProps> = ({
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
            relation_type: "buyer",
          },
          {
            onSuccess: () => {
              message.success("Контрагент успешно создан");
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
            relation_type: "buyer",
          },
          {
            onSuccess: () => {
              message.success("Контрагент успешно создан");
              onSuccess();
              handleCancel();
            },
          }
        );
      }
    } catch (error) {
      message.error("Ошибка при создании контрагента");
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
      title="Добавить контрагента"
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
                Контрагент с указанными ИНН/КПП не найден. Пожалуйста, заполните
                данные вручную.
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
