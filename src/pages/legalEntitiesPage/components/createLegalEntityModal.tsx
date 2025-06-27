import React, { useState } from "react";
import { Modal, Steps, Form, Input, Button, message, Spin, Select } from "antd";
import { useLegalEntityByInnKppQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import {
  useCreateLegalEntity,
  useCreateLegalEntityByINN,
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
  relationTypeBeforeSelect?: "seller" | "buyer";
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const CreateLegalEntityModal: React.FC<CreateLegalEntityModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  companyId,
  showCompanySelect = false,
  relationTypeBeforeSelect,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [inn, setInn] = useState("");
  const [kpp, setKpp] = useState("");
  const [relationType, setRelationType] = useState<"buyer" | "seller">(
    relationTypeBeforeSelect || "seller"
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isManualCreation, setIsManualCreation] = useState(false);

  const { data: companiesData } = useCompanyQuery();

  const {
    data: innKppData,
    isFetching: isFetchingInnKpp,
    error: innKppError,
    refetch: fetchByInnKpp,
  } = useLegalEntityByInnKppQuery(inn, kpp, { enabled: false });

  const { mutate: createEntity, isPending: isCreating } =
    useCreateLegalEntity();
  const { mutate: createEntityByINN, isPending: isCreatingByINN } =
    useCreateLegalEntityByINN();
  const { mutate: createRelation } = useCreateEntityCompanyRelation();

  const handleNext = async () => {
    try {
      await form.validateFields(["inn", "kpp", "relation_type"]);
      const { data, error } = await fetchByInnKpp();

      if (data) {
        // Юрлицо найдено - создаем связь
        createRelation(
          {
            legal_entity_id: data.legal_entity_id,
            company_id: companyId || form.getFieldValue("company_id"),
            relation_type: relationType,
          },
          {
            onSuccess: () => {
              // message.success("Связь с компанией успешно создана");
              onSuccess();
              handleCancel();
            },
            onError: (error) => {
              // message.error(`Ошибка при создании связи: ${error.message}`);
            },
          }
        );
      } else if (error) {
        // Если есть ошибка, пробуем создать по ИНН
        handleEntityNotFound();
      }
    } catch (error) {
      message.error("Пожалуйста, заполните обязательные поля");
    }
  };

  const handleEntityNotFound = async () => {
    const companyIdValue = companyId || form.getFieldValue("company_id");
    if (!companyIdValue) {
      message.error("Пожалуйста, выберите компанию");
      return;
    }

    try {
      await createEntityByINN(
        {
          inn,
          kpp: kpp || undefined,
          company_id: companyIdValue,
          relation_type: relationType,
        },
        {
          onSuccess: () => {
            // message.success("Юрлицо успешно создано по ИНН");
            onSuccess();
            handleCancel();
          },
          onError: (error) => {
            if ((error as ApiError).response?.status === 404) {
              setShowConfirmModal(true);
            } else {
              // message.error(`Ошибка при создании: ${error.message}`);
              setShowConfirmModal(true);
            }
          },
        }
      );
    } catch (error) {
      setShowConfirmModal(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const companyIdValue = companyId || form.getFieldValue("company_id");

      createEntity(
        {
          ...values,
          inn,
          kpp: kpp || undefined,
          company_id: companyIdValue,
          relation_type: relationType,
          vat_rate: values.vat_rate ? parseInt(values.vat_rate) : undefined,
        },
        {
          onSuccess: () => {
            onSuccess();
            handleCancel();
          },
          onError: (error) => {
            // message.error(`Ошибка при создании: ${error.message}`);
          },
        }
      );
    } catch (error) {
      message.error("Пожалуйста, заполните все обязательные поля");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setCurrentStep(0);
    setInn("");
    setKpp("");
    setIsManualCreation(false);
    setShowConfirmModal(false);
    onCancel();
  };

  const handleConfirmContinue = () => {
    setShowConfirmModal(false);
    setIsManualCreation(true);
    setCurrentStep(1);
  };

  const handleFixInnKpp = () => {
    setShowConfirmModal(false);
    setCurrentStep(0);
  };

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
              {(showCompanySelect || !companyId) && (
                <Form.Item
                  name="company_id"
                  label="Компания"
                  rules={[{ required: true, message: "Выберите компанию" }]}
                >
                  <Select placeholder="Выберите компанию">
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

              {!relationTypeBeforeSelect && (
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
              )}

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

          {currentStep === 1 && isManualCreation && (
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
                    required: true,
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

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button onClick={() => setCurrentStep(0)}>Назад</Button>
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
        </Form>
      </Modal>

      <Modal
        title={
          <span style={{ fontSize: "18px", fontWeight: "500" }}>
            Подтверждение
          </span>
        }
        zIndex={1002}
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        width={600}
        centered
        footer={[
          // <Button
          //   key="back"
          //   onClick={() => setShowConfirmModal(false)} // Исправлено здесь
          //   style={{ marginRight: "8px" }}
          // >
          //   Отмена
          // </Button>,
          <Button
            key="fix"
            type="default"
            onClick={handleFixInnKpp}
            style={{ marginRight: "8px" }}
          >
            Исправить ИНН и КПП
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirmContinue}>
            Продолжить
          </Button>,
        ]}
        bodyStyle={{
          padding: "24px",
          fontSize: "15px",
          lineHeight: "1.6",
        }}
      >
        <div style={{ marginBottom: "16px" }}>
          <p style={{ marginBottom: "8px", fontWeight: "500" }}>
            Введенные ИНН и КПП не найдены в общей базе
          </p>
          <p style={{ color: "#595959" }}>
            Вы уверены, что хотите продолжить? При продолжении вам нужно будет
            ввести данные вручную.
          </p>
        </div>

        <div
          style={{
            background: "#f6f6f6",
            borderRadius: "8px",
            padding: "12px",
            marginTop: "16px",
          }}
        >
          <div style={{ display: "flex", marginBottom: "8px" }}>
            <span style={{ width: "80px", color: "#8c8c8c" }}>ИНН:</span>
            <span style={{ fontWeight: "500" }}>{inn}</span>
          </div>
          {kpp && (
            <div style={{ display: "flex" }}>
              <span style={{ width: "80px", color: "#8c8c8c" }}>КПП:</span>
              <span style={{ fontWeight: "500" }}>{kpp}</span>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
