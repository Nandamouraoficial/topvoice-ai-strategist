

# TopVoice AI — Full Build Plan

## Overview
Build a premium AI-powered LinkedIn personal brand strategist app with dark/gold design system, access code gating, 20-step career questionnaire, LinkedIn analysis engine, section-by-section executive report, gamification, editorial calendar, admin panel, and mentee dashboard. All in PT-BR.

## Phase 1 — Design System & Layout Foundation
- Set up custom color tokens (navy-950 through gold-500, platinum, surface, etc.) in Tailwind config and CSS variables
- Configure Inter font (400–800 weights)
- Create reusable glass card, gold button, input, badge, and score components
- Build dark sidebar layout with navigation (Dashboard, Relatório, Plano de Ação, Calendário, Conquistas, Configurações)
- Implement micro-animations via Tailwind CSS (fade-in, slide, scale, count-up numbers, progress ring fill)

## Phase 2 — Access Code System
- Access code entry screen: dark full-screen with glass card, monospace input, gold CTA
- Validation flow with shake animation on error, smooth transition on success
- Token states: created → activated → analysis_used → expired → bonus_granted
- localStorage persistence for session

## Phase 3 — Welcome Screen
- Animated dark screen with floating orbs/particles (CSS)
- Personalized greeting with gold accent
- 3 feature pills, progress indicator, CTA button

## Phase 4 — Strategic Questionnaire (20 Steps)
- Multi-step wizard with slide transitions and gold progress bar
- **Bloco 1 (Steps 1–5):** Name, role/company, segment grid cards, experience slider, professional description textarea
- **Bloco 2 (Steps 6–10):** Goals, timeline selector, motivation, multi-select objective cards with emojis, Top Voice references
- **Bloco 3 (Steps 11–16):** LinkedIn self-assessment radio cards, posting frequency, content types, challenges, achievements, insecurities
- **Bloco 4 (Steps 17–20):** LinkedIn URL with validation, language, Creator Mode, Newsletter status
- Final confirmation summary card with gold CTA
- Auto-save every step to localStorage

## Phase 5 — LinkedIn Ownership Verification
- Generate unique TOPVOICE-XXXXXXXX code
- Step-by-step instructions with copy button
- Verify button with retry counter (5 attempts)
- Success/failure animations
- Store verification status

## Phase 6 — Analysis Loading Screen
- Full dark screen with pulsing logo and circular gold progress ring
- 14 rotating status messages (2s each)
- Progress percentage 0→100

## Phase 7 — Analysis Report (Main Deliverable)
- **Header:** Profile photo with gold ring, name/role, animated circular score gauge, 4 mini score cards
- **Rank display:** Full-width banner with rank icon, XP earned, progress bar
- **Executive Diagnosis:** Gold-accented card with AI assessment and pull quote
- **Radar Chart:** 360° radar chart (Recharts) with 17 dimensions, highlighted highs/lows
- **17 Section Cards:** Each with score badge, status pill, "O que está funcionando" vs "O que precisa mudar" columns, immediate action, 90-day strategy. Special sections include:
  - Headline: 5 alternative versions with copy buttons
  - About: side-by-side current vs rewritten with copy
  - Experiences: current vs suggested rewrites
  - Recommendations: 3 scripts in accordions
  - Content strategy: pillar cards + post ideas
- **Editorial Calendar:** Frequency negotiation screen → AI recommendation → user selection → monthly grid/list calendar with colored content pillars, exportable
- **Action Plan:** 3-phase visual timeline (30/60/90 days) with checklists, Top 5 priority cards
- **Top Voice Potential:** Dark card with gauge, timeline estimate, accelerators/blockers
- **Badges Earned:** Horizontal scroll of earned/locked badges
- Export PDF button, share report link

## Phase 8 — Action Items Page
- Filterable checklist (Tudo / 30 dias / 60 dias / 90 dias / Imediato)
- Sortable by impact, XP, deadline
- Animated checkbox completion with XP counter increment
- Badge unlock celebration modal
- Progress ring showing overall completion

## Phase 9 — Mentee Dashboard
- Stats cards: Current Score, XP Total, Ações Concluídas, Streak
- Rank card with XP progress bar
- Score evolution line chart (Recharts)
- Recent activity feed
- Badges grid (earned + locked in grayscale)

## Phase 10 — Gamification System
- 8 ranks (Invisível → Ícone) with colored glow icons
- 20 badges across 4 rarities (Common/Rare/Epic/Legendary)
- XP transaction tracking for all actions
- Streak system (consecutive weeks posting)
- Rank-up celebration overlay with confetti/particles

## Phase 11 — Admin Panel
- Admin login with password
- Stats header: total tokens, active mentees, analyses count
- Token management table with actions (view report, grant bonus, reset, expire, copy, email)
- Generate tokens modal with optional name/email and auto-send toggle
- Mentee overview grid with score badges, rank icons, trend arrows
- Per-mentee admin notes

## Phase 12 — Backend & Database (Lovable Cloud)
- Set up all tables: access_tokens, users, questionnaire_responses, linkedin_raw_data, verification_attempts, analyses, mentee_gamification, xp_transactions, completed_actions, editorial_calendars, report_shares, admin_notes
- RLS policies for mentee/admin access
- Edge functions for:
  - Token validation
  - LinkedIn profile fetch (Proxycurl) — mock for now
  - GPT-4o analysis with VERA prompt — mock for now
  - Welcome email (Resend) — mock for now
  - Report sharing (token-based public access)

## Phase 13 — Polish & UX
- Skeleton loaders everywhere (no spinners)
- All copy buttons show "Copiado! ✓" feedback
- Helpful error states with specific instructions
- Encouraging empty states
- Full mobile responsiveness
- All text in PT-BR with realistic placeholders

## Notes
- All API integrations (OpenAI, Proxycurl, Resend) will use **mock data** initially since keys aren't ready yet. The UI and flow will be fully functional with realistic mock responses.
- Backend will use **Lovable Cloud** (Supabase under the hood).
- Animations use **CSS/Tailwind** (no Framer Motion dependency).
- This is a very large application — implementation will proceed incrementally, building foundational pieces first, then layering on features.

