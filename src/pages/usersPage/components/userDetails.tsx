import React from "react";
import { Typography, Card, Tag } from "antd";
import { IUser } from "../../../api/usersApi";

const { Title, Text } = Typography;

interface UserDetailsProps {
  userDetails: IUser;
}

export const UserDetailsCard: React.FC<UserDetailsProps> = ({
  userDetails,
}) => {
  return (
    <>
      {!!userDetails && (
        <Card style={{ width: "100%", maxWidth: 600 }}>
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Email:</Title>
            <Text>{userDetails.email}</Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Ф.И.О.:</Title>
            <Text>{userDetails.full_name}</Text>
          </div>

          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Статус:</Title>
            <Tag color={userDetails.is_verified ? "green" : "orange"}>
              {userDetails.is_verified ? "Верифицирован" : "Не верифицирован"}
            </Tag>
          </div>
        </Card>
      )}
    </>
  );
};
