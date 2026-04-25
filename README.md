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
- `src/`: módulos core (contexto, intención, plan, política, ejecución, orquestación).
- `tests/`: pruebas base de regresión y validaciones de contratos.
- `infra/`: notas de integración con Docker y n8n.

## Módulos core
- `context_builder`: normalización y contexto conversacional.
- `intent_engine`: detección de intención, entidades y riesgo.
- `planner`: plan de acciones por estado/intención.
- `policy_guard`: autorización por rol/permisos.
- `executor`: ejecución segura contra tool registry.
- `orchestrator`: composición final para respuesta del canal.

## Validación local rápida
```bash
python tests/contract_validation.py
```

## Estado actual
Base funcional con pipeline interno, idempotencia en inbound y contratos versionados listos para iteración.
