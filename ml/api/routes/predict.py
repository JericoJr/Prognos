"""
Prediction endpoints — one per cancer type + NHANES comprehensive assessment.
TODO: Replace each HTTPException with real model inference.
"""

from fastapi import APIRouter, HTTPException
from api.schemas.prediction import (
    LungCancerInput, BreastCancerInput, ColonCancerInput,
    ProstateCancerInput, MelanomaInput, CervicalCancerInput,
    BladderCancerInput, ThyroidCancerInput, PredictionResponse,
)
from api.schemas.nhanes_assessment import NHANESAssessmentInput, AssessmentPredictionResponse

router = APIRouter()


@router.post("/lung", response_model=PredictionResponse)
async def predict_lung(data: LungCancerInput):
    # TODO: load model from models/lung_cancer/model.pkl and run inference
    raise HTTPException(status_code=501, detail="Lung cancer model not yet implemented")


@router.post("/breast", response_model=PredictionResponse)
async def predict_breast(data: BreastCancerInput):
    # TODO: load model from models/breast_cancer/model.pkl and run inference
    raise HTTPException(status_code=501, detail="Breast cancer model not yet implemented")


@router.post("/colon", response_model=PredictionResponse)
async def predict_colon(data: ColonCancerInput):
    # TODO: load model from models/colon_cancer/model.pkl and run inference
    raise HTTPException(status_code=501, detail="Colon cancer model not yet implemented")


@router.post("/prostate", response_model=PredictionResponse)
async def predict_prostate(data: ProstateCancerInput):
    # TODO: load model from models/prostate_cancer/model.pkl and run inference
    raise HTTPException(status_code=501, detail="Prostate cancer model not yet implemented")


@router.post("/melanoma", response_model=PredictionResponse)
async def predict_melanoma(data: MelanomaInput):
    # TODO: load model from models/melanoma/model.pkl and run inference
    raise HTTPException(status_code=501, detail="Melanoma model not yet implemented")


@router.post("/cervical", response_model=PredictionResponse)
async def predict_cervical(data: CervicalCancerInput):
    # TODO: load model from models/cervical_cancer/model.pkl and run inference
    raise HTTPException(status_code=501, detail="Cervical cancer model not yet implemented")


@router.post("/bladder", response_model=PredictionResponse)
async def predict_bladder(data: BladderCancerInput):
    # TODO: load model from models/bladder_cancer/model.pkl and run inference
    raise HTTPException(status_code=501, detail="Bladder cancer model not yet implemented")


@router.post("/thyroid", response_model=PredictionResponse)
async def predict_thyroid(data: ThyroidCancerInput):
    # TODO: load model from models/thyroid_cancer/model.pkl and run inference
    raise HTTPException(status_code=501, detail="Thyroid cancer model not yet implemented")


@router.post("/assess", response_model=AssessmentPredictionResponse)
async def assess_nhanes(_data: NHANESAssessmentInput):
    # TODO: run full NHANES-compatible multi-cancer pipeline on _data
    raise HTTPException(status_code=501, detail="NHANES assessment model not yet implemented")
