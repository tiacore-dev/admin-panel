// src/pages/legalEntityDetailsPage/LegalEntityDetailsPage.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "../../redux/slices/breadcrumbsSlice";
import { BackButton } from "../../components/buttons/backButton";
import {
  Spin,
  Descriptions,
  Typography,
  Card,
  Button,
  Space,
  message,
} from "antd";
import { useLegalEntityDetailsQuery } from "../../hooks/legalEntities/useLegalEntityQuery";
import { useCompany } from "../../context/companyContext";
import { useDeleteLegalEntity } from "../../hooks/legalEntities/useLegalEntityMutation";
import { useUpdateLegalEntity } from "../../hooks/legalEntities/useLegalEntityMutation";
import { ConfirmDeleteModal } from "../../components/modals/confirmDeleteModal";
import { EditBuyerModal } from "./components/editBuyerModal";
import { ILegalEntityEdit } from "../../api/legalEntitiesApi";

const { Title } = Typography;

export const BuyerDetailsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { legal_entity_id } = useParams<{ legal_entity_id: string }>();
  const { selectedCompanyId } = useCompany();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const {
    data: legalEntity,
    isLoading,
    isError,
    refetch,
  } = useLegalEntityDetailsQuery(legal_entity_id || "", {
    enabled: !!legal_entity_id,
  });

  const deleteMutation = useDeleteLegalEntity();
  const updateMutation = useUpdateLegalEntity();

  React.useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { label: "Главная страница", to: "/home" },
        { label: "Контрагенты", to: "/legal-entities/buyers" },
        { label: "Детали контрагента", to: "" },
      ])
    );
  }, [dispatch]);

  const handleDelete = () => {
    if (!legal_entity_id) return;

    deleteMutation.mutate(legal_entity_id, {
      onSuccess: () => {
        navigate("/legal-entities/buyers");
        // message.success("Контрагент успешно удален");
      },
      onError: () => {
        // message.error("Ошибка при удалении контрагента");
      },
    });
  };

  const handleUpdate = (values: ILegalEntityEdit) => {
    if (!legal_entity_id) return;

    updateMutation.mutate(
      { legal_entity_id, updatedData: values },
      {
        onSuccess: () => {
          //   message.success("Данные успешно обновлены");
          setEditModalVisible(false);
          refetch();
        },
        onError: () => {
          //   message.error("Ошибка при обновлении данных");
        },
      }
    );
  };

  if (isLoading) {
    return <Spin size="large" className="center-spin" />;
  }

  if (isError || !legalEntity) {
    return (
      <div>
        <BackButton />
        <div>Не удалось загрузить данные контрагента</div>
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* <Card
        title={ */}
      <Space>
        {/* <Title level={4} style={{ margin: 0 }}>
              Информация о контрагенте
            </Title> */}
        <Button
          type="primary"
          onClick={() => setEditModalVisible(true)}
          style={{ marginRight: 8, marginBottom: 16 }}
        >
          Редактировать
        </Button>
        <Button
          danger
          onClick={() => setDeleteModalVisible(true)}
          style={{ marginRight: 8, marginBottom: 16 }}
        >
          Удалить
        </Button>
      </Space>
      {/* }
      > */}
      <Descriptions bordered column={1}>
        {/* <Descriptions.Item label="Полное название">
            {legalEntity.full_name || "-"}
          </Descriptions.Item> */}
        <Descriptions.Item label="Короткое название">
          {legalEntity.short_name}
        </Descriptions.Item>
        <Descriptions.Item label="ИНН">{legalEntity.inn}</Descriptions.Item>
        <Descriptions.Item label="КПП">
          {legalEntity.kpp || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="ОГРН">{legalEntity.ogrn}</Descriptions.Item>
        <Descriptions.Item label="ОПФ">
          {legalEntity.opf || "-"}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Ставка НДС">
            {legalEntity.vat_rate !== 0
              ? `${legalEntity.vat_rate}%`
              : "НДС не облагается"}
          </Descriptions.Item> */}
        <Descriptions.Item label="Адрес">
          {legalEntity.address}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Подписант">
            {legalEntity.signer || "-"}
          </Descriptions.Item> */}
      </Descriptions>
      {/* </Card> */}

      {deleteModalVisible && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteModalVisible(false)}
          isDeleteLoading={deleteMutation.isPending}
        />
      )}

      <EditBuyerModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSave={handleUpdate}
        initialValues={{
          short_name: legalEntity.short_name,
          full_name: legalEntity.full_name || "",
          inn: legalEntity.inn,
          kpp: legalEntity.kpp || "",
          ogrn: legalEntity.ogrn,
          opf: legalEntity.opf || "",
          vat_rate: legalEntity.vat_rate,
          address: legalEntity.address,
          signer: legalEntity.signer || "",
        }}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
};
