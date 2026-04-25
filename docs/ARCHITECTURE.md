# Architecture Overview

## Current channel integration
`WhatsApp -> n8n (thin adapter) -> /whatsapp/inbound -> Angelica Core`

## Internal modules
- `context_builder`: carga contexto operacional.
- `intent_engine`: clasifica intención y entidades.
- `planner`: genera plan de acciones.
- `policy_guard`: valida permisos y riesgo.
- `executor`: ejecuta herramientas permitidas.

## Swarm-ready principles
- Contrato versionado de entrada/salida.
- Correlation IDs (`task_id`, `trace_id`).
- Modo `plan_only` para simulación del orquestador futuro.
- Capacidades declarativas en manifest.
