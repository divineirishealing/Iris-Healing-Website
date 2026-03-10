# Divine Iris Healing - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of https://divineirishealing.com/ with admin panel and Stripe payments.

## Architecture
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Backend**: FastAPI + Motor (async MongoDB) + emergentintegrations (Stripe)
- **Database**: MongoDB
- **Payments**: Stripe (test mode) via emergentintegrations library

## What's Been Implemented

### Visual Fidelity (COMPLETED)
- [x] Playfair Display + Lato fonts, golden (#D4AF37) color scheme
- [x] Hero, About, golden menu overlay, footer, floating buttons
- [x] Image upload/display FIXED, Admin logout on refresh FIXED

### Enhanced Admin Panel (COMPLETED)
- [x] Visibility toggle + reorder for programs, sessions, testimonials
- [x] Site Settings: global font, color, size customization
- [x] Programs: CRUD + program_type, offer pricing, enrollment_open toggle
- [x] Sessions: CRUD with 21 sessions from original site
- [x] Testimonials: 44 items (32 graphic + 12 video) with search
- [x] AED base pricing for all items

### Services Page - Personal Sessions (COMPLETED)
- [x] Static "Claim your Personal space" iris header
- [x] Left sidebar with 21 sessions, right side shows details on click
- [x] Pricing display with auto-detected currency
- [x] "VIEW DETAILS & BOOK" button

### Upcoming Programs + Transformations (COMPLETED)
- [x] Upcoming Programs section on homepage with offer badges, type badges
- [x] Transformations page with real-time search + tab filtering

### Stripe Payment Gateway (COMPLETED)
- [x] **Multi-currency**: AED (base), USD, INR, EUR, GBP
- [x] **Auto-detection**: Currency detected via IP, defaults to AED
- [x] **Manual switcher**: Dropdown on checkout page to pick currency
- [x] **Checkout flow**: Item summary → currency select → order total → Stripe redirect
- [x] **Stripe Checkout Sessions**: Created via emergentintegrations library
- [x] **Payment Success/Cancel pages**: With status polling and retry
- [x] **Enrollment toggle**: Programs can be open/closed for enrollment
  - Open: "Enroll Now" → checkout page
  - Closed: "Express Your Interest" → contact page
- [x] **Transaction records**: Stored in payment_transactions collection
- [x] **Webhook handler**: /api/webhook/stripe for payment completion

### Admin Credentials
- URL: /admin | Username: admin | Password: divineadmin2024

## Prioritized Backlog

### P1 - Medium Priority
- [ ] Admin Transactions tab to view all payments
- [ ] "Express Your Interest" pre-fill program name on contact page
- [ ] Media page with video content from original site

### P2 - Low Priority
- [ ] Mobile responsiveness audit
- [ ] SEO meta tags
- [ ] Email notifications for admin on new payments/subscriptions
