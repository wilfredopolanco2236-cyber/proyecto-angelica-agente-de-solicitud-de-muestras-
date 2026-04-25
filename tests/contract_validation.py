import json
from pathlib import Path

REQUIRED_INPUT_FIELDS = {
    "contract_version",
    "task_id",
    "orchestrator_trace_id",
    "caller_agent_id",
    "mode",
    "goal",
    "user_context",
    "conversation_context",
    "input_payload",
}

REQUIRED_OUTPUT_FIELDS = {
    "contract_version",
    "status",
    "confidence",
    "risk_level",
    "goal_result",
    "state_delta",
    "actions_executed",
    "user_reply",
    "artifacts",
    "audit_ref",
}


def load_json(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def validate_contract_required(path: str, required: set[str]):
    data = load_json(path)
    schema_required = set(data.get("required", []))
    missing = required - schema_required
    if missing:
        raise AssertionError(f"{path} missing required keys: {sorted(missing)}")


def validate_scenarios(path: str):
    data = load_json(path)
    if not isinstance(data, list) or not data:
        raise AssertionError("scenarios.json must contain at least one scenario")

    for idx, case in enumerate(data, start=1):
        if "input" not in case or "expected_intent" not in case:
            raise AssertionError(f"scenario {idx} must contain input and expected_intent")


def main():
    validate_contract_required("contracts/angelica_input.contract.json", REQUIRED_INPUT_FIELDS)
    validate_contract_required("contracts/angelica_output.contract.json", REQUIRED_OUTPUT_FIELDS)
    validate_scenarios("tests/unit/scenarios.json")

    print("contract and scenario validations passed")


if __name__ == "__main__":
    main()
