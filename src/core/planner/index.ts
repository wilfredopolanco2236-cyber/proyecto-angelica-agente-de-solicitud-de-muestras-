export interface PlannedAction {
  tool: string;
  args: Record<string, unknown>;
}

export function buildPlan(intent: string): PlannedAction[] {
  if (intent === 'START_SAMPLE_REQUEST') {
    return [{ tool: 'draft.create', args: {} }];
  }

  return [];
}
