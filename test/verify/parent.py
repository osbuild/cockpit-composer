import sys
import pathlib

TEST_DIR = pathlib.Path(__file__).parent.parent
sys.path.append(str(TEST_DIR / "common"))
sys.path.append(str(TEST_DIR.parent / "bots/machine"))
