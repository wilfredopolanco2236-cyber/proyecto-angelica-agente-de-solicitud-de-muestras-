import { UserContext } from '../../types';
import { checkPolicy } from '../policy_guard';
import { TOOL_REGISTRY } from '../../tools/registry';

export interface Action {
  tool: string;
  args: Record<string, unknown>;
}

export interface ExecutionResult {
  ok: boolean;
  tool: string;
  message: string;
}

export function executeActions(actions: Action[], user: UserContext): ExecutionResult[] {
  return actions.map((action) => {
    if (!TOOL_REGISTRY.includes(action.tool)) {
      return {
        ok: false,
        tool: action.tool,
        message: 'Tool not registered'
      };
    }

    const policy = checkPolicy(user, action.tool);
    if (!policy.allowed) {
      return {
        ok: false,
        tool: action.tool,
        message: policy.reason ?? 'Policy denied execution'
      };
    }

    return {
      ok: true,
      tool: action.tool,
      message: `Executed ${action.tool}`
    };
  });
}
