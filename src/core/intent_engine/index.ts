export interface IntentDecision {
  primaryIntent: string;
  confidence: 'high' | 'medium' | 'low';
}

export function classifyIntent(text: string): IntentDecision {
  if (/muestra|solicitud/i.test(text)) {
    return { primaryIntent: 'START_SAMPLE_REQUEST', confidence: 'high' };
  }

  return { primaryIntent: 'UNKNOWN', confidence: 'low' };
}
