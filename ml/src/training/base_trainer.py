"""
Base trainer class for cancer risk models.
TODO: Subclass per cancer type and implement build_model / train.
"""

from abc import ABC, abstractmethod
from pathlib import Path
import joblib


class BaseTrainer(ABC):

    def __init__(self, model_dir: Path):
        self.model_dir = model_dir
        self.model = None

    @abstractmethod
    def build_model(self):
        """Return an untrained sklearn Pipeline or equivalent."""
        pass

    @abstractmethod
    def train(self, X_train, y_train):
        """Fit the model on training data."""
        pass

    def evaluate(self, X_test, y_test) -> dict:
        # TODO: implement metrics — AUC-ROC, precision, recall, F1
        raise NotImplementedError

    def save(self, filename: str = "model.pkl"):
        self.model_dir.mkdir(parents=True, exist_ok=True)
        joblib.dump(self.model, self.model_dir / filename)

    def load(self, filename: str = "model.pkl"):
        self.model = joblib.load(self.model_dir / filename)
        return self.model
