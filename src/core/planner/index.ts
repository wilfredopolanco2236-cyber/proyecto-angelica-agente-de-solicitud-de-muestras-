import { IntentDecision } from '../intent_engine';
import { ConversationState } from '../../types';

export interface PlannedAction {
  tool: string;
  args: Record<string, unknown>;
  reason: string;
}

export interface PlanResult {
  actions: PlannedAction[];
  nextState: ConversationState;
}

export function buildPlan(decision: IntentDecision, currentState: ConversationState): PlanResult {
  switch (decision.primaryIntent) {
    case 'START_SAMPLE_REQUEST':
      return {
        actions: [{ tool: 'draft.create', args: {}, reason: 'Start request flow' }],
        nextState: decision.missingSlots.includes('cliente') ? 'AWAITING_CLIENT' : 'AWAITING_PRODUCT'
      };

    case 'SET_CLIENT':
      return {
        actions: [{ tool: 'draft.set_client', args: { cliente: decision.entities.cliente }, reason: 'Set client in draft' }],
        nextState: 'AWAITING_PRODUCT'
      };

    case 'ADD_ITEM':
      return {
        actions: [
          {
            tool: 'catalog.search',
            args: { query: decision.entities.producto ?? 'from_message' },
            reason: 'Resolve product against catalog'
          },
          {
            tool: 'draft.add_item',
            args: {
              cantidad: decision.entities.cantidad,
              unidad: decision.entities.unidad
            },
            reason: 'Add resolved item to active draft'
          }
        ],
        nextState: 'AWAITING_PRODUCT'
      };

    case 'FINISH_DRAFT':
      return {
        actions: [{ tool: 'draft.finish', args: {}, reason: 'Close capture and show review summary' }],
        nextState: 'DRAFT_READY_FOR_REVIEW'
      };

    case 'CHECK_STATUS':
      return {
        actions: [
          {
            tool: 'request.status',
            args: { numeroSolicitud: decision.entities.numeroSolicitud },
            reason: 'Retrieve request status'
          }
        ],
        nextState: currentState
      };

    case 'SHOW_DRAFT':
      return {
        actions: [{ tool: 'draft.show', args: {}, reason: 'Render active draft summary' }],
        nextState: currentState
      };

    default:
      return {
        actions: [],
        nextState: currentState
      };
  }
}
