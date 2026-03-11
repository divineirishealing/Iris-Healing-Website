# Divine Iris Healing - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of https://divineirishealing.com/ with comprehensive admin panel, robust enrollment system with anti-fraud India-gating, custom duration tiers, promotions/coupon system, and geo-based currency detection.

## Architecture
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Backend**: FastAPI + Pydantic + Motor (async MongoDB)
- **Database**: MongoDB
- **Payments**: Stripe (test mode) via emergentintegrations
- **Email**: Resend (configured, pending domain verification)

## What's Been Implemented

### Geo-Currency Auto-Detection (COMPLETED - Mar 11, 2026)
- [x] **IP-based country detection** via ip-api.com
- [x] **Single currency display** - Users see only their local currency (UAE→AED, India→INR, US→USD)
- [x] **Non-primary currencies** converted from AED using admin-managed fixed exchange rates
- [x] **CurrencyContext** provides getPrice/getOfferPrice/formatPrice across all pages
- [x] **Exchange Rates admin tab** with 38+ currencies, editable table with Save/Reload
- [x] **No more currency switcher** - auto-detected, fraud-proof

### Revamped Enrollment Flow (COMPLETED - Mar 11, 2026)
- [x] **4-step flow**: Participants → Review Cart + Promo → Billing + OTP → Pay
- [x] **Promo code input** at Review step with real-time validation
- [x] **Cart summary** showing program, tier, price per person, participants, subtotal, discounts, total
- [x] **Booker & billing last** - participants first, then billing details
- [x] **Tier passed via URL** (?tier=0/1/2) from homepage cards

### Homepage Program Cards Fix (COMPLETED - Mar 11, 2026)
- [x] **Explicit "Enroll Now" button** on every priced card
- [x] **Duration selector** works without navigating away
- [x] **Annual tier** shows "Contact for Pricing" → navigates to quote form
- [x] **Single currency** pricing on all cards

### Request Quote System (COMPLETED - Mar 11, 2026)
- [x] **Contact page** accepts ?program=X&title=Y&tier=Z params
- [x] **Pre-fills message** with program/tier context
- [x] **Backend endpoint** POST /api/enrollment/quote-request saves to DB
- [x] **"Request a Quote" heading** when accessed from Annual tier

### Program UI/UX Simplification (COMPLETED - Mar 11, 2026)
- [x] Interactive duration selectors on all program cards
- [x] Excel-like pricing table in admin
- [x] All 6 programs as flagship with 3 tiers
- [x] "Contact for Pricing" for Annual tier (price=0)

### Previous Features (All COMPLETED)
- Multi-Person Enrollment with anti-fraud India-gating
- Promotions & Coupons (percentage/fixed, multi-currency)
- 12-tab Admin Panel (Hero, About, Programs, Sessions, Testimonials, Stats, Newsletter, Header/Footer, Enrollments, Promotions, Exchange Rates, Subscribers, Global Styles)
- Stripe payment integration
- Resend email integration (pending domain verification)

## Key API Endpoints
- `GET /api/currency/detect` - IP-based currency detection
- `GET/PUT /api/currency/exchange-rates` - Admin exchange rates
- `GET/POST/PUT/DELETE /api/programs` - Programs CRUD with duration_tiers
- `GET/POST/PUT/DELETE /api/promotions` - Promotions CRUD
- `POST /api/promotions/validate` - Validate coupon code
- `POST /api/enrollment/start` - Create enrollment
- `POST /api/enrollment/{id}/send-otp` - Send OTP
- `POST /api/enrollment/{id}/verify-otp` - Verify OTP
- `POST /api/enrollment/{id}/checkout` - Stripe checkout
- `POST /api/enrollment/quote-request` - Save quote request
- `GET /api/payments/status/{session_id}` - Payment verification

## Prioritized Backlog

### P0 - High Priority
- [ ] User login/registration system
- [ ] Annual Subscriber dashboard (enrolled programs, upcoming sessions, availed vs remaining, payment history, next due, reminders, progress tracking)
- [ ] Annual Subscriber special discount tier

### P1 - Medium Priority
- [ ] Verify Resend domain for live email
- [ ] Replace mock phone OTP with real provider (Twilio/Firebase)
- [ ] Mobile responsiveness audit
- [ ] PPP enforcement: Block INR pricing if billing country ≠ India

### P2 - Low Priority
- [ ] SEO meta tags
- [ ] Admin analytics dashboard
- [ ] Bulk export enrollments (CSV)
- [ ] Quote request management in admin panel

## Admin Credentials
- URL: /admin | Username: admin | Password: divineadmin2024

## Test Data
- 6 programs: All flagship with 3 tiers (1 Month/3 Months/Annual)
- Annual tier: price=0 → triggers "Contact for Pricing"
- Promo codes: EARLY50 (fixed AED50/INR1000/USD15), NY2026 (15% off)
- Phone OTP: MOCKED (test code displayed on screen)
