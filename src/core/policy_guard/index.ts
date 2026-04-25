export function canExecute(role: string, tool: string): boolean {
  if (tool.startsWith('allowlist.') && role !== 'ADMINISTRADOR') {
    return false;
  }

  return true;
}
