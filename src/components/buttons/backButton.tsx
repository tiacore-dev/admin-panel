"use client";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      type="default"
      onClick={() => navigate(-1)}
      size="large"
      icon={<LeftOutlined />}
      style={{
        margin: "16px",
        borderRadius: "8px",
        height: "40px",
        minWidth: "140px",
        fontWeight: 500,
        border: "1px solid #d9d9d9",
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        color: "#475569",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      }}
      onMouseEnter={(e) => {
        const target = e.target as HTMLElement;
        target.style.background =
          "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)";
        target.style.borderColor = "#94a3b8";
        target.style.color = "#334155";
        target.style.transform = "translateY(-1px)";
        target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLElement;
        target.style.background =
          "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)";
        target.style.borderColor = "#d9d9d9";
        target.style.color = "#475569";
        target.style.transform = "translateY(0)";
        target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
      }}
      onMouseDown={(e) => {
        const target = e.target as HTMLElement;
        target.style.transform = "translateY(0)";
        target.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.1)";
      }}
      onMouseUp={(e) => {
        const target = e.target as HTMLElement;
        target.style.transform = "translateY(-1px)";
        target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
    >
      Вернуться назад
    </Button>
  );
};
