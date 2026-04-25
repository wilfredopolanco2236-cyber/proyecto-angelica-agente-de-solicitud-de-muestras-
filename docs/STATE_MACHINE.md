# State Machine (V1)

## Core transitions
- `NO_ACTIVE_FLOW -> AWAITING_CLIENT` (start request without client)
- `NO_ACTIVE_FLOW -> AWAITING_PRODUCT` (start request with client already resolved)
- `AWAITING_CLIENT -> AWAITING_PRODUCT` (client confirmed)
- `AWAITING_PRODUCT -> AWAITING_QUANTITY` (product captured, quantity missing)
- `AWAITING_QUANTITY -> AWAITING_PRODUCT` (item completed)
- `AWAITING_PRODUCT -> DRAFT_READY_FOR_REVIEW` (`solo eso` / `listo`)
- `DRAFT_READY_FOR_REVIEW -> PENDING_MANAGEMENT` (send to management)
- `PENDING_MANAGEMENT -> APPROVED_OR_DISTRIBUTED` (signed PDF validated)
- `* -> MANUAL_REVIEW_REQUIRED` (policy/document mismatch)

## Notes
- `CHECK_STATUS` and `SHOW_DRAFT` do not force state change.
- Greeting/help during active flow must preserve current state.
