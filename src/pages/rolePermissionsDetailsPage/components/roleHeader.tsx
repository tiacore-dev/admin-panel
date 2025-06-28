"use client";

import type React from "react";
import { Button, Space, Typography, Card, Row, Col } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface RoleHeaderProps {
  role: any;
  isEditing: boolean;
  selectedPermissions: string[];
  allPermissions: any;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onRenameClick: () => void;
  onSelectAllPermissions: (checked: boolean) => void;
  onCancelEdit: () => void;
  onSavePermissions: () => void;
  isSaving: boolean;
}

export const RoleHeader: React.FC<RoleHeaderProps> = ({
  role,
  isEditing,
  selectedPermissions,
  allPermissions,
  onEditClick,
  onDeleteClick,
  onRenameClick,
  onSelectAllPermissions,
  onCancelEdit,
  onSavePermissions,
  isSaving,
}) => {
  return (
    <Row gutter={16} align="middle">
      <Col>
        {isEditing ? (
          <Space>
            <Button icon={<EditOutlined />} onClick={onRenameClick}>
              Переименовать
            </Button>
            <Button
              onClick={() => onSelectAllPermissions(true)}
              disabled={
                selectedPermissions.length ===
                allPermissions?.permissions.length
              }
            >
              Выбрать все
            </Button>
            <Button
              onClick={() => onSelectAllPermissions(false)}
              disabled={selectedPermissions.length === 0}
            >
              Убрать все
            </Button>
            <Button icon={<CloseOutlined />} onClick={onCancelEdit}>
              Отмена
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={onSavePermissions}
              loading={isSaving}
            >
              Сохранить
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={onEditClick}
            >
              Редактировать
            </Button>
            <Button danger icon={<DeleteOutlined />} onClick={onDeleteClick}>
              Удалить
            </Button>
          </Space>
        )}
      </Col>
    </Row>
  );
};
