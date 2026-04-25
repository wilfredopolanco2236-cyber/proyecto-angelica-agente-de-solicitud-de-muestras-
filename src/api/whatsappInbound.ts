export interface InboundPayload {
  text?: string;
  messageType: 'text' | 'voice' | 'document';
  messageId: string;
  phone: string;
}

export function routeWhatsappThroughAngelica(payload: InboundPayload): string {
  return `Received ${payload.messageType} message ${payload.messageId} from ${payload.phone}`;
}
