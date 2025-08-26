# Dor Real Estate Platform

## Overview

This is a Hebrew real estate platform for "דור נכסים" (Dor Real Estate) that serves as a comprehensive property investment and services website. The platform features a modern, minimalist design with an emphasis on user experience and client acquisition through an interactive onboarding process. The application focuses on connecting potential clients with various real estate services including development, marketing, property management, and financial consulting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Firebase Authentication** using phone number + invisible reCAPTCHA  
- **Client-side property database** (JavaScript module) for browsing, filtering, and swipe interaction  
- **LocalStorage persistence** for user data, onboarding progress, and preferences  
- **No dedicated backend server required** — all logic runs in the client with Firebase providing secure auth  

### Frontend Architecture
- **Single-page application** with vanilla HTML, CSS, and JavaScript  
- **RTL (Right-to-Left) layout** optimized for Hebrew content  
- **Responsive design** using CSS Grid and Flexbox with mobile-specific breakpoints  
- **Modal-based navigation** system for company info, services, team, and legal pages  
- **Onboarding flow** with hero CTA → registration → property questionnaire → swipe deck  

### UI/UX Design Patterns
- **Minimalist modern design** with emphasis on clarity and visual hierarchy  
- **Color scheme** featuring gold primary (#d4af37) with neutral/dark contrasts  
- **Typography** using Heebo and Inter fonts for Hebrew and English content  
- **Backdrop blur effects** and transparency for modern app-like feel  
- **Toast notifications** and inline error handling for better feedback  

### Interactive Features
- **Phone authentication** with SMS code validation  
- **Multi-step onboarding process** with a short questionnaire (area, budget, rooms, property type)  
- **Swipe interface** for property discovery (Tinder-style like/dislike interaction)  
- **End-of-deck results** with dynamic CTA buttons (schedule meeting / talk to advisor)  
- **Social media integration** with Facebook, Instagram, LinkedIn, WhatsApp links  
- **Accessibility toolbar** with font scaling, high contrast, grayscale, invert, and reset  

### Content Management Strategy
- **Content stored as modular JavaScript objects** in `script_fixed.js`  
- **Dynamic rendering** into modals on demand  
- **Static property database** in `propertyDatabase.generated.js` for initial MVP  
- **Fallback logic** for empty searches → trending properties displayed  

### User Journey Architecture
1. **Landing page** with hero branding and CTA  
2. **Onboarding intro** explaining the experience  
3. **Phone verification** via Firebase  
4. **Quick questionnaire** (area, budget, rooms, type)  
5. **Swipe deck** of matching or trending properties  
6. **End-of-deck CTA** to contact advisors or book a meeting  

### State Management
- **Client-side state object (`userData`)** for auth and onboarding progress  
- **LocalStorage persistence** for returning users  
- **Step navigation** handled by `onboardingSteps` and `goToStepType`  
- **Progress bar** with fill and step text  

### Responsive Design Strategy
- **Mobile-first approach** with progressive enhancement for desktops  
- **Typography scaling** using `clamp()` on the `html` font-size  
- **Fluid grids** that collapse to single column under 900px  
- **Tap-friendly buttons** (≥44px height) with spacing for touch devices  
- **Overflow handling**: modals and onboarding containers have `max-height` + scroll for smaller screens  
- **Safety wrappers** to avoid horizontal scrolling on mobile  

## External Dependencies

### Third-party Services
- **Firebase Authentication** for phone verification  
- **Google Fonts API** (Heebo, Inter) for typography  
- **Font Awesome CDN** for icons and social links  

### Planned Integrations
- **Analytics tracking** for funnel optimization  
- **CRM system** for lead capture and client management  
- **A/B testing** on onboarding flows and modals  
- **Payment integrations** for service fees or property deposits  
- **Live property listing API** for dynamic inventory  

### Browser Dependencies
- **Modern browser support** (CSS Grid, Flexbox, backdrop-filter)  
- **ES6+ JavaScript** features (modules, arrow functions, async/await)  
- **LocalStorage** for persistence  
- **Touch events** for swipe interface  

### Content Dependencies
- **Hebrew language support** (RTL rendering)  
- **Property images** stored in `prop_pics` directory for presentation  
- **SVG and PNG logo assets** for branding  
- **Video & media support** for future storytelling content  
