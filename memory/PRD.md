# Divine Iris Healing - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of https://divineirishealing.com/ with admin panel, Stripe payments, and a robust multi-step enrollment system with anti-fraud India-gating.

## Architecture
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Backend**: FastAPI + Motor (async MongoDB) + emergentintegrations (Stripe)
- **Database**: MongoDB
- **Payments**: Stripe (test mode) via emergentintegrations library

## What's Been Implemented

### Multi-Person Enrollment System v2 (COMPLETED - Feb 2026)
- [x] **3-Step Flow**: Participants → Verify → Pay (reduced from 4 steps)
- [x] **Per-Participant Fields**: name, relationship, age, gender, country, attendance_mode (online/offline), notify toggle, optional email/phone
- [x] **Booker Section**: Name, email, country — verified separately
- [x] **Attendance Mode Per Person**: Each participant independently selects Online (Zoom) or Remote Healing (offline)
- [x] **Notification Preferences**: Toggle per participant — if enabled, collects their email and phone for session info
- [x] **Dynamic Participant Management**: Add/remove participant forms dynamically
- [x] **Payment Summary**: Shows each participant with attendance mode badge (Zoom/Remote) and per-person pricing
- [x] **Total Pricing**: Correctly multiplies per-person price × participant count

### Anti-Fraud India-Gating (COMPLETED - Mar 10, 2026)
- [x] **VPN/Proxy Detection**: ip-api.com detects VPN, Tor, proxy, hosting IPs
- [x] **Strict India Validation**: ALL must pass for INR pricing:
  - IP must be Indian (no VPN/proxy)
  - Booker country must be India
  - Phone must be +91 prefix
- [x] **BIN Validation**: Card BIN checked against Indian bank prefixes + binlist.net API
- [x] **PPP Tiers**: Fixed AED base, INR multiplier (0.14x)
- [x] **If ANY check fails → AED base price** with detailed fraud warning

### Phone OTP Verification (COMPLETED - MOCKED)
- [x] 6-digit OTP generated server-side
- [x] Mock OTP displayed on frontend for testing
- [x] OTP expiry (5 min), max attempts (5)

### Stats Section (COMPLETED - Mar 10, 2026)
- [x] Exact replica of original: black background, gold particles.js canvas animation
- [x] FontAwesome icons (users, calendar, infinity, award)
- [x] Cinzel serif font with golden glow text-shadow

### Hero Section (COMPLETED - Mar 10, 2026)
- [x] Video background, no black screen, no overlay
- [x] Admin controls: title font/size/color/bold/italic/alignment, subtitle same
- [x] Logo upload + width slider in admin

### Previous Completions
- [x] Pixel-perfect site clone (all pages)
- [x] Services page with interactive sidebar
- [x] Stripe payment gateway (multi-currency)
- [x] Advanced admin panel (visibility, reorder, CRUD)
- [x] Testimonials (video + graphic tabs)
- [x] Upcoming programs with countdown timers
- [x] Newsletter section (white background)
- [x] Section alignment fixes

### Admin Credentials
- URL: /admin | Username: admin | Password: divineadmin2024

## Key API Endpoints
- `POST /api/enrollment/start` — Create enrollment with booker info + participants (per-person country, attendance_mode, notify, email, phone)
- `POST /api/enrollment/{id}/send-otp` — Send phone OTP (MOCK)
- `POST /api/enrollment/{id}/verify-otp` — Verify OTP
- `GET /api/enrollment/{id}/pricing` — Get pricing with security checks
- `POST /api/enrollment/{id}/validate-bin` — Card BIN validation
- `POST /api/enrollment/{id}/checkout` — Create Stripe session

## Prioritized Backlog

### P0 - High Priority
- [ ] Replace mock phone OTP with Firebase Phone Auth
- [ ] Per-element granular styling admin panel (all sections)

### P1 - Medium Priority
- [ ] Admin Enrollments tab to view all registrations
- [ ] Admin Transactions tab to view all payments
- [ ] Re-upload graphic testimonial images to local storage

### P2 - Low Priority
- [ ] Mobile responsiveness audit
- [ ] SEO meta tags
- [ ] Refactor AdminPanel.jsx into smaller components
