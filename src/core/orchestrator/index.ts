import { AngelicaContext } from '../context_builder';
import { classifyIntent } from '../intent_engine';
import { buildPlan } from '../planner';
import { executeActions } from '../executor';

export interface OrchestrationResult {
  goal: string;
  intent: string;
  confidence: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  nextState: string;
  needsConfirmation: boolean;
  executions: { ok: boolean; tool: string; message: string }[];
  userReply: string;
}

function buildReply(intent: string, nextState: string): string {
  switch (intent) {
    case 'START_SAMPLE_REQUEST':
      return nextState === 'AWAITING_CLIENT'
        ? 'Claro. ¿Para qué cliente es la muestra?'
        : 'Perfecto, ya tengo el cliente. Dime el producto.';
    case 'ADD_ITEM':
      return 'Item agregado al borrador. ¿Deseas agregar otro producto?';
    case 'REMOVE_ITEM':
      return 'Listo, quité ese item del borrador. ¿Algo más?';
    case 'UPDATE_ITEM':
      return 'Actualicé ese item. ¿Confirmas que quedó correcto?';
    case 'FINISH_DRAFT':
      return 'Te muestro el resumen del borrador. ¿Genero el PDF?';
    case 'CHECK_STATUS':
      return 'Aquí tienes el estado actual de tu solicitud.';
    case 'SHOW_DRAFT':
      return 'Este es tu borrador actual.';
    case 'GREET':
      return 'Hola. Te ayudo con la solicitud de muestras.';
    default:
      return 'Te entendí parcialmente. ¿Me confirmas qué necesitas hacer ahora?';
  }
}

export function runOrchestrator(context: AngelicaContext): OrchestrationResult {
  const decision = classifyIntent(context);
  const plan = buildPlan(decision, context.memory.state);
  const executions = executeActions(
    plan.actions.map((action) => ({ tool: action.tool, args: action.args })),
    context.user
  );

  return {
    goal: decision.goal,
    intent: decision.primaryIntent,
    confidence: decision.confidence,
    riskLevel: decision.riskLevel,
    nextState: plan.nextState,
    needsConfirmation: plan.needsConfirmation,
    executions,
    userReply: buildReply(decision.primaryIntent, plan.nextState)
  };
}
