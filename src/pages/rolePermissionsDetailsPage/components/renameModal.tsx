"use client";

import type React from "react";
import { Modal, Input } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";

interface RenameModalProps {
  isOpen: boolean;
  newRoleName: string;
  onRoleNameChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const RenameModal: React.FC<RenameModalProps> = ({
  isOpen,
  newRoleName,
  onRoleNameChange,
  onConfirm,
  onCancel,
  isLoading,
}) => {
  return (
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
          <EditOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Переименовать роль
          </span>
        </div>
      }
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={isLoading}
      maskClosable={!isLoading}
      closable={!isLoading}
      centered
      width={480}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          Сохранить
        </span>
      }
      cancelText="Отмена"
      okButtonProps={{
        size: "large",
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "8px",
          height: "40px",
          fontWeight: "500",
        },
        disabled: !newRoleName.trim() || isLoading,
      }}
      cancelButtonProps={{
        size: "large",
        style: {
          borderRadius: "8px",
          height: "40px",
          fontWeight: "500",
          borderColor: "#d1d5db",
          color: "#6b7280",
        },
      }}
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
      <div style={{ marginBottom: "8px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
          }}
        >
          Название роли
        </label>
        <Input
          value={newRoleName}
          onChange={(e) => onRoleNameChange(e.target.value)}
          placeholder="Введите новое название роли"
          size="large"
          prefix={<EditOutlined style={{ color: "#9ca3af" }} />}
          style={{
            borderRadius: "8px",
            border: "2px solid #e5e7eb",
            fontSize: "16px",
          }}
          onPressEnter={onConfirm}
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
};
