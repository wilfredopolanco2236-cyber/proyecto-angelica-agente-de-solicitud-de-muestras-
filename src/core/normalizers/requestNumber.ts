export function normalizeRequestNumber(input: string): string {
  const compact = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const match = compact.match(/SM(\d{8})([A-Z]{3})(\d{4})/);

  if (!match) {
    return input.toUpperCase();
  }

  const [, date, day, seq] = match;
  return `SM-${date}-${day}-${seq}`;
}
