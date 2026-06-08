from pathlib import Path

ML_ROOT    = Path(__file__).parent.parent.parent
MODELS_DIR = ML_ROOT / "models"
DATA_DIR   = ML_ROOT / "data"


def get_model_path(cancer_type: str) -> Path:
    return MODELS_DIR / cancer_type


def get_raw_data_path() -> Path:
    return DATA_DIR / "raw"


def get_processed_data_path() -> Path:
    return DATA_DIR / "processed"
