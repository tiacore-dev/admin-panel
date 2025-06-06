import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button type="primary" onClick={() => navigate(-1)} style={{ margin: 16 }}>
      <LeftOutlined />
      Вернуться назад
    </Button>
  );
};
