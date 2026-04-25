import { routeWhatsappThroughAngelica } from './api/whatsappInbound';
import { UserContext } from './types';

export const APP_NAME = 'angelica-subagent';

export function bootstrapMessage(): string {
  return 'Angelica subagent bootstrap complete';
}

export function runSampleInbound(message: string) {
  const user: UserContext = {
    phone: '+18090000000',
    roles: ['VENDEDOR'],
    permissions: ['create_request']
  };

  return routeWhatsappThroughAngelica(
    {
      messageId: 'sample-001',
      phone: user.phone,
      messageType: 'text',
      text: message
    },
    user
  );
}
