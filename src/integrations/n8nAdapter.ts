export function buildN8nHeaders(secret: string): Record<string, string> {
  return {
    'x-angelica-secret': secret,
    'content-type': 'application/json'
  };
}
