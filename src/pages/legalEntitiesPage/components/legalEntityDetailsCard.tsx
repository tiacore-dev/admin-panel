import React from "react";
import { Descriptions } from "antd";
import { ILegalEntity } from "../../../api/legalEntitiesApi";

interface LegalEntityDetailsCardProps {
  legal_entity: ILegalEntity;
  showAdditionalFields?: boolean;
  legalEntityTypes?: {
    legal_entity_type_id: string;
    entity_name: string;
  }[];
}

export const LegalEntityDetailsCard: React.FC<LegalEntityDetailsCardProps> = ({
  legal_entity,
  showAdditionalFields = false,
  legalEntityTypes = [],
}) => {
  const formatVatRate = (rate?: number) => {
    if (rate === undefined) return "Не указано";
    return rate === 0 ? "НДС не облагается" : `${rate} %`;
  };

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Имя контрагента">
        {legal_entity.legal_entity_name}
      </Descriptions.Item>
      <Descriptions.Item label="ИНН">{legal_entity.inn}</Descriptions.Item>
      <Descriptions.Item label="КПП">
        {legal_entity.kpp || "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Адрес">
        {legal_entity.address}
      </Descriptions.Item>

      {showAdditionalFields && (
        <>
          <Descriptions.Item label="Ставка НДС">
            {formatVatRate(legal_entity.vat_rate)}
          </Descriptions.Item>
          <Descriptions.Item label="Подписант">
            {legal_entity.signer || "Не указано"}
          </Descriptions.Item>
        </>
      )}
    </Descriptions>
  );
};
