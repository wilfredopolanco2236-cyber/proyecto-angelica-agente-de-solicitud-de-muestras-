import { Confidence, Intent } from '../../types';
import { AngelicaContext } from '../context_builder';

export interface ExtractedEntities {
  cliente?: string;
  producto?: string;
  cantidad?: number;
  unidad?: string;
  numeroSolicitud?: string;
  itemSelector?: string;
}

export interface IntentDecision {
  goal: string;
  primaryIntent: Intent;
  secondaryIntents: Intent[];
  confidence: Confidence;
  entities: ExtractedEntities;
  missingSlots: string[];
  replyHint: string;
  riskLevel: 'low' | 'medium' | 'high';
}

const STATUS_REGEX = /sm[-\s]?\d{8}[-\s]?[a-z]{3}[-\s]?\d{4}/i;
const QUANTITY_REGEX = /(\d+(?:[\.,]\d+)?)\s*(gramos|g|ml|kg|unidad|und|onza|onzas|pza)/i;
const NUMERIC_PRODUCT_TOKENS = ['dc-90', '99%', '99.9%', 'peg 400', 'd-3', '20/410', '#0', '#1', '#2', '#00'];

function detectIntent(text: string): Intent {
  if (/\b(ayuda|help)\b/.test(text)) return 'HELP';
  if (/\b(hola|buenas|hello)\b/.test(text)) return 'GREET';
  if (/\b(solo eso|listo|termina|finaliza|eso es todo)\b/.test(text)) return 'FINISH_DRAFT';
  if (/\b(ver solicitud|muestra borrador|resumen|que llevo|como va)\b/.test(text)) return 'SHOW_DRAFT';
  if (/\b(quita|elimina|borra|saca)\b/.test(text)) return 'REMOVE_ITEM';
  if (/\b(cambia|modifica|corrige|mejor|era|sustituye)\b/.test(text)) return 'UPDATE_ITEM';
  if (/\b(estado)\b/.test(text) || STATUS_REGEX.test(text)) return 'CHECK_STATUS';
  if (/\b(quiero solicitar|nueva solicitud|solicitud de muestras|necesito una muestra|hazme una solicitud)\b/.test(text)) return 'START_SAMPLE_REQUEST';
  if (/\b(para |cliente )/.test(text)) return 'SET_CLIENT';
  if (QUANTITY_REGEX.test(text)) return 'ADD_ITEM';
  return 'UNKNOWN';
}

function safeTrim(value?: string): string | undefined {
  if (!value) return undefined;
  const cleaned = value.trim().replace(/^de\s+/i, '').trim();
  return cleaned.length ? cleaned : undefined;
}

function extractProduct(text: string): string | undefined {
  const fromDe = text.match(/(?:de|producto)\s+([a-z0-9 .\-/%#]+)/i);
  const candidate = safeTrim(fromDe?.[1]);

  if (candidate) return candidate;

  for (const token of NUMERIC_PRODUCT_TOKENS) {
    if (text.includes(token)) {
      return token;
    }
  }

  return undefined;
}

function extractEntities(text: string): ExtractedEntities {
  const entities: ExtractedEntities = {};

  const statusMatch = text.match(STATUS_REGEX);
  if (statusMatch) {
    entities.numeroSolicitud = statusMatch[0].toUpperCase().replace(/\s+/g, '-');
  }

  const quantityMatch = text.match(QUANTITY_REGEX);
  if (quantityMatch) {
    entities.cantidad = Number(quantityMatch[1].replace(',', '.'));
    entities.unidad = quantityMatch[2].toUpperCase();
  }

  const clientMatch = text.match(/(?:para|cliente)\s+([a-z0-9 .-]+)/i);
  if (clientMatch) {
    entities.cliente = safeTrim(clientMatch[1]);
  }

  const removeOrUpdateMatch = text.match(/(?:quita|elimina|borra|cambia|modifica)\s+([a-z0-9 .\-/%#]+)/i);
  if (removeOrUpdateMatch) {
    entities.itemSelector = safeTrim(removeOrUpdateMatch[1]);
  }

  entities.producto = extractProduct(text);

  return entities;
}

function goalFromIntent(intent: Intent): string {
  switch (intent) {
    case 'START_SAMPLE_REQUEST':
      return 'start_sample_request';
    case 'SET_CLIENT':
      return 'set_client';
    case 'ADD_ITEM':
      return 'add_item_to_draft';
    case 'FINISH_DRAFT':
      return 'finish_draft_and_prepare_review';
    case 'CHECK_STATUS':
      return 'check_request_status';
    case 'REMOVE_ITEM':
      return 'remove_item_from_draft';
    case 'UPDATE_ITEM':
      return 'update_draft_item';
    default:
      return 'understand_and_continue';
  }
}

function getRiskLevel(intent: Intent): 'low' | 'medium' | 'high' {
  if (intent === 'FINISH_DRAFT' || intent === 'UPDATE_ITEM') return 'medium';
  return 'low';
}

export function classifyIntent(context: AngelicaContext): IntentDecision {
  const primaryIntent = detectIntent(context.normalizedText);
  const entities = extractEntities(context.normalizedText);

  const missingSlots: string[] = [];
  if (primaryIntent === 'START_SAMPLE_REQUEST' && !entities.cliente) {
    missingSlots.push('cliente');
  }

  if (primaryIntent === 'ADD_ITEM') {
    if (!entities.cantidad) missingSlots.push('cantidad');
    if (!entities.unidad) missingSlots.push('unidad');
  }

  if ((primaryIntent === 'REMOVE_ITEM' || primaryIntent === 'UPDATE_ITEM') && !entities.itemSelector) {
    missingSlots.push('item_selector');
  }

  const confidence: Confidence = primaryIntent === 'UNKNOWN' ? 'low' : missingSlots.length > 0 ? 'medium' : 'high';

  return {
    goal: goalFromIntent(primaryIntent),
    primaryIntent,
    secondaryIntents: [],
    confidence,
    entities,
    missingSlots,
    replyHint: 'contextual_short_reply',
    riskLevel: getRiskLevel(primaryIntent)
  };
}
