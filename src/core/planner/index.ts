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
  needsConfirmation: boolean;
}

export function buildPlan(decision: IntentDecision, currentState: ConversationState): PlanResult {
  switch (decision.primaryIntent) {
    case 'START_SAMPLE_REQUEST':
      return {
        actions: [{ tool: 'draft.create', args: {}, reason: 'Start request flow' }],
        nextState: decision.missingSlots.includes('cliente') ? 'AWAITING_CLIENT' : 'AWAITING_PRODUCT',
        needsConfirmation: false
      };

    case 'SET_CLIENT':
      return {
        actions: [{ tool: 'draft.set_client', args: { cliente: decision.entities.cliente }, reason: 'Set client in draft' }],
        nextState: 'AWAITING_PRODUCT',
        needsConfirmation: false
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
              unidad: decision.entities.unidad,
              producto: decision.entities.producto
            },
            reason: 'Add resolved item to active draft'
          }
        ],
        nextState: 'AWAITING_PRODUCT',
        needsConfirmation: false
      };

    case 'REMOVE_ITEM':
      return {
        actions: [{ tool: 'draft.remove_item', args: { selector: decision.entities.itemSelector }, reason: 'Remove selected item' }],
        nextState: 'AWAITING_PRODUCT',
        needsConfirmation: false
      };

    case 'UPDATE_ITEM':
      return {
        actions: [{ tool: 'draft.update_item', args: { selector: decision.entities.itemSelector, cantidad: decision.entities.cantidad, unidad: decision.entities.unidad }, reason: 'Update selected item' }],
        nextState: 'AWAITING_PRODUCT',
        needsConfirmation: true
      };

    case 'FINISH_DRAFT':
      return {
        actions: [{ tool: 'draft.finish', args: {}, reason: 'Close capture and show review summary' }],
        nextState: 'DRAFT_READY_FOR_REVIEW',
        needsConfirmation: true
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
        nextState: currentState,
        needsConfirmation: false
      };

    case 'SHOW_DRAFT':
      return {
        actions: [{ tool: 'draft.show', args: {}, reason: 'Render active draft summary' }],
        nextState: currentState,
        needsConfirmation: false
      };

    default:
      return {
        actions: [],
        nextState: currentState,
        needsConfirmation: false
      };
  }
}
