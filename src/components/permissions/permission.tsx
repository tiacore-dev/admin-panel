// components/Permission.tsx
import { usePermissions } from "../../context/permissionsContext";

export const ShowIf: React.FC<{
  has: string | string[];
  children: React.ReactNode;
}> = ({ has, children }) => {
  const { hasPermission } = usePermissions();

  const requiredPermissions = Array.isArray(has) ? has : [has];
  const hasAllPermissions = requiredPermissions.every(hasPermission);

  return hasAllPermissions ? <>{children}</> : null;
};

export const HideIf: React.FC<{
  has: string | string[];
  children: React.ReactNode;
}> = ({ has, children }) => {
  const { hasPermission } = usePermissions();

  const requiredPermissions = Array.isArray(has) ? has : [has];
  const hasAnyPermission = requiredPermissions.some(hasPermission);

  return hasAnyPermission ? null : <>{children}</>;
};
