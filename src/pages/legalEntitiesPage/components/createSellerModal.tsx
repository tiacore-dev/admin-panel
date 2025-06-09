// src/pages/companyDetailsPage/components/createSellerModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Steps, Form, Input, Button, message, Spin, Select } from "antd";
import { useLegalEntityByInnKppQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useLegalEntityDetailsQuery } from "../../../hooks/legalEntities/useLegalEntityQuery";
import { useCreateLegalEntity } from "../../../hooks/legalEntities/useLegalEntityMutation";
import { useCreateEntityCompanyRelation } from "../../../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";
import { useCompanyQuery } from "../../../hooks/companies/useCompanyQuery";

const { Step } = Steps;
const { Option } = Select;

interface CreateSellerModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  companyId?: string; // Делаем необязательным
  showCompanySelect?: boolean; // Флаг для отображения выбора компании
}

export const CreateSellerModal: React.FC<CreateSellerModalProps> = ({
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
  const [isExistingEntity, setIsExistingEntity] = useState(false);
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
  const { mutate: createRelation } = useCreateEntityCompanyRelation();

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
        vat_rate: entityDetails.vat_rate?.toString(),
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

      if (!selectedCompany) {
        message.error("Пожалуйста, выберите компанию");
        return;
      }

      if (isExistingEntity) {
        createRelation(
          {
            legal_entity_id: legalEntityId,
            company_id: selectedCompany,
            relation_type: "seller",
          },
          {
            onSuccess: () => {
              onSuccess();
              handleCancel();
            },
            onError: () => {},
          }
        );
      } else {
        createEntity(
          {
            ...values,
            inn,
            kpp: kpp || undefined,
            company_id: selectedCompany,
            relation_type: "seller",
            vat_rate: values.vat_rate ? parseInt(values.vat_rate) : undefined,
          },
          {
            onSuccess: (data) => {
              onSuccess();
              handleCancel();
            },
            onError: (error) => {},
          }
        );
      }
    } catch (error) {}
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
                    <Option key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </Option>
                  ))}
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
                minLength={5}
              />
            </Form.Item>

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
              <Input
                placeholder="Введите ОГРН"
                maxLength={13}
                disabled={isExistingEntity}
              />
            </Form.Item>

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
                {
                  required: true,
                  message: "Пожалуйста, выберите ставку НДС",
                },
              ]}
            >
              <Select
                placeholder="Выберите ставку НДС"
                disabled={isExistingEntity}
              >
                <Option value="0">НДС не облагается</Option>
                <Option value="5">5%</Option>
                <Option value="7">7%</Option>
                <Option value="20">20%</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="signer"
              label="Подписант"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите подписанта",
                },
              ]}
            >
              <Input
                placeholder="Введите ФИО подписанта"
                disabled={isExistingEntity}
              />
            </Form.Item>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handlePrev}>Назад</Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isCreating}
              >
                {isExistingEntity ? "Добавить" : "Создать"}
              </Button>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
};
