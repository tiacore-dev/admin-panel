"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Space } from "antd";
import { RightOutlined, HomeOutlined } from "@ant-design/icons";

interface ContextualNavigationProps {
  textColor?: string;
  size?: "small" | "default" | "large";
  showIcon?: boolean;
  separator?: "arrow" | "slash";
}

export const ContextualNavigation: React.FC<ContextualNavigationProps> = ({
  textColor = "#8c8c8c",
  size = "default",
  showIcon = false,
  separator = "arrow",
}) => {
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumbs.paths
  );

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  const fontSize = size === "small" ? 12 : size === "large" ? 16 : 14;
  const iconSize = size === "small" ? 12 : size === "large" ? 16 : 14;

  const separatorElement =
    separator === "arrow" ? (
      <RightOutlined
        style={{ fontSize: iconSize - 2, color: textColor, opacity: 0.6 }}
      />
    ) : (
      <span style={{ color: textColor, opacity: 0.6, fontSize: fontSize }}>
        /
      </span>
    );

  return (
    <div style={{ marginBottom: 4 }}>
      <Space size={4} wrap>
        {breadcrumbs.map((path, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <React.Fragment key={index}>
              {isFirst && showIcon && (
                <HomeOutlined
                  style={{ fontSize: iconSize, color: textColor, opacity: 0.8 }}
                />
              )}

              {isLast ? (
                <span
                  style={{
                    color: textColor,
                    fontSize: fontSize,
                    fontWeight: 500,
                    opacity: 0.9,
                  }}
                >
                  {path.label}
                </span>
              ) : (
                <Link
                  to={path.to}
                  style={{
                    color: textColor,
                    fontSize: fontSize,
                    textDecoration: "none",
                    opacity: 0.7,
                    transition: "opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.textDecoration = "underline";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0.7";
                    e.currentTarget.style.textDecoration = "none";
                  }}
                >
                  {path.label}
                </Link>
              )}

              {!isLast && separatorElement}
            </React.Fragment>
          );
        })}
      </Space>
    </div>
  );
};
