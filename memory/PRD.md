# PRD - Tealor Mode Link-in-Bio Landing Page

## Original Problem Statement
Build a high-converting "link in bio" landing page for a fitness creator brand called "Tealor Mode" with a dark theme, minimal design, and mobile-first approach. The page should drive users to download a free fitness PDF and visit social media profiles.

## User Personas
- **Primary**: Fitness enthusiasts seeking transformation guidance
- **Secondary**: Social media followers looking for free resources and training programs

## Core Requirements
1. Dark theme (pure black background with lime green accents)
2. Mobile-first, centered layout design
3. Profile section with avatar, name, and bio
4. Primary CTA for PDF download
5. Social media links (YouTube, TikTok, Instagram)
6. Free resource showcase (Protocolo ABS)
7. Future products section (placeholders)
8. Final conversion CTA
9. Smooth animations and hover effects

## Architecture & Tech Stack
- **Frontend**: React (Vite/CRA), Tailwind CSS, Lucide React icons
- **Backend**: FastAPI, MongoDB (to be implemented)
- **Design System**: Neon-tech guidelines (pure black + lime green #d9fb06)

## What's Been Implemented (December 2026)

### ✅ Phase 1 - Frontend with Mock Data (Completed)
**Date**: December 17, 2026

**Files Created**:
- `/app/frontend/src/pages/Home.jsx` - Main landing page component
- `/app/frontend/src/data/mock.js` - Mock data for all content
- `/app/frontend/src/App.css` - Custom styles following neon-tech guidelines
- Updated `/app/frontend/src/App.js` - Routing configuration
- Updated `/app/frontend/src/index.css` - Global styles with Inter font

**Features Implemented**:
1. ✅ Profile Section
   - Circular avatar with lime green border and glow effect
   - Brand name "Tealor Mode"
   - Bio and tagline with proper typography
   
2. ✅ Primary CTA Button
   - Large lime green button with flame icon
   - Pulse animation for attention
   - Mock download functionality with alert

3. ✅ Social Links Section
   - Three buttons for YouTube, TikTok, Instagram
   - External links to real social profiles
   - Hover effects with color transition
   - Lucide-react icons (not emojis)

4. ✅ Free Resource Card (Protocolo ABS)
   - Dark card with border
   - Title, description, download button
   - Hover effects with lift animation

5. ✅ Future Products Section
   - Two placeholder cards (Rutina Avanzada, Curso Completo)
   - "PRÓXIMAMENTE" status badges
   - Grid layout (responsive)

6. ✅ Final CTA Section
   - Strong message in bordered container
   - Lime green border accent
   - Download button

7. ✅ Footer
   - Copyright text
   - Minimal styling

**Design Implementation**:
- ✅ Pure black background (#000000)
- ✅ Lime green primary color (#d9fb06)
- ✅ Pill/capsule buttons (border-radius: 10rem)
- ✅ Inter font family
- ✅ Mobile-first responsive design
- ✅ Smooth transitions and animations
- ✅ High contrast for readability
- ✅ Centered layout (max-width: 600px)
- ✅ No prohibited color combinations
- ✅ Proper use of lucide-react icons

**Real Assets Used**:
- Avatar image: User-provided Tealor Mode branding
- Social URLs: Real links to YouTube, TikTok, Instagram profiles

**Mock Functionality**:
- PDF download triggers browser alert (needs backend integration)
- All buttons and interactions working on frontend only

## Prioritized Backlog

### P0 Features (Next Phase)
1. **Backend Development**
   - PDF file upload and storage system
   - Download endpoint for Protocolo ABS PDF
   - Click tracking for analytics
   - MongoDB models for downloads and tracking

2. **PDF Integration**
   - Connect download buttons to actual PDF file
   - Implement file serving from backend
   - Add download counter

### P1 Features
1. **Analytics**
   - Track button clicks (social links, downloads)
   - View counts and conversion metrics
   - Admin dashboard for stats

2. **Email Capture** (Optional)
   - Collect email before PDF download
   - Basic email validation
   - Store in database for marketing

### P2 Features
1. **Admin Panel**
   - Update content without code changes
   - Upload new PDFs
   - View analytics

2. **Additional Resources**
   - Multiple downloadable resources
   - Video content embeds
   - Blog/content section

## Next Tasks
1. User to provide the Protocolo ABS PDF file
2. Build backend API for PDF storage and download
3. Integrate frontend with backend API
4. Remove mock data and connect to real download functionality
5. Add analytics tracking (optional)
6. Test end-to-end flow with real PDF

## API Contracts (To Be Implemented)

### Download Endpoint
```
POST /api/download
Body: { resource_id: string }
Response: { download_url: string, success: boolean }
```

### Track Click Endpoint
```
POST /api/track-click
Body: { button_id: string, timestamp: string }
Response: { success: boolean }
```

## Notes
- Design follows neon-tech guidelines strictly
- All interactions use mock data currently
- Ready for backend integration
- Mobile-optimized and conversion-focused
