"use client";

import type React from "react";
import { Skeleton, Space } from "antd";

export const RoleHeaderSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
    >
      <Skeleton.Input active size="large" style={{ width: 200 }} />

      <Space>
        <Skeleton.Button active style={{ width: 120 }} />
        <Skeleton.Button active style={{ width: 100 }} />
      </Space>
    </div>
  );
};
