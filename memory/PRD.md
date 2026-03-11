# Divine Iris Healing - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of https://divineirishealing.com/ with a comprehensive admin panel, robust enrollment system with anti-fraud India-gating, custom duration tiers, and a promotions/coupon system.

## Architecture
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Backend**: FastAPI + Pydantic + Motor (async MongoDB)
- **Database**: MongoDB
- **Payments**: Stripe (test mode) via emergentintegrations
- **Email**: Resend (configured, pending domain verification)

## What's Been Implemented

### Program UI/UX Simplification Refactor (COMPLETED - Mar 2026)
- [x] **Interactive Duration Selector**: 1 Month / 3 Months / Annual buttons on all program cards (Upcoming + Flagship sections)
- [x] **Contact for Pricing**: Annual tier with price=0 shows "Contact for Pricing" button instead of price
- [x] **Excel-like Pricing Table**: Admin panel has spreadsheet-style table for managing Duration/AED/INR/USD/Offer columns
- [x] **All 6 Programs Flagship**: Every program has 3 duration tiers seeded with proper pricing
- [x] **Merged Mode Field**: Session mode and program type merged into single "Mode" dropdown (Online / Remote)
- [x] **Simplified Admin Hints**: Helper text "Leave Annual at 0 = Contact for Pricing"

### Programs Enhancement (COMPLETED - Mar 2026)
- [x] **Session Mode**: Each program has Online (Zoom) / Remote Healing / Both
- [x] **Start & End Dates**: Displayed on program detail and upcoming sections
- [x] **Flagship Programs**: Toggle to enable custom duration tiers
- [x] **Custom Duration Tiers**: Admin defines tiers (label, per-tier pricing in AED/INR/USD)
- [x] **Duration Tier Cards**: Program detail page shows tier cards with Select buttons
- [x] **Upcoming Programs**: Shows session mode badges, dates, countdown timers, duration selectors

### Promotions & Coupons System (COMPLETED - Mar 2026)
- [x] **3 Promo Types**: Coupon Code, Early Bird, Limited Time Offer
- [x] **2 Discount Types**: Percentage (%) or Fixed Amount
- [x] **Multi-Currency Fixed Discounts**: AED (base), INR, USD
- [x] **Applicability**: All programs or specific programs (checkboxes)
- [x] **Usage Limits**: Max uses, used count tracking
- [x] **Validation API**: POST /api/promotions/validate

### Comprehensive Admin Panel (12 Tabs)
1. Hero Banner
2. About
3. Programs (with Excel-like pricing)
4. Sessions
5. Testimonials
6. Stats
7. Newsletter
8. Header & Footer
9. Enrollments
10. Promotions
11. Subscribers
12. Global Styles

### Multi-Person Enrollment v2
- [x] 3-step flow: Participants -> Verify -> Pay
- [x] Per-participant: country, attendance mode, notification toggle
- [x] Anti-fraud India-gating (VPN, IP, phone, BIN checks)

### Email Notifications (Resend)
- [x] Booker confirmation + participant notifications
- [x] Pending: Domain verification for custom sender

## Key API Endpoints
- `GET/POST/PUT/DELETE /api/programs` - Programs CRUD with duration_tiers
- `GET/POST/PUT/DELETE /api/promotions` - Promotions CRUD
- `POST /api/promotions/validate` - Validate coupon code
- `GET/PUT /api/settings` - Site settings
- `POST /api/enrollment/start` - Multi-person enrollment
- `POST /api/enrollment/{id}/checkout` - Stripe checkout
- `GET /api/payments/status/{session_id}` - Payment verification

## Prioritized Backlog

### P0 - High Priority
- [ ] User login/registration system
- [ ] Annual Subscriber dashboard (enrolled programs, upcoming sessions, availed vs remaining, payment history, next due, reminders, progress tracking)
- [ ] Annual Subscriber special discount tier
- [ ] Apply coupon codes in enrollment checkout flow

### P1 - Medium Priority
- [ ] Verify Resend domain for live email
- [ ] Replace mock phone OTP with real provider
- [ ] Mobile responsiveness audit

### P2 - Low Priority
- [ ] SEO meta tags
- [ ] Admin analytics dashboard
- [ ] Bulk export enrollments (CSV)

## Admin Credentials
- URL: /admin | Username: admin | Password: divineadmin2024

## Test Data
- All 6 programs: Flagship with 3 tiers (1 Month/3 Months/Annual)
- Annual tier: price=0 -> triggers "Contact for Pricing"
- Phone OTP: MOCKED (test code displayed on screen)
