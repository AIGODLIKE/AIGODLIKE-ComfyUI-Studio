import json
from pathlib import Path


def read_json(path: Path | str) -> dict:
    if not path.exists() or not path.is_file():
        return {}
    encodings = ["utf8", "gbk"]
    for encoding in encodings:
        try:
            return json.loads(Path(path).read_text(encoding=encoding))
        except UnicodeDecodeError:
            continue
    return {}
