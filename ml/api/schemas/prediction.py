"""
Pydantic schemas for prediction request/response validation.
Add or remove fields as your datasets and models evolve.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    VERY_HIGH = "very_high"
    UNKNOWN = "unknown"


class SourceItem(BaseModel):
    title: str
    url: Optional[str] = None
    organization: Optional[str] = None


class PredictionResponse(BaseModel):
    likelihood: float = Field(ge=0, le=100, description="Risk likelihood as a percentage (0–100)")
    risk_level: RiskLevel
    symptoms: List[str]
    treatments: List[str]
    sources: List[SourceItem]


# ─── Input schemas ─────────────────────────────────────────────────────────────

class LungCancerInput(BaseModel):
    age: int = Field(ge=18, le=100)
    gender: str
    smoking_status: str          # never | former | current
    pack_years: Optional[float] = None
    years_since_quit: Optional[float] = None
    family_history: bool = False
    asbestos_exposure: bool = False
    radon_exposure: bool = False
    chronic_cough: bool = False
    shortness_of_breath: bool = False
    chest_pain: bool = False
    unexplained_weight_loss: bool = False
    hemoptysis: bool = False


class BreastCancerInput(BaseModel):
    age: int = Field(ge=18, le=100)
    gender: str
    family_history: bool = False
    brca_mutation: bool = False
    previous_breast_biopsy: bool = False
    dense_breast_tissue: bool = False
    hormone_replacement_therapy: bool = False
    age_first_menstruation: Optional[int] = None
    age_first_birth: Optional[int] = None
    alcohol_use: bool = False
    obesity: bool = False
    breast_lump: bool = False
    nipple_discharge: bool = False
    skin_dimpling: bool = False
    breast_pain: bool = False


class ColonCancerInput(BaseModel):
    age: int = Field(ge=18, le=100)
    family_history: bool = False
    personal_polyp_history: bool = False
    inflammatory_bowel_disease: bool = False
    smoking: bool = False
    heavy_alcohol_use: bool = False
    obesity: bool = False
    low_fiber_diet: bool = False
    red_processed_meat: bool = False
    physical_inactivity: bool = False
    blood_in_stool: bool = False
    bowel_habit_changes: bool = False
    abdominal_pain: bool = False
    unexplained_weight_loss: bool = False


class ProstateCancerInput(BaseModel):
    age: int = Field(ge=18, le=100)
    race: Optional[str] = None
    family_history: bool = False
    elevated_psa: bool = False
    psa_level: Optional[float] = None
    urinary_symptoms: bool = False
    weak_urine_flow: bool = False
    frequent_urination: bool = False
    blood_in_urine_or_semen: bool = False
    erectile_dysfunction: bool = False
    pelvic_discomfort: bool = False


class MelanomaInput(BaseModel):
    age: int = Field(ge=18, le=100)
    skin_type: Optional[int] = Field(None, ge=1, le=6)
    sun_exposure_hours: Optional[float] = None
    history_of_sunburns: bool = False
    tanning_bed_use: bool = False
    family_history: bool = False
    personal_melanoma_history: bool = False
    number_of_moles: Optional[int] = None
    changing_mole: bool = False
    atypical_moles: bool = False
    immunosuppression: bool = False


class CervicalCancerInput(BaseModel):
    age: int = Field(ge=18, le=100)
    hpv_positive: Optional[bool] = None
    abnormal_pap_smear: bool = False
    smoking: bool = False
    multiple_sexual_partners: bool = False
    early_sexual_activity: bool = False
    long_term_oral_contraceptives: bool = False
    weakened_immune_system: bool = False
    chlamydia_history: bool = False
    abnormal_vaginal_bleeding: bool = False
    pelvic_pain: bool = False
    pain_during_intercourse: bool = False


class BladderCancerInput(BaseModel):
    age: int = Field(ge=18, le=100)
    gender: str
    smoking: bool = False
    occupational_chemical_exposure: bool = False
    arsenic_exposure: bool = False
    chronic_uti: bool = False
    bladder_stones: bool = False
    family_history: bool = False
    personal_bladder_cancer_history: bool = False
    blood_in_urine: bool = False
    frequent_urination: bool = False
    painful_urination: bool = False
    pelvic_pain: bool = False
    back_pain: bool = False


class ThyroidCancerInput(BaseModel):
    age: int = Field(ge=18, le=100)
    gender: str
    family_history: bool = False
    radiation_exposure: bool = False
    thyroid_nodule: bool = False
    goiter: bool = False
    hashimotos_disease: bool = False
    iodine_deficiency: bool = False
    neck_lump: bool = False
    hoarseness: bool = False
    difficulty_swallowing: bool = False
    difficulty_breathing: bool = False
    neck_pain: bool = False
