# Immigration AI Assistant - Design Guidelines

## Design Approach

**Selected Approach:** Design System with Professional SaaS References

**Primary Influences:**
- Material Design for component structure and interaction patterns
- Stripe for trust-building color restraint and professional polish
- Linear for dashboard clarity and modern typography
- Notion for content organization and hierarchy

**Design Principles:**
- Trust through clarity: Every element reinforces credibility
- Progressive disclosure: Complex information revealed intuitively
- Accessible professionalism: Welcoming without sacrificing authority
- Data transparency: Clear status indicators and progress tracking

## Core Design Elements

### A. Color Palette

**Primary Colors (Dark Mode):**
- Brand Blue: 217 91% 60% (Trust, authority)
- Deep Navy: 220 40% 15% (Backgrounds, depth)
- Success Green: 142 76% 45% (Approvals, positive status)

**Primary Colors (Light Mode):**
- Brand Blue: 217 91% 50% (Primary actions)
- Slate: 215 20% 97% (Backgrounds)
- Success Green: 142 71% 40% (Status indicators)

**Semantic Colors:**
- Warning Amber: 38 92% 50% (Pending, action needed)
- Error Red: 0 84% 60% (Denials, urgent)
- Info Blue: 199 89% 48% (Notifications, tips)
- Neutral Gray: 215 16% 47% (Secondary text)

**Surface & Elevation:**
- Dark Mode: 220 40% with 12%, 15%, 18% lightness variations
- Light Mode: 0 0% with 100%, 98%, 95% lightness variations

### B. Typography

**Font Stack:**
- Primary: Inter (Google Fonts) - Clean, professional, excellent readability
- Monospace: JetBrains Mono - For case numbers, dates, status codes

**Scale:**
- Hero Headline: text-5xl md:text-6xl font-bold (60-72px)
- Section Headers: text-3xl md:text-4xl font-semibold (36-48px)
- Card Titles: text-xl font-semibold (20px)
- Body Text: text-base (16px)
- Secondary Text: text-sm (14px)
- Meta Info: text-xs (12px)

**Weights:**
- Headlines: 700 (bold)
- Subheadings: 600 (semibold)
- Body: 400 (regular)
- Emphasis: 500 (medium)

### C. Layout System

**Spacing Primitives:**
Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24, 32 for consistent rhythm

**Container Strategy:**
- Full-width sections: max-w-7xl mx-auto (1280px)
- Dashboard content: max-w-6xl (1152px)
- Form content: max-w-2xl (672px)
- Text content: max-w-prose (65ch)

**Vertical Spacing:**
- Section padding: py-16 md:py-24
- Component spacing: space-y-8 md:space-y-12
- Card padding: p-6 md:p-8

**Grid Patterns:**
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Feature showcase: grid-cols-1 lg:grid-cols-2 gap-12
- Visa guides: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6

### D. Component Library

**Navigation:**
- Fixed header with blur backdrop (backdrop-blur-xl bg-opacity-90)
- Logo + main nav links + CTA button
- Mobile: Hamburger menu with slide-in panel
- User profile dropdown in top-right

**Hero Section:**
- Large professional image showing diverse professionals/office environment
- Gradient overlay (from navy to transparent) for text legibility
- H1 + supporting text + dual CTA buttons
- Trust badges row (e.g., "SOC 2 Certified", "ABA Verified", "10K+ Cases")
- Height: min-h-[600px] md:min-h-[700px]

**AI Chat Interface:**
- Prominent chat widget card (elevated, rounded-2xl)
- Message bubbles: User (brand blue), AI (slate gray)
- Typing indicator with animated dots
- Quick suggestion chips above input
- File upload for document analysis
- Clear conversation history sidebar

**Case Tracking Dashboard:**
- Status timeline component (horizontal progress bar with milestones)
- Case cards with: Case number, visa type, current status badge, next action, progress percentage
- Color-coded status badges (green=approved, amber=pending, blue=in-review)
- Filter/sort controls with dropdown menus
- Empty state illustration for new users

**Visa Guide Cards:**
- Icon + Title + Brief description + "Learn More" link
- Hover effect: subtle lift (shadow-lg) and border highlight
- Categories: H-1B, OPT, F-1, Green Card, each with distinct icon
- Grid layout with equal height cards

**Policy Alert Banner:**
- Dismissible top banner (slide-down animation)
- Icon + Alert text + "Read More" + Close button
- Background: Warning amber with alpha transparency
- Fixed positioning above main nav when active

**Form Components:**
- Large input fields with clear labels above
- Validation states (green border success, red border error)
- Helper text below inputs
- Multi-step forms with progress indicator
- Submit buttons: Full-width on mobile, inline on desktop

**Data Tables:**
- Striped rows for readability
- Sortable column headers with arrow indicators
- Row hover state with background highlight
- Compact mode toggle for power users
- Sticky header on scroll

**Modals & Overlays:**
- Centered modal with backdrop blur and dark overlay
- Close button top-right
- Modal sizes: sm (448px), md (672px), lg (896px)
- Slide-up animation on mobile

### E. Animations

**Minimal, Purposeful Motion:**
- Button hover: Slight background darkening (100ms)
- Card hover: Lift with shadow (200ms ease-out)
- Modal enter/exit: Fade + slide (300ms)
- Alert banner: Slide down (400ms ease-out)
- Status changes: Pulse effect once (600ms)

**No continuous animations** - keeps interface professional and distraction-free

## Page Structure

**Landing Page Sections:**
1. Hero with professional imagery and dual CTAs
2. Trust indicators row (certifications, user count, success rate)
3. AI Chat preview with sample conversation
4. Case tracking dashboard showcase (screenshot or live demo)
5. Visa type guide cards (4-column grid)
6. How It Works (3-step process with icons)
7. Testimonials (2-column cards with photos)
8. Policy update subscription CTA
9. Comprehensive footer (services, company, resources, legal links)

**Dashboard Layout:**
- Left sidebar: Navigation (My Cases, AI Assistant, Documents, Guides, Alerts)
- Main content area: Dynamic based on selection
- Right panel: Quick actions + upcoming deadlines widget

**Chat Interface Page:**
- Full-height chat window
- Conversation history scrollable
- Input fixed at bottom with attachment button
- Suggested questions displayed initially
- Context panel (collapsible) showing relevant visa info

## Images

**Required Images:**

1. **Hero Image:** Professional diverse group in modern office setting, conferring over documents. Should convey collaboration, professionalism, and hope. Bright, well-lit environment. Dimensions: 1920x1080 minimum. Placement: Full-width background with navy gradient overlay.

2. **Dashboard Screenshot:** Mockup of case tracking interface showing multiple visa cases in various stages. Placement: Features section, desktop browser frame.

3. **Testimonial Photos:** 3-4 headshots of diverse individuals (professional style). Circular crop, 80x80px. Placement: Testimonials section alongside quotes.

4. **Process Icons/Illustrations:** Simple, modern icons for H-1B, OPT, F-1, Green Card visa types. Placement: Visa guide cards, 64x64px.

5. **Trust Badge Logos:** Partner certifications, security badges. Placement: Below hero, footer. 120x40px each.

6. **Empty State Illustration:** Friendly illustration for empty dashboard. Placement: Dashboard when no cases exist. 300x300px.

The design prioritizes clarity and trust through restrained color use, generous whitespace, and clear visual hierarchy—creating an interface that feels both approachable and authoritative for users navigating complex immigration processes.