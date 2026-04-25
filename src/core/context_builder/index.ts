export interface AngelicaContext {
  userId?: string;
  roles: string[];
  conversationState: string;
}

export function buildContext(): AngelicaContext {
  return {
    roles: [],
    conversationState: 'NO_ACTIVE_FLOW'
  };
}
