// renderFooter.tsx
import { Button, Space } from "antd";
import React from "react";

interface FooterProps {
  mode: "create" | "edit";
  showAllFields: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  handleNext: () => void;
}

export const renderFooter = ({
  mode,
  showAllFields,
  isSubmitting,
  onCancel,
  handleBack,
  handleSubmit,
  handleNext,
}: FooterProps) => {
  if (mode === "edit") {
    return (
      <Space>
        <Button key="back" onClick={onCancel}>
          Отменить
        </Button>
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Сохранить
        </Button>
      </Space>
    );
  }

  if (showAllFields) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button key="back" onClick={handleBack}>
          Назад
        </Button>
        <Space align="end">
          <Button key="cancel" onClick={onCancel}>
            Отменить
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            Добавить
          </Button>
        </Space>
      </div>
    );
  }

  return (
    <Space align="end">
      <Button key="back" onClick={onCancel}>
        Отменить
      </Button>
      <Button key="next" type="primary" onClick={handleNext}>
        Далее
      </Button>
    </Space>
  );
};
