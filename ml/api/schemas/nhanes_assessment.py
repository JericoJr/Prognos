"""
NHANES-aligned assessment schemas for the full multi-category prediction endpoint.
Variable names and codes mirror NHANES 2017-2018 (J cycle) — see nhanes_mapping.json.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class SexEnum(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class SmokingStatusEnum(str, Enum):
    NEVER = "never"
    FORMER = "former"
    CURRENT = "current"


class AlcoholFrequencyEnum(str, Enum):
    NEVER = "never"
    MONTHLY = "monthly"
    WEEKLY = "weekly"
    DAILY = "daily"


class ProcessedFoodFrequencyEnum(str, Enum):
    RARELY = "rarely"
    SOMETIMES = "sometimes"
    OFTEN = "often"
    ALWAYS = "always"


class GeneralHealthEnum(str, Enum):
    EXCELLENT = "excellent"
    VERY_GOOD = "very_good"
    GOOD = "good"
    FAIR = "fair"
    POOR = "poor"


# ─── Section schemas ──────────────────────────────────────────────────────────

class Demographics(BaseModel):
    """NHANES: RIDAGEYR · RIAGENDR · RIDRETH3 · DMDEDUC2 · DMDMARTL · INDHHIN2"""
    age: int = Field(ge=18, le=100)
    sex: SexEnum
    race_ethnicity: Optional[str] = None
    education_level: Optional[str] = None
    marital_status: Optional[str] = None
    household_income: Optional[str] = None


class BodyMeasurements(BaseModel):
    """NHANES: BMXHT · BMXWT · BMXBMI · BMXWAIST"""
    height_cm: Optional[float] = Field(None, ge=100, le=250)
    weight_kg: Optional[float] = Field(None, ge=20, le=500)
    bmi: Optional[float] = Field(None, ge=10, le=80)           # derived in frontend
    waist_circumference_cm: Optional[float] = Field(None, ge=40, le=200)


class LifestyleFactors(BaseModel):
    """NHANES: SMQ* · ALQ* · PAQ605 · PAD680 · SLD010H"""
    smoking_status: Optional[SmokingStatusEnum] = None
    cigarettes_per_day: Optional[int] = Field(None, ge=0)
    years_smoked: Optional[int] = Field(None, ge=0)
    years_since_quit: Optional[int] = Field(None, ge=0)
    alcohol_frequency: Optional[AlcoholFrequencyEnum] = None
    alcohol_drinks_per_week: Optional[int] = Field(None, ge=0)
    physical_activity_minutes_per_week: Optional[int] = Field(None, ge=0)
    sedentary_hours_per_day: Optional[float] = Field(None, ge=0, le=24)
    sleep_hours_per_night: Optional[float] = Field(None, ge=0, le=24)


class DietaryData(BaseModel):
    """NHANES: DBD900 · DBD910 · DRD350A (+ consumer-derived items)"""
    fruit_servings_per_day: Optional[float] = Field(None, ge=0)
    vegetable_servings_per_day: Optional[float] = Field(None, ge=0)
    water_glasses_per_day: Optional[float] = Field(None, ge=0)
    sugary_drinks_per_day: Optional[float] = Field(None, ge=0)
    fast_food_meals_per_week: Optional[int] = Field(None, ge=0)
    processed_food_frequency: Optional[ProcessedFoodFrequencyEnum] = None


class MedicalHistory(BaseModel):
    """NHANES: DIQ010 · BPQ020 · MCQ160* · MCQ220 · MCQ230A · MCQ300* · RXQ510"""
    diabetes_diagnosed: bool = False
    hypertension_diagnosed: bool = False
    heart_disease_diagnosed: bool = False
    previous_cancer_diagnosed: bool = False
    previous_cancer_types: List[str] = []
    family_cancer_history: bool = False
    family_cancer_types: List[str] = []
    current_medications: bool = False
    medications_list: Optional[str] = None


class Symptoms(BaseModel):
    """NHANES: HUQ010 + symptom questionnaire items"""
    general_health_rating: Optional[GeneralHealthEnum] = None
    fatigue: bool = False
    unexplained_weight_loss: bool = False
    persistent_pain: bool = False
    chronic_cough: bool = False
    shortness_of_breath: bool = False
    blood_in_stool: bool = False
    unusual_bleeding: bool = False
    skin_changes: bool = False
    lumps_or_swelling: bool = False


class LaboratoryResults(BaseModel):
    """
    NHANES CBC_J, BIOPRO_J, TCHOL_J, HDL_J, TRIGLY_J, GHB_J, CRP_J, GLU_J
    All optional — users who don't have recent labs can skip this section.
    """
    # CBC (NHANES: LBXWBCSI, LBXRBCSI, LBXHGB, LBXHCT, LBXPLTSI)
    wbc: Optional[float] = Field(None, ge=0, le=100,    description="White Blood Cell Count (10³/μL)")
    rbc: Optional[float] = Field(None, ge=0, le=10,     description="Red Blood Cell Count (10⁶/μL)")
    hemoglobin: Optional[float] = Field(None, ge=0, le=25,  description="Hemoglobin (g/dL)")
    hematocrit: Optional[float] = Field(None, ge=0, le=70,  description="Hematocrit (%)")
    platelet_count: Optional[float] = Field(None, ge=0, le=2000, description="Platelet count (10³/μL)")
    # Metabolic (NHANES: LBXGLU, LBXGH)
    glucose: Optional[float] = Field(None, ge=0, le=600, description="Fasting glucose (mg/dL)")
    hba1c: Optional[float] = Field(None, ge=0, le=20,   description="Glycated hemoglobin (%)")
    # Lipids (NHANES: LBXTC, LBDHDD, LBDLDLM, LBXTR)
    total_cholesterol: Optional[float] = Field(None, ge=0, le=600, description="Total cholesterol (mg/dL)")
    hdl_cholesterol: Optional[float] = Field(None, ge=0, le=200,   description="HDL cholesterol (mg/dL)")
    ldl_cholesterol: Optional[float] = Field(None, ge=0, le=500,   description="LDL cholesterol (mg/dL)")
    triglycerides: Optional[float] = Field(None, ge=0, le=3000,    description="Triglycerides (mg/dL)")
    # Inflammation (NHANES: LBXCRP)
    crp: Optional[float] = Field(None, ge=0, le=200, description="C-Reactive Protein (mg/L)")


# ─── Top-level assessment input ───────────────────────────────────────────────

class NHANESAssessmentInput(BaseModel):
    """
    Full NHANES-aligned assessment. Passed to the ML prediction pipeline.
    Each section maps to a Supabase table and a set of NHANES variables.
    """
    demographics: Demographics
    body_measurements: Optional[BodyMeasurements] = None
    lifestyle: Optional[LifestyleFactors] = None
    dietary: Optional[DietaryData] = None
    medical_history: Optional[MedicalHistory] = None
    symptoms: Optional[Symptoms] = None
    lab_results: Optional[LaboratoryResults] = None


# ─── Prediction response ──────────────────────────────────────────────────────

class CancerPrediction(BaseModel):
    type: str
    label: str
    risk_percentage: float = Field(ge=0, le=100)
    risk_level: str                       # low | moderate | high | very_high
    top_factors: List[str] = []
    symptoms: List[str] = []
    treatments: List[str] = []
    sources: List[dict] = []


class CategoryContribution(BaseModel):
    """Designed to accept SHAP values directly in a future phase."""
    category: str
    weight: float = Field(ge=0, le=1)    # 0.0 – 1.0 (proportional contribution)
    nhanes_tables: List[str] = []


class AssessmentPredictionResponse(BaseModel):
    overall_risk_percentage: float = Field(ge=0, le=100)
    risk_category: str
    cancer_breakdown: List[CancerPrediction]
    category_contributions: List[CategoryContribution]
