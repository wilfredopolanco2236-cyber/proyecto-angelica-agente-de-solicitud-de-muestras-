import { buildContext } from '../core/context_builder';
import { classifyIntent } from '../core/intent_engine';
import { buildPlan } from '../core/planner';
import { executeActions } from '../core/executor';
import { ConversationState, UserContext } from '../types';

export interface InboundPayload {
  text?: string;
  messageType: 'text' | 'voice' | 'document';
  messageId: string;
  phone: string;
}

export interface InboundResponse {
  traceId: string;
  intent: string;
  confidence: 'high' | 'medium' | 'low';
  nextState: ConversationState;
  executions: { ok: boolean; tool: string; message: string }[];
}

export function routeWhatsappThroughAngelica(
  payload: InboundPayload,
  user: UserContext,
  currentState: ConversationState = 'NO_ACTIVE_FLOW'
): InboundResponse {
  const traceId = `${payload.messageId}:${payload.phone}`;

  const context = buildContext({
    traceId,
    rawText: payload.text ?? '',
    user,
    memory: { state: currentState }
  });

  const decision = classifyIntent(context);
  const plan = buildPlan(decision, currentState);
  const executions = executeActions(
    plan.actions.map((action) => ({ tool: action.tool, args: action.args })),
    user
  );

  return {
    traceId,
    intent: decision.primaryIntent,
    confidence: decision.confidence,
    nextState: plan.nextState,
    executions
  };
}
