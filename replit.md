# Immigration AI Assistant

## Project Overview
A comprehensive web application that provides AI-powered immigration guidance using RAG (Retrieval Augmented Generation) with official USCIS and Department of State documents. Users can chat with an AI assistant, track immigration cases, manage alert subscriptions, and access visa guides.

**Status:** Core MVP features completed and tested (October 19, 2025)

## Technology Stack
- **Frontend:** React 18 with Vite, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend:** Express.js with TypeScript
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **Authentication:** Replit OIDC Auth
- **AI:** OpenAI GPT-4.5 with text-embedding-3-small for embeddings
- **Email:** SendGrid for alert notifications

## Features Implemented

### ✅ Core Features
1. **User Authentication**
   - Replit Auth integration with OIDC
   - Session management with PostgreSQL store
   - User profile creation on first login

2. **AI Chat Interface**
   - Interactive chat with GPT-4.5
   - RAG pipeline with immigration document embeddings
   - Source citations from official documents
   - Conversation history persistence
   - Typing indicators and real-time responses

3. **RAG Knowledge Base**
   - Pre-seeded with H-1B, OPT, and Green Card guides
   - OpenAI embeddings for semantic search
   - Document chunking (1000 chars, 200 overlap)
   - Vector similarity search with fallback to text search

4. **Visa Guidance System**
   - Comprehensive guides for H-1B, F-1, OPT, STEM OPT, Green Card
   - Requirements, timelines, fees, and processes
   - Category-based organization (non-immigrant vs immigrant)

5. **Immigration Case Tracking**
   - Create and manage immigration cases
   - Track status and progress
   - Receipt number management
   - Expected completion dates

6. **Alert Subscriptions**
   - Email alerts for visa bulletin updates
   - H-1B lottery result notifications
   - Policy change alerts
   - OPT deadline reminders

7. **Policy Updates**
   - Display recent immigration policy changes
   - Source attribution (USCIS, DOS)
   - Categorized updates

## Database Schema

### Core Tables
- `users` - User accounts (id, email, first_name, last_name, profile_image_url)
- `sessions` - Express session store
- `conversations` - Chat conversation threads
- `messages` - Individual chat messages with sources
- `cases` - Immigration case tracking
- `saved_queries` - Bookmarked searches
- `alert_subscriptions` - User alert preferences
- `policy_updates` - Immigration policy changes
- `document_embeddings` - RAG knowledge base vectors

## API Routes

### Authentication
- `GET /api/login` - Initiate OIDC login
- `GET /api/callback` - OIDC callback handler
- `POST /api/logout` - End user session
- `GET /api/auth/user` - Get current user info

### Chat & Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - List user conversations
- `GET /api/conversations/:id/messages` - Get conversation messages
- `POST /api/chat` - Send message, get AI response with RAG

### Case Management
- `GET /api/cases` - List user cases
- `POST /api/cases` - Create new case
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case

### Saved Queries
- `GET /api/saved-queries` - List saved queries
- `POST /api/saved-queries` - Save new query
- `DELETE /api/saved-queries/:id` - Delete saved query

### Alerts
- `GET /api/alert-subscriptions` - List subscriptions
- `POST /api/alert-subscriptions` - Create subscription
- `PUT /api/alert-subscriptions/:id` - Update subscription
- `DELETE /api/alert-subscriptions/:id` - Delete subscription
- `POST /api/send-alert` - Send email alert (SendGrid)

### Policy Updates
- `GET /api/policy-updates` - Get recent updates

## Frontend Pages

1. **Landing Page** (`/`)
   - Hero section with value proposition
   - Feature showcase
   - Visa category overview
   - Call-to-action buttons

2. **Dashboard** (`/`) (authenticated)
   - Welcome message with user name
   - AI chat interface
   - Case progress tracking
   - Saved queries list
   - Alert subscription toggles
   - Recent policy updates
   - Quick resource links

3. **Visa Guide** (`/visa-guide`)
   - Tabbed interface (Non-Immigrant vs Immigrant)
   - Detailed visa category cards
   - Requirements, timelines, fees
   - Application processes

4. **Alerts** (`/alerts`)
   - Alert type descriptions
   - Subscription management
   - Example notifications
   - Manage preferences

## Key Components

### ChatInterface
- Message rendering (user + assistant)
- Source citation display
- Typing indicators
- Auto-scroll to latest message
- Welcome message on first load
- Query cache invalidation for real-time updates

### CaseProgress
- Case cards with status badges
- Progress bars (0-100%)
- Receipt number display
- Status color coding (pending, in-review, approved, denied)
- Expected completion dates

