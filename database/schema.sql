-- =============================================================================
-- Prognos — Supabase Schema
-- NHANES-aligned normalized tables for cancer risk assessment storage.
-- Run this in the Supabase SQL editor.
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CORE
-- =============================================================================

CREATE TABLE public.assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID,                            -- nullable until auth is added
  status      TEXT DEFAULT 'completed',        -- draft | completed
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- NHANES CATEGORY TABLES
-- Each linked to assessments.id with ON DELETE CASCADE
-- =============================================================================

-- NHANES: Demographics (RIDAGEYR, RIAGENDR, RIDRETH3, DMDEDUC2, DMDMARTL, INDHHIN2)
CREATE TABLE public.demographics (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id    UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  age              INTEGER,
  sex              TEXT,             -- male | female | other
  race_ethnicity   TEXT,
  education_level  TEXT,
  marital_status   TEXT,
  household_income TEXT
);

-- NHANES: Body Measurements (BMXHT, BMXWT, BMXBMI, BMXWAIST)
CREATE TABLE public.body_measurements (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id            UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  height_cm                NUMERIC(5,1),
  weight_kg                NUMERIC(5,1),
  bmi                      NUMERIC(5,2),     -- derived: kg/m²
  waist_circumference_cm   NUMERIC(5,1)
);

-- NHANES: Lifestyle (SMQ020/SMQ040/SMD641/SMD650/SMQ050Q, ALQ111/ALQ130, PAQ605/PAD680, SLD010H)
CREATE TABLE public.lifestyle_factors (
  id                                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id                       UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  smoking_status                      TEXT,      -- never | former | current
  cigarettes_per_day                  INTEGER,
  years_smoked                        INTEGER,
  years_since_quit                    INTEGER,
  alcohol_frequency                   TEXT,      -- never | monthly | weekly | daily
  alcohol_drinks_per_week             INTEGER,
  physical_activity_minutes_per_week  INTEGER,
  sedentary_hours_per_day             NUMERIC(4,1),
  sleep_hours_per_night               NUMERIC(4,1)
);

-- NHANES: Dietary (DBD900/DBD910 + derived consumer survey items)
-- EXTENSIBLE: add columns here or use dietary_extras JSONB for future NHANES vars
CREATE TABLE public.dietary_data (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id               UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  fruit_servings_per_day      NUMERIC(4,1),
  vegetable_servings_per_day  NUMERIC(4,1),
  water_glasses_per_day       NUMERIC(4,1),
  sugary_drinks_per_day       NUMERIC(4,1),
  fast_food_meals_per_week    INTEGER,
  processed_food_frequency    TEXT,          -- rarely | sometimes | often | always
  dietary_extras              JSONB DEFAULT '{}'   -- for future NHANES dietary variables
);

-- NHANES: Medical History (DIQ010, BPQ020, MCQ160C/D/E, MCQ220, MCQ300A/B/C)
CREATE TABLE public.medical_history (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id               UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  diabetes_diagnosed          BOOLEAN DEFAULT FALSE,
  hypertension_diagnosed      BOOLEAN DEFAULT FALSE,
  heart_disease_diagnosed     BOOLEAN DEFAULT FALSE,
  previous_cancer_diagnosed   BOOLEAN DEFAULT FALSE,
  previous_cancer_types       TEXT[],           -- array of cancer type strings
  family_cancer_history       BOOLEAN DEFAULT FALSE,
  family_cancer_types         TEXT[],
  current_medications         BOOLEAN DEFAULT FALSE,
  medications_list            TEXT
);

