import { UserContext } from '../../types';
import { checkPolicy } from '../policy_guard';
import { TOOL_REGISTRY } from '../../tools/registry';
import { TOOL_HANDLERS } from '../../tools/handlers';

export interface Action {
  tool: string;
  args: Record<string, unknown>;
}

export interface ExecutionResult {
  ok: boolean;
  tool: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface ExecutorContext {
  phone: string;
}

export function executeActions(actions: Action[], user: UserContext, context: ExecutorContext): ExecutionResult[] {
  return actions.map((action) => {
    if (!TOOL_REGISTRY.includes(action.tool)) {
      return {
        ok: false,
        tool: action.tool,
        message: 'Tool not registered'
      };
    }

    const policy = checkPolicy(user, action.tool, action.args);
    if (!policy.allowed) {
      return {
        ok: false,
        tool: action.tool,
        message: policy.reason ?? 'Policy denied execution'
      };
    }

    const handler = TOOL_HANDLERS[action.tool];
    if (!handler) {
      return {
        ok: false,
        tool: action.tool,
        message: 'Tool has no handler implementation yet'
      };
    }

    const result = handler(action.args, { phone: context.phone });
    return {
      ok: result.ok,
      tool: action.tool,
      message: result.message ?? `Executed ${action.tool}`,
      data: result.data
    };
  });
}
