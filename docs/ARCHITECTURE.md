# Architecture Overview

## Position in swarm
Angélica is a **domain subagent** (`agent.angelica.samples.v1`) ready to be called by a future orchestrator. It should not own global orchestration.

## Runtime pipeline
1. Channel adapter (n8n thin workflow)
2. `whatsapp/inbound` endpoint
3. Session Store (state + draft memory)
4. Context Builder
5. Intent Engine
6. Planner
7. Policy Guard
8. Executor (real handlers)
9. Orchestrator response composer
10. Audit logger + response

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
- Contract and scenario checks in CI (`tests/contract_validation.py`)
