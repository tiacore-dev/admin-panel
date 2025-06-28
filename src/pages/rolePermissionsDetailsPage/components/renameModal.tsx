import type React from "react";
import { Modal, Input } from "antd";

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
      title="Переименовать роль"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      confirmLoading={isLoading}
    >
      <Input
        value={newRoleName}
        onChange={(e) => onRoleNameChange(e.target.value)}
        placeholder="Введите новое название роли"
      />
    </Modal>
  );
};