-- NHANES: Health Status & Symptoms (HUQ010 + symptom items)
CREATE TABLE public.symptoms (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id           UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  general_health_rating   TEXT,     -- excellent | very_good | good | fair | poor
  fatigue                 BOOLEAN DEFAULT FALSE,
  unexplained_weight_loss BOOLEAN DEFAULT FALSE,
  persistent_pain         BOOLEAN DEFAULT FALSE,
  chronic_cough           BOOLEAN DEFAULT FALSE,
  shortness_of_breath     BOOLEAN DEFAULT FALSE,
  blood_in_stool          BOOLEAN DEFAULT FALSE,
  unusual_bleeding        BOOLEAN DEFAULT FALSE,
  skin_changes            BOOLEAN DEFAULT FALSE,
  lumps_or_swelling       BOOLEAN DEFAULT FALSE
);

-- NHANES: Laboratory Results (CBC_J, BIOPRO_J, TCHOL_J, HDL_J, TRIGLY_J, GHB_J, CRP_J, GLU_J)
-- EXTENSIBLE: additional_biomarkers JSONB stores future NHANES lab variables without schema migration
CREATE TABLE public.laboratory_results (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id        UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  -- Complete Blood Count (NHANES: CBC_*)
  wbc                  NUMERIC(6,2),     -- White Blood Cell Count  10³/μL
  rbc                  NUMERIC(6,2),     -- Red Blood Cell Count    10⁶/μL
  hemoglobin           NUMERIC(5,1),     -- g/dL
  hematocrit           NUMERIC(5,1),     -- %
  platelet_count       NUMERIC(7,0),     -- 10³/μL
  -- Metabolic (NHANES: GLU_J, GHB_J)
  glucose              NUMERIC(6,1),     -- mg/dL (fasting)
  hba1c                NUMERIC(4,1),     -- %
  -- Lipid Panel (NHANES: TCHOL_J, HDL_J, TRIGLY_J; LDL derived)
  total_cholesterol    NUMERIC(6,1),     -- mg/dL
  hdl_cholesterol      NUMERIC(5,1),     -- mg/dL
  ldl_cholesterol      NUMERIC(5,1),     -- mg/dL
  triglycerides        NUMERIC(6,1),     -- mg/dL
  -- Inflammation (NHANES: CRP_J)
  crp                  NUMERIC(6,2),     -- C-Reactive Protein  mg/L
  -- Extensible store for future biomarkers
  additional_biomarkers JSONB DEFAULT '{}'
);

-- =============================================================================
-- PREDICTION RESULTS (SHAP-ready structure)
-- =============================================================================

CREATE TABLE public.prediction_results (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id             UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  model_version             TEXT DEFAULT 'mock-v0',  -- update when real models ship
  overall_risk_percentage   NUMERIC(5,2),
  risk_category             TEXT,         -- low | moderate | high | very_high
  cancer_breakdown          JSONB,        -- array of per-cancer predictions
  category_contributions    JSONB,        -- designed for SHAP output: [{category, weight}]
  raw_output                JSONB         -- full model output for debugging
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX idx_assessments_user_id   ON public.assessments(user_id);
CREATE INDEX idx_assessments_created   ON public.assessments(created_at DESC);
CREATE INDEX idx_demographics_aid      ON public.demographics(assessment_id);
CREATE INDEX idx_body_measurements_aid ON public.body_measurements(assessment_id);
CREATE INDEX idx_lifestyle_aid         ON public.lifestyle_factors(assessment_id);
CREATE INDEX idx_dietary_aid           ON public.dietary_data(assessment_id);
CREATE INDEX idx_medical_history_aid   ON public.medical_history(assessment_id);
CREATE INDEX idx_symptoms_aid          ON public.symptoms(assessment_id);
CREATE INDEX idx_lab_results_aid       ON public.laboratory_results(assessment_id);
CREATE INDEX idx_prediction_results_aid ON public.prediction_results(assessment_id);

-- =============================================================================
-- ROW LEVEL SECURITY (enable when auth is configured)
-- =============================================================================

-- ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view own assessments"
--   ON public.assessments FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own assessments"
--   ON public.assessments FOR INSERT WITH CHECK (auth.uid() = user_id);
-- (Repeat for each child table using assessment_id → assessments.user_id join)
