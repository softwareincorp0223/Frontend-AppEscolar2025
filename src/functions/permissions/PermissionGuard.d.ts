import type { ReactNode } from "react";

export function hasPermission(permissionKey?: string | null): boolean;

export default function PermissionGuard(props: {
  children: ReactNode;
}): JSX.Element | null;
