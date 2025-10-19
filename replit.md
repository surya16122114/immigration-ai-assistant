# Immigration AI Assistant

## Overview

The Immigration AI Assistant is a full-stack web application that provides accurate, up-to-date immigration guidance powered by AI. The system helps users navigate complex U.S. immigration processes including visa applications (H-1B, F-1, OPT, Green Card, etc.), policy updates, and document assistance. All information is sourced from official USCIS and Department of State documents using a Retrieval-Augmented Generation (RAG) pipeline.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & UI Library**
- Built with React 18+ using Vite as the build tool and development server
- TypeScript for type safety across the entire frontend codebase
- Wouter for lightweight client-side routing (not Next.js as initially planned)
- TailwindCSS for styling with a custom design system based on shadcn/ui components

**Design System**
- Implements a professional SaaS design approach influenced by Material Design, Stripe, Linear, and Notion
- Custom color palette with semantic colors for trust and accessibility
- Dark mode support with CSS variables for theming
- Primary font: Inter (Google Fonts) for clean, professional readability
- Comprehensive component library using Radix UI primitives with custom styling

**State Management**
- TanStack Query (React Query) for server state management, caching, and data fetching
- Custom hooks for authentication (`useAuth`) and UI interactions (`useToast`, `useIsMobile`)
- No global state management library - relies on React Query's built-in state capabilities

**Key Pages & Features**
- Landing page for unauthenticated users
- Dashboard with chat interface, case tracking, saved queries, and policy updates
- Visa guide with detailed information on visa categories
- Alerts management for subscribing to immigration updates
- Real-time chat interface with streaming AI responses

### Backend Architecture

**Framework & Runtime**
- Express.js server running on Node.js
- TypeScript throughout with ES modules
- Development uses tsx for hot reloading; production uses compiled JavaScript

**Authentication**
- Replit Auth using OpenID Connect (OIDC) for user authentication
- Passport.js with custom OIDC strategy
- Session-based authentication stored in PostgreSQL
- Mandatory session and user tables for Replit Auth integration

**API Structure**
- RESTful API endpoints under `/api` prefix
- Route groups:
  - `/api/auth/*` - Authentication endpoints
  - `/api/cases` - Immigration case management
  - `/api/conversations` - Chat conversation management
  - `/api/messages` - Chat messages
  - `/api/saved-queries` - User's saved queries
  - `/api/alert-subscriptions` - Alert subscription management
  - `/api/policy-updates` - Latest immigration policy updates

**AI & RAG Pipeline**
- OpenAI GPT-5 integration for conversational AI responses
- RAG (Retrieval-Augmented Generation) pipeline that:
  - Generates embeddings from user queries
  - Searches document embeddings database for relevant context
  - Provides context-aware responses with source citations
- Document processing service for chunking and embedding official immigration documents

### Data Storage

**PostgreSQL Database**
- Primary relational database using Neon serverless PostgreSQL
- Drizzle ORM for type-safe database operations and migrations
- Schema includes:
  - `sessions` - Session storage (required for Replit Auth)
  - `users` - User profiles (required for Replit Auth)
  - `cases` - Immigration cases with progress tracking
  - `conversations` - Chat conversation threads
  - `messages` - Individual chat messages with AI responses
  - `saved_queries` - Bookmarked queries and responses
  - `alert_subscriptions` - User alert preferences
  - `policy_updates` - Latest immigration policy changes
  - `document_embeddings` - Vector embeddings for RAG retrieval

**Vector Storage**
- Document embeddings stored in PostgreSQL alongside metadata
- Supports similarity search for RAG pipeline
- Fallback to text-based search when vector search returns no results

### External Dependencies

**Authentication Service**
- Replit Auth (OpenID Connect)
- Requires `REPL_ID`, `ISSUER_URL`, and `SESSION_SECRET` environment variables

**AI Services**
- OpenAI API (GPT-5 model)
- Used for both chat completions and embedding generation
- Requires `OPENAI_API_KEY` environment variable

**Email Service**
- SendGrid for transactional emails and alert notifications
- Used for sending immigration alerts, case updates, and policy notifications
- Requires `SENDGRID_API_KEY` and `FROM_EMAIL` environment variables
- Gracefully degrades if not configured (logs instead of failing)

**Database**
- Neon Serverless PostgreSQL
- WebSocket support for serverless connection pooling
- Requires `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations

**Development Tools**
- Replit-specific plugins for development (cartographer, dev banner, runtime error overlay)
- Only loaded in development environment when `REPL_ID` is present