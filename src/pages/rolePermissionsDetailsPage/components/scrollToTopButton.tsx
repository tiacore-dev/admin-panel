import type React from "react";
import { Button } from "antd";
import { UpOutlined } from "@ant-design/icons";

interface ScrollToTopButtonProps {
  show: boolean;
  onClick: () => void;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({
  show,
  onClick,
}) => {
  if (!show) return null;

  return (
    <Button
      type="primary"
      shape="circle"
      size="large"
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "50px",
        right: "50px",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
      icon={<UpOutlined />}
    />
  );
};
