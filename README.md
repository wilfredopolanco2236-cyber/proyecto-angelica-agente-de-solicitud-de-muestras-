# Angelica Subagent

Subagente especializado para gestionar solicitudes de muestras de ASAVIM con arquitectura **swarm-ready**.

## Objetivo
Angélica opera como subagente de dominio (no como orquestador global) y está preparada para ser invocada por un orquestador de enjambre en el futuro.

## Capacidades principales
- Conversación natural por WhatsApp (texto/voz).
- Gestión de borradores de solicitud de muestras.
- Integración segura con catálogo, clientes, PDF y auditoría.
- Validación documental de PDF firmado.
- Ejecución de herramientas con RBAC y políticas.

## Estructura
- `docs/`: especificaciones funcionales y técnicas.
- `contracts/`: contratos JSON de entrada/salida entre orquestador y subagente.
- `src/`: código fuente del subagente.
- `tests/`: pruebas unitarias, integración y e2e.
- `infra/`: assets de despliegue e integración n8n.

## Estado
Scaffold inicial listo para implementación incremental.