### SavedQueries
- Query history with titles
- Quick access to past searches
- Delete functionality
- Tags for categorization

### AlertSubscriptions
- Toggle switches for each alert type
- Active/inactive status
- Alert type descriptions

### PolicyUpdates
- Chronological list of updates
- Source attribution with links
- Category badges
- Expandable content

## Environment Variables

### Required Secrets
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `SESSION_SECRET` - Express session secret
- `OPENAI_API_KEY` - OpenAI API access
- `SENDGRID_API_KEY` - SendGrid email service
- `ISSUER_URL` - Replit Auth OIDC issuer (auto-configured)
- `CLIENT_ID` - Replit Auth client ID (auto-configured)
- `CLIENT_SECRET` - Replit Auth client secret (auto-configured)

## RAG Pipeline Details

### Document Processing
1. Documents split into 1000-character chunks with 200-character overlap
2. Each chunk embedded using OpenAI text-embedding-3-small
3. Embeddings stored in PostgreSQL as JSONB
4. Metadata includes source, URL, category, last updated date

### Query Flow
1. User question embedded using same model
2. Vector similarity search (cosine similarity) against document embeddings
3. Top 5 most relevant chunks retrieved
4. Fallback to text search if no vector matches
5. Context provided to GPT-4.5 for response generation
6. Sources cited in response

### Knowledge Base
- **H-1B Guide:** Requirements, cap, LCA, petition process, duration
- **OPT Guide:** Pre/post-completion OPT, STEM extension, eligibility, deadlines
- **Green Card Guide:** Family/employment-based, EB categories, priority dates, process

## Development Workflow

### Starting the Application
```bash
npm run dev
```
Runs both Express backend and Vite frontend on port 5000

### Database Migrations
```bash
npx tsx server/migrate.ts
```
Creates all tables and seeds RAG knowledge base

### Running Tests
Uses Playwright for e2e testing with Replit Auth bypass (OIDC test mode)

## Testing Notes
- All core features tested end-to-end (auth, chat, navigation, database persistence)
- Chat responses take 60-90 seconds (RAG retrieval + OpenAI processing)
- OIDC auth automatically bypassed in test environment
- Database queries verified for message persistence

## Recent Changes (October 19, 2025)

### Chat Interface Fixes
- Fixed TanStack Query v5 compatibility (removed deprecated `onSuccess`)
- Implemented proper query cache invalidation after message send
- Added automatic message sending after conversation creation
- Fixed race condition between mutation and query updates

### Database Initialization
- Migrated from drizzle-kit to custom migration script
- Pre-seeded RAG knowledge base with 3 immigration guides
- Created all required tables with proper foreign key relationships
- Set up session store for Replit Auth

## Known Limitations
1. RAG knowledge base limited to 3 core documents (H-1B, OPT, Green Card)
2. No web scraping for live USCIS updates yet
3. Email alerts require manual triggering (no automation)
4. Case tracking is manual (not integrated with USCIS Case Status API)

## Future Enhancements (Planned)
1. Advanced RAG with ChromaDB for better vector search
2. Automated web scraping for USCIS/DOS updates
3. Comprehensive document library with downloadable forms
4. SMS notifications via Twilio
5. Multi-language support (Spanish, Chinese, etc.)
6. Case timeline tracking with automated deadline reminders
7. Export functionality for consultation summaries
8. Integration with USCIS Case Status API

## Architecture Decisions

### Why PostgreSQL Over In-Memory Storage?
- User data persistence across sessions
- Complex relational data (conversations, messages, cases)
- Production-ready with Neon integration

### Why RAG Over Pure GPT?
- Ensures responses grounded in official sources
- Reduces hallucination risk for legal/immigration guidance
- Provides source citations for user verification

### Why Replit Auth?
- Simplified OAuth setup
- No manual token management
- Automatic session handling
- Secure by default

## Security Considerations
- All immigration queries stored in database for audit trail
- Sessions expire after inactivity
- API keys stored as secrets (never in code)
- User data isolated by user_id
- HTTPS enforced in production

## Performance Notes
- Chat responses: 60-90s (OpenAI + RAG processing)
- Page loads: <2s
- Database queries: <100ms
- Frontend build: <5s

## Deployment
Ready for deployment via Replit's built-in publishing feature. All environment variables configured through Replit Secrets.

---

**Last Updated:** October 19, 2025
**Version:** 1.0.0 (MVP)
**Status:** ✅ Core features complete and tested
