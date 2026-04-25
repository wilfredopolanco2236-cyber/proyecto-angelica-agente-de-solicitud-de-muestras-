# Smoke Test Cases (Initial)

1. Input: `solicitud de muestras` + no flow -> intent `START_SAMPLE_REQUEST`, next state `AWAITING_CLIENT`.
2. Input: `para laboratorios alpha` + state `AWAITING_CLIENT` -> intent `SET_CLIENT`, next state `AWAITING_PRODUCT`.
3. Input: `10 gramos de acetaminofen dc 90` -> intent `ADD_ITEM`, no confusion with `90` as quantity.
4. Input: `solo eso` + active draft -> intent `FINISH_DRAFT`, state `DRAFT_READY_FOR_REVIEW`.
5. Input: `quita acetaminofen` -> intent `REMOVE_ITEM` and execute `draft.remove_item`.
6. Input: `cambia pure sense a 20 gramos` -> intent `UPDATE_ITEM` with confirmation required.
7. Input: `estado sm20260425-sab-0009` -> intent `CHECK_STATUS` and normalized request number.
8. Duplicate `messageId` -> idempotent no-op response.
9. Unauthorized user executing `allowlist.add` -> blocked by policy guard.

Automatable fixtures: `tests/unit/scenarios.json` + `tests/contract_validation.py`.

10. Input: `agrega este numero como vendedor` -> intent `MANAGE_ALLOWLIST` con confirmación.
