"""
Evaluation metrics for cancer risk models.
TODO: implement using sklearn.metrics once models are trained.
"""

from typing import Dict


def compute_classification_metrics(y_true, y_pred, y_prob=None) -> Dict:
    """Accuracy, precision, recall, F1, AUC-ROC."""
    # TODO: from sklearn.metrics import classification_report, roc_auc_score
    raise NotImplementedError


def compute_calibration(y_true, y_prob) -> Dict:
    """Assess how well predicted probabilities match actual outcomes."""
    # TODO: from sklearn.calibration import calibration_curve
    raise NotImplementedError
