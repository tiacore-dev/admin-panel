import React from "react";
import { Typography, Card } from "antd";
import { ICompany } from "../../../api/companiesApi";

const { Title, Text } = Typography;

interface CompanyCardProps {
  data: ICompany;
  loading?: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  data,
  loading = false,
}) => {
  return (
    <Card style={{ width: "100%", maxWidth: 600 }} loading={loading}>
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Название компании:</Title>
        <Text>{data.company_name}</Text>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Описание:</Title>
        <Text>{data.description || "-"}</Text>
      </div>
    </Card>
  );
};
