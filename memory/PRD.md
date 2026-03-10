# Divine Iris Healing - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of https://divineirishealing.com/ with admin panel and Stripe payments.

## Architecture
- **Frontend**: React + TailwindCSS + shadcn/ui
- **Backend**: FastAPI + Motor (async MongoDB)
- **Database**: MongoDB
- **Fonts**: Configurable via admin (default: Playfair Display headings, Lato body)

## What's Been Implemented

### Visual Fidelity (COMPLETED)
- [x] Playfair Display + Lato fonts, golden (#D4AF37) color scheme
- [x] Hero section, About section, golden menu overlay, footer
- [x] Image upload/display bug FIXED, Admin logout on refresh FIXED

### Enhanced Admin Panel (COMPLETED)
- [x] Visibility toggle (show/hide) for programs, sessions, testimonials
- [x] Drag reordering (up/down arrows) for programs, sessions
- [x] Site Settings: global font, color, size customization (Cinzel, Caveat, etc.)
- [x] Programs: CRUD + program_type (online/offline/hybrid), offer pricing, offer badge text, is_upcoming toggle, start date
- [x] Sessions: CRUD with 21 sessions from original site
- [x] Testimonials: 44 items (32 graphic + 12 video) with search indexing
- [x] Subscribers list, Stats view

### Services Page - Personal Sessions (COMPLETED)
- [x] Exact match to original site layout
- [x] Left sidebar with 21 session names + chevron arrows
- [x] "Claim your Personal space" header overlay on session image
- [x] Session title in UPPERCASE, Lato body text
- [x] Dark rounded "VIEW DETAILS & BOOK" button
- [x] Active state with gold left border

### Upcoming Programs Section (COMPLETED)
- [x] Section on homepage above "Shine a Light"
- [x] Program cards with image, pricing, offer badges (e.g., "20% OFF")
- [x] Program type badge (Online/In-Person/Hybrid)
- [x] Start date display, original price + offer price with strikethrough
- [x] "Know More" + "Enroll Now" buttons
- [x] Only shows when programs are marked as upcoming in admin

### Transformations Page (COMPLETED)
- [x] 44 testimonials (32 graphic + 12 video)
- [x] Real-time search bar
- [x] All/Graphic/Video tab filtering
- [x] Image lightbox + YouTube video modal
- [x] Added to footer and menu navigation

### Admin Credentials
- URL: /admin | Username: admin | Password: divineadmin2024

## Prioritized Backlog

### P0 - High Priority
- [ ] Complete Stripe payment flow (end-to-end with test key)
- [ ] Multi-currency detection on frontend

### P1 - Medium Priority
- [ ] "Express Your Interest" → contact page with pre-filled program name
- [ ] Media page with video content

### P2 - Low Priority
- [ ] Mobile responsiveness audit
- [ ] SEO meta tags
- [ ] Admin transactions view
