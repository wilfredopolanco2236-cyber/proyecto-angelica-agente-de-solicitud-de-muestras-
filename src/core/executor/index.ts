export interface ExecutionResult {
  ok: boolean;
  message: string;
}

export function executeTool(tool: string): ExecutionResult {
  return { ok: true, message: `Executed ${tool}` };
}
