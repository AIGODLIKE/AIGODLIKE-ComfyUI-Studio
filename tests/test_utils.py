import tempfile
import unittest
from pathlib import Path

from utils import read_json


class ReadJsonTests(unittest.TestCase):
    def test_reads_path_and_string_paths(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "synthetic.json"
            path.write_text('{"value": "synthetic"}', encoding="utf-8")

            self.assertEqual({"value": "synthetic"}, read_json(path))
            self.assertEqual({"value": "synthetic"}, read_json(str(path)))

    def test_missing_file_and_directory_return_empty_object(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            self.assertEqual({}, read_json(str(Path(temp_dir) / "missing.json")))
            self.assertEqual({}, read_json(temp_dir))


if __name__ == "__main__":
    unittest.main()
