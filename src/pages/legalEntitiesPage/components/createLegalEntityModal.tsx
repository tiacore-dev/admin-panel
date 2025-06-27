import React, { useState, useEffect } from "react";
import { Modal, Steps, Form, Input, Button, message, Spin, Select } from "antd";
import { useLegalEntityByInnKppQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useLegalEntityDetailsQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import {
  useCreateLegalEntity,
  useCreateLegalEntityByINN,
  useUpdateLegalEntity,
} from "../../../hooks/legalEntities/useLegalEntityMutation";
import { useCreateEntityCompanyRelation } from "../../../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";
import { useCompanyQuery } from "../../../hooks/companies/useCompanyQuery";

const { Step } = Steps;
const { Option } = Select;

interface CreateLegalEntityModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  companyId?: string;
  showCompanySelect?: boolean;
}

export const CreateLegalEntityModal: React.FC<CreateLegalEntityModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  companyId,
  showCompanySelect = false,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [inn, setInn] = useState("");
  const [kpp, setKpp] = useState("");
  const [legalEntityId, setLegalEntityId] = useState("");
  const [relationType, setRelationType] = useState<"buyer" | "seller">(
    "seller"
  );
  const [isExistingEntity, setIsExistingEntity] = useState(false);
  const [isCreatedByINN, setIsCreatedByINN] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(
    companyId
  );

  const { data: companiesData } = useCompanyQuery();

  const {
    data: innKppData,
    isFetching: isFetchingInnKpp,
    error: innKppError,
    refetch: fetchByInnKpp,
  } = useLegalEntityByInnKppQuery(inn, kpp, { enabled: false });

  const { data: entityDetails, isFetching: isFetchingDetails } =
    useLegalEntityDetailsQuery(legalEntityId, { enabled: !!legalEntityId });

  const { mutate: createEntity, isPending: isCreating } =
    useCreateLegalEntity();
  const { mutate: createEntityByINN, isPending: isCreatingByINN } =
    useCreateLegalEntityByINN();
  const { mutate: updateEntity, isPending: isUpdating } =
    useUpdateLegalEntity();
  const { mutate: createRelation } = useCreateEntityCompanyRelation();

  // Обработка результата проверки ИНН/КПП
  useEffect(() => {
    if (innKppData) {
      setLegalEntityId(innKppData.legal_entity_id);
      setIsExistingEntity(true);
      createRelationAutomatically(innKppData.legal_entity_id);
    } else if (innKppError && (innKppError as any).response?.status === 404) {
      handleEntityNotFound();
    }
  }, [innKppData, innKppError]);

  // Автоматическое создание связи для существующего юрлица
  const createRelationAutomatically = (entityId: string) => {
    if (!selectedCompany) {
      message.error("Пожалуйста, выберите компанию");
      return;
    }

    createRelation(
      {
        legal_entity_id: entityId,
        company_id: selectedCompany,
        relation_type: relationType,
      },
      {
        onSuccess: () => {
          message.success("Связь с компанией успешно создана");
          onSuccess();
          handleCancel();
        },
        onError: (error) => {
          message.error(`Ошибка при создании связи: ${error.message}`);
        },
      }
    );
  };

  // Обработка случая, когда юрлицо не найдено
  const handleEntityNotFound = () => {
    if (!selectedCompany) {
      message.error("Пожалуйста, выберите компанию");
      return;
    }

    createEntityByINN(
      {
        inn,
        kpp: kpp || undefined,
        company_id: selectedCompany,
        relation_type: relationType,
      },
      {
        onSuccess: (data) => {
          setLegalEntityId(data.legal_entity_id);
          setIsCreatedByINN(true);
          message.success("Юрлицо успешно создано по ИНН");
        },
        onError: (error) => {
          setShowConfirmModal(true);
        },
      }
    );
  };

  // Заполнение формы данными после загрузки деталей
  useEffect(() => {
    if (entityDetails) {
      form.setFieldsValue({
        short_name: entityDetails.short_name,
        address: entityDetails.address,
        ogrn: entityDetails.ogrn,
        opf: entityDetails.opf,
        vat_rate: entityDetails.vat_rate?.toString(),
      });
    }
  }, [entityDetails, form]);

  const handleNext = async () => {
    try {
      await form.validateFields(["inn", "kpp", "relation_type"]);
      await fetchByInnKpp();
      setCurrentStep(1);
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

      if (isCreatedByINN && legalEntityId) {
        // Обновляем только ставку НДС для созданного по ИНН юрлица
        updateEntity(
          {
            legal_entity_id: legalEntityId,
            updatedData: {
              vat_rate: values.vat_rate ? parseInt(values.vat_rate) : undefined,
            },
          },
          {
            onSuccess: () => {
              onSuccess();
              handleCancel();
            },
            onError: (error) => {
              message.error(`Ошибка при обновлении: ${error.message}`);
            },
          }
        );
      } else {
        // Создаем новое юрлицо вручную
        createEntity(
          {
            ...values,
            inn,
            kpp: kpp || undefined,
            company_id: selectedCompany,
            relation_type: relationType,
            vat_rate: values.vat_rate ? parseInt(values.vat_rate) : undefined,
          },
          {
            onSuccess: () => {
              onSuccess();
              handleCancel();
            },
            onError: (error) => {
              message.error(`Ошибка при создании: ${error.message}`);
            },
          }
        );
      }
    } catch (error) {
      message.error("Пожалуйста, заполните все обязательные поля");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    setInn("");
    setKpp("");
    setLegalEntityId("");
    setIsExistingEntity(false);
    setIsCreatedByINN(false);
    onCancel();
  };

  // Обработчик подтверждения продолжения
  const handleConfirmContinue = () => {
    setShowConfirmModal(false);
    setCurrentStep(1); // Переходим на следующий шаг для ручного ввода
  };

  // Обработчик исправления ИНН/КПП
  const handleFixInnKpp = () => {
    setShowConfirmModal(false);
    setCurrentStep(0); // Возвращаемся на первый шаг
  };

  // Валидация ИНН/КПП
  const validateInnKpp = (_: any, value: string) => {
    if (!inn) return Promise.resolve();

    if (inn.length === 10 && !kpp) {
      return Promise.reject(
        new Error("Для ИНН из 10 цифр необходимо указать КПП")
      );
    }

    if (inn.length === 12 && kpp) {
      return Promise.reject(new Error("Для ИНН из 12 цифр КПП не требуется"));
    }

    return Promise.resolve();
  };

  return (
    <>
      <Modal
        title="Добавить юридическое лицо"
        zIndex={1001}
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
              {showCompanySelect && (
                <Form.Item
                  name="company_id"
                  label="Компания"
                  rules={[{ required: true, message: "Выберите компанию" }]}
                >
                  <Select
                    placeholder="Выберите компанию"
                    onChange={(value) => setSelectedCompany(value)}
                    value={selectedCompany}
                  >
                    {companiesData?.companies.map((company) => (
                      <Option
                        key={company.company_id}
                        value={company.company_id}
                      >
                        {company.company_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

              <Form.Item
                name="relation_type"
                label="Тип контрагента"
                rules={[
                  { required: true, message: "Выберите тип контрагента" },
                ]}
              >
                <Select
                  placeholder="Выберите тип"
                  onChange={(value) => setRelationType(value)}
                  value={relationType}
                >
                  <Option value="buyer">Контрагент</Option>
                  <Option value="seller">Организация</Option>
                </Select>
              </Form.Item>

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
                  { validator: validateInnKpp },
                  {
                    pattern: kpp ? /^[0-9]{9}$/ : undefined,
                    message: "КПП должен содержать 9 цифр",
                  },
                ]}
              >
                <Input
                  placeholder="Введите КПП (обязательно для ИНН из 10 цифр)"
                  onChange={(e) => setKpp(e.target.value)}
                  maxLength={9}
                />
              </Form.Item>

              <div style={{ textAlign: "right" }}>
                <Button
                  type="primary"
                  onClick={handleNext}
                  loading={isFetchingInnKpp || isCreatingByINN}
                >
                  Продолжить
                </Button>
              </div>
            </>
          )}

          {currentStep === 1 && (
            <>
              {(isFetchingInnKpp || isFetchingDetails || isCreatingByINN) && (
                <Spin />
              )}

              {!isFetchingDetails && entityDetails && (
                <>
                  <Form.Item
                    name="short_name"
                    label="Название"
                    rules={[{ required: true }]}
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label="Адрес"
                    rules={[{ required: !isCreatedByINN }]}
                  >
                    <Input.TextArea rows={2} disabled={isCreatedByINN} />
                  </Form.Item>

                  <Form.Item
                    name="ogrn"
                    label="ОГРН"
                    rules={[
                      { required: true },
                      {
                        pattern: /^[0-9]{13,15}$/,
                        message: "ОГРН должен содержать 13-15 цифр",
                      },
                    ]}
                  >
                    <Input maxLength={15} disabled />
                  </Form.Item>

                  <Form.Item name="opf" label="ОПФ">
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    name="vat_rate"
                    label="Ставка НДС"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Выберите ставку НДС">
                      <Option value="0">НДС не облагается</Option>
                      <Option value="5">5%</Option>
                      <Option value="7">7%</Option>
                      <Option value="20">20%</Option>
                    </Select>
                  </Form.Item>

                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button onClick={handlePrev}>Назад</Button>
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      loading={isCreating || isUpdating}
                    >
                      {isExistingEntity ? "Добавить" : "Создать"}
                    </Button>
                  </div>
                </>
              )}

              {!isFetchingDetails && !entityDetails && !isCreatedByINN && (
                <>
                  <Form.Item
                    name="short_name"
                    label="Название"
                    rules={[{ required: true, message: "Введите название" }]}
                  >
                    <Input placeholder="Введите краткое название" />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label="Адрес"
                    rules={[
                      {
                        min: 5,
                        message: "Адрес должен содержать минимум 5 символов",
                        required: !isCreatedByINN,
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="Введите адрес" rows={2} />
                  </Form.Item>

                  <Form.Item
                    name="ogrn"
                    label="ОГРН"
                    rules={[
                      { required: true, message: "Введите ОГРН" },
                      {
                        pattern: /^[0-9]{13,15}$/,
                        message: "ОГРН должен содержать 13-15 цифр",
                      },
                    ]}
                  >
                    <Input placeholder="Введите ОГРН" maxLength={15} />
                  </Form.Item>

                  <Form.Item name="opf" label="ОПФ">
                    <Input placeholder="Введите организационно-правовую форму" />
                  </Form.Item>

                  <Form.Item
                    name="vat_rate"
                    label="Ставка НДС"
                    rules={[{ required: true, message: "Выберите ставку НДС" }]}
                  >
                    <Select placeholder="Выберите ставку НДС">
                      <Option value="0">НДС не облагается</Option>
                      <Option value="5">5%</Option>
                      <Option value="7">7%</Option>
                      <Option value="20">20%</Option>
                    </Select>
                  </Form.Item>

                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button onClick={handlePrev}>Назад</Button>
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      loading={isCreating}
                    >
                      Создать
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </Form>
      </Modal>
      <Modal
        title="Подтверждение"
        zIndex={1002}
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        width={600}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setShowConfirmModal(false);
              handleCancel();
            }}
          >
            Отмена
          </Button>,
          <Button key="fix" type="default" onClick={handleFixInnKpp}>
            Исправить ИНН и КПП
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirmContinue}>
            Продолжить
          </Button>,
        ]}
        bodyStyle={{ height: "150px", overflowY: "auto" }} // Высота контента + скролл при необходимости
      >
        <p>
          Введенные ИНН и КПП не найдены в общей базе. Вы уверены что хотите
          продолжить?
        </p>
        <p>При продолжении вам нужно будет ввести данные вручную.</p>
      </Modal>
    </>
  );
};
