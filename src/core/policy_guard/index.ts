import { UserContext } from '../../types';

export interface PolicyCheckResult {
  allowed: boolean;
  reason?: string;
}

const TOOL_PERMISSIONS: Record<string, string[]> = {
  'allowlist.add': ['manage_allowlist'],
  'allowlist.update': ['manage_allowlist'],
  'allowlist.revoke': ['manage_allowlist'],
  'request.approve': ['approve_request'],
  'request.reject': ['approve_request'],
  'pdf.validate_signed': ['approve_request']
};

function isManagementRole(roles: string[]): boolean {
  return roles.includes('GERENCIA_ADMIN');
}

export function checkPolicy(user: UserContext, tool: string): PolicyCheckResult {
  const requiredPermissions = TOOL_PERMISSIONS[tool];

  if (tool.startsWith('request.approve') || tool === 'pdf.validate_signed') {
    if (!isManagementRole(user.roles)) {
      return { allowed: false, reason: 'Only management can approve or validate signed requests' };
    }
  }

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return { allowed: true };
  }

  const missing = requiredPermissions.filter((permission) => !user.permissions.includes(permission));
  if (missing.length > 0) {
    return { allowed: false, reason: `Missing permissions: ${missing.join(', ')}` };
  }

  return { allowed: true };
}
