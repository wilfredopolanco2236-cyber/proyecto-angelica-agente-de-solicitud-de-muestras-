export interface AllowlistEntry {
  phone: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

const allowlist = new Map<string, AllowlistEntry>();

export function upsertAllowlist(entry: AllowlistEntry): AllowlistEntry {
  allowlist.set(entry.phone, entry);
  return entry;
}

export function revokeAllowlist(phone: string): boolean {
  return allowlist.delete(phone);
}

export function getAllowlist(phone: string): AllowlistEntry | undefined {
  return allowlist.get(phone);
}

export function listAllowlist(): AllowlistEntry[] {
  return Array.from(allowlist.values());
}
