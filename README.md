# Angelica Subagent

Subagente especializado para gestionar solicitudes de muestras de ASAVIM con arquitectura **swarm-ready**.

## Qué es
Angélica es un subagente de dominio (`agent.angelica.samples.v1`) preparado para integrarse con un orquestador de enjambre en el futuro.

## Principios
- IA entiende intención y contexto.
- Backend valida políticas y ejecuta herramientas.
- n8n se mantiene delgado (transporte/orquestación, no cerebro).
- Idempotencia por mensaje para evitar duplicados.

## Estructura
- `docs/`: especificaciones funcionales y técnicas.
- `contracts/`: contratos JSON de entrada/salida e intención.
- `src/`: módulos core (estado, contexto, intención, plan, política, ejecución, orquestación).
- `tests/`: pruebas base de regresión y validaciones de contratos.
- `infra/`: notas de integración con Docker y n8n.

## Módulos core
- `session_store`: estado conversacional por teléfono.
- `context_builder`: normalización y contexto conversacional.
- `intent_engine`: detección de intención, entidades y riesgo.
- `planner`: plan de acciones por estado/intención.
- `policy_guard`: autorización por rol/permisos.
- `executor`: ejecución real contra handlers permitidos.
- `orchestrator`: composición final para respuesta del canal.
- `audit`: registro de acciones por `traceId`.
- `allowlist_store`: soporte para altas/bajas/actualizaciones de usuarios autorizados.

## Validación local rápida
```bash
python tests/contract_validation.py
```

## Estado actual
Pipeline funcional con estado en memoria, idempotencia inbound y ejecución de herramientas básicas de borrador/estado.
