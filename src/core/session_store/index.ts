import { ConversationState } from '../../types';

export interface DraftItem {
  producto: string;
  cantidad: number;
  unidad: string;
}

export interface DraftData {
  client?: string;
  items: DraftItem[];
}

export interface SessionTurn {
  traceId: string;
  input: string;
  intent: string;
  at: string;
}

export interface SessionData {
  phone: string;
  state: ConversationState;
  draft: DraftData;
  turns: SessionTurn[];
  updatedAt: string;
}

const sessionStore = new Map<string, SessionData>();

export function getSession(phone: string): SessionData {
  const existing = sessionStore.get(phone);
  if (existing) return existing;

  const created: SessionData = {
    phone,
    state: 'NO_ACTIVE_FLOW',
    draft: { items: [] },
    turns: [],
    updatedAt: new Date().toISOString()
  };
  sessionStore.set(phone, created);
  return created;
}

export function appendTurn(phone: string, turn: SessionTurn): void {
  const session = getSession(phone);
  session.turns = [...session.turns.slice(-9), turn];
  saveSession(session);
}

export function saveSession(next: SessionData): SessionData {
  next.updatedAt = new Date().toISOString();
  sessionStore.set(next.phone, next);
  return next;
}

export function clearSession(phone: string): void {
  sessionStore.delete(phone);
}
