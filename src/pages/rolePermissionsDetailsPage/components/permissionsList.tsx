import type React from "react";
import { List } from "antd";
import { PermissionItem } from "./permissionItem";

interface PermissionsListProps {
  permissions: any[];
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

export const PermissionsList: React.FC<PermissionsListProps> = ({
  permissions,
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
  return (
    <List
      style={{ marginLeft: 24 }}
      dataSource={permissions}
      renderItem={(permission) => (
        <PermissionItem
          key={permission.permission_id}
          permission={permission}
          restrictions={restrictions}
          assignedPermissions={assignedPermissions}
          assignedPermissionIds={assignedPermissionIds}
          assignedRestrictionIds={assignedRestrictionIds}
          selectedPermissions={selectedPermissions}
          selectedRestrictions={selectedRestrictions}
          isEditing={isEditing}
          onPermissionChange={onPermissionChange}
          onRestrictionChange={onRestrictionChange}
          onSelectAllRestrictions={onSelectAllRestrictions}
        />
      )}
    />
  );
};
