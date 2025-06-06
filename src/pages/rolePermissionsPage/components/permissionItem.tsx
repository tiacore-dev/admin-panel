// src/components/rolePermissions/PermissionItem.tsx
import React from "react";
import { List, Checkbox } from "antd";
import { IPermission } from "../../../api/permissionsApi";

interface PermissionItemProps {
  permission: IPermission;
  isLinked: boolean;
  isEditing: boolean;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
}

export const PermissionItem: React.FC<PermissionItemProps> = ({
  permission,
  isLinked,
  isEditing,
  onPermissionChange,
}) => (
  <List.Item
    style={
      !isEditing && isLinked
        ? { borderLeft: "4px solid rgba(24, 143, 255, 0.56)" }
        : { borderLeft: "4px solid rgba(145, 148, 151, 0.17)" }
    }
  >
    <Checkbox
      checked={isLinked}
      onChange={(e) =>
        onPermissionChange(permission.permission_id, e.target.checked)
      }
      disabled={!isEditing}
      style={!isEditing ? { pointerEvents: "none", opacity: 1 } : {}}
    >
      <span style={{ color: "black" }}>
        {permission.permission_name}
        {permission.comment && (
          <span style={{ marginLeft: "8px" }}>({permission.comment})</span>
        )}
      </span>
    </Checkbox>
  </List.Item>
);
