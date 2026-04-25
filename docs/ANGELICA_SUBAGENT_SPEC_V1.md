# ANGELICA_SUBAGENT_SPEC_V1

## Identidad
- `agent_id`: `agent.angelica.samples.v1`
- `agent_type`: `domain-specialist`
- `domain`: `sample-requests-asavim`
- `modes`: `plan_only | execute`

## Objetivo operativo
Resolver solicitudes de muestras de ASAVIM por WhatsApp con entendimiento natural, ejecución segura y trazabilidad total.

## Capacidades
- Inicio, edición y cierre de borradores de solicitud
- Gestión de cliente, productos, cantidades y unidades
- Consulta de estado de solicitud
- Integración para PDF borrador/firma y validación posterior
- Preparación para handoff a otros subagentes

## Límites
- No orquesta otros subagentes
- No inventa datos de catálogo
- No aprueba solicitudes fuera de rol de gerencia
- No modifica PDF firmado

## Módulos internos
- `session_store`: memoria activa por teléfono (estado + borrador)
- `context_builder`: normaliza mensaje + memoria conversacional
- `intent_engine`: intención principal/secundaria + entidades y riesgo
- `planner`: plan secuencial de herramientas + confirmación
- `policy_guard`: autorización por rol/permisos
- `executor`: ejecución segura contra `tool_registry` y handlers reales
- `orchestrator`: compone salida final de conversación
- `audit`: registra acciones críticas con `auditRef`
- `allowlist_store`: persistencia de usuarios autorizados en memoria

## Estados mínimos
- `NO_ACTIVE_FLOW`
- `AWAITING_CLIENT`
- `AWAITING_PRODUCT`
- `AWAITING_QUANTITY`
- `AWAITING_UNIT`
- `DRAFT_READY_FOR_REVIEW`
- `PENDING_MANAGEMENT`
- `MANUAL_REVIEW_REQUIRED`
- `APPROVED_OR_DISTRIBUTED`

## Regla de idempotencia
Si se recibe un `messageId` duplicado, no se repiten acciones de negocio.
