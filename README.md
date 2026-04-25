# Angelica Subagent

Subagente especializado para gestionar solicitudes de muestras de ASAVIM con arquitectura **swarm-ready**.

## Qué es
Angélica es un subagente de dominio (`agent.angelica.samples.v1`) preparado para integrarse con un orquestador de enjambre en el futuro.

## Principios
- IA entiende intención y contexto.
- Backend valida políticas y ejecuta herramientas.
- n8n se mantiene delgado (transporte/orquestación, no cerebro).

## Estructura
- `docs/`: especificaciones funcionales y técnicas.
- `contracts/`: contratos JSON de entrada/salida e intención.
- `src/`: módulos core (contexto, intención, plan, política, ejecución).
- `tests/`: pruebas base de regresión.
- `infra/`: notas de integración con Docker y n8n.

## Módulos core
- `context_builder`: normalización y contexto conversacional.
- `intent_engine`: detección de intención y entidades.
- `planner`: plan de acciones por estado/intención.
- `policy_guard`: autorización por rol/permisos.
- `executor`: ejecución segura contra tool registry.

## Estado actual
Scaffold funcional con pipeline interno y contratos versionados listos para iteración.
