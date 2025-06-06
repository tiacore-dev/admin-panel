import React, { useEffect, useState } from "react";
import { Modal, Form } from "antd";
// import { ILegalEntityType } from "../../../api/baseApi";
import { ILegalEntity } from "../../../api/legalEntitiesApi";
import { useLegalEntityMutations } from "../../../hooks/legalEntities/useLegalEntityMutation";
import {
  useLegalEntityByInnKppQuery,
  useLegalEntityDetailsQuery,
} from "../../../hooks/legalEntities/useLegalEntityQuery";
import { renderFooter } from "./renderLegalEntityFooter";
import {
  renderAdditionalFields,
  renderBasicFields,
} from "./renderLegalEntityFields";
import { useEntityCompanyRelationsMutations } from "../../../hooks/entityCompanyRelations/useEntityCompanyRelationMutations";

export interface LegalEntityModalProps {
  visible: boolean;
  onCancel: () => void;
  // legalEntityTypes: ILegalEntityType[];
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: ILegalEntity | null;
  defaultRelationType?: "buyer" | "seller";
}

export const LegalEntityFormModal: React.FC<LegalEntityModalProps> = ({
  visible,
  onCancel,
  // legalEntityTypes,
  onSuccess,
  mode = "create",
  initialData = null,
  defaultRelationType,
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllFields, setShowAllFields] = useState(mode === "edit");
  const [basicFieldsData, setBasicFieldsData] = useState<{
    inn: string;
    kpp: string;
    relation_type?: string;
  } | null>(null);
  const [isExistingEntity, setIsExistingEntity] = useState(false);
  const [innForCheck, setInnForCheck] = useState<string | null>(null);
  const [kppForCheck, setKppForCheck] = useState<string | null>(null);

  const { createMutation, updateMutation } = useLegalEntityMutations(
    initialData?.legal_entity_id || "",
    initialData?.legal_entity_name || "",
    initialData?.inn || "",
    initialData?.vat_rate || null,
    initialData?.address || "",
    initialData?.entity_type || null,
    initialData?.company || "",
    initialData?.kpp || null,
    initialData?.signer || undefined
  );

  const { createMutation: createRelationMutation } =
    useEntityCompanyRelationsMutations("", "", "", "");

  const {
    data: existingEntity,
    //  isFetching: isCheckingExisting
  } = useLegalEntityByInnKppQuery(innForCheck || "", kppForCheck || null);

  const { data: entityDetails } = useLegalEntityDetailsQuery(
    existingEntity?.legal_entity_id || ""
  );

  useEffect(() => {
    if (entityDetails && showAllFields) {
      form.setFieldsValue({
        legal_entity_name: entityDetails.legal_entity_name,
        address: entityDetails.address,
        vat_rate: entityDetails.vat_rate,
        entity_type: entityDetails.entity_type,
        signer: entityDetails.signer,
      });
      setIsExistingEntity(true);
    } else if (showAllFields) {
      setIsExistingEntity(false);
    }
  }, [entityDetails, showAllFields, form]);

  useEffect(() => {
    if (visible) {
      if (initialData && mode === "edit") {
        form.setFieldsValue({
          legal_entity_name: initialData.legal_entity_name,
          inn: initialData.inn,
          kpp: initialData.kpp,
          address: initialData.address,
          vat_rate: initialData.vat_rate,
          entity_type: initialData.entity_type,
          signer: initialData.signer,
        });
        setShowAllFields(true);
      } else {
        form.resetFields();
        // Устанавливаем relation_type по умолчанию при создании
        if (mode === "create" && defaultRelationType) {
          form.setFieldsValue({
            relation_type: defaultRelationType,
          });
        }
        setShowAllFields(false);
        setBasicFieldsData(null);
      }
    }
  }, [visible, initialData, mode, form, defaultRelationType]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields(["inn", "kpp"]);
      setInnForCheck(values.inn);
      setKppForCheck(values.kpp || null);
      setBasicFieldsData({
        inn: values.inn,
        kpp: values.kpp,
        relation_type:
          defaultRelationType || form.getFieldValue("relation_type"),
      });
      setShowAllFields(true);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleBack = () => {
    setShowAllFields(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const selectedCompanyId = localStorage.getItem("selectedCompanyId");

      const cleanData = (data: any) => {
        const cleaned = { ...data };
        if (
          cleaned.signer === null ||
          cleaned.signer === undefined ||
          cleaned.signer === ""
        ) {
          delete cleaned.signer;
        }
        if (
          cleaned.entity_type === null ||
          cleaned.entity_type === undefined ||
          cleaned.entity_type === ""
        ) {
          delete cleaned.entity_type;
        }
        return cleaned;
      };

      if (mode === "create") {
        if (existingEntity?.legal_entity_id) {
          await createRelationMutation.mutateAsync({
            legal_entity: existingEntity.legal_entity_id,
            company: selectedCompanyId || "",
            relation_type:
              defaultRelationType! || basicFieldsData?.relation_type,
          });
        } else {
          const formData = cleanData({
            ...values,
            relation_type:
              defaultRelationType || basicFieldsData?.relation_type,
            company: selectedCompanyId || null,
          });
          await createMutation.mutateAsync(formData);
        }
      } else if (mode === "edit" && initialData?.legal_entity_id) {
        const formData = cleanData(values);
        await updateMutation.mutateAsync(formData);
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const relationType =
    defaultRelationType || form.getFieldValue("relation_type");
  const modalTitle =
    mode === "create" && defaultRelationType === "buyer"
      ? "Добавить контрагента"
      : mode === "create" && defaultRelationType === "seller"
      ? "Добавить организацию к компании"
      : mode === "edit" && defaultRelationType === "buyer"
      ? "Редактировать контрагента"
      : mode === "edit" && defaultRelationType === "seller"
      ? "Редактировать организацию"
      : "Форма контрагента";
  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onCancel}
      footer={renderFooter({
        mode,
        showAllFields,
        isSubmitting,
        onCancel,
        handleBack,
        handleSubmit,
        handleNext,
      })}
      width={700}
    >
      <Form form={form} layout="vertical">
        {!showAllFields
          ? renderBasicFields({ mode, defaultRelationType })
          : renderAdditionalFields({
              mode,
              isExistingEntity,
              relationType,
              // legalEntityTypes,
            })}
      </Form>
    </Modal>
  );
};
