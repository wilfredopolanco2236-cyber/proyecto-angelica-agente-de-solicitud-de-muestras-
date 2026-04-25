# Architecture Overview

## Position in swarm
Angélica is a **domain subagent** (`agent.angelica.samples.v1`) ready to be called by a future orchestrator. It should not own global orchestration.

## Runtime pipeline
1. Channel adapter (n8n thin workflow)
2. `whatsapp/inbound` endpoint
3. Context Builder
4. Intent Engine
5. Planner
6. Policy Guard
7. Tool Executor
8. Audit + response

## Swarm-ready guarantees
- Versioned contracts (`contracts/*.json`)
- Correlation IDs (`task_id`, `orchestrator_trace_id`, `traceId`)
- Dual mode (`plan_only`, `execute`)
- Explicit handoff envelope for future agent-to-agent delegation

## Reliability constraints
- Idempotency by `whatsapp_message_id`
- Policy-first execution
- No business logic in n8n
- Deterministic action planning for critical flows
