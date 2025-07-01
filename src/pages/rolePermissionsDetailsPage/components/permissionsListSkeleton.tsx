"use client";

import type React from "react";
import { List, Skeleton, Space } from "antd";

interface PermissionsListSkeletonProps {
  count?: number;
}

export const PermissionsListSkeleton: React.FC<
  PermissionsListSkeletonProps
> = ({ count = 5 }) => {
  return (
    <List
      style={{ marginLeft: 24 }}
      dataSource={Array.from({ length: count }, (_, index) => index)}
      renderItem={(index) => (
        <List.Item
          key={index}
          style={{
            paddingLeft: "16px",
            marginBottom: "8px",
            backgroundColor: "#fff",
            border: "1px solid #f0f0f0",
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <Space>
                <Skeleton.Button
                  active
                  size="small"
                  style={{ width: 16, height: 16 }}
                />
                <Skeleton.Input active size="small" style={{ width: 200 }} />
              </Space>
            </div>

            <div style={{ flex: 1, textAlign: "center" }}>
              <Skeleton.Input active size="small" style={{ width: 150 }} />
            </div>

            <Space
              size="middle"
              style={{ flex: 1, justifyContent: "flex-end" }}
            >
              <Space>
                <Skeleton.Button
                  active
                  size="small"
                  style={{ width: 16, height: 16 }}
                />
                <Skeleton.Input active size="small" style={{ width: 80 }} />
              </Space>
              <Space>
                <Skeleton.Button
                  active
                  size="small"
                  style={{ width: 16, height: 16 }}
                />
                <Skeleton.Input active size="small" style={{ width: 80 }} />
              </Space>
              <Space>
                <Skeleton.Button
                  active
                  size="small"
                  style={{ width: 16, height: 16 }}
                />
                <Skeleton.Input active size="small" style={{ width: 80 }} />
              </Space>
            </Space>
          </div>
        </List.Item>
      )}
    />
  );
};
