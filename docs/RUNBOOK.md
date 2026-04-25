# Runbook (Bootstrap)

## Local setup
1. Copy `.env.example` to `.env`.
2. Fill required secrets and service URLs.
3. Start backend service.
4. Configure n8n router webhook to call `/whatsapp/inbound`.

## Operational checks
- Verify idempotency by replaying same `whatsapp_message_id`.
- Verify policy guard blocks unauthorized tools.
- Verify state continuity (`hola` during active flow does not reset state).

## Incident handling
- If external integration fails, queue retry and log `traceId`.
- For policy mismatch or signed-PDF mismatch, route to `MANUAL_REVIEW_REQUIRED`.
