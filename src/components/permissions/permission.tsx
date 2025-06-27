// components/Permission.tsx

export const ShowIf: React.FC<{
  has: string | string[];
  children: React.ReactNode;
}> = ({ has, children }) => {
  const requiredPermissions = Array.isArray(has) ? has : [has];
  const hasAllPermissions = requiredPermissions;

  return hasAllPermissions ? <>{children}</> : null;
};

export const HideIf: React.FC<{
  has: string | string[];
  children: React.ReactNode;
}> = ({ has, children }) => {
  const requiredPermissions = Array.isArray(has) ? has : [has];
  const hasAnyPermission = requiredPermissions;

  return hasAnyPermission ? null : <>{children}</>;
};
