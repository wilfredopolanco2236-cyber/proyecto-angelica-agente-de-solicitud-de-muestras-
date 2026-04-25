# Runbook (Bootstrap)

## Local bootstrap
1. Copiar `.env.example` a `.env`.
2. Configurar llaves de integraciones.
3. Levantar servicio backend.
4. Configurar webhook de n8n hacia `/whatsapp/inbound`.

## Operating notes
- Idempotencia por `whatsapp_message_id`.
- Registrar `trace_id` por interacción.
- En errores críticos, usar cola de reintentos y alerta.
