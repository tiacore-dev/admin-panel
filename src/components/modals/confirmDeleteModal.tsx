import React, { useEffect } from "react";
import { Modal, Button } from "antd"; // Импорт компонентов Ant Design

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
      title=""
      open={true}
      onOk={onConfirm}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isDeleteLoading}>
          Отмена
        </Button>,
        <Button
          key="delete"
          danger
          onClick={onConfirm}
          loading={isDeleteLoading}
          disabled={isDeleteLoading}
        >
          {isDeleteLoading ? "Удаление..." : "Удалить"}
        </Button>,
      ]}
    >
      <p>Вы уверены, что хотите удалить?</p>
    </Modal>
  );
};
