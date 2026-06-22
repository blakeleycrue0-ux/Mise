# Mise — AI Nutrition + Cooking Assistant (MVP scaffold)

Mise is **not a calorie tracker**. It's a personalized cooking coach + AI food
system + virtual pet companion. Mobile-first, premium but accessible, playful
without being childish (no emoji in the product UI).

This is the React Native (Expo) + TypeScript + Supabase scaffold. It runs
**end-to-end with zero backend** thanks to a mock AI provider and a local-only
fallback, then upgrades transparently once Supabase + an AI gateway are configured.

---

## 1. Project structure

```
mise-app/
├─ index.ts                  # Expo entry -> src/app/App.tsx
├─ app.json                  # Expo config (permissions, plugins, extra)
├─ babel.config.js           # path aliases (@services, @features, …)
├─ tsconfig.json             # strict TS + path aliases
├─ .env.example              # Supabase + AI gateway config
│
├─ supabase/
│  ├─ schema.sql             # full DB: tables, indexes, RLS, triggers, storage
│  └─ functions/ai/index.ts  # AI gateway Edge Function (holds the model key)
│
└─ src/
   ├─ app/                   # App root (providers, navigation container)
   ├─ navigation/            # RootNavigator, MainTabs, typed param lists
   ├─ screens/               # screen components
   │  └─ onboarding/         # Welcome, Steps, Generating
   ├─ components/            # Button, Screen, ProgressBar, OptionCard
   ├─ services/
   │  ├─ ai/                 # AIService facade + swappable providers + prompts
   │  │  └─ providers/       # GatewayProvider (server), MockProvider (offline)
   │  ├─ supabase/           # client + auth helpers
   │  ├─ nutrition/          # BMR/TDEE/macros (deterministic, never AI)
   │  └─ vision/             # image-feature wrappers over AIService
   ├─ features/
   │  ├─ onboarding/         # steps config, useOnboarding, generateProfile
   │  ├─ cooking_coach/      # (core, built on request)
   │  ├─ meal_planner/       # (built on request)
   │  ├─ pet_system/         # PetState engine (pure logic, included)
   │  ├─ food_scan/          # (built last)
   │  └─ fridge_scan/        # (built last)
   ├─ state/                 # zustand stores (user, onboarding, pet)
   ├─ utils/                 # theme, config, formatting
   ├─ types/                 # all shared TypeScript types
   └─ assets/                # images, pet animations
```

## 2. Getting started

```bash
cd mise-app
npm install
cp .env.example .env      # optional — app runs without it (mock mode)
npm start
```

- **No `.env`** → AI uses `MockProvider`, profiles stay in local state. Fully runnable.
- **With Supabase** → run `supabase/schema.sql` in the SQL editor, set
  `EXPO_PUBLIC_SUPABASE_URL` / `_ANON_KEY`. Auth + persistence turn on.
- **With AI gateway** → deploy `supabase/functions/ai`, set
  `EXPO_PUBLIC_AI_GATEWAY_URL`. Real model calls turn on. Swap models in the
  gateway's `MODEL_FOR_KIND` map — no app change.

## 3. AI layer design (swappable by construction)

```
screen/feature ─▶ AIService ─▶ AIProvider (interface)
                     │            ├─ GatewayProvider ─▶ Edge Function ─▶ model vendor
                     │            └─ MockProvider (offline/dev/CI)
                     └─ logs every call to ai_interactions_log
```

`AIProvider` (`src/types/ai.ts`) defines the five methods from the spec —
`analyzeFood`, `analyzeFridge`, `generateMealPlan`, `generateRecipe`,
`coachCookingStep` — each returning a structured `AIResult<T>` (JSON only,
never free text). The model vendor key never ships in the app.

## 4. Build order (staged, to avoid scope explosion)

1. ✅ Onboarding + user profile
2. ⬜ Cooking coach (MVP core)
3. ⬜ Meal planner
4. ⬜ Pet system UI (engine already included)
5. ⬜ Food + fridge scanning

Each remaining module has a documented contract in its `features/<module>/index.ts`.
