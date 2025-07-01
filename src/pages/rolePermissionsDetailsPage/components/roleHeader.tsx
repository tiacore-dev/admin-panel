"use client";

import type React from "react";
import { Button, Space, Typography, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface RoleHeaderProps {
  onDeleteClick: () => void;
  onRenameClick: () => void;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({
  onDeleteClick,
  onRenameClick,
}) => {
  return (
    <Row gutter={16} align="middle">
      <Col>
        <Space>
          <Button
            size="large"
            className="primary-button"
            style={{ color: "#764ba2" }}
            icon={<EditOutlined />}
            onClick={onRenameClick}
          >
            Переименовать
          </Button>
          <Button
            danger
            size="large"
            icon={<DeleteOutlined />}
            onClick={onDeleteClick}
            className="primary-button"
            style={{
              background: "rgba(255, 77, 79, 0.2) !important",
              borderColor: "rgba(255, 77, 79, 0.5) !important",
            }}
          >
            Удалить
          </Button>
        </Space>
      </Col>
    </Row>
  );
};
