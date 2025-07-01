"use client";

import type React from "react";
import { useState } from "react";
import {
  Modal,
  Steps,
  Form,
  Input,
  Button,
  message,
  Select,
  Card,
  Typography,
  Space,
  Alert,
  Divider,
} from "antd";
import {
  BankOutlined,
  FileTextOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useLegalEntityByInnKppQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import {
  useCreateLegalEntity,
  useCreateLegalEntityByINN,
} from "../../../hooks/legalEntities/useLegalEntityMutation";
import { useCreateEntityCompanyRelation } from "../../../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";
import { useCompanyQuery } from "../../../hooks/companies/useCompanyQuery";

const { Step } = Steps;
const { Option } = Select;
const { Title, Text } = Typography;

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
        createRelation(
          {
            legal_entity_id: data.legal_entity_id,
            company_id: companyId || form.getFieldValue("company_id"),
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
      } else if (error) {
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
            message.success("Юрлицо успешно создано по ИНН");
            onSuccess();
            handleCancel();
          },
          onError: (error) => {
            if ((error as ApiError).response?.status === 404) {
              setShowConfirmModal(true);
            } else {
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
          vat_rate: values.vat_rate
            ? Number.parseInt(values.vat_rate)
            : undefined,
        },
        {
          onSuccess: () => {
            message.success("Юридическое лицо успешно создано");
            onSuccess();
            handleCancel();
          },
          onError: (error) => {
            message.error(`Ошибка при создании: ${error.message}`);
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
            <BankOutlined style={{ fontSize: "20px" }} />
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
              Добавить юридическое лицо
            </span>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        centered
        width={700}
        footer={[
          <Button
            key="back"
            onClick={currentStep === 1 ? () => setCurrentStep(0) : handleCancel}
            size="large"
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
            key="submit"
            type="primary"
            size="large"
            onClick={currentStep === 0 ? handleNext : handleSubmit}
            loading={isFetchingInnKpp || isCreatingByINN || isCreating}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              borderRadius: "8px",
              height: "40px",
              fontWeight: "500",
            }}
            icon={<SaveOutlined />}
          >
            {currentStep === 0 ? "Продолжить" : "Сохранить"}
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
        <Form form={form} layout="vertical">
          {currentStep === 0 && (
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {(showCompanySelect || !companyId) && (
                <Form.Item
                  name="company_id"
                  label="Компания"
                  rules={[{ required: true, message: "Выберите компанию" }]}
                >
                  <Select
                    placeholder="Выберите компанию"
                    showSearch
                    optionFilterProp="children"
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

              {!relationTypeBeforeSelect && (
                <Form.Item
                  name="relation_type"
                  label="Тип юр.лица"
                  rules={[{ required: true, message: "Выберите тип юр.лица" }]}
                >
                  <Select
                    placeholder="Выберите тип"
                    onChange={(value) => setRelationType(value)}
                    value={relationType}
                  >
                    <Option value="buyer">
                      <Space>
                        <UserOutlined />
                        Контрагент
                      </Space>
                    </Option>
                    <Option value="seller">
                      <Space>
                        <BankOutlined />
                        Организация
                      </Space>
                    </Option>
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
                  prefix={<FileTextOutlined />}
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
                  prefix={<FileTextOutlined />}
                />
              </Form.Item>
            </Space>
          )}

          {currentStep === 1 && isManualCreation && (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Form.Item
                name="short_name"
                label="Название"
                rules={[{ required: true, message: "Введите название" }]}
              >
                <Input
                  placeholder="Введите краткое название"
                  prefix={<BankOutlined />}
                />
              </Form.Item>

              <Form.Item name="opf" label="ОПФ">
                <Input
                  placeholder="Введите организационно-правовую форму"
                  prefix={<FileTextOutlined />}
                />
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
                <Input
                  placeholder="Введите ОГРН"
                  maxLength={15}
                  prefix={<FileTextOutlined />}
                />
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
                <Input.TextArea
                  placeholder="Введите адрес"
                  rows={3}
                  showCount
                  maxLength={255}
                />
              </Form.Item>
            </Space>
          )}
        </Form>
      </Modal>

      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ExclamationCircleOutlined
              style={{ color: "#faad14", fontSize: 24 }}
            />
            <span style={{ fontSize: "18px", fontWeight: "500" }}>
              Подтверждение создания
            </span>
          </div>
        }
        open={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        width={600}
        centered
        footer={[
          <Button
            key="fix"
            onClick={handleFixInnKpp}
            style={{ marginRight: "8px" }}
          >
            Исправить ИНН и КПП
          </Button>,
          <Button
            key="submit"
            onClick={handleConfirmContinue}
            icon={<CheckCircleOutlined />}
          >
            Продолжить
          </Button>,
        ]}
      >
        <Alert
          message="Организация не найдена в базе данных"
          description="Введенные ИНН и КПП не найдены в общей базе. Вы можете продолжить и ввести данные вручную."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Card size="small" style={{ background: "#fafafa" }}>
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
        </Card>
      </Modal>
    </>
  );
};
