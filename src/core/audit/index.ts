export interface AuditEvent {
  traceId: string;
  phone: string;
  intent: string;
  stateBefore: string;
  stateAfter: string;
  actions: string[];
  timestamp: string;
}

const events: AuditEvent[] = [];

export function logAudit(event: AuditEvent): string {
  events.push(event);
  return `AUD-${events.length.toString().padStart(6, '0')}`;
}

export function listAudit(): AuditEvent[] {
  return [...events];
}
