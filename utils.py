import json
from pathlib import Path


def read_json(path: Path | str) -> dict:
    encodings = ["utf8", "gbk"]
    for encoding in encodings:
        try:
            return json.loads(Path(path).read_text(encoding=encoding))
        except UnicodeDecodeError:
            continue
    return {}
