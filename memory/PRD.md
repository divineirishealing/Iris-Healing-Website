# Divine Iris Healing - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of https://divineirishealing.com/ with admin panel and Stripe payments.
The user wants full control over every element's styling via admin panel, video hero background, and smart upcoming programs with countdown timers.

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

### Hero Section (COMPLETED - Mar 10, 2026)
- [x] Purple logo removed from hero
- [x] Black overlay removed - video plays directly without dark plate
- [x] "ETERNAL HAPPINESS" subtitle in white (color configurable via admin)
- [x] Video background support (user uploads via admin)

### Site Logo Management (COMPLETED - Mar 10, 2026)
- [x] Admin can upload custom logo image
- [x] Admin can control logo width (40px-300px slider)
- [x] Logo displayed dynamically in About section from settings

### Enhanced Admin Panel (COMPLETED)
- [x] Visibility toggle + reorder for programs, sessions, testimonials
- [x] Site Settings: global font, color, size customization
- [x] Hero subtitle color picker
- [x] Logo upload + size control
- [x] Programs: CRUD + program_type, offer pricing, enrollment_open, deadline_date
- [x] Sessions: CRUD with 21 sessions from original site
- [x] Testimonials: 44 items (32 graphic + 12 video) with search
- [x] Per-section style overrides (font, size, color, bg)

### Testimonials Section (FIXED - Mar 10, 2026)
- [x] Video testimonials now display correctly with YouTube thumbnails
- [x] Tab switcher between "Video Testimonials" and "Transformations"
- [x] Proper image resolution for both graphic and video types

### Upcoming Programs (ENHANCED - Mar 10, 2026)
- [x] Expired programs still appear but payment is disabled
- [x] Live countdown timer with days/hours/minutes/seconds
- [x] "Limited Period Offer" highlighting with animated badges
- [x] "Registration Closed" overlay for expired programs
- [x] Deadline date field in admin panel

### Newsletter/Join Our Community (FIXED - Mar 10, 2026)
- [x] Background changed to white (was beige/cream)

### Section Alignment (FIXED - Mar 10, 2026)
- [x] Sponsor, Programs, Sessions sections use consistent max-width
- [x] 3-column grid properly aligned

### Services Page - Personal Sessions (COMPLETED)
- [x] Static "Claim your Personal space" iris header
- [x] Left sidebar with 21 sessions, right side shows details on click
- [x] Pricing display with auto-detected currency
- [x] "VIEW DETAILS & BOOK" button

### Stripe Payment Gateway (COMPLETED)
- [x] Multi-currency: AED (base), USD, INR, EUR, GBP
- [x] Auto-detection via IP, manual switcher on checkout
- [x] Checkout flow with Stripe redirect
- [x] Payment Success/Cancel pages
- [x] Enrollment toggle (open/closed)
- [x] Transaction records + webhook handler

### Admin Credentials
- URL: /admin | Username: admin | Password: divineadmin2024

## Prioritized Backlog

### P0 - High Priority
- [ ] Per-element granular styling admin panel (font size, style, color for every heading/body/button per section)

### P1 - Medium Priority
- [ ] Admin Transactions tab to view all payments
- [ ] "Express Your Interest" pre-fill program name on contact page
- [ ] Media page with video content from original site
- [ ] Re-upload graphic testimonial images to local storage (external URLs unreliable)

### P2 - Low Priority
- [ ] Mobile responsiveness audit
- [ ] SEO meta tags
- [ ] Email notifications for admin on new payments/subscriptions
- [ ] Refactor AdminPanel.jsx into smaller components
