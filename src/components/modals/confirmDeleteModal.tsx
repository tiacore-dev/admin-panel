"use client";

import type React from "react";
import { useEffect } from "react";
import { Modal, Button, Typography, Space } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ConfirmDeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleteLoading: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  onConfirm,
  onCancel,
  isDeleteLoading,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !isDeleteLoading) {
        onConfirm();
      } else if (event.key === "Escape" && !isDeleteLoading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onConfirm, onCancel, isDeleteLoading]);

  return (
    <Modal
      title={
        <Space align="center" style={{ color: "#ff4d4f" }}>
          <ExclamationCircleOutlined
            style={{ fontSize: "20px", color: "#ff4d4f" }}
          />
          <span style={{ fontSize: "16px", fontWeight: 600 }}>
            Подтверждение удаления
          </span>
        </Space>
      }
      open={true}
      onOk={onConfirm}
      onCancel={onCancel}
      centered
      width={500}
      maskClosable={!isDeleteLoading}
      closable={!isDeleteLoading}
      style={{
        borderRadius: "12px",
      }}
      bodyStyle={{
        padding: "24px",
        textAlign: "center",
      }}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          disabled={isDeleteLoading}
          size="large"
          style={{
            borderRadius: "8px",
            height: "40px",
            minWidth: "100px",
            fontWeight: 500,
          }}
        >
          Отмена
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          onClick={onConfirm}
          loading={isDeleteLoading}
          disabled={isDeleteLoading}
          size="large"
          icon={!isDeleteLoading ? <DeleteOutlined /> : undefined}
          style={{
            borderRadius: "8px",
            height: "40px",
            minWidth: "120px",
            fontWeight: 500,
            background: isDeleteLoading
              ? undefined
              : "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
            border: "none",
            boxShadow: !isDeleteLoading
              ? "0 2px 8px rgba(255, 77, 79, 0.3)"
              : undefined,
          }}
        >
          {isDeleteLoading ? "Удаление..." : "Удалить"}
        </Button>,
      ]}
    >
      <div style={{ marginTop: "8px", marginBottom: "16px" }}>
        {/* <ExclamationCircleOutlined
          style={{
            fontSize: "48px",
            color: "#ff4d4f",
            marginBottom: "16px",
            display: "block",
          }}
        /> */}
        <Text
          style={{
            fontSize: "16px",
            color: "#090909",
            lineHeight: "1.5",
            display: "block",
          }}
        >
          Вы уверены, что хотите удалить этот элемент?
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: "#8c8c8c",
            marginTop: "8px",
            display: "block",
          }}
        >
          Это действие нельзя будет отменить.
        </Text>
      </div>
    </Modal>
  );
};
