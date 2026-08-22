# model_loader.py
import os
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

def _load(filename: str):
    path = MODEL_DIR / filename
    if not path.exists():
        raise FileNotFoundError(f"Model not found: {path}")
    return joblib.load(path)

def get_models(config: dict):
    """
    config = {
        "level1": "SVM",
        "level2a": "RF",
        "level2b": "Logistic"
    }
    """

    lvl1_file  = f"LEVEL1_{config['level1']}.pkl"
    lvl2a_file = f"LEVEL2a_{config['level2a']}.pkl"
    lvl2b_file = f"LEVEL2b_{config['level2b']}.pkl"

    return (
        _load(lvl1_file),
        _load(lvl2a_file),
        _load(lvl2b_file)
    )
