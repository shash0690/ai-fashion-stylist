# AI Fashion Stylist (MVP)

A minimal, ready-to-run skeleton for an AI-powered fashion stylist web app (frontend + backend).

## Features
- Upload a photo
- (Mock or real) AI analysis for color tone + style
- Outfit recommendations from a small dataset
- Simple React frontend to preview results

## Quick Start

### 0) Requirements
- Node.js 18+
- npm

### 1) Backend
```bash
cd backend
cp .env.sample .env   # keep MOCK_MODE=true for local testing
npm install
npm run dev
```
The backend runs at http://localhost:5000

### 2) Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend runs at http://localhost:5173

### 3) Test
Open the frontend in your browser, upload any image, and you should see mock analysis + outfit suggestions.

## Real AI (Optional)
- Set `MOCK_MODE=false` in `backend/.env`
- Google Vision: provide credentials (`GOOGLE_APPLICATION_CREDENTIALS`)
- Hugging Face: set `HF_API_KEY` (and optionally `HF_MODEL_URL`)

## Project Structure
```
ai-fashion-stylist/
  backend/
    data/outfits.json
    services/
      googleVision.js
      huggingFace.js
      outfitRecommendation.js
    index.js
    package.json
    .env.sample
  frontend/
    index.html
    vite.config.js
    src/
      App.jsx
      main.jsx
      components/
        UploadForm.jsx
        OutfitCard.jsx
    package.json
```