# Smoke Test Cases (Initial)

1. Input: `solicitud de muestras` + no flow -> intent `START_SAMPLE_REQUEST`, next state `AWAITING_CLIENT`.
2. Input: `para laboratorios alpha` + state `AWAITING_CLIENT` -> intent `SET_CLIENT`, next state `AWAITING_PRODUCT`.
3. Input: `10 gramos de acetaminofen dc 90` -> intent `ADD_ITEM`, no confusion with `90` as quantity.
4. Input: `solo eso` + active draft -> intent `FINISH_DRAFT`, state `DRAFT_READY_FOR_REVIEW`.
5. Input: `estado sm20260425-sab-0009` -> intent `CHECK_STATUS` and normalized request number.
6. Unauthorized user executing `allowlist.add` -> blocked by policy guard.
