# Prognos — AI-Powered Cancer Risk Predictor

Prognos is a web application that estimates a user's likelihood of developing eight types of cancer based on self-reported health data. Users complete a structured, seven-section health assessment aligned with the CDC's National Health and Nutrition Examination Survey (NHANES) dataset, and receive a personalized risk dashboard with an overall score, per-cancer breakdown, and a category contribution chart designed for future SHAP explainability integration.

> **Medical Disclaimer:** Prognos is an informational tool only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.

---

## Features

- **Secure authentication** — email/password sign-up, login, forgot password, and password reset via Supabase Auth
- **7-step NHANES-compatible assessment** covering:
  - Demographics (age, sex, race/ethnicity, education, income)
  - Body measurements (height, weight, auto-calculated BMI, waist circumference; imperial/metric toggle)
  - Lifestyle & behavioral factors (smoking with pack-year details, alcohol, physical activity, sleep)
  - Dietary information (fruit, vegetable, sugary drink, fast food, and processed food frequency)
  - Medical history (diabetes, hypertension, heart disease, personal and family cancer history)
  - Symptoms & health status (general health self-rating, 9 cancer-warning-sign checkboxes)
  - Laboratory / blood test data (WBC, hemoglobin, platelets, cholesterol, HbA1c, CRP, PSA — all optional)
- **Risk results dashboard** with:
  - SVG arc gauge showing overall cancer risk percentage and risk category
  - Per-cancer accordion cards sorted by estimated risk score (lung, breast, colon, prostate, melanoma, cervical, bladder, thyroid)
  - Expandable details per cancer: key risk factors, common symptoms, treatment options, and authoritative sources
  - Category contribution bar chart (SHAP-ready structure, detailed feature importance planned for a future phase)
- **NHANES dataset alignment** — every field maps to a documented NHANES variable code (e.g. `RIDAGEYR`, `BMXBMI`, `SMQ020`, `LBXWBCSI`) so future ML models can be trained directly on NHANES data
- **ML fallback pattern** — the backend tries the FastAPI prediction service first; if it is unavailable or returns 501, it falls back to a semi-dynamic mock scoring model so the UI works during development before any models are trained
- **Protected routes** — `/assess` and `/results` require authentication; unauthenticated users are redirected to login and returned to their original destination after sign-in
- **PDF export** — results page dropdown to download a Full Risk Report PDF or a Lab Results Summary PDF (color-coded status, recommendations, disclaimer footer)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TailwindCSS, React Router v6, Axios |
| Auth | Supabase Auth (email/password) |
| Backend | Node.js, Express.js (CommonJS) |
| Database | Supabase (PostgreSQL) — 10 NHANES-aligned normalized tables |
| ML API | Python, FastAPI, Pydantic (stub endpoints; models not yet trained) |
| ML Libraries | scikit-learn, PyTorch, Pandas, NumPy, StatsModels, Jupyter |
| Deployment | Vercel (frontend + backend as serverless functions) |

---

## Project Structure

```
Prognos/
├── frontend/               # React + Vite app
│   └── src/
│       ├── components/
│       │   ├── assessment/ # 7-step form components
│       │   ├── auth/       # ProtectedRoute
│       │   ├── common/     # Header, Footer
│       │   └── results/    # OverallRisk, CancerRiskBreakdown, RiskExplanation
│       ├── context/        # AuthContext (Supabase session)
│       ├── lib/            # Supabase client
│       ├── pages/          # HomePage, AssessmentPage, ResultsPage, auth pages
│       └── services/       # api.js (Axios + auth token interceptor)
├── backend/                # Express API
│   └── src/
│       ├── controllers/    # assessmentController, predictionController
│       ├── middleware/     # authMiddleware, errorHandler
│       ├── routes/         # /assessments (protected), /predict, /health
│       ├── services/       # mlService (scoring + ML fallback), assessmentService (Supabase)
│       └── config/         # supabase.js
├── ml/                     # Python FastAPI ML layer
│   ├── api/
│   │   ├── routes/         # predict.py (8 cancer stubs + /assess NHANES endpoint)
│   │   └── schemas/        # nhanes_assessment.py, prediction.py (Pydantic models)
│   ├── notebooks/          # Jupyter notebooks — one per cancer type + exploration/evaluation
│   ├── models/             # Placeholder directories for trained model files
│   └── src/                # BaseTrainer, FeatureEngineer, metrics stubs
├── database/
│   └── schema.sql          # Complete Supabase PostgreSQL schema
└── vercel.json             # Monorepo deployment config
```

