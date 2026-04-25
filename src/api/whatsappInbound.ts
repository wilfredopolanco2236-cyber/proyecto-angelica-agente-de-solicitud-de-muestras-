import { logAudit } from '../core/audit';
import { buildContext } from '../core/context_builder';
import { runOrchestrator } from '../core/orchestrator';
import { appendTurn, getSession, saveSession } from '../core/session_store';
import { ConversationState, UserContext } from '../types';

export interface InboundPayload {
  text?: string;
  messageType: 'text' | 'voice' | 'document';
  messageId: string;
  phone: string;
}

export interface InboundResponse {
  traceId: string;
  goal: string;
  intent: string;
  confidence: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  nextState: ConversationState;
  needsConfirmation: boolean;
  userReply: string;
  executions: { ok: boolean; tool: string; message: string; data?: Record<string, unknown> }[];
  duplicateMessage: boolean;
  auditRef?: string;
}

const processedMessages = new Set<string>();

export function routeWhatsappThroughAngelica(
  payload: InboundPayload,
  user: UserContext,
  currentState?: ConversationState
): InboundResponse {
  const traceId = `${payload.messageId}:${payload.phone}`;

  if (processedMessages.has(payload.messageId)) {
    return {
      traceId,
      goal: 'idempotent_noop',
      intent: 'UNKNOWN',
      confidence: 'low',
      riskLevel: 'low',
      nextState: currentState ?? 'NO_ACTIVE_FLOW',
      needsConfirmation: false,
      userReply: 'Mensaje duplicado detectado. No repetí acciones.',
      executions: [],
      duplicateMessage: true
    };
  }

  processedMessages.add(payload.messageId);

  const session = getSession(payload.phone);
  const stateBefore = currentState ?? session.state;

  const context = buildContext({
    traceId,
    rawText: payload.text ?? '',
    user,
    memory: { state: stateBefore }
  });

  const orchestration = runOrchestrator(context);
  session.state = orchestration.nextState as ConversationState;
  saveSession(session);

  appendTurn(payload.phone, {
    traceId,
    input: payload.text ?? '',
    intent: orchestration.intent,
    at: new Date().toISOString()
  });

  const auditRef = logAudit({
    traceId,
    phone: payload.phone,
    intent: orchestration.intent,
    stateBefore,
    stateAfter: orchestration.nextState,
    actions: orchestration.executions.map((execution) => execution.tool),
    timestamp: new Date().toISOString()
  });

  return {
    traceId,
    goal: orchestration.goal,
    intent: orchestration.intent,
    confidence: orchestration.confidence,
    riskLevel: orchestration.riskLevel,
    nextState: orchestration.nextState as ConversationState,
    needsConfirmation: orchestration.needsConfirmation,
    userReply: orchestration.userReply,
    executions: orchestration.executions,
    duplicateMessage: false,
    auditRef
  };
}
