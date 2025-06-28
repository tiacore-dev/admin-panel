"use client";

import type React from "react";
import { Checkbox, Typography, Space, Button, Card, Tag } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useAppsMap } from "../../../hooks/base/useAppHelpers";

const { Text } = Typography;

interface PermissionItemProps {
  permission: any;
  restrictions: any[];
  assignedPermissions: any[];
  assignedPermissionIds: string[];
  assignedRestrictionIds: string[];
  selectedPermissions: string[];
  selectedRestrictions: Record<string, string[]>;
  isEditing: boolean;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onRestrictionChange: (
    permissionId: string,
    restrictionId: string,
    checked: boolean
  ) => void;
  onSelectAllRestrictions: (permissionId: string, checked: boolean) => void;
}

export const PermissionItem: React.FC<PermissionItemProps> = ({
  permission,
  restrictions,
  assignedPermissions,
  assignedPermissionIds,
  assignedRestrictionIds,
  selectedPermissions,
  selectedRestrictions,
  isEditing,
  onPermissionChange,
  onRestrictionChange,
  onSelectAllRestrictions,
}) => {
  const appsMap = useAppsMap();
  const isPermissionSelected = selectedPermissions.includes(
    permission.permission_id
  );
  const isPermissionAssigned = assignedPermissionIds.includes(
    permission.permission_id
  );

  // Находим связанное разрешение для получения application_id
  const relatedPermission = assignedPermissions.find(
    (p) => p.permission_id === permission.permission_id
  );
  const applicationName = relatedPermission?.application_id
    ? appsMap.get(relatedPermission.application_id)
    : null;

  const hasActiveRestrictions = restrictions.some((restriction) =>
    assignedPermissions.some(
      (p) =>
        p.permission_id === permission.permission_id &&
        p.restriction_id === restriction.restriction_id
    )
  );

  return (
    <Card
      size="small"
      style={{
        marginBottom: 12,
        borderLeft: isPermissionAssigned
          ? "4px solid #52c41a"
          : "4px solid transparent",
        backgroundColor: isPermissionAssigned ? "#f6ffed" : "#fff",
      }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        {/* Основная информация о разрешении */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <Checkbox
                checked={isPermissionSelected}
                onChange={(e) => {
                  console.log(
                    "Checkbox clicked:",
                    permission.permission_id,
                    e.target.checked
                  );
                  onPermissionChange(
                    permission.permission_id,
                    e.target.checked
                  );
                }}
              >
                <Text strong={isPermissionSelected}>
                  {permission.permission_name}
                </Text>
              </Checkbox>
            ) : (
              <Space>
                <CheckCircleOutlined
                  style={{
                    color: isPermissionAssigned ? "#52c41a" : "#d9d9d9",
                  }}
                />
                <Text strong={isPermissionAssigned}>
                  {permission.permission_name}
                </Text>
                {isPermissionAssigned && hasActiveRestrictions && (
                  <Tag color="orange" icon={<ExclamationCircleOutlined />}>
                    С ограничениями
                  </Tag>
                )}
              </Space>
            )}
          </div>

          {applicationName && (
            <Tag color="blue" icon={<AppstoreOutlined />}>
              {applicationName}
            </Tag>
          )}
        </div>

        {/* Комментарий к разрешению */}
        {/* {permission.comment && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            {permission.comment}
          </Text>
        )} */}

        {/* Ограничения */}
        {restrictions.length > 0 && (
          <div>
            <Text
              type="secondary"
              style={{ fontSize: 12, marginBottom: 8, display: "block" }}
            >
              Ограничения:
            </Text>
            <Space wrap size="small">
              {restrictions.map((restriction) => {
                const isRestrictionActive =
                  assignedRestrictionIds.includes(restriction.restriction_id) &&
                  assignedPermissions.some(
                    (p) =>
                      p.permission_id === permission.permission_id &&
                      p.restriction_id === restriction.restriction_id
                  );

                const isRestrictionSelected =
                  selectedRestrictions[permission.permission_id]?.includes(
                    restriction.restriction_id
                  ) || false;

                if (isEditing && isPermissionSelected) {
                  return (
                    <Checkbox
                      key={restriction.restriction_id}
                      checked={isRestrictionSelected}
                      onChange={(e) => {
                        console.log(
                          "Restriction checkbox clicked:",
                          restriction.restriction_id,
                          e.target.checked
                        );
                        onRestrictionChange(
                          permission.permission_id,
                          restriction.restriction_id,
                          e.target.checked
                        );
                      }}
                      // size="small"
                    >
                      <Text style={{ fontSize: 12 }}>
                        {restriction.restriction_name}
                      </Text>
                    </Checkbox>
                  );
                } else {
                  return (
                    <Tag
                      key={restriction.restriction_id}
                      color={isRestrictionActive ? "orange" : "default"}
                      style={{ fontSize: 11 }}
                    >
                      {restriction.restriction_name}
                    </Tag>
                  );
                }
              })}
            </Space>

            {/* Кнопка выбора всех ограничений */}
            {isEditing && isPermissionSelected && restrictions.length > 1 && (
              <div style={{ marginTop: 8 }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    const currentRestrictions =
                      selectedRestrictions[permission.permission_id] || [];
                    const shouldSelectAll =
                      currentRestrictions.length !== restrictions.length;
                    onSelectAllRestrictions(
                      permission.permission_id,
                      shouldSelectAll
                    );
                  }}
                  style={{ padding: 0, height: "auto", fontSize: 11 }}
                >
                  {selectedRestrictions[permission.permission_id]?.length ===
                  restrictions.length
                    ? "Снять все ограничения"
                    : "Выбрать все ограничения"}
                </Button>
              </div>
            )}
          </div>
        )}
      </Space>
    </Card>
  );
};
