-- =============================================================================
-- Prognos — Enable Row Level Security
-- Run this in the Supabase SQL Editor AFTER running schema.sql.
-- This ensures users can only read and write their own assessment data.
-- =============================================================================

-- Enable RLS on every table
ALTER TABLE public.assessments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demographics        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_factors   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dietary_data        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.laboratory_results  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_results  ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- ASSESSMENTS — root table; user_id is the ownership anchor
-- =============================================================================

CREATE POLICY "users_select_own_assessments"
  ON public.assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_assessments"
  ON public.assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_assessments"
  ON public.assessments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "users_delete_own_assessments"
  ON public.assessments FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- CHILD TABLES — access is granted if the parent assessment belongs to the user
-- =============================================================================

-- Helper macro: SELECT allowed when the linked assessment belongs to auth.uid()
-- Repeat for each child table

CREATE POLICY "users_select_own_demographics"
  ON public.demographics FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

CREATE POLICY "users_insert_own_demographics"
  ON public.demographics FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

-- body_measurements
CREATE POLICY "users_select_own_body"
  ON public.body_measurements FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

CREATE POLICY "users_insert_own_body"
  ON public.body_measurements FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

-- lifestyle_factors
CREATE POLICY "users_select_own_lifestyle"
  ON public.lifestyle_factors FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

CREATE POLICY "users_insert_own_lifestyle"
  ON public.lifestyle_factors FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

-- dietary_data
CREATE POLICY "users_select_own_dietary"
  ON public.dietary_data FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

CREATE POLICY "users_insert_own_dietary"
  ON public.dietary_data FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

-- medical_history
CREATE POLICY "users_select_own_medical"
  ON public.medical_history FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

CREATE POLICY "users_insert_own_medical"
  ON public.medical_history FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

-- symptoms
CREATE POLICY "users_select_own_symptoms"
  ON public.symptoms FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

CREATE POLICY "users_insert_own_symptoms"
  ON public.symptoms FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

-- laboratory_results
CREATE POLICY "users_select_own_labs"
  ON public.laboratory_results FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

CREATE POLICY "users_insert_own_labs"
  ON public.laboratory_results FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

-- prediction_results
CREATE POLICY "users_select_own_predictions"
  ON public.prediction_results FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

CREATE POLICY "users_insert_own_predictions"
  ON public.prediction_results FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));

-- =============================================================================
-- SERVICE ROLE BYPASS (optional — uncomment if backend uses service role key)
-- The service role key bypasses RLS automatically; these are only needed
-- if you want to explicitly allow it through standard policies instead.
-- =============================================================================

-- CREATE POLICY "service_role_all_assessments"
--   ON public.assessments FOR ALL
--   USING (auth.role() = 'service_role');