---

## Running Locally

### Prerequisites

- Node.js 18+
- Python 3.10+
- A Supabase project (see [Supabase Setup](#supabase-setup) below)

### 1. Clone the repository

```bash
git clone https://github.com/JericoJr/Prognos.git
cd prognos
```

### 2. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project dashboard go to **Settings → API** and copy:
   - **Project URL**
   - **anon / public key**
3. Go to **Authentication → URL Configuration** and set:
   - **Site URL**: `http://localhost:3000`
   - **Redirect URLs**: `http://localhost:3000/reset-password`
4. Go to **SQL Editor**, paste the contents of `database/schema.sql`, and click **Run**
5. In the SQL Editor, also paste and run `database/enable_rls.sql` to enable Row Level Security
6. In **Authentication → Sign In / Up**, disable **Confirm email** so users can sign in immediately after registration

### 3. Backend

```bash
cd backend
cp .env.example .env
# Fill in your Supabase URL and anon key in .env
npm install
npm run dev       # starts on http://localhost:5000
```

### 4. Frontend

```bash
cd frontend
cp .env.example .env
# Fill in your Supabase URL and anon key in .env
npm install
npm run dev       # starts on http://localhost:3000
```

### 5. ML API (optional — app works without it via mock fallback)

```bash
cd ml
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

The app will automatically fall back to the mock scoring model if the ML API is not running.

### All three services running

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| ML API | http://localhost:8000 |
| Supabase Studio | Your Supabase dashboard |

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial Prognos deployment"
git push origin main
```

### 2. Import project on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Vercel will detect the `vercel.json` monorepo config automatically

### 3. Set environment variables in Vercel

Go to your project → **Settings → Environment Variables** and add:

**Frontend variables** (apply to all environments):
```
VITE_SUPABASE_URL        = https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY   = your-anon-key
```

**Backend variables**:
```
SUPABASE_URL             = https://your-project-id.supabase.co
SUPABASE_ANON_KEY        = your-anon-key
ML_API_URL               = https://your-ml-api-url  (if deployed separately)
NODE_ENV                 = production
FRONTEND_URL             = https://your-vercel-app.vercel.app
```

### 4. Update Supabase for production

In your Supabase dashboard → **Authentication → URL Configuration**:
- **Site URL**: `https://your-vercel-app.vercel.app`
- **Redirect URLs**: add `https://your-vercel-app.vercel.app/reset-password`

### 5. Deploy

Click **Deploy** — Vercel builds the frontend as a static site and the backend as a serverless Node.js function. All `/api/*` requests are routed to the backend automatically via `vercel.json`.

---

## Environment Variables Reference

### `frontend/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (default `/api` in production via Vite proxy) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon / public key |

### `backend/.env`

| Variable | Description |
|---|---|
| `PORT` | Express server port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `FRONTEND_URL` | Allowed CORS origin |
| `ML_API_URL` | FastAPI ML service URL (default `http://localhost:8000`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key (used to verify user JWTs) |

---

## Cancers Covered

| Cancer | Key NHANES Risk Variables Used |
|---|---|
| Lung | Smoking status, pack-years, age, asbestos/radon exposure |
| Breast | Sex, age, family history, BMI, alcohol |
| Colorectal | Age, diet, physical activity, family history, diabetes |
| Prostate | Sex, age, family history, PSA |
| Melanoma | UV exposure, skin changes symptom |
| Cervical | Sex, age, smoking |
| Bladder | Smoking, age, hydration (water intake) |
| Thyroid | Age, sex, family history, BMI |

---

## Roadmap

- [ ] Train ML models on NHANES dataset (scikit-learn / PyTorch pipelines in `ml/notebooks/`)
- [ ] Replace mock scoring with real model inference in `ml/api/routes/predict.py`
- [ ] Add SHAP explainability layer to results dashboard
- [ ] User assessment history — view and compare past assessments
- [x] Export results as PDF (Full Risk Report + Lab Results Summary)
- [ ] Deploy ML API (e.g., Railway, Render, or AWS Lambda)
