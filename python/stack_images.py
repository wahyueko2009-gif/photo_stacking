from __future__ import annotations

import json
import sys
from pathlib import Path

from stacking import PhotoStackingPipeline, StackingConfig


def load_payload() -> dict:
    if len(sys.argv) > 1:
        payload_path = Path(sys.argv[1])
        return json.loads(payload_path.read_text(encoding="utf-8"))

    raw = sys.stdin.read().strip()
    if not raw:
        return {}

    return json.loads(raw)


def main() -> int:
    payload = load_payload()
    config = StackingConfig.from_dict(payload.get("config", {}))
    pipeline = PhotoStackingPipeline(config=config)

    result = {
        "schema": StackingConfig.ui_schema(),
        "pipeline": pipeline.describe(),
        "alignment": pipeline.align_images(),
        "focus_measure": pipeline.focus_measure(),
        "fusion": pipeline.fusion_settings(),
        "output": pipeline.output_settings(),
        "ai_assist": pipeline.ai_assist(),
    }

    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
