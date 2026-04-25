import { ConversationState, UserContext } from '../../types';

export interface ConversationMemory {
  state: ConversationState;
  lastQuestion?: string;
  pendingProduct?: string;
  draftId?: string;
}

export interface AngelicaContext {
  traceId: string;
  user: UserContext;
  memory: ConversationMemory;
  normalizedText: string;
  timestampIso: string;
}

export interface BuildContextInput {
  traceId: string;
  rawText: string;
  user: UserContext;
  memory?: Partial<ConversationMemory>;
  timestamp?: Date;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function buildContext(input: BuildContextInput): AngelicaContext {
  return {
    traceId: input.traceId,
    user: input.user,
    normalizedText: normalizeText(input.rawText),
    timestampIso: (input.timestamp ?? new Date()).toISOString(),
    memory: {
      state: input.memory?.state ?? 'NO_ACTIVE_FLOW',
      lastQuestion: input.memory?.lastQuestion,
      pendingProduct: input.memory?.pendingProduct,
      draftId: input.memory?.draftId
    }
  };
}
